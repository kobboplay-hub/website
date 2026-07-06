"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  altTexts?: (string | null)[];
}

export default function ProductGallery({
  images,
  productName,
  altTexts = [],
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.length > 0;
  const hasMultiple = hasImages && images.length > 1;

  return (
    <div className="w-full lg:sticky lg:top-24 lg:self-start">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-kobbo-beige shadow-soft sm:rounded-3xl">
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
      </div>

      {hasMultiple && (
        <>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex snap-x snap-mandatory gap-2">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  className={`relative h-14 w-14 shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-all sm:h-16 sm:w-16 ${
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
          </div>

          <div className="mt-2 flex justify-center gap-1.5 lg:hidden">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-4 bg-kobbo-yellow"
                    : "w-1.5 bg-kobbo-beige"
                }`}
                aria-hidden
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
