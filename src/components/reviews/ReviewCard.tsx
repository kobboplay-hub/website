import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import RatingStars from "@/components/reviews/RatingStars";
import type { JudgeMeReview } from "@/lib/judgeme";
import { formatReviewDate } from "@/lib/judgeme";

interface ReviewCardProps {
  review: JudgeMeReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-2xl border border-kobbo-beige bg-kobbo-white p-5 shadow-soft">
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

      {review.images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.images.map((image, index) => (
            <div
              key={`${review.id}-${index}`}
              className="relative h-16 w-16 overflow-hidden rounded-xl bg-kobbo-beige"
            >
              <Image
                src={image}
                alt={`Review photo ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
