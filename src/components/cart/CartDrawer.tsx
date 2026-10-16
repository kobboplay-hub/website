"use client";

import Link from "next/link";
import { X, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/shopify/types";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shopify/cart";
import CartLineItem from "./CartLineItem";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/data/empty-states";

export default function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeCart,
    subtotal,
    currencyCode,
    isCheckoutLoading,
    proceedToCheckout,
    error,
    clearError,
  } = useCart();

  const isEmpty = !cart || cart.lines.length === 0;

  const handleCheckout = async () => {
    // Shopify-hosted checkout: form fields and payment labels are controlled by Shopify.
    // This storefront only redirects to cart.checkoutUrl from the Storefront API.
    const url = await proceedToCheckout();
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <>
      {isDrawerOpen && (
        <button
          type="button"
          aria-label="Close cart"
          className="fixed inset-0 z-[60] bg-kobbo-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-[70] flex h-full w-full flex-col bg-kobbo-white shadow-soft-lg transition-transform duration-300 ease-in-out sm:w-[420px] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-kobbo-beige px-5 py-4">
          <h2 className="font-heading text-lg font-extrabold text-kobbo-black">
            Cart
            {cart && cart.totalQuantity > 0 && (
              <span className="ml-1.5 text-kobbo-muted">
                ({cart.totalQuantity})
              </span>
            )}
          </h2>
          <button
            type="button"
            aria-label="Close cart drawer"
            onClick={closeCart}
            className="rounded-full p-2 transition-colors hover:bg-kobbo-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 flex items-center justify-between rounded-2xl border border-kobbo-yellow/40 bg-kobbo-yellow/15 px-4 py-3 text-sm text-kobbo-black">
            <span>{error}</span>
            <button type="button" onClick={clearError} aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {isEmpty ? (
          <div className="flex flex-1 flex-col justify-center px-5">
            <EmptyState
              title={emptyStates.cart.title}
              description={emptyStates.cart.description}
              cta={emptyStates.cart.cta}
              ctaHref={emptyStates.cart.ctaHref}
              emoji={emptyStates.cart.emoji}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {cart.lines.map((line) => (
                  <CartLineItem key={line.id} line={line} />
                ))}
              </div>
            </div>

            <div className="border-t border-kobbo-beige px-5 py-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-kobbo-muted">Subtotal</span>
                  <span className="font-bold text-kobbo-black">
                    {formatPrice(subtotal, currencyCode)}
                  </span>
                </div>
                <p className="text-xs text-kobbo-muted">
                  {subtotal >= FREE_SHIPPING_THRESHOLD
                    ? "You qualify for free shipping!"
                    : `Free shipping on orders above ₹${FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}`}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="inline-flex items-center justify-center rounded-full border-2 border-kobbo-beige py-3 text-sm font-bold text-kobbo-black transition-all hover:border-kobbo-yellow hover:bg-kobbo-cream"
                >
                  View Cart
                </Link>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCheckoutLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
