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

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface ShopifySeo {
  title: string | null;
  description: string | null;
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
