"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, ZoomIn } from "lucide-react";
import RatingStars from "@/components/reviews/RatingStars";
import type { JudgeMeReview } from "@/lib/judgeme";
import { formatReviewDate } from "@/lib/judgeme";
import ReviewPhotoLightbox from "./ReviewPhotoLightbox";

interface ReviewCardProps {
  review: JudgeMeReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const photoItems = review.images.map((url) => ({
    url,
    reviewerName: review.reviewerName,
    rating: review.rating,
    verified: review.verified,
    createdAt: review.createdAt,
    title: review.title,
    body: review.body,
  }));

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <article className="rounded-2xl border border-kobbo-beige bg-kobbo-white p-5 shadow-soft transition-all hover:shadow-soft-lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-kobbo-black">{review.reviewerName}</p>
              {review.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-kobbo-yellow/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-kobbo-black">
                  <BadgeCheck className="h-3 w-3" />
                  Verified Buyer
                </span>
              )}
            </div>
            <div className="mt-1.5">
              <RatingStars rating={review.rating} size="sm" />
            </div>
          </div>
          <span className="text-xs text-kobbo-muted">
            {formatReviewDate(review.createdAt)}
          </span>
        </div>

        {review.title && (
          <h3 className="mt-3 font-heading text-sm font-bold text-kobbo-black">
            {review.title}
          </h3>
        )}

        {review.body && (
          <p className="mt-2 text-sm leading-relaxed text-kobbo-muted">
            {review.body}
          </p>
        )}

        {/* Customer Review Photos (Clickable with full-screen zoom preview) */}
        {review.images.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-kobbo-muted mb-1.5">
              Customer photos:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {review.images.map((image, index) => (
                <button
                  key={`${review.id}-${index}`}
                  type="button"
                  onClick={() => handlePhotoClick(index)}
                  aria-label={`View full-size photo ${index + 1} from ${review.reviewerName}`}
                  className="group relative h-16 w-16 overflow-hidden rounded-xl border border-kobbo-beige bg-kobbo-cream transition-all hover:border-kobbo-yellow hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-kobbo-black"
                >
                  <Image
                    src={image}
                    alt={`Review photo ${index + 1}`}
                    fill
                    unoptimized
                    sizes="64px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-kobbo-black/0 transition-colors group-hover:bg-kobbo-black/25">
                    <ZoomIn className="size-4 text-white opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Lightbox for full screen photo inspection */}
      <ReviewPhotoLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={photoItems}
        initialIndex={selectedPhotoIndex}
      />
    </>
  );
}
