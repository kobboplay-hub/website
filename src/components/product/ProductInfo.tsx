"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Lock,
  Loader2,
  type LucideProps,
} from "lucide-react";
import { formatPrice, type Product } from "@/lib/shopify/types";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductDescription from "@/components/product/ProductDescription";
import ProductDetailRating from "@/components/product/ProductDetailRating";
import ProductShareButton from "@/components/product/ProductShareButton";
import type { JudgeMeProductSummary } from "@/lib/judgeme";

interface ProductInfoProps {
  product: Product;
  reviewSummary?: JudgeMeProductSummary | null;
}

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

type TrustItem = {
  icon: typeof ReplacementIcon | typeof ShieldCheck | typeof Lock;
  label: string;
  href?: string;
};

function getTrustItems(showReplacement: boolean): TrustItem[] {
  const items: TrustItem[] = [];
  if (showReplacement) {
    items.push({
      icon: ReplacementIcon,
      label: "7 days Replacement",
      href: "/return-policy",
    });
  }
  items.push(
    {
      icon: ShieldCheck,
      label: "Secure transaction",
    },
    {
      icon: Lock,
      label: "Safe Checkout",
    },
  );
  return items;
}

export default function ProductInfo({ product, reviewSummary }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.handle);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((v) => v.availableForSale)?.id ??
      product.variants[0]?.id ??
      "",
  );
  const { buyNow, isBuyNowLoading } = useCart();
  const trustItems = getTrustItems(isElectronicToy(product));

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
    const checkoutUrl = await buyNow(selectedVariant.id, quantity);
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  const priceDisplay = formatPrice(displayPrice, currencyCode);

  return (
    <>
      <div className="flex min-w-0 flex-col lg:py-2">
        {/* Title block */}
        <div className="border-b border-kobbo-beige/80 pb-4 lg:border-none lg:pb-0">
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

          <ProductDetailRating summary={reviewSummary} />

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
          <button
            type="button"
            onClick={() => toggleWishlist(product.handle)}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-kobbo-beige bg-kobbo-white py-3 text-sm font-semibold text-kobbo-black transition-all hover:border-kobbo-yellow hover:bg-kobbo-cream active:bg-kobbo-beige"
          >
            <Heart
              className={`h-4 w-4 ${wishlisted ? "fill-kobbo-yellow text-kobbo-yellow" : ""}`}
            />
            {wishlisted ? "Added to Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        {/* Amazon-style service badges */}
        <div className="mt-6 flex flex-wrap items-start justify-start gap-x-5 gap-y-4 border-t border-kobbo-beige/80 pt-5 sm:gap-x-6">
          {trustItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f0ad4e]/70 bg-[#fff8ef]">
                  <Icon
                    className="h-5 w-5 text-[#e67e22]"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="max-w-[5.25rem] text-center text-[11px] font-medium leading-snug text-kobbo-muted sm:text-xs">
                  {item.label}
                </span>
              </>
            );

            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex w-[30%] max-w-[6rem] flex-col items-center gap-1.5 sm:w-auto sm:max-w-none sm:min-w-[5.5rem]"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={item.label}
                className="flex w-[30%] max-w-[6rem] flex-col items-center gap-1.5 sm:w-auto sm:max-w-none sm:min-w-[5.5rem]"
              >
                {content}
              </div>
            );
          })}
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
