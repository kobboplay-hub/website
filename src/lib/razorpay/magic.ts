import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

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

export interface CompletedShopifyOrder {
  orderNumber: string;
  paymentMethod: string | null;
  totalAmount: number | null;
}

export class MagicCompletionError extends Error {
  constructor(message: string, readonly retryable: boolean) {
    super(message);
  }
}

/**
 * Creates the Shopify order for a Razorpay payment. Razorpay returns the existing
 * order when the same payment is completed again, so retries do not duplicate orders.
 */
export async function completeShopifyOrder(
  keyId: string,
  paymentId: string,
  orderId: string,
  timeoutMs: number,
): Promise<CompletedShopifyOrder> {
  let response: Response;
  try {
    response = await fetch(
      `https://api.razorpay.com/v1/1cc/shopify/complete?key_id=${encodeURIComponent(keyId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ razorpay_payment_id: paymentId, razorpay_order_id: orderId }),
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      },
    );
  } catch {
    throw new MagicCompletionError("Razorpay order completion did not respond", true);
  }

  if (!response.ok) {
    throw new MagicCompletionError(
      `Razorpay order completion failed with ${response.status}`,
      response.status >= 500 || response.status === 429,
    );
  }

  // COD orders come back without an order_status_url, so the Shopify order number is the success signal.
  const result = (await response.json()) as {
    order_id?: unknown;
    payment_method?: unknown;
    total_amount?: unknown;
  };
  if (typeof result.order_id !== "string" || !result.order_id) {
    throw new MagicCompletionError("Shopify order number missing", true);
  }

  return {
    orderNumber: result.order_id.replace(/^#/, ""),
    paymentMethod: typeof result.payment_method === "string" ? result.payment_method : null,
    totalAmount: typeof result.total_amount === "number" ? result.total_amount : null,
  };
}

export function verifyHmacSha256(payload: string, secret: string, signatureHex: string): boolean {
  if (!/^[a-fA-F0-9]{64}$/.test(signatureHex)) return false;
  const expected = createHmac("sha256", secret).update(payload).digest();
  return timingSafeEqual(expected, Buffer.from(signatureHex, "hex"));
}

export function isMagicEligible(cart: Cart): boolean {
  return (
    cart.currencyCode === "INR" &&
    cart.lines.length > 0 &&
    cart.lines.every((line) => line.quantity > 0)
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
