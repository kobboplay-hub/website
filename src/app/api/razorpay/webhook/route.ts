import { NextResponse } from "next/server";

import { MagicCompletionError, completeShopifyOrder, verifyHmacSha256 } from "@/lib/razorpay/magic";

// Backup for customers who close the tab after paying: Razorpay notifies the server and the
// Shopify order is completed here. Completion is idempotent, so this is safe alongside the browser flow.
const COMPLETION_EVENTS = new Set(["payment.captured", "payment.pending", "order.paid"]);

interface PaymentEntity {
  id?: unknown;
  order_id?: unknown;
  status?: unknown;
  method?: unknown;
  notes?: Record<string, unknown> | unknown[];
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const keyId = process.env.RAZORPAY_MAGIC_KEY_ID;
  if (!secret || !keyId?.startsWith("rzp_")) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!verifyHmacSha256(rawBody, secret, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: unknown; payload?: { payment?: { entity?: PaymentEntity } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  const notes = payment?.notes && !Array.isArray(payment.notes) ? payment.notes : {};
  const isMagicPayment = typeof notes.storefront_id === "string" || typeof notes.cart_id === "string";

  if (
    typeof event.event !== "string" ||
    !COMPLETION_EVENTS.has(event.event) ||
    !isMagicPayment ||
    typeof payment?.id !== "string" ||
    typeof payment.order_id !== "string" ||
    (payment.status !== "captured" && !(payment.status === "pending" && payment.method === "cod"))
  ) {
    return NextResponse.json({ ignored: true });
  }

  try {
    const order = await completeShopifyOrder(keyId, payment.id, payment.order_id, 4000);
    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Razorpay webhook could not complete Shopify order:", payment.id, error);
    if (error instanceof MagicCompletionError && !error.retryable) {
      return NextResponse.json({ ignored: true });
    }
    return NextResponse.json({ error: "Order completion pending" }, { status: 500 });
  }
}
