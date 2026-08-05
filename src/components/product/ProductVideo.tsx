"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import AdaptiveProductVideoPlayer from "@/components/product/AdaptiveProductVideoPlayer";
import type { ProductVideoItem } from "@/lib/productPageContent";

interface ProductVideoProps {
  videos: ProductVideoItem[];
}

function isPortraitVideo(video: ProductVideoItem): boolean {
  if (video.type === "instagram" || video.type === "mp4") return true;
  if (video.type === "youtube") {
    return /\/shorts\//i.test(video.url) || /youtube\.com\/shorts/i.test(video.url);
  }
  return false;
}

function VideoCard({
  video,
  onPlay,
}: {
  video: ProductVideoItem;
  onPlay: () => void;
}) {
  const portrait = isPortraitVideo(video);
  const aspectClass = portrait ? "aspect-[9/16]" : "aspect-video";

  if (video.type === "instagram") {
    return (
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative mx-auto flex w-full max-w-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-kobbo-black shadow-soft transition-transform hover:-translate-y-0.5 ${aspectClass}`}
      >
        <Image
          src={video.thumbnail}
          alt={video.label ?? "Instagram video"}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          className="object-cover opacity-80 transition-opacity group-hover:opacity-60"
        />
        <div className="absolute inset-0 bg-kobbo-black/30" />
        <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kobbo-yellow shadow-soft">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5 text-kobbo-black"
              aria-hidden
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className="font-heading text-sm font-bold text-kobbo-white">
            Watch on Instagram
          </span>
        </div>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      className={`group relative mx-auto w-full overflow-hidden rounded-2xl bg-kobbo-black shadow-soft transition-transform hover:-translate-y-0.5 ${
        portrait ? "max-w-[280px] aspect-[9/16]" : "aspect-video"
      }`}
    >
      <Image
        src={video.thumbnail}
        alt={video.label ?? "Product video"}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-kobbo-black/25 transition-colors group-hover:bg-kobbo-black/35" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kobbo-yellow shadow-soft-lg transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
          <Play className="h-5 w-5 fill-kobbo-black text-kobbo-black sm:h-6 sm:w-6" />
        </div>
      </div>
      {video.label && (
        <span className="absolute bottom-3 left-3 rounded-lg bg-kobbo-white/90 px-2.5 py-1 text-xs font-semibold text-kobbo-black">
          {video.label}
        </span>
      )}
    </button>
  );
}

export default function ProductVideo({ videos }: ProductVideoProps) {
  const [playingVideo, setPlayingVideo] = useState<ProductVideoItem | null>(
    null,
  );

  if (videos.length === 0) return null;

  const gridCols =
    videos.length === 1
      ? "grid-cols-1 max-w-3xl mx-auto"
      : videos.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2";

  return (
    <section className="pt-1 pb-4 sm:pt-2 sm:pb-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-kobbo-beige shadow-soft">
          <div className="p-6 sm:p-8">
            <div className="text-center lg:text-left">
              <h2 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
                Watch It In Action
              </h2>
              <p className="mt-2 text-sm text-kobbo-muted sm:text-base">
                See how children play, learn and explore with this toy.
              </p>
            </div>

            <div className={`mt-6 grid gap-4 ${gridCols}`}>
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={() => setPlayingVideo(video)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {playingVideo && (
        <AdaptiveProductVideoPlayer
          video={playingVideo}
          onClose={() => setPlayingVideo(null)}
          autoplayEmbed={false}
        />
      )}
    </section>
  );
}
