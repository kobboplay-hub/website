"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { Collection } from "@/lib/shopify/types";

interface ShopByCategoriesProps {
  collections: Collection[];
}

function isGanpati(title: string, handle: string): boolean {
  return `${title} ${handle}`.toLowerCase().includes("ganpati");
}

export default function ShopByCategories({
  collections = [],
}: ShopByCategoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(scrollLeft / maxScroll);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [collections]);

  if (collections.length === 0) return null;

  return (
    <section className="bg-kobbo-cream py-5 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Row: "Shop by Categories" on left, "View all" on right */}
        <div className="flex items-baseline justify-between border-b border-kobbo-beige pb-3 sm:pb-4">
          <h2 className="font-heading text-xl font-extrabold tracking-tight text-kobbo-black sm:text-2xl lg:text-3xl">
            Shop by Categories
          </h2>
          <Link
            href="/shop"
            className="text-xs font-bold text-kobbo-black/75 underline decoration-kobbo-yellow decoration-2 underline-offset-4 transition-colors hover:text-kobbo-black sm:text-sm"
          >
            View all
          </Link>
        </div>

        {/* Compact Horizontal Scrollable Carousel */}
        <div
          ref={scrollRef}
          className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 py-4 scroll-smooth sm:-mx-6 sm:gap-5 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {collections.map((col) => {
            const festive = isGanpati(col.title, col.handle);

            return (
              <Link
                key={col.id}
                href={`/collections/${col.handle}`}
                className="group flex w-[210px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-kobbo-beige/90 bg-kobbo-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-kobbo-yellow hover:shadow-soft-lg active:scale-[0.98] sm:w-[260px] sm:rounded-3xl lg:w-[280px]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-kobbo-white">
                  {col.image?.url ? (
                    <Image
                      src={col.image.url}
                      alt={col.image.altText ?? col.title}
                      fill
                      sizes="(max-width: 640px) 210px, (max-width: 1024px) 260px, 280px"
                      className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-kobbo-yellow/30 via-kobbo-beige to-kobbo-cream font-heading text-3xl font-extrabold text-kobbo-black/30">
                      {col.title.slice(0, 1)}
                    </div>
                  )}

                  {/* Festive or Curated Badge */}
                  {festive && (
                    <div className="absolute left-2.5 top-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs backdrop-blur-xs sm:text-xs">
                        <Sparkles className="h-2.5 w-2.5 text-amber-600" />
                        Festive
                      </span>
                    </div>
                  )}
                </div>

                {/* Compact Card Content */}
                <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
                  <div>
                    <h3 className="font-heading text-xs font-extrabold text-kobbo-black transition-colors group-hover:text-kobbo-yellow-dark sm:text-sm lg:text-base">
                      {col.title}
                    </h3>
                    {col.description ? (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-kobbo-muted sm:text-xs">
                        {col.description}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-[11px] text-kobbo-muted sm:text-xs">
                        {festive ? "Festive wooden toys" : "Handpicked for development"}
                      </p>
                    )}
                  </div>

                  {/* Bottom Explore Row */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-stone-100 pt-2 text-[11px] font-bold text-kobbo-black/75 group-hover:text-kobbo-black sm:text-xs">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Carousel controls matching user reference */}
        <div className="mt-1 flex items-center justify-between pt-1 sm:mt-2">
          {/* Active slide pill indicator */}
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                scrollProgress < 0.5
                  ? "w-5 bg-kobbo-yellow shadow-2xs"
                  : "w-2 bg-stone-300/80"
              }`}
            />
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                scrollProgress >= 0.5
                  ? "w-5 bg-kobbo-yellow shadow-2xs"
                  : "w-2 bg-stone-300/80"
              }`}
            />
          </div>

          {/* Circular Left/Right Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous categories"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black shadow-soft transition-all hover:border-kobbo-yellow hover:bg-kobbo-yellow/20 active:scale-95 sm:h-9 sm:w-9"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next categories"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black shadow-soft transition-all hover:border-kobbo-yellow hover:bg-kobbo-yellow/20 active:scale-95 sm:h-8 sm:w-8"
            >
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
