"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  Loader2,
  ShieldCheck,
  type LucideProps,
} from "lucide-react";
import { formatPrice, type Product } from "@/lib/shopify/types";
import { useCart } from "@/context/cart-context";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductDescription from "@/components/product/ProductDescription";
import ProductDetailRating from "@/components/product/ProductDetailRating";
import ProductShareButton from "@/components/product/ProductShareButton";
import ProductHighlights from "@/components/product/ProductHighlights";
import { useProductPurchase } from "@/components/product/ProductPurchaseContext";

/** Shopify product tag that shows the "7 days Replacement" badge. Add/remove this tag to toggle. */
export const ELECTRONICS_TAG = "electronics";

function isElectronicToy(product: Product): boolean {
  const tags = product.tags.map((tag) => tag.trim().toLowerCase());
  if (tags.includes(ELECTRONICS_TAG)) return true;
  // Fallback: Product type set to Electronics / Electronic Toy in Shopify Admin
  const type = product.productType.trim().toLowerCase();
  return type.includes("electronic");
}

/** Amazon-style box + return arrow icon */
function ReplacementIcon({ className, strokeWidth = 1.75 }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* Return arrow */}
      <path d="M7 7H4a1 1 0 0 0-1 1v3" />
      <path d="M4 8c2.5-3 6-4.5 9.5-4 4.5.6 7.5 4 8 8" />
      <path d="m5.5 4.5-2 3.5 3.8.2" />
      {/* Package */}
      <path d="M7.5 12.5 12 10l4.5 2.5v5.5L12 20.5 7.5 18z" />
      <path d="M12 10v10.5" />
      <path d="m7.5 12.5 4.5 2.5 4.5-2.5" />
    </svg>
  );
}

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
  const hasReplacement = isElectronicToy(product);

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
          <AddToCartButton
            merchandiseId={selectedVariant?.id ?? null}
            quantity={quantity}
            productTitle={product.title}
            disabled={!isAvailable}
            variant="full"
            className="w-full min-h-12"
          />
          <button
            type="button"
            disabled={!isAvailable || buyNowLoading}
            onClick={handleBuyNow}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-kobbo-black bg-kobbo-black py-3.5 text-sm font-bold text-kobbo-white transition-all active:scale-[0.99] hover:bg-kobbo-black/90 disabled:cursor-not-allowed disabled:opacity-50 lg:hover:-translate-y-0.5"
          >
            {buyNowLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Buy Now
          </button>
          {buyNowFailed && (
            <p role="alert" className="text-center text-sm text-red-700">
              {error ?? "Checkout could not open. Please try again."}
            </p>
          )}
          {product.isKit && (
            <p className="rounded-2xl border border-kobbo-yellow/60 bg-kobbo-yellow/15 px-4 py-3 text-center font-heading text-base font-extrabold leading-snug text-kobbo-black sm:text-lg">
              ₹150 OFF on Prepaid Orders + A FREE GIFT 🎁
            </p>
          )}
        </div>

        <div className="mt-5 border-t border-kobbo-beige/80 pt-4">
          <div className={`grid gap-2.5 ${hasReplacement ? "grid-cols-2" : "grid-cols-1"}`}>
            {hasReplacement && (
              <Link
                href="/return-policy"
                className="flex min-h-14 min-w-0 items-center gap-2 rounded-xl border border-kobbo-beige bg-kobbo-white/75 px-2.5 py-2.5 text-xs font-semibold leading-snug text-kobbo-black transition-colors hover:border-kobbo-yellow sm:gap-3 sm:px-4 sm:text-sm"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-kobbo-yellow/15 sm:size-9">
                  <ReplacementIcon className="size-4.5 text-[#c96921] sm:size-5" strokeWidth={1.75} />
                </span>
                <span>7 days Replacement</span>
              </Link>
            )}
            <div className="flex min-h-14 min-w-0 items-center gap-2 rounded-xl border border-kobbo-beige bg-kobbo-white/75 px-2.5 py-2.5 text-xs font-semibold leading-snug text-kobbo-black sm:gap-3 sm:px-4 sm:text-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-kobbo-yellow/15 sm:size-9">
                <ShieldCheck className="size-4.5 text-kobbo-black sm:size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span>Secure Transaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky buy bar — standard ecommerce pattern */}
      <div
        id="product-mobile-buy-bar"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-kobbo-beige bg-kobbo-white/95 px-4 py-3 shadow-soft-lg backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 shrink-0">
            <p className="text-[10px] font-medium text-kobbo-muted">Price</p>
            <p className="text-lg font-bold leading-tight text-kobbo-black">
              {priceDisplay}
            </p>
          </div>
          <AddToCartButton
            merchandiseId={selectedVariant?.id ?? null}
            quantity={quantity}
            productTitle={product.title}
            disabled={!isAvailable}
            variant="full"
            label="Add to Cart"
            className="min-h-11 flex-1"
          />
        </div>
      </div>
    </>
  );
}
