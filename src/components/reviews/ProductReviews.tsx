import ReviewSummary from "@/components/reviews/ReviewSummary";
import ReviewCard from "@/components/reviews/ReviewCard";
import WriteReviewButton from "@/components/reviews/WriteReviewButton";
import { getProductReviews } from "@/lib/judgeme";
import { getReviewEligibility, getReviewEligibilityMessage } from "@/lib/review-eligibility";
import { getCustomerToken } from "@/lib/auth/session";
import { emptyStates } from "@/data/empty-states";
import type { JudgeMeProductReviewData } from "@/lib/judgeme";

interface ProductReviewsProps {
  productId: string;
  productHandle: string;
  productTitle: string;
}

function EmptyReviews({
  productId,
  productHandle,
  productTitle,
  showWriteReview,
  statusMessage,
}: {
  productId: string;
  productHandle: string;
  productTitle: string;
  showWriteReview: boolean;
  statusMessage: string | null;
}) {
  return (
    <div className="rounded-3xl bg-kobbo-cream px-6 py-12 text-center">
      <p className="font-heading text-xl font-bold text-kobbo-black">
        {emptyStates.reviews.title}
      </p>
      <p className="mt-2 text-sm text-kobbo-muted">
        {emptyStates.reviews.description}
      </p>
      {statusMessage && (
        <p className="mt-3 text-sm font-medium text-kobbo-muted">
          {statusMessage}
        </p>
      )}
      {showWriteReview && (
        <div className="mt-6 flex justify-center">
          <WriteReviewButton
            productId={productId}
            productHandle={productHandle}
            productTitle={productTitle}
          />
        </div>
      )}
    </div>
  );
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
    // Graceful fallback — empty state below
  }

  const token = await getCustomerToken();
  const eligibility = token
    ? await getReviewEligibility(productHandle, productId, productTitle)
    : { eligible: false, reason: "not_authenticated" as const };

  const showWriteReview =
    !token || eligibility.reason === "eligible";
  const statusMessage =
    token && !eligibility.eligible
      ? getReviewEligibilityMessage(eligibility.reason)
      : null;

  return (
    <section id="product-reviews" className="bg-kobbo-white py-5 sm:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
            What Parents Are Saying
          </h2>
          {showWriteReview && data.reviewCount > 0 && (
            <WriteReviewButton
              productId={productId}
              productHandle={productHandle}
              productTitle={productTitle}
            />
          )}
        </div>

        {statusMessage && data.reviewCount > 0 && (
          <p className="mt-3 text-sm font-medium text-kobbo-muted">
            {statusMessage}
          </p>
        )}

        {data.reviewCount === 0 ? (
          <div className="mt-6">
            <EmptyReviews
              productId={productId}
              productHandle={productHandle}
              productTitle={productTitle}
              showWriteReview={showWriteReview}
              statusMessage={statusMessage}
            />
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}
