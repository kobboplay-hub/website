"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Star, X } from "lucide-react";

interface WriteReviewModalProps {
  open: boolean;
  productTitle: string;
  productId: string;
  productHandle: string;
  productNoun?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WriteReviewModal({
  open,
  productTitle,
  productId,
  productHandle,
  productNoun = "toy",
  onClose,
  onSuccess,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const displayRating = hoverRating || rating;

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 1400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(img.src);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      setError("You can attach up to 5 photos per review.");
      return;
    }

    setError("");
    setCompressing(true);

    try {
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          setError("Please select image files only (JPG, PNG, WEBP).");
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError("Images should be under 10MB each.");
          return false;
        }
        return true;
      });

      const compressedResults = await Promise.all(
        validFiles.map((file) => compressImage(file)),
      );

      setImages((prev) => [...prev, ...compressedResults].slice(0, 5));
    } catch {
      setError("Could not process selected photos. Please try another image.");
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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
          images,
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
      setImages([]);
      onSuccess();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-kobbo-black/50 p-4 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-kobbo-white p-6 shadow-soft-lg sm:p-7">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-kobbo-muted transition-colors hover:bg-kobbo-cream hover:text-kobbo-black"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="pr-8 font-heading text-xl font-extrabold text-kobbo-black sm:text-2xl">
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
                    className="rounded p-0.5 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
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
              placeholder={
                productNoun === "toy"
                  ? "Tell other parents what you loved about this toy..."
                  : `Tell other customers what you loved about this ${productNoun}...`
              }
              className="mt-1.5 w-full resize-none rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-3 text-sm outline-none transition-colors focus:border-kobbo-yellow"
            />
          </div>

          {/* Customer Photos Upload Section */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-kobbo-black">
                Add Photos{" "}
                <span className="text-xs font-normal text-kobbo-muted">
                  (optional, up to 5)
                </span>
              </label>
              {images.length > 0 && (
                <span className="text-xs font-bold text-kobbo-muted">
                  {images.length} / 5 photos
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              {/* Photo Previews */}
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream shadow-xs"
                >
                  <Image
                    src={img}
                    alt={`Selected preview ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    aria-label={`Remove photo ${idx + 1}`}
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-kobbo-black/70 text-white transition-all hover:bg-red-600 hover:scale-110"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}

              {/* Add Photo Trigger Button */}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={compressing || submitting}
                  className="flex size-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-kobbo-beige bg-kobbo-cream/60 text-kobbo-muted transition-all hover:border-kobbo-yellow hover:bg-kobbo-yellow/15 hover:text-kobbo-black active:scale-95 disabled:opacity-50"
                >
                  {compressing ? (
                    <Loader2 className="size-5 animate-spin text-kobbo-black" />
                  ) : (
                    <>
                      <Camera className="size-5 text-kobbo-black/70" />
                      <span className="text-[10px] font-bold">Add Photo</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-kobbo-muted">
              JPG, PNG, or WEBP. Share how your child plays or the kit in action!
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
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
              disabled={submitting || compressing}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-6 py-2.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light active:scale-95 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
