import type { Product, ShopifyImage } from "@/lib/shopify/types";
import { slugifyCategory } from "@/lib/storefront/lifestyle-category";

/** Minimal product data sent to Lifestyle client components. */
export interface LifestyleCardProduct {
  id: string;
  handle: string;
  title: string;
  category: string | null;
  categorySlug: string | null;
  price: number;
  compareAtPrice: number | null;
  currencyCode: string;
  availableForSale: boolean;
  images: ShopifyImage[];
  /** Set only when the product can be added without choosing options. */
  quickAddVariantId: string | null;
  hasOptions: boolean;
}

export function hasSelectableOptions(product: Pick<Product, "variants">): boolean {
  return !(
    product.variants.length <= 1 &&
    (product.variants[0]?.title ?? "Default Title") === "Default Title"
  );
}

export function toLifestyleCard(product: Product): LifestyleCardProduct {
  const hasOptions = hasSelectableOptions(product);
  const firstAvailable = product.variants.find((variant) => variant.availableForSale);
  const images = product.images.length > 0
    ? product.images.slice(0, 2)
    : product.featuredImage
      ? [product.featuredImage]
      : [];

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    category: product.category,
    categorySlug: product.category ? slugifyCategory(product.category) : null,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    currencyCode: product.currencyCode,
    availableForSale: product.availableForSale,
    images,
    quickAddVariantId: !hasOptions && firstAvailable ? firstAvailable.id : null,
    hasOptions,
  };
}

/** Whole-number percentage off, only when Shopify has a higher compare-at price. */
export function getDiscountPercent(price: number, compareAtPrice: number | null): number | null {
  if (!compareAtPrice || compareAtPrice <= price || price <= 0) return null;
  const percent = Math.round((1 - price / compareAtPrice) * 100);
  return percent >= 1 ? percent : null;
}
