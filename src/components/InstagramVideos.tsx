"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Expand, ExternalLink, X } from "lucide-react";
import { instagramSection } from "@/data/home-content";
import { instagramVideos } from "@/data/instagramVideos";

export default function InstagramVideos() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeReel = activeIndex === null ? null : instagramVideos[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        requestAnimationFrame(() => lastTriggerRef.current?.focus());
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) => current === null ? null : (current - 1 + instagramVideos.length) % instagramVideos.length);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) => current === null ? null : (current + 1) % instagramVideos.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  function scrollCards(direction: number) {
    const carousel = carouselRef.current;
    const card = carousel?.firstElementChild as HTMLElement | null;
    if (!carousel || !card) return;
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    carousel.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  function closeViewer() {
    setActiveIndex(null);
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  return (
    <section aria-labelledby="play-moments-heading" className="bg-kobbo-cream py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="play-moments-heading" className="font-heading text-3xl font-extrabold text-kobbo-black sm:text-4xl">
              {instagramSection.title}
            </h2>
            <p className="mt-2 text-sm text-kobbo-muted sm:text-base">{instagramSection.subtitle}</p>
          </div>
          <div className="flex shrink-0 gap-2" aria-label="Browse play moments">
            <button type="button" onClick={() => scrollCards(-1)} aria-label="Previous play moments" className="flex size-10 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black transition-colors hover:border-kobbo-yellow sm:size-11">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => scrollCards(1)} aria-label="Next play moments" className="flex size-10 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black transition-colors hover:border-kobbo-yellow sm:size-11">
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Kobbo Instagram reels"
          className="scrollbar-none -mx-4 mt-7 flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain px-4 pb-3 sm:-mx-6 sm:gap-4 sm:px-6 lg:mx-0 lg:px-0"
        >
          {instagramVideos.map((reel, index) => (
            <div
              key={reel.id}
              className="relative aspect-[9/16] w-[88vw] max-w-[350px] shrink-0 snap-start overflow-hidden rounded-2xl border border-kobbo-black/10 bg-kobbo-white shadow-soft sm:w-[46%] sm:max-w-none lg:w-[32%]"
            >
              <iframe
                src={`${reel.url}embed/`}
                title={`${reel.title} from @kobboplay`}
                loading="lazy"
                scrolling="no"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full border-0"
              />
              <button
                type="button"
                onClick={(event) => {
                  lastTriggerRef.current = event.currentTarget;
                  setActiveIndex(index);
                }}
                aria-label={`Expand ${reel.title}`}
                className="absolute bottom-3 right-3 z-10 flex size-10 items-center justify-center rounded-full bg-kobbo-white/95 text-kobbo-black shadow-soft transition-colors hover:bg-kobbo-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black"
              >
                <Expand className="size-5" aria-hidden />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link href={instagramSection.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-kobbo-black/10 bg-kobbo-white px-6 py-2.5 text-sm font-bold text-kobbo-black transition-all hover:border-kobbo-yellow hover:shadow-soft">
            {instagramSection.viewOnInstagramLabel}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      {activeReel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-kobbo-black/80 px-4 py-5 backdrop-blur-sm" onClick={closeViewer}>
          <div role="dialog" aria-modal="true" aria-label={`${activeReel.title} video`} className="flex max-h-full flex-col items-center gap-3" onClick={(event) => event.stopPropagation()}>
            <div className="flex w-full items-center justify-between gap-3 text-kobbo-white">
              <p className="truncate text-sm font-bold sm:text-base">{activeReel.title}</p>
              <button ref={closeButtonRef} type="button" onClick={closeViewer} aria-label="Close video" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-kobbo-white text-kobbo-black">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="aspect-[9/16] w-[min(88vw,360px,42dvh)] overflow-hidden rounded-2xl bg-kobbo-white">
              <iframe
                key={activeReel.id}
                src={`${activeReel.url}embed/`}
                title={`${activeReel.title} from @kobboplay`}
                scrolling="no"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full border-0"
              />
            </div>
            <div className="flex w-full items-center justify-between gap-3 text-kobbo-white">
              <button type="button" onClick={() => setActiveIndex((current) => current === null ? null : (current - 1 + instagramVideos.length) % instagramVideos.length)} aria-label="Previous video" className="flex size-11 items-center justify-center rounded-full border border-kobbo-white/40 transition-colors hover:bg-kobbo-white/15">
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <Link href={activeReel.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-4 sm:text-sm">
                Open on Instagram <ExternalLink className="size-3.5" aria-hidden />
              </Link>
              <button type="button" onClick={() => setActiveIndex((current) => current === null ? null : (current + 1) % instagramVideos.length)} aria-label="Next video" className="flex size-11 items-center justify-center rounded-full border border-kobbo-white/40 transition-colors hover:bg-kobbo-white/15">
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
