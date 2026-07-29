export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: { name: string; value: string }[];
}

/** Resolved file/media reference on a product metafield */
export interface ShopifyMetafieldReference {
  id?: string;
  alt?: string | null;
  sources?: { url: string; mimeType: string }[];
  embedUrl?: string | null;
  host?: string | null;
  originUrl?: string | null;
  previewImage?: ShopifyImage | null;
  url?: string;
  mimeType?: string | null;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
  reference?: ShopifyMetafieldReference | null;
  references?: { edges: { node: ShopifyMetafieldReference }[] };
}

export interface ShopifySeo {
  title: string | null;
  description: string | null;
}

/** Shopify product media — Video and ExternalVideo nodes from Storefront API */
export interface ShopifyMediaVideo {
  id: string;
  mediaContentType: string;
  alt?: string | null;
  sources?: { url: string; mimeType: string }[];
  embedUrl?: string | null;
  host?: string | null;
  originUrl?: string | null;
  previewImage?: ShopifyImage | null;
}

/** Normalized product for frontend use */
export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  price: number;
  compareAtPrice: number | null;
  currencyCode: string;
  availableForSale: boolean;
  variants: ShopifyVariant[];
  vendor: string;
  productType: string;
  tags: string[];
  seo: ShopifySeo;
  metafields: ShopifyMetafield[];
  /** Populated on product detail fetches — Shopify media videos */
  mediaVideos?: ShopifyMediaVideo[];
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
}

/** Raw Shopify GraphQL response shapes */
export interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  vendor: string;
  productType: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  variants: { edges: { node: ShopifyVariant }[] };
  seo?: ShopifySeo;
  metafields?: (ShopifyMetafield | null)[];
  media?: {
    edges: { node: ShopifyMediaVideo }[];
  };
}

export interface ShopifyCollectionNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  products?: { edges: { node: ShopifyProductNode }[] };
}

export function parseMoney(money: ShopifyMoney | null | undefined): number {
  if (!money?.amount) return 0;
  return parseFloat(money.amount);
}

export function formatPrice(amount: number, currencyCode = "INR"): string {
  if (currencyCode === "INR") {
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
  }
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export function getProductImageUrl(product: Product): string | null {
  return product.featuredImage?.url ?? product.images[0]?.url ?? null;
}

export function getProductImageUrls(product: Product): string[] {
  const urls = product.images.map((img) => img.url).filter(Boolean);
  if (urls.length > 0) return urls;
  if (product.featuredImage?.url) return [product.featuredImage.url];
  return [];
}

/** First playable Shopify-hosted video URL for product card hover previews */
export function getProductPreviewVideoUrl(product: Product): string | null {
  const video = product.mediaVideos?.find(
    (item) =>
      item.mediaContentType === "VIDEO" &&
      Boolean(item.sources?.some((source) => source.url)),
  );
  if (!video?.sources?.length) return null;

  const mp4 = video.sources.find((source) =>
    source.mimeType?.includes("mp4"),
  );
  return mp4?.url ?? video.sources[0]?.url ?? null;
}
