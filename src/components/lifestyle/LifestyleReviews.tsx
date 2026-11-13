import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { formatReviewDate, getProductReviews, type JudgeMeReview } from "@/lib/judgeme";
import type { Product } from "@/lib/shopify/types";
import { getProductPath } from "@/lib/storefront/product-routing";
import LifestyleRatingStars from "./LifestyleRatingStars";
import LifestyleSectionHeading from "./LifestyleSectionHeading";

const PRODUCTS_TO_SCAN = 12;
const REVIEWS_TO_SHOW = 6;

interface ReviewWithProduct extends JudgeMeReview {
  product: Pick<Product, "handle" | "title">;
}

/** Published Judge.me reviews of Lifestyle products only; omitted when there are none. */
export default async function LifestyleReviews({ products }: { products: Product[] }) {
  const results = await Promise.allSettled(
    products.slice(0, PRODUCTS_TO_SCAN).map(async (product) => {
      const data = await getProductReviews(product.id);
      return data.reviews.map((review): ReviewWithProduct => ({ ...review, product }));
    }),
  );

  const reviews = results
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((review) => review.body.trim() || review.title.trim())
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, REVIEWS_TO_SHOW);

  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="lifestyle-reviews" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LifestyleSectionHeading id="lifestyle-reviews" eyebrow="Customer reviews" title="What customers are saying" />
        <ul className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id} className="flex flex-col border-t border-ls-line pt-6">
              <LifestyleRatingStars rating={review.rating} />
              {review.title && <h3 className="mt-4 font-ls-display text-base font-semibold text-ls-ink">{review.title}</h3>}
              {review.body && <p className="mt-2 line-clamp-5 text-[15px] leading-relaxed text-ls-ink-soft">{review.body}</p>}
              <div className="mt-auto pt-5 text-sm">
                <p className="flex items-center gap-1.5 font-medium text-ls-ink">
                  {review.reviewerName}
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-normal text-ls-muted">
                      <BadgeCheck className="size-3.5 text-ls-accent" strokeWidth={1.8} aria-hidden /> Verified buyer
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-ls-muted">
                  <Link href={getProductPath({ handle: review.product.handle, isLifestyle: true })} className="underline-offset-4 hover:underline">
                    {review.product.title}
                  </Link>
                  {review.createdAt && <> · {formatReviewDate(review.createdAt)}</>}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
