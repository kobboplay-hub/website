import { Star } from "lucide-react";
import { reviews } from "@/data/reviews";

export default function ParentReviews() {
  return (
    <section className="bg-kobbo-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-center text-2xl font-extrabold text-kobbo-black sm:text-3xl">
          What Parents Are Saying
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col rounded-2xl bg-kobbo-cream p-5 shadow-soft"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-kobbo-yellow text-kobbo-yellow"
                  />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-kobbo-muted">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-3 text-sm font-bold text-kobbo-black">
                {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
