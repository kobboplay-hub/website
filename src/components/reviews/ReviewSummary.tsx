import RatingStars from "@/components/reviews/RatingStars";
import type { JudgeMeRatingBreakdown } from "@/lib/judgeme";

interface ReviewSummaryProps {
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: JudgeMeRatingBreakdown[];
}

export default function ReviewSummary({
  averageRating,
  reviewCount,
  ratingBreakdown,
}: ReviewSummaryProps) {
  return (
    <div className="rounded-2xl bg-kobbo-cream p-6">
      <div className="text-center">
        <p className="font-heading text-5xl font-extrabold text-kobbo-black">
          {averageRating > 0 ? averageRating.toFixed(1) : "—"}
        </p>
        <div className="mt-2 flex justify-center">
          <RatingStars rating={averageRating} size="md" />
        </div>
        <p className="mt-2 text-sm text-kobbo-muted">
          {reviewCount > 0
            ? `Based on ${reviewCount} review${reviewCount === 1 ? "" : "s"}`
            : "No reviews yet"}
        </p>
      </div>

      {reviewCount > 0 && (
        <div className="mt-6 space-y-2">
          {ratingBreakdown.map(({ stars, percent }) => (
            <div key={stars} className="flex items-center gap-2 text-xs">
              <span className="w-3 font-medium text-kobbo-black">{stars}</span>
              <RatingStars rating={stars} size="sm" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-kobbo-white">
                <div
                  className="h-full rounded-full bg-kobbo-yellow transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-8 text-right text-kobbo-muted">{percent}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
