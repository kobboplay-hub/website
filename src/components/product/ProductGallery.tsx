"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, ImageOff, Loader2 } from "lucide-react";
import ProductShareButton from "@/components/product/ProductShareButton";
import { useWishlist } from "@/context/wishlist-context";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  productHandle?: string;
  altTexts?: (string | null)[];
}

export default function ProductGallery({
  images,
  productName,
  productHandle,
  altTexts = [],
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({ 0: true });
  const [erroredImages, setErroredImages] = useState<Record<number, boolean>>({});
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = productHandle ? isWishlisted(productHandle) : false;
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const hasImages = images.length > 0;
  const hasMultiple = hasImages && images.length > 1;

  // Background prefetch all gallery images so clicks are instant
  useEffect(() => {
    if (typeof window === "undefined" || images.length <= 1) return;
    const preloaded: HTMLImageElement[] = [];
    images.forEach((url, i) => {
      if (i === 0) return;
      const img = new window.Image();
      img.src = url;
      preloaded.push(img);
    });
    return () => {
      preloaded.length = 0;
    };
  }, [images]);

  const goTo = useCallback(
    (index: number) => {
      if (!hasMultiple) return;
      const next = (index + images.length) % images.length;
      setActiveIndex(next);
    },
    [hasMultiple, images.length],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null || !hasMultiple) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) > 40) {
      if (distance < 0) goNext();
      else goPrev();
    }
  }

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    const thumbnail = thumbRefs.current[activeIndex];
    if (!strip || !thumbnail) return;

    strip.scrollTo({
      left: strip.scrollLeft + thumbnail.getBoundingClientRect().left - strip.getBoundingClientRect().left + thumbnail.offsetWidth / 2 - strip.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [activeIndex]);

  return (
    <div className="w-full lg:sticky lg:top-24 lg:self-start">
      <div className="relative">
        {productHandle ? (
          <>
            <ProductShareButton
              productTitle={productName}
              productHandle={productHandle}
              variant="overlay"
            />
            <button
              type="button"
              onClick={() => toggleWishlist(productHandle)}
              aria-label={wishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
              aria-pressed={wishlisted}
              className="absolute right-2 top-2 z-20 flex size-10 items-center justify-center rounded-full border border-white/70 bg-white/95 text-kobbo-black shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black sm:right-3 sm:top-3"
            >
              <Heart className={`size-5 ${wishlisted ? "fill-kobbo-yellow text-kobbo-black" : ""}`} strokeWidth={2.1} aria-hidden />
            </button>
          </>
        ) : null}

        <div
          className="group relative aspect-square w-full touch-pan-y overflow-hidden rounded-2xl bg-kobbo-white shadow-soft sm:rounded-3xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => { touchStartX.current = null; }}
        >
          {hasImages ? (
            <>
              {/* Subtle Loading Shimmer while current active image is downloading */}
              {!loadedImages[activeIndex] && !erroredImages[activeIndex] && (
                <div
                  aria-hidden
                  className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-2.5 bg-gradient-to-b from-kobbo-cream/30 via-kobbo-beige/40 to-kobbo-cream/30 animate-pulse"
                >
                  <Loader2 className="h-6 w-6 animate-spin text-kobbo-muted/60" />
                  <span className="text-xs font-semibold text-kobbo-muted/70">Loading view…</span>
                </div>
              )}

              {/* Stacked Images for instant switching and silky-smooth crossfade */}
              {images.map((img, index) => {
                const isCurrent = activeIndex === index;
                const isErrored = erroredImages[index];

                return (
                  <div
                    key={`${img}-${index}`}
                    aria-hidden={!isCurrent}
                    className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                      isCurrent ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                    }`}
                  >
                    {isErrored ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-kobbo-muted">
                        <ImageOff className="h-10 w-10 text-kobbo-muted/60" />
                        <span className="text-xs font-semibold">Image unavailable</span>
                      </div>
                    ) : (
                      <Image
                        src={img}
                        alt={
                          altTexts[index] ??
                          `${productName} — image ${index + 1}`
                        }
                        fill
                        priority={index === 0}
                        loading={index <= 2 ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="object-contain p-3 px-11 sm:p-4 sm:px-14"
                        onLoad={() => {
                          setLoadedImages((prev) => (prev[index] ? prev : { ...prev, [index]: true }));
                        }}
                        onError={() => {
                          setErroredImages((prev) => (prev[index] ? prev : { ...prev, [index]: true }));
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-kobbo-muted">
              <ImageOff className="h-10 w-10 sm:h-12 sm:w-12" />
              <span className="text-xs sm:text-sm">No images available</span>
            </div>
          )}

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-1.5 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/95 text-kobbo-black shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black sm:left-2 sm:size-9"
              >
                <ChevronLeft className="size-4 sm:size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-1.5 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/95 text-kobbo-black shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black sm:right-2 sm:size-9"
              >
                <ChevronRight className="size-4 sm:size-5" aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>

      {hasMultiple && (
        <div ref={thumbnailStripRef} className="mt-3 flex gap-2 overflow-x-auto scroll-smooth py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2.5">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-16 sm:w-16 ${
                activeIndex === index
                  ? "border-kobbo-yellow shadow-soft"
                  : "border-kobbo-beige opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-contain bg-kobbo-white p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
