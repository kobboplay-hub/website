import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCTS_PAGINATED_QUERY,
  GET_PRODUCTS_WITH_VIDEOS_QUERY,
  GET_HOMEPAGE_AGE_PRODUCTS_QUERY,
  GET_RECENT_PRODUCTS_QUERY,
  SEARCH_PRODUCTS_PAGINATED_QUERY,
  PRODUCTS_SORTED_PAGINATED_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  GET_AGE_GROUPS_QUERY,
} from "./queries";
import { cache } from "react";
import type {
  AgeGroup,
  Collection,
  Product,
  ProductMerchandisingFlags,
  ShopifyAgeGroupNode,
  ShopifyCollectionNode,
  ShopifyMediaVideo,
  ShopifyMetafield,
  ShopifyProductNode,
} from "./types";
import { parseMoney } from "./types";

const REVALIDATE_SECONDS = 3600;
const CATALOG_REVALIDATE_SECONDS = 60;

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

function normalizeMediaVideos(
  media?: ShopifyProductNode["media"],
): ShopifyMediaVideo[] {
  if (!media?.edges) return [];
  return media.edges
    .map((edge) => edge.node)
    .filter(
      (node) =>
        node.mediaContentType === "VIDEO" ||
        node.mediaContentType === "EXTERNAL_VIDEO",
    );
}

function normalizeAgeGroup(node: ShopifyAgeGroupNode): AgeGroup {
  return {
    id: node.id,
    handle: node.handle,
    name: node.name?.value?.trim() || node.handle,
  };
}

function normalizeMerchandisingFlags(
  flags: ShopifyProductNode["merchandisingFlags"],
): ProductMerchandisingFlags {
  const isTrue = (key: string) =>
    flags?.some((flag) => flag?.key === key && flag.value === "true") ?? false;

  return {
    featured: isTrue("featured_product"),
    trending: isTrue("trending_toys"),
    bestSelling: isTrue("best_selling_toys"),
  };
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
    mediaVideos: normalizeMediaVideos(node.media),
    ageGroup: node.ageGroup?.reference
      ? normalizeAgeGroup(node.ageGroup.reference)
      : null,
    merchandising: normalizeMerchandisingFlags(node.merchandisingFlags),
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

export const SHOP_PRODUCTS_PER_PAGE = 12;

export type ShopSortOption = "featured" | "price-asc" | "price-desc" | "alpha";

const SHOP_SORT_OPTIONS: ShopSortOption[] = [
  "featured",
  "price-asc",
  "price-desc",
  "alpha",
];

export function parseShopSort(raw: string | null | undefined): ShopSortOption {
  return SHOP_SORT_OPTIONS.includes(raw as ShopSortOption)
    ? (raw as ShopSortOption)
    : "featured";
}

interface ShopifyProductSortParams {
  sortKey: string;
  reverse: boolean;
}

function toShopifySortParams(
  sort: ShopSortOption,
  hasSearchQuery = false,
): ShopifyProductSortParams {
  switch (sort) {
    case "price-asc":
      return { sortKey: "PRICE", reverse: false };
    case "price-desc":
      return { sortKey: "PRICE", reverse: true };
    case "alpha":
      return { sortKey: "TITLE", reverse: false };
    default:
      // RELEVANCE only works with a search query; otherwise pagination can skip products
      return hasSearchQuery
        ? { sortKey: "RELEVANCE", reverse: false }
        : { sortKey: "BEST_SELLING", reverse: false };
  }
}

export interface ShopProductsResult {
  products: Product[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalFetched: number;
  searchQuery: string;
  sort: ShopSortOption;
}

export interface ShopProductsCursorResult {
  products: Product[];
  endCursor: string | null;
  hasNextPage: boolean;
  searchQuery: string;
  sort: ShopSortOption;
}

function buildShopifyProductQuery(searchQuery: string): string {
  const trimmed = searchQuery.trim();
  if (!trimmed) return "";
  return `title:*${trimmed}* OR product_type:*${trimmed}*`;
}

const OFFSET_CURSOR_PREFIX = "offset:";

/**
 * "Featured" sort: products flagged `custom.featured_product` first, then the
 * rest in best-selling order. Storefront can't sort by a metafield, so the
 * full catalogue is ordered here and paged with an offset cursor.
 */
async function getFeaturedFirstPage(
  first: number,
  after: string | null,
): Promise<{ products: Product[]; endCursor: string | null; hasNextPage: boolean }> {
  const all = await getAllProducts("featured");
  const ordered = [
    ...all.filter((product) => product.merchandising.featured),
    ...all.filter((product) => !product.merchandising.featured),
  ];

  const parsed = after?.startsWith(OFFSET_CURSOR_PREFIX)
    ? Number.parseInt(after.slice(OFFSET_CURSOR_PREFIX.length), 10)
    : 0;
  const start = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  const end = start + first;
  const hasNextPage = end < ordered.length;

  return {
    products: ordered.slice(start, end),
    endCursor: hasNextPage ? `${OFFSET_CURSOR_PREFIX}${end}` : null,
    hasNextPage,
  };
}

export async function getShopProductsByCursor(
  pageSize = SHOP_PRODUCTS_PER_PAGE,
  searchQuery = "",
  sort: ShopSortOption = "featured",
  after: string | null = null,
): Promise<ShopProductsCursorResult> {
  const trimmedQuery = searchQuery.trim();
  const shopifyQuery = buildShopifyProductQuery(trimmedQuery);
  const hasSearch = shopifyQuery.length > 0;
  const { sortKey, reverse } = toShopifySortParams(sort, hasSearch);
  const first = Math.min(50, Math.max(1, pageSize));

  if (sort === "featured" && !hasSearch) {
    const page = await getFeaturedFirstPage(first, after);
    return { ...page, searchQuery: trimmedQuery, sort };
  }

  const data = hasSearch
    ? await shopifyFetch<{
        products: {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          edges: { node: ShopifyProductNode }[];
        };
      }>({
        query: SEARCH_PRODUCTS_PAGINATED_QUERY,
        variables: {
          query: shopifyQuery,
          first,
          after,
          sortKey,
          reverse,
        },
        revalidate: false,
        cache: "no-store",
      })
    : await shopifyFetch<{
        products: {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          edges: { node: ShopifyProductNode }[];
        };
      }>({
        query: PRODUCTS_SORTED_PAGINATED_QUERY,
        variables: {
          first,
          after,
          sortKey,
          reverse,
        },
        revalidate: false,
        cache: "no-store",
      });

  return {
    products: data.products.edges.map((edge) => normalizeProduct(edge.node)),
    endCursor: data.products.pageInfo.endCursor,
    hasNextPage: data.products.pageInfo.hasNextPage,
    searchQuery: trimmedQuery,
    sort,
  };
}

export async function getShopProductsPage(
  page = 1,
  pageSize = SHOP_PRODUCTS_PER_PAGE,
  searchQuery = "",
  sort: ShopSortOption = "featured",
): Promise<ShopProductsResult> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const targetCount = safePage * pageSize;

  let cursor: string | null = null;
  let hasNextPage = true;
  const collected: Product[] = [];

  while (collected.length < targetCount && hasNextPage) {
    const remaining = targetCount - collected.length;
    const batchSize = Math.min(50, remaining);
    const batch = await getShopProductsByCursor(
      batchSize,
      searchQuery,
      sort,
      cursor,
    );

    collected.push(...batch.products);
    hasNextPage = batch.hasNextPage;
    cursor = batch.endCursor;

    if (batch.products.length === 0) break;
  }

  const start = (safePage - 1) * pageSize;

  return {
    products: collected.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    hasNextPage: collected.length > start + pageSize || hasNextPage,
    hasPreviousPage: safePage > 1,
    totalFetched: collected.length,
    searchQuery: searchQuery.trim(),
    sort,
  };
}

const MAX_CATALOG_PAGES = 40;

/**
 * Walks every Storefront product page so derived filters (e.g. age group)
 * never miss products beyond the first cursor page.
 */
export const getAllProducts = cache(
  async (sort: ShopSortOption = "featured"): Promise<Product[]> => {
    const { sortKey, reverse } = toShopifySortParams(sort);
    const collected: Product[] = [];
    let after: string | null = null;

    for (let page = 0; page < MAX_CATALOG_PAGES; page++) {
      const data: {
        products: {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          edges: { node: ShopifyProductNode }[];
        };
      } = await shopifyFetch({
        query: PRODUCTS_SORTED_PAGINATED_QUERY,
        variables: { first: 50, after, sortKey, reverse },
        revalidate: CATALOG_REVALIDATE_SECONDS,
      });

      collected.push(
        ...data.products.edges.map((edge) => normalizeProduct(edge.node)),
      );

      if (!data.products.pageInfo.hasNextPage) return collected;
      after = data.products.pageInfo.endCursor;
      if (!after) return collected;
    }

    console.warn(
      `getAllProducts stopped after ${MAX_CATALOG_PAGES} pages; catalogue may be truncated.`,
    );
    return collected;
  },
);

/** Products assigned to a Shopify age-group metaobject for the homepage. */
export const getHomepageAgeProducts = cache(async (): Promise<Product[]> => {
  const products: Product[] = [];
  let after: string | null = null;

  for (let page = 0; page < MAX_CATALOG_PAGES; page++) {
    const data: {
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: { node: ShopifyProductNode }[];
      };
    } = await shopifyFetch({
      query: GET_HOMEPAGE_AGE_PRODUCTS_QUERY,
      variables: { first: 50, after },
      revalidate: CATALOG_REVALIDATE_SECONDS,
    });

    products.push(
      ...data.products.edges
        .map((edge) => normalizeProduct(edge.node))
        .filter((product) => product.ageGroup !== null),
    );

    if (!data.products.pageInfo.hasNextPage) return products;
    after = data.products.pageInfo.endCursor;
    if (!after) return products;
  }

  console.warn(`getHomepageAgeProducts stopped after ${MAX_CATALOG_PAGES} pages; catalogue may be truncated.`);
  return products;
});

/** All `age_group` metaobjects in Shopify Admin order. Throws on Shopify errors. */
export const getAgeGroups = cache(async (): Promise<AgeGroup[]> => {
  const data = await shopifyFetch<{
    metaobjects: { nodes: ShopifyAgeGroupNode[] };
  }>({
    query: GET_AGE_GROUPS_QUERY,
    variables: { first: 50 },
    revalidate: CATALOG_REVALIDATE_SECONDS,
  });

  return data.metaobjects.nodes.map(normalizeAgeGroup);
});

/** Navigation-safe variant: never throws, returns [] when Shopify is unavailable. */
export async function getNavAgeGroups(): Promise<AgeGroup[]> {
  if (!isShopifyConfigured()) return [];
  try {
    return await getAgeGroups();
  } catch (error) {
    console.error("Failed to fetch age groups for navigation:", error);
    return [];
  }
}

export async function getAgeGroupByHandle(
  handle: string,
): Promise<AgeGroup | null> {
  const ageGroups = await getAgeGroups();
  return ageGroups.find((group) => group.handle === handle) ?? null;
}

/** Matches on the metaobject id — the display name is never used for identity. */
export async function getProductsByAgeGroup(
  ageGroup: AgeGroup,
  sort: ShopSortOption = "featured",
): Promise<Product[]> {
  const products = await getAllProducts(sort);
  return products.filter((product) => product.ageGroup?.id === ageGroup.id);
}

/** Products flagged with the `custom.featured_product` boolean metafield */
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts("featured");
  return products.filter((product) => product.merchandising.featured);
}

/** Products flagged with the `custom.best_selling_toys` boolean metafield */
export async function getBestSellingProducts(): Promise<Product[]> {
  const products = await getAllProducts("featured");
  return products.filter((product) => product.merchandising.bestSelling);
}

export interface ProductsPageResult {
  products: Product[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export async function getProductsPage(
  page = 1,
  pageSize = SHOP_PRODUCTS_PER_PAGE,
): Promise<ProductsPageResult> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const targetCount = safePage * pageSize;

  let cursor: string | undefined;
  let hasNextPage = true;
  const collected: Product[] = [];

  while (collected.length < targetCount && hasNextPage) {
    const remaining = targetCount - collected.length;
    const batchSize = Math.min(50, remaining);

    const data = await shopifyFetch<{
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: { node: ShopifyProductNode }[];
      };
    }>({
      query: GET_PRODUCTS_PAGINATED_QUERY,
      variables: { first: batchSize, after: cursor ?? null },
    });

    const batch = data.products.edges.map((edge) => normalizeProduct(edge.node));
    collected.push(...batch);
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor ?? undefined;

    if (batch.length === 0) break;
  }

  const start = (safePage - 1) * pageSize;

  return {
    products: collected.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    hasNextPage: collected.length > start + pageSize || hasNextPage,
    hasPreviousPage: safePage > 1,
  };
}

export async function getProductsWithVideos(limit = 50): Promise<Product[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProductNode }[] };
  }>({
    query: GET_PRODUCTS_WITH_VIDEOS_QUERY,
    variables: { first: limit },
  });

  return data.products.edges.map((edge) => normalizeProduct(edge.node));
}

/** Newest products first — used for homepage "Recently Added" */
export async function getRecentProducts(limit = 5): Promise<Product[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProductNode }[] };
  }>({
    query: GET_RECENT_PRODUCTS_QUERY,
    variables: { first: limit },
    revalidate: 60,
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
    revalidate: 60,
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
    revalidate: false,
    cache: "no-store",
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

function normalizeHandle(value: string): string {
  return value.trim().toLowerCase();
}

/** Resolve a collection by handle, then by title keyword (e.g. "ganpati"). */
export async function findCollectionProducts(
  preferredHandle: string,
  titleKeyword: string,
  limit = 20,
): Promise<{ collection: Collection; products: Product[] } | null> {
  const byHandle = await getCollectionProducts(preferredHandle, limit);
  if (byHandle && byHandle.products.length > 0) return byHandle;

  const collections = await getCollections(50);
  const keyword = titleKeyword.trim().toLowerCase();

  const match = collections.find((collection) => {
    const title = collection.title.toLowerCase();
    const handle = collection.handle.toLowerCase();
    return (
      title.includes(keyword) ||
      handle.includes(keyword) ||
      normalizeHandle(collection.title) === normalizeHandle(preferredHandle)
    );
  });

  if (!match) {
    // Collection exists in Admin but may be unpublished — return handle attempt anyway
    return byHandle;
  }

  if (match.handle === preferredHandle && byHandle) {
    return byHandle;
  }

  return getCollectionProducts(match.handle, limit);
}

export function isShopifyConfigured(): boolean {
  return getShopifyConfig() !== null;
}

/** Search products by title via Shopify Storefront API query */
export async function searchProducts(
  query: string,
  limit = 20,
): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const data = await shopifyFetch<{
      products: { edges: { node: ShopifyProductNode }[] };
    }>({
      query: SEARCH_PRODUCTS_QUERY,
      variables: { query: trimmed, first: limit },
      revalidate: 300,
    });

    const results = data.products.edges.map((edge) =>
      normalizeProduct(edge.node),
    );

    if (results.length > 0) return results;
  } catch {
    // fall through to local filter
  }

  const all = await getProducts(50);
  const lower = trimmed.toLowerCase();
  return all
    .filter((p) => p.title.toLowerCase().includes(lower))
    .slice(0, limit);
}
