"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Star } from "lucide-react";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import { isOrderPaid, isOrderFulfilled, isOrderReviewable } from "@/lib/order-status";
import type { CustomerOrder } from "@/lib/shopify/customer-types";

interface OrderLineItemReviewProps {
  order: CustomerOrder;
  productId: string;
  productHandle: string;
  productTitle: string;
  alreadyReviewed: boolean;
  onReviewSubmitted: () => void;
}

export default function OrderLineItemReview({
  order,
  productId,
  productHandle,
  productTitle,
  alreadyReviewed,
  onReviewSubmitted,
}: OrderLineItemReviewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const orderReady = isOrderReviewable(
    order.financialStatus,
    order.fulfillmentStatus,
  );

  if (alreadyReviewed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-kobbo-green/15 px-3 py-1.5 text-xs font-semibold text-kobbo-green">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Reviewed
      </span>
    );
  }

  if (!orderReady) {
    const message = !isOrderPaid(order.financialStatus)
      ? "After payment"
      : !isOrderFulfilled(order.fulfillmentStatus)
        ? "After delivery"
        : "After delivery";

    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-kobbo-beige px-3 py-1.5 text-xs font-medium text-kobbo-muted"
        title="You can rate this product once payment is confirmed and the order is delivered."
      >
        <Clock className="h-3.5 w-3.5 shrink-0" />
        {message}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-kobbo-yellow bg-kobbo-yellow/20 px-4 py-2 text-xs font-bold text-kobbo-black transition-all hover:bg-kobbo-yellow hover:shadow-soft"
      >
        <Star className="h-3.5 w-3.5 fill-kobbo-yellow text-kobbo-yellow" />
        Rate &amp; Review
      </button>

      <WriteReviewModal
        open={modalOpen}
        productTitle={productTitle}
        productId={productId}
        productHandle={productHandle}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          onReviewSubmitted();
        }}
      />
    </>
  );
}
