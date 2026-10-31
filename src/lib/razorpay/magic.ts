import "server-only";

import type { Cart } from "@/lib/shopify/cart-types";

const CART_GID_PREFIX = "gid://shopify/Cart/";

export function getMagicCheckoutConfig() {
  const keyId = process.env.RAZORPAY_MAGIC_KEY_ID;
  const keySecret = process.env.RAZORPAY_MAGIC_KEY_SECRET;

  if (
    process.env.RAZORPAY_MAGIC_CHECKOUT_ENABLED !== "true" ||
    !keyId?.startsWith("rzp_") ||
    !keySecret
  ) {
    return null;
  }

  return { keyId, keySecret };
}

export function isMagicEligible(cart: Cart): boolean {
  return (
    cart.currencyCode === "INR" &&
    cart.lines.length > 0 &&
    cart.lines.every((line) => line.isKit && line.quantity > 0)
  );
}

export function getCheckoutUrl(cart: Cart): string {
  if (!getMagicCheckoutConfig() || !isMagicEligible(cart)) {
    return cart.checkoutUrl;
  }

  return `/checkout/magic?cartId=${encodeURIComponent(cart.id)}`;
}

export function shopifyCartToken(cartId: string): string | null {
  if (!cartId.startsWith(CART_GID_PREFIX)) return null;
  const token = cartId.slice(CART_GID_PREFIX.length);
  return token && !token.includes("#") ? token : null;
}

export function numericShopifyId(gid: string, type: "Product" | "ProductVariant"): number | null {
  const prefix = `gid://shopify/${type}/`;
  if (!gid.startsWith(prefix)) return null;
  const raw = gid.slice(prefix.length);
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
