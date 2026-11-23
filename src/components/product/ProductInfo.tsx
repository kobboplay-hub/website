"use client";

import { useState } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { formatPrice, type Product } from "@/lib/shopify/types";
import { useCart } from "@/context/cart-context";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductDescription from "@/components/product/ProductDescription";
import ProductDetailRating from "@/components/product/ProductDetailRating";
import ProductShareButton from "@/components/product/ProductShareButton";
import ProductHighlights from "@/components/product/ProductHighlights";
import PrepaidOfferBanner from "@/components/product/PrepaidOfferBanner";
import { useProductPurchase } from "@/components/product/ProductPurchaseContext";

export default function ProductInfo({ product }: { product: Product }) {
  const { quantity, setQuantity, selectedVariantId, setSelectedVariantId } = useProductPurchase();
  const { buyNow, isBuyNowLoading, error } = useCart();
  const [buyNowFailed, setBuyNowFailed] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  const displayPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : product.price;

  const displayCompareAt = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : product.compareAtPrice;

  const currencyCode =
    selectedVariant?.price.currencyCode ?? product.currencyCode;

  const hasMultipleVariants =
    product.variants.length > 1 &&
    !(
      product.variants.length === 1 &&
      product.variants[0]?.title === "Default Title"
    );

  const isAvailable =
    selectedVariant?.availableForSale ?? product.availableForSale;

  const buyNowLoading = selectedVariant?.id
    ? isBuyNowLoading(selectedVariant.id)
    : false;

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) return;
    setBuyNowFailed(false);
    const checkoutUrl = await buyNow(selectedVariant.id, quantity);
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      setBuyNowFailed(true);
    }
  };

  const priceDisplay = formatPrice(displayPrice, currencyCode);

  return (
    <>
      <div className="flex min-w-0 flex-col lg:py-2">
        {/* Title block */}
        <div className="border-b border-kobbo-beige/80 pb-4 lg:border-none lg:pb-0">
          <ProductHighlights product={product} />
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-heading min-w-0 flex-1 break-words text-xl font-extrabold leading-tight text-kobbo-black sm:text-2xl lg:text-4xl">
              {product.title}
            </h1>
            <div className="hidden shrink-0 pt-1 lg:block">
              <ProductShareButton
                productTitle={product.title}
                productHandle={product.handle}
                variant="inline"
              />
            </div>
          </div>

          <ProductDetailRating productId={product.id} />

          {product.vendor && (
            <p className="mt-1.5 text-xs text-kobbo-muted sm:text-sm">
              by {product.vendor}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-2xl font-bold text-kobbo-black sm:text-3xl">
              {priceDisplay}
            </span>
            {displayCompareAt && displayCompareAt > displayPrice && (
              <span className="text-base text-kobbo-muted line-through sm:text-lg">
                {formatPrice(displayCompareAt, currencyCode)}
              </span>
            )}
            {!isAvailable && (
              <span className="inline-flex rounded-full bg-kobbo-beige px-2.5 py-0.5 text-[11px] font-semibold text-kobbo-muted sm:text-xs">
                Out of Stock
              </span>
            )}
          </div>

          {/* Top Placement: Prominent Prepaid Deal Highlight */}
          <PrepaidOfferBanner variant="top" />
        </div>

        <ProductDescription description={product.description} />

        {hasMultipleVariants && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-kobbo-muted sm:text-sm sm:normal-case sm:tracking-normal">
              Select option
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  disabled={!variant.availableForSale}
                  className={`min-h-11 rounded-full border-2 px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    selectedVariantId === variant.id
                      ? "border-kobbo-yellow bg-kobbo-yellow/20 text-kobbo-black"
                      : "border-kobbo-beige bg-kobbo-white text-kobbo-muted hover:border-kobbo-yellow"
                  } ${!variant.availableForSale ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-kobbo-black">
            Quantity
          </span>
          <div className="flex items-center rounded-full border-2 border-kobbo-beige bg-kobbo-white">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-l-full transition-colors hover:bg-kobbo-cream active:bg-kobbo-beige"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2.5rem] text-center text-sm font-bold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-r-full transition-colors hover:bg-kobbo-cream active:bg-kobbo-beige"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Primary actions */}
        <div className="mt-5 space-y-2.5">
          {/* 1st button: Buy Now */}
          <button
            type="button"
            disabled={!isAvailable || buyNowLoading}
            onClick={handleBuyNow}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3.5 text-sm font-bold text-kobbo-black shadow-soft transition-all active:scale-[0.99] hover:bg-kobbo-yellow-light hover:shadow-soft-lg disabled:cursor-not-allowed disabled:opacity-50 lg:hover:-translate-y-0.5"
          >
            {buyNowLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Buy Now
          </button>

          {/* 2nd button: Add to Cart */}
          <AddToCartButton
            merchandiseId={selectedVariant?.id ?? null}
            quantity={quantity}
            productTitle={product.title}
            disabled={!isAvailable}
            variant="full"
            buttonVariant="secondary"
            className="w-full min-h-12"
          />

          {buyNowFailed && (
            <div role="alert" className="flex flex-col items-center gap-1.5 text-center text-sm text-red-600">
              <p>{error ?? "Checkout could not open. Please try again."}</p>
              <button
                type="button"
                onClick={handleBuyNow}
                className="text-xs font-semibold text-kobbo-black underline hover:text-kobbo-muted transition-colors"
              >
                Tap here to retry
              </button>
            </div>
          )}
          {/* Bottom Placement: Big, bold & impossible to miss (all products) */}
          <PrepaidOfferBanner variant="bottom" />
        </div>
      </div>

      {/* Mobile sticky buy bar — standard ecommerce pattern with sticky reminder */}
      <div
        id="product-mobile-buy-bar"
        className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden border-t border-kobbo-beige bg-kobbo-white/95 shadow-soft-lg backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <PrepaidOfferBanner variant="sticky" />
        <div className="mx-auto flex max-w-lg items-center gap-2 px-3 pt-2">
          <div className="min-w-0 shrink-0 pr-1">
            <p className="text-[10px] font-medium text-kobbo-muted">Price</p>
            <p className="text-base font-bold leading-tight text-kobbo-black">
              {priceDisplay}
            </p>
          </div>
          {/* 1st button: Buy Now */}
          <button
            type="button"
            disabled={!isAvailable || buyNowLoading}
            onClick={handleBuyNow}
            className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-kobbo-yellow px-3 py-2 text-xs font-bold text-kobbo-black shadow-soft transition-all active:scale-[0.99] hover:bg-kobbo-yellow-light disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            {buyNowLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Buy Now
          </button>
          {/* 2nd button: Add to Cart */}
          <AddToCartButton
            merchandiseId={selectedVariant?.id ?? null}
            quantity={quantity}
            productTitle={product.title}
            disabled={!isAvailable}
            variant="full"
            buttonVariant="secondary"
            label="Add to Cart"
            className="min-h-11 flex-1 px-2 text-xs sm:text-sm"
          />
        </div>
      </div>
    </>
  );
}
