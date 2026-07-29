"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import ProductVideoModal from "@/components/product/ProductVideoModal";
import type { HomeProductVideo } from "@/lib/productPageContent";

interface HomeProductVideosGridProps {
  videos: HomeProductVideo[];
}

function getGridClass(count: number): string {
  if (count === 1) {
    return "mx-auto max-w-xs grid-cols-1 sm:max-w-sm";
  }
  if (count === 2) {
    return "grid-cols-2 max-w-2xl mx-auto";
  }
  if (count === 3) {
    return "grid-cols-2 sm:grid-cols-3";
  }
  return "grid-cols-2 lg:grid-cols-4";
}

export default function HomeProductVideosGrid({
  videos,
}: HomeProductVideosGridProps) {
  const [playingVideo, setPlayingVideo] = useState<HomeProductVideo | null>(
    null,
  );

  const handlePlay = (item: HomeProductVideo) => {
    if (item.video.type === "instagram") {
      window.open(item.video.url, "_blank", "noopener,noreferrer");
      return;
    }
    setPlayingVideo(item);
  };

  return (
    <>
      <div
        className={`mt-4 grid gap-2.5 sm:gap-3 ${getGridClass(videos.length)}`}
      >
        {videos.map((item) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-2xl bg-kobbo-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
          >
            <button
              type="button"
              onClick={() => handlePlay(item)}
              aria-label={`Play video for ${item.title}`}
              className="relative block w-full text-left"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-kobbo-beige">
                <Image
                  src={item.video.thumbnail}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kobbo-black/50 via-kobbo-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kobbo-yellow shadow-soft transition-transform group-hover:scale-110 sm:h-11 sm:w-11">
                    <Play className="h-4 w-4 fill-kobbo-black text-kobbo-black sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>
            </button>

            <div className="border-t border-kobbo-beige/80 p-2.5 sm:p-3">
              <Link
                href={`/products/${item.handle}`}
                className="line-clamp-2 text-xs font-semibold leading-snug text-kobbo-black transition-colors hover:text-kobbo-black/70 sm:text-sm"
              >
                {item.title}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {playingVideo && (
        <ProductVideoModal
          video={playingVideo.video}
          onClose={() => setPlayingVideo(null)}
        />
      )}
    </>
  );
}
