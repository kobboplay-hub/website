import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { getMagicCheckoutConfig } from "@/lib/razorpay/magic";

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
    typeof signature !== "string" || !/^[a-fA-F0-9]{64}$/.test(signature)
  ) {
    return NextResponse.json({ error: "Invalid payment response" }, { status: 400 });
  }

  const expected = createHmac("sha256", config.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const received = Buffer.from(signature, "hex");
  if (!timingSafeEqual(expected, received)) {
    return NextResponse.json({ error: "Payment signature verification failed" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.razorpay.com/v1/1cc/shopify/complete?key_id=${encodeURIComponent(config.keyId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ razorpay_payment_id: paymentId, razorpay_order_id: orderId }),
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      },
    );

    if (!response.ok) throw new Error("Razorpay order completion failed");
    const result = (await response.json()) as { order_status_url?: unknown };
    if (
      typeof result.order_status_url !== "string" ||
      new URL(result.order_status_url).protocol !== "https:"
    ) {
      throw new Error("Order status URL missing");
    }

    return NextResponse.json({ orderStatusUrl: result.order_status_url });
  } catch (error) {
    console.error("Magic Checkout payment completed, Shopify order pending:", error);
    return NextResponse.json(
      { error: "Payment received, but order confirmation is pending", paymentId },
      { status: 502 },
    );
  }
}
