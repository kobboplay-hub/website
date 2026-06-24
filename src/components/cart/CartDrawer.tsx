"use client";

import Link from "next/link";
import { X, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/shopify/types";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shopify/cart";
import CartLineItem from "./CartLineItem";

export default function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeCart,
    subtotal,
    currencyCode,
    checkoutUrl,
    isCheckoutLoading,
    setCheckoutLoading,
    error,
    clearError,
  } = useCart();

  const isEmpty = !cart || cart.lines.length === 0;

  const handleCheckout = () => {
    if (checkoutUrl) {
      setCheckoutLoading(true);
      window.location.href = checkoutUrl;
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
          <div className="mx-5 mt-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={clearError} aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-kobbo-cream">
              <span className="text-5xl">🧸</span>
            </div>
            <p className="font-heading mt-6 text-xl font-bold text-kobbo-black">
              Cart is Empty
            </p>
            <p className="mt-2 text-sm text-kobbo-muted">
              Discover playful toys for little minds.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-kobbo-yellow px-8 py-3 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light"
            >
              Continue Shopping
            </Link>
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
                  disabled={isCheckoutLoading || !checkoutUrl}
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
