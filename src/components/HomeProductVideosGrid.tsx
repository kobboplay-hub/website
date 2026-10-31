"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import ProductVideoModal from "@/components/product/ProductVideoModal";
import type { HomeProductVideo } from "@/lib/productPageContent";

interface HomeProductVideosGridProps {
  videos: HomeProductVideo[];
}

export default function HomeProductVideosGrid({ videos }: HomeProductVideosGridProps) {
  const [playingVideo, setPlayingVideo] = useState<HomeProductVideo | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let previewTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (previewTimer) clearTimeout(previewTimer);
      if (entry.isIntersecting) {
        setPreviewing(true);
        previewTimer = setTimeout(() => setPreviewing(false), 4000);
      } else {
        setPreviewing(false);
      }
    }, { threshold: 0.3 });

    observer.observe(carousel);
    return () => {
      observer.disconnect();
      if (previewTimer) clearTimeout(previewTimer);
    };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const observer = new IntersectionObserver((entries) => {
      setVisibleCards((current) => {
        const next = new Set(current);
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.videoIndex);
          if (entry.isIntersecting) next.add(index);
          else next.delete(index);
        }
        return next;
      });
    }, { root: carousel, threshold: 0.5 });

    for (const card of carousel.children) observer.observe(card);
    return () => observer.disconnect();
  }, []);

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

  function handlePlay(item: HomeProductVideo) {
    if (item.video.type === "instagram") {
      window.open(item.video.url, "_blank", "noopener,noreferrer");
      return;
    }
    setPlayingVideo(item);
  }

  return (
    <>
      <div className="mt-3 flex justify-end gap-2" aria-label="Browse product videos">
        <button type="button" onClick={() => scrollCards(-1)} aria-label="Previous product videos" className="flex size-10 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black transition-colors hover:border-kobbo-yellow sm:size-11">
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => scrollCards(1)} aria-label="Next product videos" className="flex size-10 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black transition-colors hover:border-kobbo-yellow sm:size-11">
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div ref={carouselRef} role="region" aria-roledescription="carousel" aria-label="Product videos" className="scrollbar-none -mx-4 mt-2 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-4 sm:-mx-6 sm:gap-4 sm:px-6 lg:mx-0 lg:px-0">
        {videos.map((item, index) => (
          <article key={item.id} data-video-index={index} className="group w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl bg-kobbo-white shadow-soft sm:w-[46%] sm:max-w-none lg:w-[24%]">
            <button type="button" onClick={() => handlePlay(item)} aria-label={`Play video for ${item.title}`} className="relative block w-full text-left">
              <div className="relative aspect-[9/16] overflow-hidden bg-kobbo-beige">
                {previewing && visibleCards.has(index) && item.video.type === "mp4" ? (
                  <video src={item.video.url} poster={item.video.thumbnail} autoPlay muted playsInline loop preload="metadata" className="h-full w-full object-cover" aria-hidden />
                ) : previewing && visibleCards.has(index) && item.video.type === "youtube" ? (
                  <iframe src={`${item.video.url}${item.video.url.includes("?") ? "&" : "?"}autoplay=1&mute=1&controls=0&playsinline=1`} title={`${item.title} preview`} allow="autoplay; encrypted-media" tabIndex={-1} className="pointer-events-none absolute left-1/2 top-1/2 h-full w-[316%] max-w-none -translate-x-1/2 -translate-y-1/2 border-0" />
                ) : (
                  <Image src={item.video.thumbnail} alt={item.title} fill sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 24vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-kobbo-black/40 via-transparent to-transparent" />
                <div className={`absolute inset-0 flex items-center justify-center ${previewing && visibleCards.has(index) && (item.video.type === "mp4" || item.video.type === "youtube") ? "opacity-0" : ""}`}>
                  <span className="flex size-12 items-center justify-center rounded-full bg-kobbo-yellow shadow-soft transition-transform group-hover:scale-110">
                    <Play className="size-5 fill-kobbo-black text-kobbo-black" aria-hidden />
                  </span>
                </div>
              </div>
            </button>
            <div className="border-t border-kobbo-beige/80 p-3">
              <Link href={`/products/${item.handle}`} className="line-clamp-2 text-sm font-semibold leading-snug text-kobbo-black transition-colors hover:text-kobbo-black/70">
                {item.title}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {playingVideo && <ProductVideoModal video={playingVideo.video} onClose={() => setPlayingVideo(null)} />}
    </>
  );
}
