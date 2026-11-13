"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Check, Loader2, Lock } from "lucide-react";

import { fraunces, manrope } from "@/components/lifestyle/fonts";
import { StorefrontMarker } from "@/components/storefront/StorefrontContext";
import { footerBrand } from "@/data/footer";
import { CART_STORAGE_KEY } from "@/lib/shopify/cart";
import {
  getStorefrontCartPath,
  withStorefrontParam,
  type Storefront,
} from "@/lib/storefront/product-routing";

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

interface CompletedOrder {
  orderNumber: string;
  paymentMethod: string | null;
  totalAmount: number | null;
}

interface SavedPayment {
  cartId: string;
  payment: RazorpayResponse;
  savedAt: number;
}

type CheckoutState = "loading" | "open" | "cancelled" | "failed" | "confirming" | "pending";

const PAYMENT_STORAGE_KEY = "kobbo_magic_payment";
const SAVED_PAYMENT_TTL_MS = 24 * 60 * 60 * 1000;
const RETRY_DELAYS_MS = [0, 1500, 3000, 6000];

class PermanentConfirmError extends Error {}

function readSavedPayment(cartId: string): RazorpayResponse | null {
  try {
    const saved = JSON.parse(localStorage.getItem(PAYMENT_STORAGE_KEY) ?? "null") as SavedPayment | null;
    if (!saved || saved.cartId !== cartId || Date.now() - saved.savedAt > SAVED_PAYMENT_TTL_MS) return null;
    return saved.payment;
  } catch {
    return null;
  }
}

function savePayment(cartId: string, payment: RazorpayResponse) {
  const saved: SavedPayment = { cartId, payment, savedAt: Date.now() };
  localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(saved));
}

function confirmationUrl(order: CompletedOrder, storefront: Storefront): string {
  const params = new URLSearchParams({ order: order.orderNumber });
  if (order.paymentMethod) params.set("method", order.paymentMethod);
  if (order.totalAmount !== null) params.set("total", String(order.totalAmount));
  return withStorefrontParam(`/checkout/success?${params}`, storefront);
}

async function completeOrder(payment: RazorpayResponse): Promise<CompletedOrder> {
  let lastError: unknown;
  for (const delay of RETRY_DELAYS_MS) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      const response = await fetch("/api/magic/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });
      if (response.ok) return (await response.json()) as CompletedOrder;
      if (response.status >= 400 && response.status < 500) {
        throw new PermanentConfirmError("Payment response was rejected");
      }
      lastError = new Error(`Order confirmation failed with ${response.status}`);
    } catch (error) {
      if (error instanceof PermanentConfirmError) throw error;
      lastError = error;
    }
  }
  throw lastError;
}

export default function MagicCheckoutClient({ cartId, storefront }: { cartId: string; storefront: Storefront }) {
  const [scriptReady, setScriptReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<CheckoutState>("loading");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const started = useRef(false);
  const confirming = useRef(false);
  const lifestyle = storefront === "lifestyle";

  const confirmPayment = useCallback(
    async (payment: RazorpayResponse) => {
      // Razorpay can call the handler more than once; the order must only be confirmed once at a time.
      if (confirming.current) return;
      confirming.current = true;
      setState("confirming");
      setPaymentId(payment.razorpay_payment_id);
      try {
        const order = await completeOrder(payment);
        localStorage.removeItem(PAYMENT_STORAGE_KEY);
        if (localStorage.getItem(CART_STORAGE_KEY) === cartId) {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
        // A full navigation resets the in-memory cart, and replace keeps Back from reopening checkout.
        window.location.replace(confirmationUrl(order, storefront));
      } catch {
        confirming.current = false;
        setState("pending");
      }
    },
    [cartId, storefront],
  );

  // A payment saved before a refresh or crash is confirmed instead of opening a second checkout.
  useEffect(() => {
    const saved = readSavedPayment(cartId);
    if (!saved) return;
    started.current = true;
    const timer = setTimeout(() => void confirmPayment(saved), 0);
    return () => clearTimeout(timer);
  }, [cartId, confirmPayment]);

  useEffect(() => {
    if (state !== "confirming") return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [state]);

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
        const data = (await response.json()) as { keyId: string; orderId: string };
        if (disposed) return;

        const Razorpay = (window as RazorpayWindow).Razorpay;
        if (!Razorpay) throw new Error("Payment form did not load");

        const checkout = new Razorpay({
          key: data.keyId,
          name: storefront === "lifestyle" ? "Kobbo Lifestyle" : "Kobbo",
          order_id: data.orderId,
          show_coupons: true,
          handler: (payment: RazorpayResponse) => {
            savePayment(cartId, payment);
            void confirmPayment(payment);
          },
          modal: {
            ondismiss: () => {
              if (!confirming.current) setState("cancelled");
            },
          },
        });
        setState("open");
        checkout.open();
      } catch {
        if (!disposed) setState("failed");
      }
    }

    void start();
    return () => { disposed = true; };
  }, [attempt, cartId, confirmPayment, scriptReady, storefront]);

  const retry = () => {
    started.current = false;
    setState("loading");
    setAttempt((current) => current + 1);
  };

  const retryConfirmation = () => {
    const saved = readSavedPayment(cartId);
    if (saved) void confirmPayment(saved);
  };

  return (
    <main
      className={`flex items-center justify-center bg-kobbo-cream px-4 py-16 ${
        lifestyle ? `${manrope.variable} ${fraunces.variable} ls-themed min-h-screen font-ls-body` : "min-h-[70vh]"
      }`}
    >
      <StorefrontMarker storefront={storefront} />
      <Script
        src="https://checkout.razorpay.com/v1/magic-checkout.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => {
          if (!confirming.current) setState("failed");
        }}
      />
      <div className="w-full max-w-md rounded-3xl border border-kobbo-beige bg-kobbo-white p-7 text-center shadow-soft sm:p-8">
        {state === "confirming" ? (
          <ConfirmingOrder />
        ) : (
          <>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-kobbo-yellow/20">
              {state === "loading" || state === "open" ? (
                <Loader2 className="size-6 animate-spin text-kobbo-black" aria-hidden />
              ) : (
                <Lock className="size-6 text-kobbo-black" aria-hidden />
              )}
            </div>
            <h1 className="mt-4 font-heading text-2xl font-extrabold text-kobbo-black">
              {state === "pending" ? "We're still confirming your order" : lifestyle ? "Kobbo Lifestyle secure checkout" : "Kobbo secure checkout"}
            </h1>
            <p className="mt-2 text-sm text-kobbo-muted" role="status">
              {state === "loading" && "Preparing your checkout…"}
              {state === "open" && "Complete your order in the secure payment window."}
              {state === "cancelled" && "You closed the payment window. Your cart is still available."}
              {state === "failed" && "The payment window could not open. Please try again."}
              {state === "pending" && "Your payment is safe. Please don't pay again. Try confirming once more, or contact us with your payment ID."}
            </p>
          </>
        )}
        {state === "pending" && (
          <div className="mt-5 flex flex-col gap-3">
            {paymentId && (
              <p className="select-all rounded-xl bg-kobbo-cream p-3 text-sm font-semibold text-kobbo-black">
                Payment ID: {paymentId}
              </p>
            )}
            <button
              type="button"
              onClick={retryConfirmation}
              className="rounded-full bg-kobbo-yellow px-5 py-3 font-semibold text-kobbo-black transition-colors hover:bg-kobbo-yellow-light"
            >
              Try confirming again
            </button>
            <a
              href={lifestyle ? `mailto:${footerBrand.email}` : "/contact"}
              className="rounded-full border border-kobbo-beige px-5 py-3 font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow"
            >
              Contact us
            </a>
          </div>
        )}
        {(state === "cancelled" || state === "failed") && (
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={retry}
              className="rounded-full bg-kobbo-yellow px-5 py-3 font-semibold text-kobbo-black transition-colors hover:bg-kobbo-yellow-light"
            >
              Try again
            </button>
            <a
              href={getStorefrontCartPath(storefront)}
              className="rounded-full border border-kobbo-beige px-5 py-3 font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow"
            >
              Return to cart
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

function ConfirmingOrder() {
  return (
    <div role="status" aria-live="polite">
      <div className="relative mx-auto size-20">
        <span className="absolute inset-0 rounded-full border-4 border-kobbo-beige" />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-kobbo-yellow" />
        <span className="absolute inset-3 flex items-center justify-center rounded-full bg-kobbo-yellow/20">
          <Lock className="size-6 text-kobbo-black" aria-hidden />
        </span>
      </div>
      <h1 className="mt-5 font-heading text-2xl font-extrabold text-kobbo-black">Confirming your order</h1>
      <p className="mt-2 text-sm text-kobbo-muted">This takes just a moment. Please don&apos;t close or refresh this page.</p>
      <ol className="mx-auto mt-6 max-w-xs space-y-3 text-left text-sm">
        <li className="flex items-center gap-3 font-semibold text-kobbo-black">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-kobbo-green text-kobbo-white">
            <Check className="size-4" strokeWidth={3} aria-hidden />
          </span>
          Payment details received
        </li>
        <li className="flex items-center gap-3 font-semibold text-kobbo-black">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-kobbo-yellow/30">
            <Loader2 className="size-4 animate-spin" aria-hidden />
          </span>
          Placing your order
        </li>
      </ol>
    </div>
  );
}
