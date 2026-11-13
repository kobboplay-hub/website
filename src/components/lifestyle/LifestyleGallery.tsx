"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

import type { ShopifyImage } from "@/lib/shopify/types";
import LifestyleImage from "./LifestyleImage";

const baseUrl = (url: string) => url.split("?")[0];

/** No backdrop so the photo stays clear; the halo keeps the chevron legible on light and dark images. */
const arrowClass =
  "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-ls-ink [filter:drop-shadow(0_0_2px_rgb(255_255_255/0.95))_drop-shadow(0_1px_6px_rgb(255_255_255/0.7))] transition-[opacity,transform] duration-200 hover:scale-110 active:scale-95 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ls-ink motion-reduce:transition-none lg:opacity-0 lg:group-hover:opacity-100";

interface LifestyleGalleryProps {
  images: ShopifyImage[];
  title: string;
  /** Image of the selected variant; the gallery jumps to it when the selection changes. */
  activeImageUrl: string | null;
}

function findImage(images: ShopifyImage[], url: string | null): number {
  return url ? images.findIndex((image) => baseUrl(image.url) === baseUrl(url)) : -1;
}

export default function LifestyleGallery({ images, title, activeImageUrl }: LifestyleGalleryProps) {
  const [initialIndex] = useState(() => Math.max(findImage(images, activeImageUrl), 0));
  const [index, setIndex] = useState(initialIndex);
  const [syncedUrl, setSyncedUrl] = useState(activeImageUrl);
  const [visited, setVisited] = useState(() => new Set([initialIndex]));
  const touchStart = useRef<number | null>(null);

  if (activeImageUrl !== syncedUrl) {
    setSyncedUrl(activeImageUrl);
    const found = findImage(images, activeImageUrl);
    if (found >= 0) setIndex(found);
  }
  if (!visited.has(index)) setVisited(new Set(visited).add(index));

  const count = images.length;
  const go = (next: number) => setIndex((next + count) % count);
  // Only the current slide, its neighbours (preloaded for instant swipes) and slides already seen are mounted.
  const isMounted = (i: number) =>
    visited.has(i) || i === (index + 1) % count || i === (index - 1 + count) % count;

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
                <LifestyleImage src={image.url} alt="" fill sizes="76px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="min-w-0">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={`${title} images`}
          tabIndex={count > 1 ? 0 : undefined}
          className="group relative aspect-[4/5] touch-pan-y overflow-hidden rounded-[4px] bg-ls-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
          onKeyDown={(event) => {
            if (count < 2) return;
            if (event.key === "ArrowLeft") go(index - 1);
            else if (event.key === "ArrowRight") go(index + 1);
            else return;
            event.preventDefault();
          }}
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
          {images.map((image, i) =>
            isMounted(i) ? (
              <LifestyleImage
                key={image.url}
                src={image.url}
                alt={image.altText || `${title} — image ${i + 1}`}
                fill
                loading="eager"
                fetchPriority={i === initialIndex ? "high" : "low"}
                shimmer={i === index}
                sizes="(max-width: 1024px) 100vw, 50vw"
                aria-hidden={i !== index}
                className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${
                  i === index ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              />
            ) : null,
          )}

          {count > 1 && (
            <>
              <button type="button" onClick={() => go(index - 1)} aria-label="Previous image" className={`${arrowClass} left-1`}>
                <ChevronLeft className="size-7" strokeWidth={1.8} aria-hidden />
              </button>
              <button type="button" onClick={() => go(index + 1)} aria-label="Next image" className={`${arrowClass} right-1`}>
                <ChevronRight className="size-7" strokeWidth={1.8} aria-hidden />
              </button>
              <p
                className="absolute bottom-3 right-3 rounded-full bg-ls-ink/45 px-2.5 py-1 text-xs tabular-nums text-ls-paper backdrop-blur-sm lg:hidden"
                aria-live="polite"
              >
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
                  className={`relative block aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-ls-sand transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink ${
                    i === index ? "ring-1 ring-ls-ink" : "opacity-60"
                  }`}
                >
                  <LifestyleImage src={image.url} alt="" fill sizes="64px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
