"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import type { ProductVideoData } from "@/lib/productPageContent";

interface ProductVideoProps {
  video: ProductVideoData;
}

export default function ProductVideo({ video }: ProductVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-kobbo-beige shadow-soft-lg">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="text-center lg:text-left">
              <h2 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
                See It In Action
              </h2>
              <p className="mt-2 text-sm text-kobbo-muted sm:text-base">
                Watch how children interact, learn and play with this toy.
              </p>
            </div>

            <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-kobbo-black shadow-soft-lg">
              {isPlaying ? (
                <>
                  {video.type === "youtube" ? (
                    <iframe
                      src={`${video.url}?autoplay=1`}
                      title="Product video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <video
                      src={video.url}
                      controls
                      autoPlay
                      className="absolute inset-0 h-full w-full object-cover"
                    >
                      <track kind="captions" />
                    </video>
                  )}
                  <button
                    type="button"
                    aria-label="Close video"
                    onClick={() => setIsPlaying(false)}
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-kobbo-white/90 text-kobbo-black shadow-soft transition-colors hover:bg-kobbo-yellow"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Image
                    src={video.thumbnail}
                    alt="Product video thumbnail"
                    fill
                    sizes="(max-width: 1280px) 100vw, 1200px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-kobbo-black/25" />
                  <button
                    type="button"
                    aria-label="Play product video"
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-kobbo-yellow shadow-soft-lg transition-transform hover:scale-110 sm:h-20 sm:w-20">
                      <Play className="h-7 w-7 fill-kobbo-black text-kobbo-black sm:h-8 sm:w-8" />
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
