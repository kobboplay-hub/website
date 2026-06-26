import { Star } from "lucide-react";
import RatingStars from "@/components/reviews/RatingStars";
import type { JudgeMeProductSummary } from "@/lib/judgeme";

interface ProductRatingBadgeProps {
  summary?: JudgeMeProductSummary | null;
  className?: string;
  variant?: "stars" | "card";
}

export default function ProductRatingBadge({
  summary,
  className = "",
  variant = "stars",
}: ProductRatingBadgeProps) {
  if (!summary || summary.reviewCount === 0) {
    if (variant === "card") return null;

    return (
      <span className={`text-[11px] font-semibold text-kobbo-muted ${className}`}>
        New
      </span>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`flex items-center gap-2 ${className}`}
        aria-label={`${summary.averageRating} out of 5 stars, ${summary.reviewCount} reviews`}
      >
        <span className="inline-flex items-center gap-0.5 rounded-md bg-kobbo-yellow px-1.5 py-0.5 text-[11px] font-bold leading-none text-kobbo-black shadow-soft sm:px-2 sm:py-1 sm:text-xs">
          {summary.averageRating.toFixed(1)}
          <Star className="h-3 w-3 fill-kobbo-black text-kobbo-black" />
        </span>
        <span className="text-xs font-medium text-kobbo-muted">
          ({summary.reviewCount.toLocaleString("en-IN")})
        </span>
      </div>
    );
  }

  return (
    <RatingStars
      rating={summary.averageRating}
      size="sm"
      reviewCount={summary.reviewCount}
      className={className}
    />
  );
}
