import { NextResponse } from "next/server";

import {
  MagicCompletionError,
  completeShopifyOrder,
  getMagicCheckoutConfig,
  verifyHmacSha256,
} from "@/lib/razorpay/magic";

export async function POST(request: Request) {
  const config = getMagicCheckoutConfig();
  if (!config) {
    return NextResponse.json({ error: "Magic Checkout is unavailable" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const paymentId = body.razorpay_payment_id;
  const orderId = body.razorpay_order_id;
  const signature = body.razorpay_signature;

  if (
    typeof paymentId !== "string" || !/^pay_[A-Za-z0-9]+$/.test(paymentId) ||
    typeof orderId !== "string" || !/^order_[A-Za-z0-9]+$/.test(orderId) ||
    typeof signature !== "string"
  ) {
    return NextResponse.json({ error: "Invalid payment response" }, { status: 400 });
  }

  if (!verifyHmacSha256(`${orderId}|${paymentId}`, config.keySecret, signature)) {
    return NextResponse.json({ error: "Payment signature verification failed" }, { status: 400 });
  }

  try {
    const order = await completeShopifyOrder(config.keyId, paymentId, orderId, 20000);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Magic Checkout payment received, Shopify order pending:", paymentId, error);
    const retryable = !(error instanceof MagicCompletionError) || error.retryable;
    return NextResponse.json(
      { error: "Payment received, but order confirmation is pending", paymentId },
      { status: retryable ? 502 : 422 },
    );
  }
}
