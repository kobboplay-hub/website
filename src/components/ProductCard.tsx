"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Heart, ImageOff, Sparkles } from "lucide-react";
import {
  formatPrice,
  getProductImageUrl,
  getProductPreviewVideoUrl,
  type Product,
} from "@/lib/shopify/types";
import { getDefaultMerchandiseId } from "@/lib/shopify/cart";
import { useWishlist } from "@/context/wishlist-context";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductCardRating from "@/components/reviews/ProductCardRating";
import type { JudgeMeProductSummary } from "@/lib/judgeme";

const DEFAULT_IMAGE_SIZES =
  "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw";

interface ProductCardProps {
  product: Product;
  reviewSummary?: JudgeMeProductSummary | null;
  /** Small pill shown over the image, e.g. "Featured" */
  badge?: string;
  /** `featured`: discount % and a full-width Add to Cart button */
  layout?: "compact" | "featured";
  imageSizes?: string;
  deferRating?: boolean;
}

export default function ProductCard({
  product,
  reviewSummary,
  badge,
  layout = "compact",
  imageSizes = DEFAULT_IMAGE_SIZES,
  deferRating = false,
}: ProductCardProps) {
  const isFeaturedLayout = layout === "featured";
  const hasDiscount =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;
  const discountPercent =
    hasDiscount && product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : 0;
  const imageUrl = getProductImageUrl(product);
  const videoUrl = getProductPreviewVideoUrl(product);
  const merchandiseId = getDefaultMerchandiseId(product);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.handle);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  useEffect(() => {
    if (!videoUrl || canHover) return;

    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setShowVideo(entry.isIntersecting && entry.intersectionRatio > 0.55);
      },
      { threshold: [0.4, 0.55, 0.75] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [videoUrl, canHover]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (showVideo) {
      video.currentTime = 0;
      void video.play().catch(() => {
        // Autoplay may be blocked — keep poster image visible.
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [showVideo, videoUrl]);

  function handlePointerEnter() {
    if (canHover && videoUrl) setShowVideo(true);
  }

  function handlePointerLeave() {
    if (canHover) setShowVideo(false);
  }

  return (
    <article
      ref={cardRef}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-kobbo-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <Link
        href={`/products/${product.handle}`}
        className="relative aspect-square overflow-hidden bg-kobbo-white"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.featuredImage?.altText ?? product.title}
            fill
            sizes={imageSizes}
            className={`object-contain p-2 transition-all duration-500 group-hover:scale-[1.03] sm:p-3 ${
              showVideo ? "opacity-0" : "opacity-100"
            }`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-kobbo-muted">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {videoUrl && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              showVideo ? "opacity-100" : "opacity-0"
            }`}
            src={videoUrl}
            muted
            playsInline
            loop
            preload="none"
            aria-hidden
          />
        )}

        {badge && (
          <span className="absolute left-2 top-2.5 z-10 inline-flex max-w-[calc(100%-3.5rem)] items-center gap-1 rounded-full bg-kobbo-white/95 px-2 py-1 text-[10px] font-bold leading-none text-kobbo-black shadow-soft sm:left-2.5 sm:px-2.5 sm:text-[11px]">
            <Sparkles
              className="h-3 w-3 shrink-0 text-kobbo-yellow"
              strokeWidth={2.5}
            />
            <span className="truncate">{badge}</span>
          </span>
        )}
      </Link>

      <button
        type="button"
        aria-label={
          wishlisted
            ? `Remove ${product.title} from wishlist`
            : `Add ${product.title} to wishlist`
        }
        onClick={() => toggleWishlist(product.handle)}
        className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-kobbo-white/90 text-kobbo-black shadow-soft transition-all hover:scale-110 hover:bg-kobbo-yellow"
      >
        <Heart
          className={`h-4 w-4 ${wishlisted ? "fill-kobbo-yellow text-kobbo-yellow" : ""}`}
        />
      </button>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-heading line-clamp-2 text-sm font-bold text-kobbo-black transition-colors hover:text-kobbo-muted sm:text-base">
            {product.title}
          </h3>
        </Link>
        <ProductCardRating
          productId={product.id}
          initialSummary={reviewSummary}
          fetchIfMissing={!deferRating}
        />
        {isFeaturedLayout ? (
          <div className="mt-auto pt-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-lg font-bold text-kobbo-black sm:text-xl">
                {formatPrice(product.price, product.currencyCode)}
              </span>
              {hasDiscount && product.compareAtPrice && (
                <>
                  <span className="text-sm text-kobbo-muted line-through">
                    {formatPrice(product.compareAtPrice, product.currencyCode)}
                  </span>
                  <span className="rounded-full bg-kobbo-yellow/25 px-2 py-0.5 text-xs font-bold text-kobbo-black">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
            <AddToCartButton
              variant="full"
              merchandiseId={merchandiseId}
              productTitle={product.title}
              disabled={!product.availableForSale}
              label={product.availableForSale ? "Add to Cart" : "Sold Out"}
              className="mt-3 min-h-11 py-2.5"
            />
          </div>
        ) : (
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-base font-bold text-kobbo-black sm:text-lg">
                {formatPrice(product.price, product.currencyCode)}
              </span>
              {hasDiscount && product.compareAtPrice && (
                <span className="text-xs text-kobbo-muted line-through sm:text-sm">
                  {formatPrice(product.compareAtPrice, product.currencyCode)}
                </span>
              )}
            </div>
            <AddToCartButton
              merchandiseId={merchandiseId}
              productTitle={product.title}
              disabled={!product.availableForSale}
            />
          </div>
        )}
      </div>
    </article>
  );
}
