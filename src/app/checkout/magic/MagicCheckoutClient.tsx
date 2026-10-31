"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

import { CART_STORAGE_KEY } from "@/lib/shopify/cart";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckout {
  open: () => void;
}

interface RazorpayWindow extends Window {
  Razorpay?: new (options: Record<string, unknown>) => RazorpayCheckout;
}

type CheckoutState = "loading" | "open" | "cancelled" | "failed" | "confirming" | "pending";

export default function MagicCheckoutClient({ cartId }: { cartId: string }) {
  const [scriptReady, setScriptReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<CheckoutState>("loading");
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!scriptReady || started.current) return;
    started.current = true;
    let disposed = false;

    async function start() {
      try {
        const response = await fetch("/api/magic/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId }),
        });
        if (!response.ok) throw new Error("Checkout could not be started");
        const data = (await response.json()) as {
          keyId: string;
          orderId: string;
          fallbackUrl: string;
        };
        if (disposed) return;
        setFallbackUrl(data.fallbackUrl);

        const Razorpay = (window as RazorpayWindow).Razorpay;
        if (!Razorpay) throw new Error("Payment form did not load");

        const checkout = new Razorpay({
          key: data.keyId,
          name: "Kobbo",
          order_id: data.orderId,
          show_coupons: true,
          handler: async (payment: RazorpayResponse) => {
            setState("confirming");
            setPaymentId(payment.razorpay_payment_id);
            try {
              const completed = await fetch("/api/magic/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payment),
              });
              if (!completed.ok) throw new Error("Order confirmation pending");
              const result = (await completed.json()) as { orderStatusUrl: string };
              if (localStorage.getItem(CART_STORAGE_KEY) === cartId) {
                localStorage.removeItem(CART_STORAGE_KEY);
              }
              window.location.assign(result.orderStatusUrl);
            } catch {
              // Never redirect to another checkout after a payment was captured.
              setState("pending");
            }
          },
          modal: {
            ondismiss: () => setState((current) => current === "confirming" ? current : "cancelled"),
          },
        });
        setState("open");
        checkout.open();
      } catch {
        if (disposed) return;
        setState("failed");
        try {
          const response = await fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`);
          if (response.ok) {
            const result = await response.json();
            setFallbackUrl(result.cart?.checkoutUrl ?? null);
          }
        } catch {
          // The cart page remains available if the Shopify checkout URL cannot be fetched.
        }
      }
    }

    void start();
    return () => { disposed = true; };
  }, [attempt, cartId, scriptReady]);

  const retry = () => {
    started.current = false;
    setState("loading");
    setAttempt((current) => current + 1);
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fff9e9] px-4 py-16">
      <Script
        src="https://checkout.razorpay.com/v1/magic-checkout.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setState("failed")}
      />
      <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-white p-7 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-neutral-900">Kobbo secure checkout</h1>
        <p className="mt-3 text-sm text-neutral-600" role="status">
          {state === "loading" && "Preparing your Play Kit checkout…"}
          {state === "open" && "Complete your order in the secure payment window."}
          {state === "cancelled" && "You closed the payment window. Your cart is still available."}
          {state === "failed" && "The payment window could not open. You can use the regular checkout."}
          {state === "confirming" && "Payment received. Confirming your order…"}
          {state === "pending" && "Payment was received, but order confirmation is pending. Please contact us with your payment ID before trying again."}
        </p>
        {state === "pending" && paymentId && (
          <p className="mt-3 select-all rounded-lg bg-amber-50 p-3 text-sm font-medium text-neutral-900">
            Payment ID: {paymentId}
          </p>
        )}
        {(state === "cancelled" || state === "failed") && (
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={retry}
              className="rounded-full bg-[#ffc400] px-5 py-3 font-semibold text-neutral-900"
            >
              Try Magic Checkout again
            </button>
            <a
              href={fallbackUrl ?? "/cart"}
              className="rounded-full border border-neutral-300 px-5 py-3 font-semibold text-neutral-900"
            >
              {fallbackUrl ? "Continue with regular checkout" : "Return to cart"}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
