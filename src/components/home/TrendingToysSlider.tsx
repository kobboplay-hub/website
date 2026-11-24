"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { JudgeMeProductSummary } from "@/lib/judgeme";
import { parseShopifyProductId } from "@/lib/judgeme";

interface TrendingToysSliderProps {
  products: Product[];
  reviewSummaries?: Record<string, JudgeMeProductSummary>;
}

export default function TrendingToysSlider({
  products,
  reviewSummaries = {},
}: TrendingToysSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [checkScrollability, products.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 280;
    const offset = direction === "left" ? -cardWidth : cardWidth;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12 sm:mt-16 w-full">
      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 shadow-2xs">
            <Flame className="size-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            Trending Toys
          </div>
          <h3 className="font-heading mt-2 text-2xl font-extrabold text-kobbo-black sm:text-3xl">
            Popular &amp; Trending Toys
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-kobbo-muted">
            Handpicked toys parents and toddlers are exploring right now
          </p>
        </div>

        {/* Navigation Arrows for desktop/tablet */}
        {products.length > 1 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              aria-label="Previous trending toy"
              className="flex size-10 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black shadow-2xs transition-all hover:border-kobbo-yellow hover:bg-kobbo-yellow disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              aria-label="Next trending toy"
              className="flex size-10 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black shadow-2xs transition-all hover:border-kobbo-yellow hover:bg-kobbo-yellow disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Slider Track */}
      <div
        ref={scrollRef}
        onScroll={checkScrollability}
        className="scrollbar-none flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto overscroll-x-contain pb-4 pt-1 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        tabIndex={0}
        role="region"
        aria-label="Trending toys slider"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[72vw] max-w-[280px] sm:w-[260px] md:w-[270px] shrink-0 snap-start flex flex-col"
          >
            <ProductCard
              className="h-full"
              product={product}
              reviewSummary={
                reviewSummaries[parseShopifyProductId(product.id)] ?? null
              }
              badge="Trending 🔥"
              imageSizes="(max-width: 640px) 72vw, (max-width: 1024px) 260px, 270px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
