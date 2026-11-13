"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff, Loader2, Plus } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { getDiscountPercent, type LifestyleCardProduct } from "@/lib/storefront/lifestyle-card";
import { getProductPath } from "@/lib/storefront/product-routing";
import LifestyleImage from "./LifestyleImage";
import LifestylePrice from "./LifestylePrice";
import LifestyleRatingStars from "./LifestyleRatingStars";

export interface LifestyleCardRating {
  averageRating: number;
  reviewCount: number;
}

interface LifestyleProductCardProps {
  product: LifestyleCardProduct;
  /** Judge.me summary; nothing is shown until real reviews exist. */
  rating?: LifestyleCardRating | null;
  eager?: boolean;
  sizes?: string;
}

export default function LifestyleProductCard({
  product,
  rating = null,
  eager = false,
  sizes = "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw",
}: LifestyleProductCardProps) {
  const { addToCart, isAddingMerchandise } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const href = getProductPath({ handle: product.handle, isLifestyle: true });
  const [primary, secondary] = product.images;
  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const wishlisted = isWishlisted(product.handle);
  const adding = product.quickAddVariantId ? isAddingMerchandise(product.quickAddVariantId) : false;
  const canQuickAdd = product.availableForSale && Boolean(product.quickAddVariantId);
  const hasRating = rating !== null && rating.reviewCount > 0 && rating.averageRating > 0;
  // The hover photo is fetched on first mouse hover only, so touch devices never download it.
  const [showSecondary, setShowSecondary] = useState(false);
  const [secondaryReady, setSecondaryReady] = useState(false);

  const quickAdd = async () => {
    if (!product.quickAddVariantId || adding) return;
    await addToCart(product.quickAddVariantId, 1);
  };

  return (
    <article
      className="group relative flex h-full flex-col"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setShowSecondary(true);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#f1ece4]">
        <Link href={href} aria-label={product.title} className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink">
          {primary ? (
            <>
              <LifestyleImage
                src={primary.url}
                alt={primary.altText || product.title}
                fill
                sizes={sizes}
                loading={eager ? "eager" : "lazy"}
                className={`object-cover transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.035] motion-reduce:group-hover:scale-100 ${
                  secondaryReady ? "group-hover:opacity-0" : ""
                }`}
              />
              {secondary && showSecondary && (
                <Image
                  src={secondary.url}
                  alt=""
                  fill
                  sizes={sizes}
                  onLoad={() => setSecondaryReady(true)}
                  className="object-cover opacity-0 transition-opacity duration-700 ease-out motion-reduce:transition-none group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-ls-muted">
              <ImageOff className="size-6" strokeWidth={1.5} aria-hidden />
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {!product.availableForSale ? (
            <span className="rounded-full bg-ls-paper/95 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ls-ink">
              Sold out
            </span>
          ) : discount ? (
            <span className="rounded-full bg-ls-accent px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-ls-paper">
              {discount}% off
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.handle)}
          aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ls-paper/90 text-ls-ink backdrop-blur-sm transition-opacity hover:bg-ls-paper focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ls-ink lg:opacity-0 lg:group-hover:opacity-100 lg:aria-pressed:opacity-100"
        >
          <Heart className={`size-4 ${wishlisted ? "fill-ls-ink" : ""}`} strokeWidth={1.7} aria-hidden />
        </button>

        <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-300 motion-reduce:transition-none group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 lg:block">
          {canQuickAdd ? (
            <button
              type="button"
              onClick={quickAdd}
              disabled={adding}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-ls-ink text-sm font-semibold text-ls-paper transition-colors hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink disabled:opacity-70"
            >
              {adding ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" strokeWidth={2} aria-hidden />}
              Quick add
            </button>
          ) : product.availableForSale ? (
            <Link
              href={href}
              className="flex h-11 w-full items-center justify-center rounded-[4px] bg-ls-paper text-sm font-semibold text-ls-ink transition-colors hover:bg-ls-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
            >
              Choose options
            </Link>
          ) : null}
        </div>

        {canQuickAdd && (
          <button
            type="button"
            onClick={quickAdd}
            disabled={adding}
            aria-label={`Add ${product.title} to cart`}
            className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-ls-ink text-ls-paper shadow-[0_6px_16px_-8px_rgba(29,28,26,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink disabled:opacity-70 lg:hidden"
          >
            {adding ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" strokeWidth={2} aria-hidden />}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {product.category && (
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ls-muted">{product.category}</p>
        )}
        <h3 className="mt-1.5 font-ls-display text-[15px] font-semibold leading-snug text-ls-ink sm:text-base">
          <Link href={href} className="line-clamp-2 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-ls-ink">
            {product.title}
          </Link>
        </h3>
        {hasRating && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ls-muted">
            <LifestyleRatingStars rating={rating.averageRating} />
            <span className="tabular-nums">
              {rating.averageRating.toFixed(1)} ({rating.reviewCount})
            </span>
          </p>
        )}
        {product.optionSummary && <p className="mt-1.5 text-xs text-ls-muted">{product.optionSummary}</p>}
        <div className="mt-auto pt-2.5">
          <LifestylePrice
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            currencyCode={product.currencyCode}
            showSavings={false}
          />
        </div>
      </div>
    </article>
  );
}
