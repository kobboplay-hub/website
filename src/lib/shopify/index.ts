import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
} from "./queries";
import type {
  Collection,
  Product,
  ShopifyCollectionNode,
  ShopifyMetafield,
  ShopifyProductNode,
} from "./types";
import { parseMoney } from "./types";

const REVALIDATE_SECONDS = 3600;

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  revalidate?: number | false;
  cache?: RequestCache;
}

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

  if (!domain || !token) {
    return null;
  }

  return { domain, token };
}

export async function shopifyFetch<T>({
  query,
  variables,
  revalidate = REVALIDATE_SECONDS,
  cache,
}: ShopifyFetchOptions): Promise<T> {
  const config = getShopifyConfig();

  if (!config) {
    throw new Error(
      "Missing Shopify environment variables: SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_PRIVATE_TOKEN",
    );
  }

  const response = await fetch(
    `https://${config.domain}/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": config.token,
      },
      body: JSON.stringify({ query, variables }),
      cache: cache ?? (revalidate === false ? "no-store" : "default"),
      next: revalidate === false ? undefined : { revalidate },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText}`,
    );
  }

  const json = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  if (!json.data) {
    throw new Error("Shopify API returned no data");
  }

  return json.data;
}

function normalizeCompareAtPrice(node: ShopifyProductNode): number | null {
  const amount = parseMoney(node.compareAtPriceRange?.minVariantPrice);
  return amount > 0 ? amount : null;
}

function normalizeMetafields(
  metafields?: (ShopifyMetafield | null)[],
): ShopifyMetafield[] {
  if (!metafields) return [];
  return metafields.filter((m): m is ShopifyMetafield => m !== null);
}

export function normalizeProduct(node: ShopifyProductNode): Product {
  const currencyCode = node.priceRange.minVariantPrice.currencyCode;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml ?? node.description,
    featuredImage: node.featuredImage,
    images: node.images.edges.map((edge) => edge.node),
    price: parseMoney(node.priceRange.minVariantPrice),
    compareAtPrice: normalizeCompareAtPrice(node),
    currencyCode,
    availableForSale: node.availableForSale,
    variants: node.variants.edges.map((edge) => edge.node),
    vendor: node.vendor,
    productType: node.productType,
    tags: node.tags,
    seo: node.seo ?? { title: null, description: null },
    metafields: normalizeMetafields(node.metafields),
  };
}

function normalizeCollection(node: ShopifyCollectionNode): Collection {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    image: node.image,
  };
}

export async function getProducts(limit = 20): Promise<Product[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProductNode }[] };
  }>({
    query: GET_PRODUCTS_QUERY,
    variables: { first: limit },
  });

  return data.products.edges.map((edge) => normalizeProduct(edge.node));
}

export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  const data = await shopifyFetch<{
    product: ShopifyProductNode | null;
  }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    revalidate: 60,
  });

  if (!data.product) return null;
  return normalizeProduct(data.product);
}

export async function getCollections(limit = 20): Promise<Collection[]> {
  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollectionNode }[] };
  }>({
    query: GET_COLLECTIONS_QUERY,
    variables: { first: limit },
  });

  return data.collections.edges.map((edge) => normalizeCollection(edge.node));
}

export async function getCollectionProducts(
  handle: string,
  limit = 20,
): Promise<{ collection: Collection; products: Product[] } | null> {
  const data = await shopifyFetch<{
    collection: ShopifyCollectionNode | null;
  }>({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first: limit },
  });

  if (!data.collection) return null;

  return {
    collection: normalizeCollection(data.collection),
    products:
      data.collection.products?.edges.map((edge) =>
        normalizeProduct(edge.node),
      ) ?? [],
  };
}

export function isShopifyConfigured(): boolean {
  return getShopifyConfig() !== null;
}
