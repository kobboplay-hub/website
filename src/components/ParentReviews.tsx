import { Star } from "lucide-react";
import { reviews } from "@/data/reviews";

export default function ParentReviews() {
  return (
    <section id="reviews" className="bg-kobbo-white py-4 sm:py-5 lg:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-center text-2xl font-extrabold text-kobbo-black sm:text-3xl">
          What Parents Are Saying
        </h2>

        <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col rounded-2xl bg-kobbo-cream p-4 shadow-soft sm:p-5"
            >
              <div
                className="flex gap-0.5"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-kobbo-yellow text-kobbo-yellow"
                        : "fill-transparent text-kobbo-beige"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-kobbo-muted">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-3 text-sm font-bold text-kobbo-black">
                — {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
