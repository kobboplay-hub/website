"use client";

import { useState } from "react";
import { Heart, Minus, Plus, Truck, RotateCcw, Lock, Loader2 } from "lucide-react";
import { formatPrice, type Product } from "@/lib/shopify/types";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import AddToCartButton from "@/components/cart/AddToCartButton";

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

  const shortDescription =
    product.description.length > 200
      ? `${product.description.slice(0, 200)}…`
      : product.description;

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

  return (
    <div className="flex flex-col">
      <h1 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl lg:text-4xl">
        {product.title}
      </h1>

      {product.vendor && (
        <p className="mt-1 text-sm text-kobbo-muted">by {product.vendor}</p>
      )}

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-kobbo-black sm:text-3xl">
          {formatPrice(displayPrice, currencyCode)}
        </span>
        {displayCompareAt && displayCompareAt > displayPrice && (
          <span className="text-lg text-kobbo-muted line-through">
            {formatPrice(displayCompareAt, currencyCode)}
          </span>
        )}
      </div>

      {!isAvailable && (
        <span className="mt-2 inline-flex w-fit rounded-full bg-kobbo-beige px-3 py-1 text-xs font-semibold text-kobbo-muted">
          Out of Stock
        </span>
      )}

      <p className="mt-4 text-sm leading-relaxed text-kobbo-muted sm:text-base">
        {shortDescription}
      </p>

      {hasMultipleVariants && (
        <div className="mt-6">
          <span className="text-sm font-semibold text-kobbo-black">Options</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={!variant.availableForSale}
                className={`rounded-full border-2 px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  selectedVariantId === variant.id
                    ? "border-kobbo-yellow bg-kobbo-yellow/20 text-kobbo-black"
                    : "border-kobbo-beige text-kobbo-muted hover:border-kobbo-yellow"
                } ${!variant.availableForSale ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-kobbo-black">Quantity</span>
        <div className="flex items-center rounded-full border-2 border-kobbo-beige bg-kobbo-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-l-full transition-colors hover:bg-kobbo-cream"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-bold">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-r-full transition-colors hover:bg-kobbo-cream"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <AddToCartButton
          merchandiseId={selectedVariant?.id ?? null}
          quantity={quantity}
          productTitle={product.title}
          disabled={!isAvailable}
          variant="full"
          className="flex-1"
        />
        <button
          type="button"
          disabled={!isAvailable || buyNowLoading}
          onClick={handleBuyNow}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-kobbo-black bg-kobbo-black py-3.5 text-sm font-bold text-kobbo-white transition-all hover:-translate-y-0.5 hover:bg-kobbo-black/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buyNowLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Buy Now
        </button>
      </div>

      <button
        type="button"
        onClick={() => toggleWishlist(product.handle)}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border-2 border-kobbo-beige py-3 text-sm font-semibold text-kobbo-black transition-all hover:border-kobbo-yellow hover:bg-kobbo-cream"
      >
        <Heart
          className={`h-4 w-4 ${wishlisted ? "fill-kobbo-yellow text-kobbo-yellow" : ""}`}
        />
        {wishlisted ? "Added to Wishlist" : "Add to Wishlist"}
      </button>

      <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-kobbo-cream p-4">
        {trustItems.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <Icon className="h-4 w-4 text-kobbo-black" />
            <span className="text-[11px] font-semibold text-kobbo-black sm:text-xs">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
