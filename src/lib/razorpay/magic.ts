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
  let rawText = "";
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
    rawText = await response.text();
  } catch (err) {
    console.error("Razorpay 1cc completion fetch error:", paymentId, err);
    throw new MagicCompletionError("Razorpay order completion did not respond", true);
  }

  let result: Record<string, unknown> = {};
  try {
    result = JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    console.warn("Razorpay 1cc complete non-JSON response:", response.status, rawText);
  }

  // Extract order number from any supported field in Razorpay or Shopify response
  let orderNumber: string | null = null;
  if (result.order_number !== undefined && result.order_number !== null) {
    orderNumber = String(result.order_number).replace(/^#/, "").trim();
  } else if (typeof result.order_name === "string" && result.order_name) {
    orderNumber = result.order_name.replace(/^#/, "").trim();
  } else if (typeof result.name === "string" && result.name) {
    orderNumber = result.name.replace(/^#/, "").trim();
  } else if (result.shopify_order_id !== undefined && result.shopify_order_id !== null) {
    orderNumber = String(result.shopify_order_id).replace(/^#/, "").trim();
  } else if (
    typeof result.order_id === "number" ||
    (typeof result.order_id === "string" && !result.order_id.startsWith("order_"))
  ) {
    orderNumber = String(result.order_id).replace(/^#/, "").trim();
  } else if (typeof result.order_status_url === "string") {
    const match = result.order_status_url.match(/\/orders\/(\d+)/);
    if (match?.[1]) {
      orderNumber = match[1];
    }
  }

  const paymentMethod =
    typeof result.payment_method === "string"
      ? result.payment_method
      : typeof result.method === "string"
      ? result.method
      : null;

  let totalAmount: number | null = null;
  if (typeof result.total_amount === "number") {
    totalAmount = result.total_amount;
  } else if (typeof result.amount === "number") {
    totalAmount = result.amount;
  } else if (typeof result.total_price === "number") {
    totalAmount = Math.round(result.total_price * 100);
  } else if (typeof result.total_amount === "string" && /^\d+$/.test(result.total_amount)) {
    totalAmount = Number(result.total_amount);
  }

  if (!response.ok) {
    console.error(`Razorpay order completion returned ${response.status}:`, rawText);
    const lower = rawText.toLowerCase();
    const isAlreadyCompleted =
      lower.includes("already") ||
      lower.includes("processed") ||
      lower.includes("completed") ||
      lower.includes("duplicate");

    if (isAlreadyCompleted) {
      return {
        orderNumber: orderNumber || paymentId,
        paymentMethod: paymentMethod ?? "online",
        totalAmount,
      };
    }

    throw new MagicCompletionError(
      `Razorpay order completion failed with ${response.status}`,
      response.status >= 500 || response.status === 429,
    );
  }

  // If Razorpay returned 200 OK but without a clear Shopify order number, fallback to paymentId
  // so the user is never stranded on a pending/error screen.
  return {
    orderNumber: orderNumber || paymentId,
    paymentMethod,
    totalAmount,
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
