"use client";

import { useState } from "react";
import { Loader2, Star, X } from "lucide-react";

interface WriteReviewModalProps {
  open: boolean;
  productTitle: string;
  productId: string;
  productHandle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WriteReviewModal({
  open,
  productTitle,
  productId,
  productHandle,
  onClose,
  onSuccess,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const displayRating = hoverRating || rating;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    if (!body.trim()) {
      setError("Please write your review.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productHandle,
          rating,
          title,
          body,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to submit review. Please try again.");
        return;
      }

      setRating(0);
      setTitle("");
      setBody("");
      onSuccess();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-kobbo-black/40 p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-kobbo-white p-6 shadow-soft-lg">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-kobbo-muted hover:bg-kobbo-cream"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="pr-8 font-heading text-xl font-extrabold text-kobbo-black">
          Write a Review
        </h3>
        <p className="mt-1 text-sm text-kobbo-muted">{productTitle}</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-kobbo-black">Your rating</p>
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const filled = displayRating >= starValue;

                return (
                  <button
                    key={starValue}
                    type="button"
                    aria-label={`Rate ${starValue} stars`}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starValue)}
                    className="rounded p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        filled
                          ? "fill-kobbo-yellow text-kobbo-yellow"
                          : "fill-kobbo-beige text-kobbo-beige"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="review-title"
              className="text-sm font-semibold text-kobbo-black"
            >
              Review title
            </label>
            <input
              id="review-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Summarize your experience"
              className="mt-1.5 w-full rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-3 text-sm outline-none transition-colors focus:border-kobbo-yellow"
            />
          </div>

          <div>
            <label
              htmlFor="review-body"
              className="text-sm font-semibold text-kobbo-black"
            >
              Your review
            </label>
            <textarea
              id="review-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              placeholder="Tell other parents what you loved about this toy..."
              className="mt-1.5 w-full resize-none rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-3 text-sm outline-none transition-colors focus:border-kobbo-yellow"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full border-2 border-kobbo-beige px-5 py-2.5 text-sm font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
