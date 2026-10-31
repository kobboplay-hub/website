import { NextResponse } from "next/server";

import { getCart } from "@/lib/shopify/cart";
import {
  getMagicCheckoutConfig,
  isMagicEligible,
  numericShopifyId,
  shopifyCartToken,
} from "@/lib/razorpay/magic";

export async function POST(request: Request) {
  const config = getMagicCheckoutConfig();
  if (!config) {
    return NextResponse.json({ error: "Magic Checkout is unavailable" }, { status: 503 });
  }

  let cartId: unknown;
  try {
    ({ cartId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof cartId !== "string" || cartId.length > 500) {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }

  try {
    // Read the cart from Shopify, never trust prices or product flags from the browser.
    const cart = await getCart(cartId);
    if (!cart || !isMagicEligible(cart)) {
      return NextResponse.json({ error: "Cart is not eligible" }, { status: 400 });
    }

    const token = shopifyCartToken(cart.id);
    const items = cart.lines.map((line) => {
      const variantId = numericShopifyId(line.merchandiseId, "ProductVariant");
      const productId = numericShopifyId(line.productId, "Product");
      if (!variantId || !productId) return null;

      return {
        id: variantId,
        quantity: line.quantity,
        product_id: productId,
        variant_id: variantId,
        properties: {},
      };
    });

    if (!token || items.some((item) => item === null)) {
      return NextResponse.json({ error: "Invalid Shopify cart" }, { status: 400 });
    }

    const checkoutResponse = await fetch(
      `https://api.razorpay.com/v1/magic/checkout/shopify?key_id=${encodeURIComponent(config.keyId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          cart: {
            token,
            note: null,
            attributes: {},
            item_count: cart.totalQuantity,
            items,
          },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );

    if (!checkoutResponse.ok) throw new Error("Razorpay checkout creation failed");
    const checkout = (await checkoutResponse.json()) as { shopify_checkout_id?: unknown };
    if (typeof checkout.shopify_checkout_id !== "string") {
      throw new Error("Razorpay checkout id missing");
    }

    const orderResponse = await fetch(
      `https://api.razorpay.com/v1/magic/order/shopify?key_id=${encodeURIComponent(config.keyId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://api.razorpay.com",
        },
        body: JSON.stringify({ shopify_checkout_id: checkout.shopify_checkout_id }),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );

    if (!orderResponse.ok) throw new Error("Razorpay order creation failed");
    const order = (await orderResponse.json()) as { order_id?: unknown };
    if (typeof order.order_id !== "string" || !order.order_id.startsWith("order_")) {
      throw new Error("Razorpay order id missing");
    }

    return NextResponse.json({
      keyId: config.keyId,
      orderId: order.order_id,
      fallbackUrl: cart.checkoutUrl,
    });
  } catch (error) {
    console.error("Magic Checkout initialization failed:", error);
    return NextResponse.json(
      { error: "Could not start Magic Checkout" },
      { status: 502 },
    );
  }
}
