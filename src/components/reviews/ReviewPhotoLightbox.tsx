"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronLeft, ChevronRight, X } from "lucide-react";
import RatingStars from "@/components/reviews/RatingStars";
import { formatReviewDate } from "@/lib/judgeme";

export interface ReviewPhotoItem {
  url: string;
  reviewerName?: string;
  rating?: number;
  verified?: boolean;
  createdAt?: string;
  title?: string;
  body?: string;
}

interface ReviewPhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  photos: ReviewPhotoItem[];
  initialIndex?: number;
}

export default function ReviewPhotoLightbox({
  isOpen,
  onClose,
  photos,
  initialIndex = 0,
}: ReviewPhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
      } else if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, photos.length, onClose]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] ?? photos[0];
  const hasMultiple = photos.length > 1;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Customer review photo viewer"
      className="fixed inset-0 z-[100] flex flex-col bg-kobbo-black/92 backdrop-blur-md text-white transition-opacity duration-200"
    >
      {/* Top Bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
            Customer Photo
          </span>
          {hasMultiple && (
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold text-white tabular-nums">
              {currentIndex + 1} / {photos.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20 active:scale-95 focus-visible:outline-2 focus-visible:outline-kobbo-yellow"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-3 sm:p-6 lg:flex-row lg:gap-8">
        {/* Navigation Buttons */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 active:scale-95 sm:left-6"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 active:scale-95 sm:right-6"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        {/* Large Image View */}
        <div className="relative flex h-[55vh] w-full max-w-2xl items-center justify-center sm:h-[65vh] lg:h-[75vh]">
          <Image
            src={currentPhoto.url}
            alt={currentPhoto.title || `Customer review photo ${currentIndex + 1}`}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-contain drop-shadow-2xl transition-all duration-300"
          />
        </div>

        {/* Review Details Card */}
        {currentPhoto.reviewerName && (
          <div className="mt-3 max-h-48 w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:mt-4 lg:mt-0 lg:max-h-[75vh] lg:w-80 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-sm text-white truncate">
                  {currentPhoto.reviewerName}
                </span>
                {currentPhoto.verified && (
                  <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-kobbo-yellow/20 px-1.5 py-0.5 text-[10px] font-bold text-kobbo-yellow">
                    <BadgeCheck className="size-3" />
                    Verified
                  </span>
                )}
              </div>
              {currentPhoto.createdAt && (
                <span className="text-[11px] text-white/60 shrink-0">
                  {formatReviewDate(currentPhoto.createdAt)}
                </span>
              )}
            </div>

            {currentPhoto.rating !== undefined && (
              <div className="mt-2">
                <RatingStars rating={currentPhoto.rating} size="sm" />
              </div>
            )}

            {currentPhoto.title && (
              <h4 className="font-heading mt-2 text-sm font-bold text-white">
                {currentPhoto.title}
              </h4>
            )}

            {currentPhoto.body && (
              <p className="mt-1.5 text-xs leading-relaxed text-white/80">
                {currentPhoto.body}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Thumbnail Strip (if multiple photos) */}
      {hasMultiple && (
        <div className="flex h-18 shrink-0 items-center justify-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-2 sm:gap-3">
          {photos.map((photo, index) => (
            <button
              key={`${photo.url}-${index}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`View photo ${index + 1}`}
              className={`relative size-12 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:size-14 ${
                currentIndex === index
                  ? "border-kobbo-yellow scale-105 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={photo.url}
                alt=""
                fill
                unoptimized
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
