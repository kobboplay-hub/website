"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import ProductVideoModal from "@/components/product/ProductVideoModal";
import type { ProductVideoItem } from "@/lib/productPageContent";

const SESSION_KEY_PREFIX = "kobbo-video-widget-dismissed:";
const EDGE_MARGIN = 16;
const STICKY_BAR_GAP = 24;
const WIDGET_WIDTH = 92;
const MOBILE_BUY_BAR_ID = "product-mobile-buy-bar";

interface ProductFloatingVideoWidgetProps {
  video: ProductVideoItem;
  productHandle: string;
}

export default function ProductFloatingVideoWidget({
  video,
  productHandle,
}: ProductFloatingVideoWidgetProps) {
  const [showWidget, setShowWidget] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(EDGE_MARGIN);

  useEffect(() => {
    const key = `${SESSION_KEY_PREFIX}${productHandle}`;
    const frame = requestAnimationFrame(() => setShowWidget(sessionStorage.getItem(key) !== "1"));
    return () => cancelAnimationFrame(frame);
  }, [productHandle]);

  useEffect(() => {
    const updateOffset = () => {
      if (window.innerWidth >= 768) {
        setBottomOffset(EDGE_MARGIN);
        return;
      }

      const bar = document.getElementById(MOBILE_BUY_BAR_ID);
      if (!bar) {
        setBottomOffset(EDGE_MARGIN);
        return;
      }

      setBottomOffset(bar.getBoundingClientRect().height + STICKY_BAR_GAP);
    };

    updateOffset();

    const bar = document.getElementById(MOBILE_BUY_BAR_ID);
    let observer: ResizeObserver | null = null;
    if (bar) {
      observer = new ResizeObserver(updateOffset);
      observer.observe(bar);
    }
    window.addEventListener("resize", updateOffset);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  const handleDismiss = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      sessionStorage.setItem(`${SESSION_KEY_PREFIX}${productHandle}`, "1");
      setShowWidget(false);
    },
    [productHandle],
  );

  const handlePlay = () => {
    if (video.type === "instagram") {
      window.open(video.url, "_blank", "noopener,noreferrer");
      return;
    }
    setIsOpen(true);
  };

  if (showWidget !== true) return null;

  return (
    <>
      <div
        className="fixed z-50 md:hidden"
        style={{
          right: `${EDGE_MARGIN}px`,
          bottom: `${bottomOffset}px`,
          width: `${WIDGET_WIDTH}px`,
        }}
      >
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-kobbo-black shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
          <button
            type="button"
            onClick={handlePlay}
            aria-label={video.label ?? "Play product video"}
            className="relative block h-full w-full"
          >
            <Image
              src={video.thumbnail}
              alt={video.label ?? "Product video preview"}
              fill
              sizes="96px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-kobbo-black/15" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-soft">
                <Play className="h-4 w-4 fill-kobbo-black text-kobbo-black" />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close video preview"
            className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-kobbo-black/60 text-white backdrop-blur-sm"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {isOpen && (
        <ProductVideoModal video={video} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
