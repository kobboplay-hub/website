"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PlayKitCard from "@/components/home/PlayKitCard";
import type { AgeGroup, Product } from "@/lib/shopify/types";

interface PlayKitsSectionProps {
  ageGroups: AgeGroup[];
  products: Product[];
}

export default function PlayKitsSection({ ageGroups, products }: PlayKitsSectionProps) {
  const [selectedAgeId, setSelectedAgeId] = useState(ageGroups[0]?.id ?? "");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const selectedAge = ageGroups.find((group) => group.id === selectedAgeId) ?? ageGroups[0];
  const ageProducts = products.filter(
    (product) => product.ageGroup?.id === selectedAge?.id,
  );

  function goToProduct(index: number) {
    const carousel = carouselRef.current;
    const firstCard = carousel?.firstElementChild as HTMLElement | null;
    const targetCard = carousel?.children.item(index) as HTMLElement | null;
    if (!carousel || !firstCard || !targetCard) return;

    carousel.scrollTo({
      left: targetCard.offsetLeft - firstCard.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
    setActiveIndex(index);
  }

  useEffect(() => {
    if (ageProducts.length < 2 || isHovered || isFocused || isDragging || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        goToProduct((activeIndex + 1) % ageProducts.length);
      }
    }, 4500);

    return () => window.clearInterval(timer);
  }, [activeIndex, ageProducts.length, isHovered, isFocused, isDragging, selectedAgeId]);

  function handleScroll() {
    const carousel = carouselRef.current;
    const firstCard = carousel?.firstElementChild as HTMLElement | null;
    if (!carousel || !firstCard) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    Array.from(carousel.children).forEach((child, index) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - firstCard.offsetLeft - carousel.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex((current) => current === closestIndex ? current : closestIndex);
  }

  return (
    <section id="play-kits" aria-labelledby="play-kits-heading" className="scroll-mt-20 bg-kobbo-white pb-12 pt-6 sm:scroll-mt-24 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="play-kits-heading" className="font-heading text-3xl font-extrabold tracking-tight text-kobbo-black sm:text-4xl lg:text-5xl">
            Choose Your Play Kit
          </h2>
          {ageGroups.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Choose an age group">
              {ageGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  aria-pressed={selectedAge?.id === group.id}
                  onClick={() => {
                    setSelectedAgeId(group.id);
                    setActiveIndex(0);
                    carouselRef.current?.scrollTo({ left: 0, behavior: "instant" });
                  }}
                  className={`min-h-11 rounded-full border px-5 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black ${selectedAge?.id === group.id ? "border-kobbo-yellow bg-kobbo-yellow text-kobbo-black" : "border-kobbo-beige bg-kobbo-cream text-kobbo-black hover:border-kobbo-yellow"}`}
                >
                  {group.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {ageProducts.length > 0 ? (
          <div
            className="mx-auto mt-8 max-w-5xl"
            role="region"
            aria-roledescription="carousel"
            aria-label={`${selectedAge?.name} products`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocusCapture={() => setIsFocused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
            }}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerCancel={() => setIsDragging(false)}
          >
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2"
            >
              {ageProducts.map((product, index) => (
                <PlayKitCard key={product.id} product={product} ageName={selectedAge?.name} index={index} count={ageProducts.length} />
              ))}
            </div>
            {ageProducts.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-4">
                <button type="button" onClick={() => goToProduct((activeIndex - 1 + ageProducts.length) % ageProducts.length)} aria-label="Previous product" className="flex size-11 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black transition-colors hover:border-kobbo-yellow hover:bg-kobbo-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black">
                  <ArrowLeft className="size-5" aria-hidden />
                </button>
                <span className="min-w-12 text-center text-sm font-bold tabular-nums text-kobbo-black">{activeIndex + 1} / {ageProducts.length}</span>
                <button type="button" onClick={() => goToProduct((activeIndex + 1) % ageProducts.length)} aria-label="Next product" className="flex size-11 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black transition-colors hover:border-kobbo-yellow hover:bg-kobbo-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black">
                  <ArrowRight className="size-5" aria-hidden />
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="mx-auto mt-8 max-w-lg rounded-2xl bg-kobbo-cream px-6 py-8 text-center text-sm text-kobbo-muted">
            {selectedAge ? `No products are assigned to ${selectedAge.name} yet.` : "No age groups are available yet."}
          </p>
        )}
      </div>
    </section>
  );
}
