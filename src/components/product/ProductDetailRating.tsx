import RatingStars from "@/components/reviews/RatingStars";
import type { JudgeMeProductSummary } from "@/lib/judgeme";

interface ProductDetailRatingProps {
  summary?: JudgeMeProductSummary | null;
}

export default function ProductDetailRating({
  summary,
}: ProductDetailRatingProps) {
  if (!summary || summary.reviewCount === 0 || summary.averageRating === 0) {
    return null;
  }

  const reviewLabel =
    summary.reviewCount === 1 ? "1 review" : `${summary.reviewCount} reviews`;

  return (
    <a
      href="#product-reviews"
      className="mt-2.5 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-lg py-0.5 transition-colors hover:opacity-80 sm:mt-3 sm:gap-x-2.5"
      aria-label={`${summary.averageRating.toFixed(1)} out of 5 stars, ${reviewLabel}. Jump to reviews`}
    >
      <RatingStars rating={summary.averageRating} size="sm" className="shrink-0" />
      <span className="text-sm font-bold tabular-nums text-kobbo-black sm:text-base">
        {summary.averageRating.toFixed(1)}
      </span>
      <span className="text-xs font-medium text-kobbo-muted sm:text-sm">
        ({reviewLabel})
      </span>
    </a>
  );
}
