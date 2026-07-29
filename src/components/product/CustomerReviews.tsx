import { Star } from "lucide-react";
import type { ProductReview } from "@/lib/productPageContent";

interface CustomerReviewsProps {
  rating: number;
  reviewCount: number;
  ratingBreakdown: { stars: number; percent: number }[];
  reviews: ProductReview[];
}

export default function CustomerReviews({
  rating,
  reviewCount,
  ratingBreakdown,
  reviews,
}: CustomerReviewsProps) {
  return (
    <section className="bg-kobbo-white py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
          Customer Reviews
        </h2>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl bg-kobbo-cream p-6">
            <div className="text-center">
              <p className="font-heading text-5xl font-extrabold text-kobbo-black">
                {rating}
              </p>
              <div className="mt-2 flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating)
                        ? "fill-kobbo-yellow text-kobbo-yellow"
                        : "fill-kobbo-beige text-kobbo-beige"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-kobbo-muted">
                Based on {reviewCount} reviews
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {ratingBreakdown.map(({ stars, percent }) => (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-3 font-medium text-kobbo-black">
                    {stars}
                  </span>
                  <Star className="h-3 w-3 fill-kobbo-yellow text-kobbo-yellow" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-kobbo-white">
                    <div
                      className="h-full rounded-full bg-kobbo-yellow"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-kobbo-muted">
                    {percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-kobbo-beige bg-kobbo-white p-5 shadow-soft"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-kobbo-black">{review.name}</p>
                  <span className="text-xs text-kobbo-muted">{review.date}</span>
                </div>
                <div className="mt-1.5 flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-kobbo-yellow text-kobbo-yellow"
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-kobbo-muted">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
