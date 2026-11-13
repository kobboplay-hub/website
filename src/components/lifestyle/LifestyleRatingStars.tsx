import { Star } from "lucide-react";

export default function LifestyleRatingStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const rounded = Math.round(rating * 2) / 2;
  const iconSize = size === "md" ? "size-4" : "size-3.5";

  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = rounded >= index + 1 ? "full" : rounded >= index + 0.5 ? "half" : "empty";
        return (
          <span key={index} className={`relative inline-block ${iconSize}`} aria-hidden>
            <Star className={`absolute inset-0 ${iconSize} text-ls-line`} fill="currentColor" strokeWidth={0} />
            {fill !== "empty" && (
              <span className={`absolute inset-y-0 left-0 overflow-hidden ${fill === "half" ? "w-1/2" : "w-full"}`}>
                <Star className={`${iconSize} text-ls-ink`} fill="currentColor" strokeWidth={0} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
