"use client";

import { useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Lock,
  Loader2,
} from "lucide-react";
import { formatPrice, type Product } from "@/lib/shopify/types";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductDescription from "@/components/product/ProductDescription";

interface ProductInfoProps {
  product: Product;
}

const trustItems = [
  { icon: Truck, label: "Fast Shipping" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Lock, label: "Secure Checkout" },
];

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.handle);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((v) => v.availableForSale)?.id ??
      product.variants[0]?.id ??
      "",
  );
  const { buyNow, isBuyNowLoading } = useCart();

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
      <div className="flex flex-col lg:py-2">
        {/* Title block */}
        <div className="border-b border-kobbo-beige/80 pb-4 lg:border-none lg:pb-0">
          <h1 className="font-heading text-xl font-extrabold leading-tight text-kobbo-black sm:text-2xl lg:text-4xl">
            {product.title}
          </h1>

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

        {/* Trust row */}
        <div className="mt-5 grid grid-cols-3 gap-1.5 rounded-2xl bg-kobbo-cream p-3 sm:gap-2 sm:p-4">
          {trustItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 text-center"
            >
              <Icon className="h-4 w-4 text-kobbo-black" strokeWidth={2} />
              <span className="text-[10px] font-semibold leading-tight text-kobbo-black sm:text-xs">
                {label}
              </span>
            </div>
          ))}
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
