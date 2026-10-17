"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { formatPrice, type Product } from "@/lib/shopify/types";
import ProductCardRating from "@/components/reviews/ProductCardRating";
import {
  getRecentlyViewedForDisplay,
  trackRecentlyViewed,
  type RecentlyViewedItem,
} from "@/lib/recently-viewed";

interface RecentlyViewedProps {
  currentProduct: Product;
}

export default function RecentlyViewed({ currentProduct }: RecentlyViewedProps) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [ready, setReady] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1) Read previous views first (before tracking current)
    const previous = getRecentlyViewedForDisplay(currentProduct.handle);

    // 2) Track current product visit
    trackRecentlyViewed(currentProduct);

    // 3) Show others only — never the product you're already on
    const frame = requestAnimationFrame(() => {
      setItems(previous);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [currentProduct]);

  const scroll = (direction: "left" | "right") => {
    const container = trackRef.current;
    if (!container) return;
    const cardWidth =
      container.querySelector<HTMLElement>("a")?.offsetWidth ?? 192;
    const amount = direction === "left" ? -(cardWidth + 16) : cardWidth + 16;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!ready || items.length === 0) return null;

  return (
    <section className="bg-kobbo-cream py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-extrabold text-kobbo-black sm:text-2xl">
            Recently Viewed
          </h2>
          {items.length > 2 && (
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scroll("left")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-kobbo-white shadow-soft transition-colors hover:bg-kobbo-yellow"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scroll("right")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-kobbo-white shadow-soft transition-colors hover:bg-kobbo-yellow"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:gap-4"
        >
          {items.map((item) => (
            <Link
              key={item.handle}
              href={`/products/${item.handle}`}
              className="group w-40 shrink-0 overflow-hidden rounded-2xl bg-kobbo-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg sm:w-48"
            >
              <div className="relative aspect-square bg-kobbo-white">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="192px"
                    className="object-contain p-2 transition-transform group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-kobbo-muted">
                    <ImageOff className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-bold text-kobbo-black">
                  {item.title}
                </p>
                <ProductCardRating productId={item.id} />
                <p className="mt-0.5 text-sm font-semibold text-kobbo-black">
                  {formatPrice(item.price, item.currencyCode)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
