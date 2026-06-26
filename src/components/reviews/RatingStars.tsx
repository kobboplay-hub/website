import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export default function RatingStars({
  rating,
  size = "md",
  showValue = false,
  reviewCount,
  className = "",
}: RatingStarsProps) {
  const starSize = sizeClasses[size];
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = rounded >= index + 1;
          const half = !filled && rounded >= index + 0.5;

          return (
            <Star
              key={index}
              className={`${starSize} ${
                filled || half
                  ? "fill-kobbo-yellow text-kobbo-yellow"
                  : "fill-kobbo-beige text-kobbo-beige"
              }`}
            />
          );
        })}
      </div>
      {showValue && rating > 0 && (
        <span className="text-sm font-semibold text-kobbo-black">
          {rating.toFixed(1)}
        </span>
      )}
      {typeof reviewCount === "number" && reviewCount > 0 && (
        <span className="text-xs text-kobbo-muted">({reviewCount})</span>
      )}
    </div>
  );
}
