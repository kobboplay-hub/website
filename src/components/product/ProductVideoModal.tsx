"use client";

import AdaptiveProductVideoPlayer from "@/components/product/AdaptiveProductVideoPlayer";
import type { ProductVideoItem } from "@/lib/productPageContent";

interface ProductVideoModalProps {
  video: ProductVideoItem;
  onClose: () => void;
}

export default function ProductVideoModal({
  video,
  onClose,
}: ProductVideoModalProps) {
  return (
    <AdaptiveProductVideoPlayer
      video={video}
      onClose={onClose}
      autoplayEmbed
    />
  );
}
