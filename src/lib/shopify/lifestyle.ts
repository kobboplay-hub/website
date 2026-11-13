import { cache } from "react";

import { slugifyCategory } from "@/lib/storefront/lifestyle-category";
import { LIFESTYLE_COLLECTION_HANDLE } from "@/lib/storefront/product-routing";
import { getProductByHandle, normalizeProduct, shopifyFetch } from "./index";
import { GET_LIFESTYLE_COLLECTION_PRODUCTS_QUERY } from "./queries";
import type { Product, ShopifyImage, ShopifyProductNode } from "./types";

const PAGE_SIZE = 50;
/** Caps a single listing build at 250 products; raise when the Lifestyle range grows past it. */
const MAX_PAGES = 5;
export const LIFESTYLE_REVALIDATE_SECONDS = 60;

interface LifestyleCollectionPage {
  collection: {
    products: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      edges: { node: ShopifyProductNode }[];
    };
  } | null;
}

/**
 * All Lifestyle products, read from the automated `lifestyle` collection (rule:
 * `custom.is_lifestyle = true`). Only that collection is paged, never the whole catalogue.
 */
export const getLifestyleProducts = cache(async (): Promise<Product[]> => {
  const seen = new Set<string>();
  const products: Product[] = [];
  let after: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const data: LifestyleCollectionPage = await shopifyFetch<LifestyleCollectionPage>({
      query: GET_LIFESTYLE_COLLECTION_PRODUCTS_QUERY,
      variables: { handle: LIFESTYLE_COLLECTION_HANDLE, first: PAGE_SIZE, after },
      revalidate: LIFESTYLE_REVALIDATE_SECONDS,
    });

    if (!data.collection) {
      console.error(`Shopify collection "${LIFESTYLE_COLLECTION_HANDLE}" is missing or not published to the storefront.`);
      return [];
    }

    for (const edge of data.collection.products.edges) {
      const product = normalizeProduct(edge.node);
      // The collection rule is the source of truth, but the flag is re-checked so a
      // misconfigured collection can never surface a Toys product.
      if (product.isLifestyle && !seen.has(product.id)) {
        seen.add(product.id);
        products.push(product);
      }
    }

    const { hasNextPage, endCursor } = data.collection.products.pageInfo;
    if (!hasNextPage || !endCursor) return products;
    after = endCursor;
  }

  console.warn(`Lifestyle listing stopped after ${MAX_PAGES * PAGE_SIZE} products.`);
  return products;
});

/** A Lifestyle product by handle, or null for missing and Toys products. */
export async function getLifestyleProductByHandle(handle: string): Promise<Product | null> {
  const product = await getProductByHandle(handle);
  return product?.isLifestyle ? product : null;
}

export interface LifestyleCategory {
  name: string;
  slug: string;
  count: number;
  image: ShopifyImage | null;
}

/** Categories that actually have products, from Shopify's standard product taxonomy. */
export function getLifestyleCategories(products: Product[]): LifestyleCategory[] {
  const categories = new Map<string, LifestyleCategory>();
  for (const product of products) {
    if (!product.category) continue;
    const slug = slugifyCategory(product.category);
    const existing = categories.get(slug);
    if (existing) {
      existing.count += 1;
      existing.image ??= product.featuredImage ?? product.images[0] ?? null;
    } else {
      categories.set(slug, {
        name: product.category,
        slug,
        count: 1,
        image: product.featuredImage ?? product.images[0] ?? null,
      });
    }
  }
  return [...categories.values()].sort((a, b) => b.count - a.count);
}

/** Navigation-safe categories: never throws, so the header and footer render if Shopify is down. */
export async function getLifestyleNavCategories(): Promise<{ name: string; slug: string }[]> {
  try {
    return getLifestyleCategories(await getLifestyleProducts()).map(({ name, slug }) => ({ name, slug }));
  } catch (error) {
    console.error("Failed to load Lifestyle categories for navigation:", error);
    return [];
  }
}

/** Search limited to Lifestyle products so Toys can never appear in Lifestyle suggestions. */
export async function searchLifestyleProducts(query: string, limit = 8): Promise<Product[]> {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const products = await getLifestyleProducts();
  return products
    .filter((product) => {
      const haystack = [product.title, product.category, product.vendor, product.productType]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    })
    .slice(0, limit);
}
