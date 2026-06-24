"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/shopify/types";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shopify/cart";
import CartLineItem from "@/components/cart/CartLineItem";

export default function CartPageContent() {
  const {
    cart,
    loading,
    isCheckoutLoading,
    setCheckoutLoading,
    subtotal,
    currencyCode,
    checkoutUrl,
    error,
    clearError,
  } = useCart();

  const isEmpty = !cart || cart.lines.length === 0;
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const handleCheckout = () => {
    if (checkoutUrl) {
      setCheckoutLoading(true);
      window.location.href = checkoutUrl;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-3xl bg-kobbo-white px-6 py-16 text-center shadow-soft">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-kobbo-cream">
          <span className="text-5xl">🧸</span>
        </div>
        <p className="font-heading mt-6 text-2xl font-bold text-kobbo-black">
          Cart is Empty
        </p>
        <p className="mt-2 text-sm text-kobbo-muted">
          Discover playful toys for little minds.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-kobbo-yellow px-8 py-3 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
          Your Cart
        </h1>
        {error && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={clearError}>
              Dismiss
            </button>
          </div>
        )}
        <div className="mt-6 space-y-3">
          {cart.lines.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </div>
      </div>

      <div className="h-fit rounded-3xl bg-kobbo-white p-6 shadow-soft lg:sticky lg:top-24">
        <h2 className="font-heading text-lg font-extrabold text-kobbo-black">
          Order Summary
        </h2>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-kobbo-muted">Subtotal</dt>
            <dd className="font-bold text-kobbo-black">
              {formatPrice(subtotal, currencyCode)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-kobbo-muted">Estimated Shipping</dt>
            <dd className="font-medium text-kobbo-black">
              {qualifiesForFreeShipping ? "Free" : "Calculated at checkout"}
            </dd>
          </div>
          <div className="flex justify-between border-t border-kobbo-beige pt-3">
            <dt className="font-bold text-kobbo-black">Total</dt>
            <dd className="text-lg font-bold text-kobbo-black">
              {formatPrice(subtotal, currencyCode)}
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-xs text-kobbo-muted">
          {qualifiesForFreeShipping
            ? "You qualify for free shipping!"
            : `Free shipping on orders above ₹${FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}`}
        </p>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={isCheckoutLoading || !checkoutUrl}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCheckoutLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Checkout
        </button>

        <Link
          href="/shop"
          className="mt-3 flex w-full items-center justify-center rounded-full border-2 border-kobbo-beige py-3 text-sm font-bold text-kobbo-black transition-all hover:border-kobbo-yellow hover:bg-kobbo-cream"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
