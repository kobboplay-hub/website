"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { ProductVideoItem } from "@/lib/productPageContent";

type VideoAspect = "portrait" | "landscape";

function getAutoplayEmbedUrl(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1`;
}

function detectInitialAspect(video: ProductVideoItem): VideoAspect {
  if (video.type === "instagram") return "portrait";

  if (video.type === "youtube") {
    const isShort =
      /\/shorts\//i.test(video.url) ||
      /youtube\.com\/shorts/i.test(video.url);
    return isShort ? "portrait" : "landscape";
  }

  // Native mp4 product clips are usually vertical reels — refine on metadata
  if (video.type === "mp4") return "portrait";

  return "landscape";
}

interface AdaptiveProductVideoPlayerProps {
  video: ProductVideoItem;
  onClose: () => void;
  autoplayEmbed?: boolean;
}

export default function AdaptiveProductVideoPlayer({
  video,
  onClose,
  autoplayEmbed = true,
}: AdaptiveProductVideoPlayerProps) {
  const [aspect, setAspect] = useState<VideoAspect>(() =>
    detectInitialAspect(video),
  );

  const isPortrait = aspect === "portrait";
  const embedSrc = autoplayEmbed
    ? getAutoplayEmbedUrl(video.url)
    : video.url;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-kobbo-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={video.label ?? "Product video"}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${
          isPortrait
            ? "max-h-[85vh] max-w-[min(100%,400px)]"
            : "max-w-4xl"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close video"
          onClick={onClose}
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-kobbo-white text-kobbo-black shadow-soft transition-colors hover:bg-kobbo-yellow"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className={`relative overflow-hidden rounded-2xl bg-kobbo-black shadow-soft-lg ${
            isPortrait
              ? "aspect-[9/16] max-h-[85vh]"
              : "aspect-video"
          }`}
        >
          {video.type === "youtube" || video.type === "external" ? (
            <iframe
              src={embedSrc}
              title={video.label ?? "Product video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <video
              src={video.url}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full object-contain"
              onLoadedMetadata={(event) => {
                const el = event.currentTarget;
                if (el.videoWidth > 0 && el.videoHeight > 0) {
                  setAspect(
                    el.videoHeight > el.videoWidth ? "portrait" : "landscape",
                  );
                }
              }}
            >
              <track kind="captions" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
