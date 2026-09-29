export const SHOP_BY_AGE_PATH = "/shop-by-age";

/** Age routes are keyed by the Shopify metaobject handle, never the display name */
export function ageGroupHref(handle: string): string {
  return `${SHOP_BY_AGE_PATH}/${handle}`;
}
