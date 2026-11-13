"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

import type { ShopifyImage } from "@/lib/shopify/types";

const baseUrl = (url: string) => url.split("?")[0];

interface LifestyleGalleryProps {
  images: ShopifyImage[];
  title: string;
  /** Image of the selected variant; the gallery jumps to it when the selection changes. */
  activeImageUrl: string | null;
}

export default function LifestyleGallery({ images, title, activeImageUrl }: LifestyleGalleryProps) {
  const [index, setIndex] = useState(() => {
    const found = activeImageUrl ? images.findIndex((image) => baseUrl(image.url) === baseUrl(activeImageUrl)) : -1;
    return Math.max(found, 0);
  });
  const [syncedUrl, setSyncedUrl] = useState(activeImageUrl);
  const touchStart = useRef<number | null>(null);

  if (activeImageUrl !== syncedUrl) {
    setSyncedUrl(activeImageUrl);
    const found = activeImageUrl ? images.findIndex((image) => baseUrl(image.url) === baseUrl(activeImageUrl)) : -1;
    if (found >= 0) setIndex(found);
  }

  const count = images.length;
  const go = (next: number) => setIndex((next + count) % count);

  if (count === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-[4px] bg-ls-sand text-ls-muted">
        <ImageOff className="size-8" strokeWidth={1.4} aria-hidden />
        <span className="sr-only">No product images available</span>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[76px_1fr] lg:gap-4">
      {count > 1 && (
        <ul className="hidden max-h-[640px] flex-col gap-3 overflow-y-auto [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden" aria-label="Product images">
          {images.map((image, i) => (
            <li key={image.url}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative block aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-ls-sand transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink ${
                  i === index ? "ring-1 ring-ls-ink" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={image.url} alt="" fill sizes="76px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="min-w-0">
        <div
          className="relative aspect-[4/5] touch-pan-y overflow-hidden rounded-[4px] bg-ls-sand"
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current === null || count < 2) return;
            const distance = event.changedTouches[0].clientX - touchStart.current;
            touchStart.current = null;
            if (Math.abs(distance) > 40) go(distance < 0 ? index + 1 : index - 1);
          }}
        >
          {images.map((image, i) => (
            <Image
              key={image.url}
              src={image.url}
              alt={image.altText || `${title} — image ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              aria-hidden={i !== index}
              className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />
          ))}

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-ls-paper/90 text-ls-ink backdrop-blur-sm transition-colors hover:bg-ls-paper focus-visible:outline-2 focus-visible:outline-ls-ink"
              >
                <ChevronLeft className="size-5" strokeWidth={1.6} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-ls-paper/90 text-ls-ink backdrop-blur-sm transition-colors hover:bg-ls-paper focus-visible:outline-2 focus-visible:outline-ls-ink"
              >
                <ChevronRight className="size-5" strokeWidth={1.6} aria-hidden />
              </button>
              <p className="absolute bottom-3 right-3 rounded-full bg-ls-paper/90 px-2.5 py-1 text-xs tabular-nums text-ls-ink lg:hidden" aria-live="polite">
                {index + 1} / {count}
              </p>
            </>
          )}
        </div>

        {count > 1 && (
          <ul className="mt-3 flex gap-2 overflow-x-auto p-px [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden" aria-label="Product images">
            {images.map((image, i) => (
              <li key={image.url} className="w-16 shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1} of ${count}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`relative block aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-ls-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink ${
                    i === index ? "ring-1 ring-ls-ink" : "opacity-60"
                  }`}
                >
                  <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
