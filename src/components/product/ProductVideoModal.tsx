"use client";

import { X } from "lucide-react";
import type { ProductVideoItem } from "@/lib/productPageContent";

function getAutoplayEmbedUrl(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1`;
}

interface ProductVideoModalProps {
  video: ProductVideoItem;
  onClose: () => void;
}

export default function ProductVideoModal({
  video,
  onClose,
}: ProductVideoModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-kobbo-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={video.label ?? "Product video"}
    >
      <div className="relative w-full max-w-4xl">
        <button
          type="button"
          aria-label="Close video"
          onClick={onClose}
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-kobbo-white text-kobbo-black shadow-soft transition-colors hover:bg-kobbo-yellow"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-kobbo-black shadow-soft-lg">
          {video.type === "youtube" || video.type === "external" ? (
            <iframe
              src={getAutoplayEmbedUrl(video.url)}
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
            >
              <track kind="captions" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
