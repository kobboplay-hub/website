"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import ProductShareButton from "@/components/product/ProductShareButton";

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
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasImages = images.length > 0;
  const hasMultiple = hasImages && images.length > 1;

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

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  return (
    <div className="w-full lg:sticky lg:top-24 lg:self-start">
      <div className="relative">
        {productHandle ? (
          <ProductShareButton
            productTitle={productName}
            productHandle={productHandle}
            variant="overlay"
          />
        ) : null}
        <div className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-kobbo-beige shadow-soft sm:rounded-3xl">
        {hasImages ? (
          <Image
            src={images[activeIndex]}
            alt={
              altTexts[activeIndex] ??
              `${productName} — image ${activeIndex + 1}`
            }
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
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
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-kobbo-black shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-95 sm:left-3 sm:h-10 sm:w-10"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-kobbo-black shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-95 sm:right-3 sm:h-10 sm:w-10"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.25} />
            </button>
          </>
        )}
        </div>
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto scroll-smooth py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2.5">
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
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
