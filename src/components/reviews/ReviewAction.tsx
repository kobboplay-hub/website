"use client";

import { useEffect, useState } from "react";
import WriteReviewButton from "@/components/reviews/WriteReviewButton";
import { useAuth } from "@/context/auth-context";

interface ReviewActionProps {
  productId: string;
  productHandle: string;
  productTitle: string;
}

type Eligibility = "loading" | "eligible" | "not_purchased" | "payment_pending" | "not_fulfilled" | "already_reviewed" | "unavailable";

const messages: Partial<Record<Eligibility, string>> = {
  already_reviewed: "You've already shared your review for this toy.",
  not_fulfilled: "You can leave a review once your order is delivered.",
  payment_pending: "You can leave a review after your payment is confirmed.",
  not_purchased: "Only customers who purchased this toy can leave a review.",
};

export default function ReviewAction({
  productId,
  productHandle,
  productTitle,
}: ReviewActionProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const [eligibility, setEligibility] = useState<Eligibility>("loading");

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ productHandle, productId });

    fetch(`/api/reviews/eligibility?${params}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return "unavailable" as const;
        const data = (await response.json()) as {
          eligible?: boolean;
          reason?: string;
        };
        if (data.eligible) return "eligible" as const;
        if (data.reason && data.reason in messages) {
          return data.reason as Eligibility;
        }
        return "unavailable" as const;
      })
      .then(setEligibility)
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setEligibility("unavailable");
        }
      });

    return () => controller.abort();
  }, [isLoading, isLoggedIn, productHandle, productId]);

  if (isLoading || (isLoggedIn && eligibility === "loading")) return null;

  if (isLoggedIn && eligibility !== "eligible") {
    const message = messages[eligibility];
    return message ? (
      <p className="text-sm font-medium text-kobbo-muted">{message}</p>
    ) : null;
  }

  return (
    <WriteReviewButton
      productId={productId}
      productHandle={productHandle}
      productTitle={productTitle}
    />
  );
}
