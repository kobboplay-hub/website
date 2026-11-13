import { BadgeCheck } from "lucide-react";

import ReviewAction from "@/components/reviews/ReviewAction";
import { formatReviewDate, type JudgeMeProductReviewData } from "@/lib/judgeme";
import LifestyleRatingStars from "./LifestyleRatingStars";

interface LifestyleProductReviewsProps {
  productId: string;
  productHandle: string;
  productTitle: string;
  data: JudgeMeProductReviewData;
}

export default function LifestyleProductReviews({ productId, productHandle, productTitle, data }: LifestyleProductReviewsProps) {
  return (
    <section id="reviews" aria-labelledby="lifestyle-product-reviews" className="scroll-mt-28 border-t border-ls-line py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="lifestyle-product-reviews" className="font-ls-display text-2xl font-bold tracking-[-0.02em] text-ls-ink">
              Reviews
            </h2>
            {data.reviewCount > 0 && (
              <p className="mt-2 flex items-center gap-2 text-sm text-ls-ink-soft">
                <LifestyleRatingStars rating={data.averageRating} size="md" />
                {data.averageRating.toFixed(1)} out of 5 · {data.reviewCount} {data.reviewCount === 1 ? "review" : "reviews"}
              </p>
            )}
          </div>
          <ReviewAction
            productId={productId}
            productHandle={productHandle}
            productTitle={productTitle}
            productNoun="product"
            className="text-sm text-ls-muted"
            buttonClassName="h-11 rounded-[4px] border border-ls-ink bg-transparent px-5 text-sm font-semibold text-ls-ink transition-colors hover:bg-ls-ink hover:text-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
          />
        </div>

        {data.reviewCount > 0 ? (
          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            <dl className="space-y-2 lg:col-span-3">
              {data.ratingBreakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-sm">
                  <dt className="w-10 shrink-0 tabular-nums text-ls-ink-soft">{row.stars} star</dt>
                  <dd className="flex flex-1 items-center gap-3">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ls-sand" aria-hidden>
                      <span className="block h-full rounded-full bg-ls-ink" style={{ width: `${row.percent}%` }} />
                    </span>
                    <span className="w-6 text-right text-xs tabular-nums text-ls-muted">{row.count}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="divide-y divide-ls-line lg:col-span-9">
              {data.reviews.map((review) => (
                <li key={review.id} className="py-6 first:pt-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <LifestyleRatingStars rating={review.rating} />
                    {review.title && <h3 className="font-ls-display text-[15px] font-semibold text-ls-ink">{review.title}</h3>}
                  </div>
                  {review.body && <p className="mt-2 text-[15px] leading-relaxed text-ls-ink-soft">{review.body}</p>}
                  <p className="mt-3 flex flex-wrap items-center gap-x-2 text-xs text-ls-muted">
                    <span className="font-medium text-ls-ink">{review.reviewerName}</span>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1">
                        <BadgeCheck className="size-3.5 text-ls-accent" strokeWidth={1.8} aria-hidden /> Verified buyer
                      </span>
                    )}
                    {review.createdAt && <span>· {formatReviewDate(review.createdAt)}</span>}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6 text-sm text-ls-muted">No reviews yet. Customers who buy this product can share their experience here.</p>
        )}
      </div>
    </section>
  );
}
