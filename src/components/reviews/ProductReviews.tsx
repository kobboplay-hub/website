import ReviewSummary from "@/components/reviews/ReviewSummary";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewAction from "@/components/reviews/ReviewAction";
import { getProductReviews } from "@/lib/judgeme";
import type { JudgeMeProductReviewData } from "@/lib/judgeme";

interface ProductReviewsProps {
  productId: string;
  productHandle: string;
  productTitle: string;
}

export default async function ProductReviews({
  productId,
  productHandle,
  productTitle,
}: ProductReviewsProps) {
  let data: JudgeMeProductReviewData = {
    averageRating: 0,
    reviewCount: 0,
    ratingBreakdown: [],
    reviews: [],
  };

  try {
    data = await getProductReviews(productId);
  } catch {
    // Keep the review action accessible if published reviews cannot be loaded.
  }

  return (
    <section id="product-reviews" className="bg-kobbo-white py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
            What Parents Are Saying
          </h2>
          <ReviewAction
            productId={productId}
            productHandle={productHandle}
            productTitle={productTitle}
          />
        </div>

        {data.reviewCount > 0 ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            <ReviewSummary
              averageRating={data.averageRating}
              reviewCount={data.reviewCount}
              ratingBreakdown={data.ratingBreakdown}
            />
            <div className="space-y-4 lg:col-span-2">
              {data.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-kobbo-muted">
            No reviews yet. Be the first to share your experience.
          </p>
        )}
      </div>
    </section>
  );
}
