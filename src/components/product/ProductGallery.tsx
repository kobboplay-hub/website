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

  return (
    <div className="space-y-3">
      <div className="group relative aspect-square overflow-hidden rounded-3xl bg-kobbo-beige shadow-soft">
        {hasImages ? (
          <Image
            src={images[activeIndex]}
            alt={altTexts[activeIndex] ?? `${productName} — image ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-kobbo-muted">
            <ImageOff className="h-12 w-12" />
            <span className="text-sm">No product images available</span>
          </div>
        )}
      </div>

      {hasImages && images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-20 sm:w-20 ${
                activeIndex === index
                  ? "border-kobbo-yellow shadow-soft"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
