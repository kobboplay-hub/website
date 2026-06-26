"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, PenLine, ShoppingBag, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";

interface WriteReviewButtonProps {
  productId: string;
  productHandle: string;
  productTitle: string;
  className?: string;
}

type ModalState =
  | "form"
  | "not_purchased"
  | "payment_pending"
  | "not_fulfilled"
  | "already_reviewed"
  | "unavailable"
  | "success"
  | null;

export default function WriteReviewButton({
  productId,
  productHandle,
  productTitle,
  className = "",
}: WriteReviewButtonProps) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  const handleClick = async () => {
    if (authLoading || checking) return;

    if (!isLoggedIn) {
      const redirect = pathname.includes("#")
        ? pathname
        : `${pathname}#product-reviews`;
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setChecking(true);
    try {
      const params = new URLSearchParams({
        productHandle,
        productId,
      });
      const response = await fetch(`/api/reviews/eligibility?${params}`);

      if (response.status === 401) {
        router.push(
          `/login?redirect=${encodeURIComponent(`${pathname}#product-reviews`)}`,
        );
        return;
      }

      const data = await response.json();

      if (data.eligible) {
        setModal("form");
        return;
      }

      if (
        data.reason === "not_purchased" ||
        data.reason === "payment_pending" ||
        data.reason === "not_fulfilled" ||
        data.reason === "already_reviewed"
      ) {
        setModal(data.reason);
        return;
      }

      setModal("unavailable");
    } catch {
      setModal("unavailable");
    } finally {
      setChecking(false);
    }
  };

  const handleSuccess = () => {
    setModal("success");
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={authLoading || checking}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      >
        {checking ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PenLine className="h-4 w-4" />
        )}
        Write a Review
      </button>

      <WriteReviewModal
        open={modal === "form"}
        productTitle={productTitle}
        productId={productId}
        productHandle={productHandle}
        onClose={() => setModal(null)}
        onSuccess={handleSuccess}
      />

      {modal === "success" && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-kobbo-black/40 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-kobbo-white p-6 text-center shadow-soft-lg">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-kobbo-muted hover:bg-kobbo-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-kobbo-green/15">
              <CheckCircle2 className="h-6 w-6 text-kobbo-green" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-extrabold text-kobbo-black">
              Thank you!
            </h3>
            <p className="mt-2 text-sm text-kobbo-muted">
              Your review has been submitted. It may take a moment to appear on
              this page.
            </p>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="mt-5 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {modal === "not_purchased" && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-kobbo-black/40 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-kobbo-white p-6 shadow-soft-lg">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-kobbo-muted hover:bg-kobbo-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kobbo-cream">
              <ShoppingBag className="h-6 w-6 text-kobbo-black" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-extrabold text-kobbo-black">
              Purchase required
            </h3>
            <p className="mt-2 text-sm text-kobbo-muted">
              You can only review toys you&apos;ve purchased from Kobbo.
            </p>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="mt-5 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {modal === "payment_pending" && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-kobbo-black/40 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-kobbo-white p-6 shadow-soft-lg">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-kobbo-muted hover:bg-kobbo-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kobbo-yellow/30">
              <Clock className="h-6 w-6 text-kobbo-black" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-extrabold text-kobbo-black">
              Payment pending
            </h3>
            <p className="mt-2 text-sm text-kobbo-muted">
              You can leave a review after your payment is confirmed.
            </p>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="mt-5 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {modal === "not_fulfilled" && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-kobbo-black/40 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-kobbo-white p-6 shadow-soft-lg">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-kobbo-muted hover:bg-kobbo-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kobbo-yellow/30">
              <Clock className="h-6 w-6 text-kobbo-black" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-extrabold text-kobbo-black">
              Order not delivered yet
            </h3>
            <p className="mt-2 text-sm text-kobbo-muted">
              You can leave a review once your order is delivered and fulfilled.
            </p>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="mt-5 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {modal === "already_reviewed" && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-kobbo-black/40 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-kobbo-white p-6 shadow-soft-lg">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-kobbo-muted hover:bg-kobbo-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kobbo-green/15">
              <CheckCircle2 className="h-6 w-6 text-kobbo-green" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-extrabold text-kobbo-black">
              Review already submitted
            </h3>
            <p className="mt-2 text-sm text-kobbo-muted">
              You&apos;ve already shared your review for this toy. Thank you!
            </p>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="mt-5 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {modal === "unavailable" && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-kobbo-black/40 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-kobbo-white p-6 shadow-soft-lg">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-kobbo-muted hover:bg-kobbo-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-heading text-xl font-extrabold text-kobbo-black">
              Write a Review
            </h3>
            <p className="mt-2 text-sm text-kobbo-muted">
              Review form is temporarily unavailable. Please try again in a little
              while.
            </p>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="mt-5 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
