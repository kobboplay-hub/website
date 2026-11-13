"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/shopify/types";
import CartLineItem from "@/components/cart/CartLineItem";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { emptyStates, errorStates } from "@/data/empty-states";
import { lifestyleEmptyStates } from "@/data/lifestyle";
import { useStorefront } from "@/components/storefront/StorefrontContext";
import { getStorefrontShopPath, withStorefrontParam } from "@/lib/storefront/product-routing";

export default function CartPageContent() {
  const {
    cart,
    loading,
    isCheckoutLoading,
    proceedToCheckout,
    subtotal,
    currencyCode,
    error,
  } = useCart();
  const storefront = useStorefront();
  const lifestyle = storefront === "lifestyle";
  const empty = lifestyle ? lifestyleEmptyStates.cart : emptyStates.cart;

  const isEmpty = !cart || cart.lines.length === 0;

  const handleCheckout = async () => {
    // Every INR cart uses Magic Checkout when enabled; the storefront lets payment pages link back correctly.
    const url = await proceedToCheckout();
    if (url) {
      window.location.href = withStorefrontParam(url, storefront);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading your cart" />;
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={empty.title}
        description={empty.description}
        cta={empty.cta}
        ctaHref={empty.ctaHref}
        emoji={lifestyle ? undefined : emptyStates.cart.emoji}
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1
          className={
            lifestyle
              ? "font-ls-display text-2xl font-bold tracking-[-0.02em] text-ls-ink sm:text-3xl"
              : "font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl"
          }
        >
          Your Cart
        </h1>
        {error && (
          <div className="mt-4">
            <ErrorState
              title={errorStates.cart.title}
              description={error}
            />
          </div>
        )}
        <div className="mt-6 space-y-3">
          {cart.lines.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </div>
      </div>

      <div
        className={
          lifestyle
            ? "h-fit rounded-[4px] border border-ls-line bg-ls-paper p-6 lg:sticky lg:top-24"
            : "h-fit rounded-3xl bg-kobbo-white p-6 shadow-soft lg:sticky lg:top-24"
        }
      >
        <h2
          className={
            lifestyle
              ? "font-ls-display text-lg font-semibold text-ls-ink"
              : "font-heading text-lg font-extrabold text-kobbo-black"
          }
        >
          Order Summary
        </h2>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-kobbo-muted">Subtotal</dt>
            <dd className="font-bold text-kobbo-black">
              {formatPrice(subtotal, currencyCode)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-kobbo-beige pt-3">
            <dt className="font-bold text-kobbo-black">Total</dt>
            <dd className="text-lg font-bold text-kobbo-black">
              {formatPrice(subtotal, currencyCode)}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={isCheckoutLoading || isEmpty}
          className={
            lifestyle
              ? "mt-6 flex w-full items-center justify-center gap-2 rounded-[4px] bg-ls-ink py-3.5 text-sm font-medium text-ls-paper transition-colors hover:bg-ls-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
              : "mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light disabled:cursor-not-allowed disabled:opacity-50"
          }
        >
          {isCheckoutLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Checkout
        </button>

        <Link
          href={getStorefrontShopPath(storefront)}
          className={
            lifestyle
              ? "mt-3 flex w-full items-center justify-center rounded-[4px] border border-ls-ink/25 py-3 text-sm font-medium text-ls-ink transition-colors hover:border-ls-ink"
              : "mt-3 flex w-full items-center justify-center rounded-full border-2 border-kobbo-beige py-3 text-sm font-bold text-kobbo-black transition-all hover:border-kobbo-yellow hover:bg-kobbo-cream"
          }
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
