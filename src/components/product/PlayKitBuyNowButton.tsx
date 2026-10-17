"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useProductPurchase } from "@/components/product/ProductPurchaseContext";

export default function PlayKitBuyNowButton() {
  const { product, selectedVariantId, quantity } = useProductPurchase();
  const { buyNow, isBuyNowLoading, error } = useCart();
  const [checkoutFailed, setCheckoutFailed] = useState(false);
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    product.variants[0];
  const loading = selectedVariant?.id ? isBuyNowLoading(selectedVariant.id) : false;
  const available = selectedVariant?.availableForSale ?? false;

  const handleBuyNow = async () => {
    if (!selectedVariant?.id || !available) return;
    setCheckoutFailed(false);
    const checkoutUrl = await buyNow(selectedVariant.id, quantity);
    if (checkoutUrl) window.location.href = checkoutUrl;
    else setCheckoutFailed(true);
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-lg sm:mt-12">
      <button
      type="button"
      onClick={handleBuyNow}
      disabled={!available || loading}
      className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-kobbo-yellow px-8 py-3.5 text-base font-bold text-kobbo-black shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-kobbo-yellow-light active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-16 sm:text-lg"
    >
      {loading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
      {available ? "Buy Now" : "Out of Stock"}
      {available && !loading ? <ArrowRight className="size-5" aria-hidden /> : null}
      </button>
      {checkoutFailed && (
        <p role="alert" className="mt-3 text-center text-sm text-red-700">
          {error ?? "Checkout could not open. Please try again."}
        </p>
      )}
    </div>
  );
}
