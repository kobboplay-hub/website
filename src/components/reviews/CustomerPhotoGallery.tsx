"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, ZoomIn } from "lucide-react";
import type { JudgeMeReview } from "@/lib/judgeme";
import ReviewPhotoLightbox, { type ReviewPhotoItem } from "./ReviewPhotoLightbox";

interface CustomerPhotoGalleryProps {
  reviews: JudgeMeReview[];
}

export default function CustomerPhotoGallery({
  reviews,
}: CustomerPhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flatten all review photos with their corresponding review context
  const allPhotos: ReviewPhotoItem[] = reviews.flatMap((review) =>
    review.images.map((url) => ({
      url,
      reviewerName: review.reviewerName,
      rating: review.rating,
      verified: review.verified,
      createdAt: review.createdAt,
      title: review.title,
      body: review.body,
    })),
  );

  if (allPhotos.length === 0) return null;

  const handlePhotoClick = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="mt-6 rounded-2xl border border-kobbo-beige bg-kobbo-cream/40 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-kobbo-yellow/30 text-kobbo-black">
              <Camera className="size-4" />
            </span>
            <h3 className="font-heading text-base font-extrabold text-kobbo-black sm:text-lg">
              Customer Photos
            </h3>
            <span className="rounded-full bg-kobbo-yellow/30 px-2 py-0.5 text-xs font-bold text-kobbo-black">
              {allPhotos.length}
            </span>
          </div>
          <span className="text-xs text-kobbo-muted hidden sm:inline">
            Click to inspect in full view
          </span>
        </div>

        {/* Horizontal scrollable row of photos */}
        <div className="scrollbar-none -mx-1 flex gap-2.5 overflow-x-auto px-1 py-1 sm:gap-3">
          {allPhotos.map((photo, index) => (
            <button
              key={`${photo.url}-${index}`}
              type="button"
              onClick={() => handlePhotoClick(index)}
              aria-label={`View full-screen photo by ${photo.reviewerName}`}
              className="group relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-kobbo-beige bg-kobbo-white shadow-xs transition-all hover:border-kobbo-yellow hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-kobbo-black sm:size-24"
            >
              <Image
                src={photo.url}
                alt=""
                fill
                unoptimized
                sizes="96px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <ZoomIn className="size-5 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <ReviewPhotoLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={allPhotos}
        initialIndex={selectedIndex}
      />
    </>
  );
}
