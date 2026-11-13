export type Storefront = "toys" | "lifestyle";

export const LIFESTYLE_BASE_PATH = "/lifestyle";
/** Shopify automated collection whose rule is `custom.is_lifestyle = true`. */
export const LIFESTYLE_COLLECTION_HANDLE = "lifestyle";
/** Remembers the storefront for shared pages (account, login) that live outside `/lifestyle`. */
export const STOREFRONT_COOKIE = "kobbo_storefront";

interface StorefrontProductRef {
  handle: string;
  isLifestyle?: boolean | null;
}

export function getProductStorefront(product: { isLifestyle?: boolean | null }): Storefront {
  return product.isLifestyle ? "lifestyle" : "toys";
}

export function getProductPath(product: StorefrontProductRef): string {
  const handle = encodeURIComponent(product.handle);
  return product.isLifestyle
    ? `${LIFESTYLE_BASE_PATH}/products/${handle}`
    : `/products/${handle}`;
}

export function isLifestylePath(pathname: string | null | undefined): boolean {
  return pathname === LIFESTYLE_BASE_PATH || Boolean(pathname?.startsWith(`${LIFESTYLE_BASE_PATH}/`));
}

export function parseStorefront(value: string | null | undefined): Storefront {
  return value === "lifestyle" ? "lifestyle" : "toys";
}

export function getStorefrontHomePath(storefront: Storefront): string {
  return storefront === "lifestyle" ? LIFESTYLE_BASE_PATH : "/";
}

export function getStorefrontShopPath(storefront: Storefront): string {
  return storefront === "lifestyle" ? `${LIFESTYLE_BASE_PATH}#all-products` : "/shop";
}

export function getStorefrontCartPath(storefront: Storefront): string {
  return storefront === "lifestyle" ? `${LIFESTYLE_BASE_PATH}/cart` : "/cart";
}

/** Adds the storefront to a checkout URL so payment pages can link back to the right store. */
export function withStorefrontParam(url: string, storefront: Storefront): string {
  if (storefront !== "lifestyle" || !url.startsWith("/")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}store=lifestyle`;
}
