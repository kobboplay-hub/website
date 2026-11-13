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

/** Storefront that owns a path; anything outside `/lifestyle` belongs to Toys. */
export function getPathStorefront(pathname: string | null | undefined): Storefront {
  return isLifestylePath(pathname?.split(/[?#]/)[0]) ? "lifestyle" : "toys";
}

/**
 * Login and account pages exist in both storefronts (`/login` and `/lifestyle/login`) so a
 * visitor never leaves the store they are shopping in. They share the same APIs and session.
 */
export function getStorefrontPath(storefront: Storefront, path: string): string {
  return storefront === "lifestyle" ? `${LIFESTYLE_BASE_PATH}${path}` : path;
}

/** Login URL that returns the visitor to `redirectTo`, inside the storefront that path belongs to. */
export function getLoginPath(redirectTo?: string | null): string {
  const loginPath = getStorefrontPath(getPathStorefront(redirectTo), "/login");
  return redirectTo ? `${loginPath}?redirect=${encodeURIComponent(redirectTo)}` : loginPath;
}

/** Only same-site relative paths may be used as post-login destinations. */
export function safeRedirectPath(value: string | null | undefined, fallback = "/account"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
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
