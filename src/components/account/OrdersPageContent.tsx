"use client";

import { useCallback, useEffect, useState } from "react";
import AccountLayoutShell from "@/components/account/AccountLayoutShell";
import OrderCard from "@/components/account/OrderCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { parseShopifyProductId } from "@/lib/judgeme";
import { mapAuthErrorMessage } from "@/lib/auth/messages";
import { emptyStates, errorStates } from "@/data/empty-states";
import type { CustomerOrder } from "@/lib/shopify/customer-types";

export default function OrdersPageContent() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [reviewedProductIds, setReviewedProductIds] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviewStatuses = useCallback(async (orderList: CustomerOrder[]) => {
    const items = orderList.flatMap((order) =>
      order.lineItems
        .filter((item) => item.productId && item.productHandle)
        .map((item) => ({
          productId: item.productId!,
          productHandle: item.productHandle!,
        })),
    );

    const uniqueItems = [
      ...new Map(
        items.map((item) => [parseShopifyProductId(item.productId), item]),
      ).values(),
    ];

    if (uniqueItems.length === 0) return;

    try {
      const response = await fetch("/api/reviews/statuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: uniqueItems }),
      });

      if (!response.ok) return;

      const data = await response.json();
      const statuses: Record<string, { alreadyReviewed: boolean }> =
        data.statuses ?? {};

      setReviewedProductIds(
        Object.fromEntries(
          Object.entries(statuses).map(([key, value]) => [
            key,
            value.alreadyReviewed,
          ]),
        ),
      );
    } catch {
      // Non-blocking — review badges fall back to unknown state
    }
  }, []);

  useEffect(() => {
    fetch("/api/customer/orders")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to load orders");
        }
        return res.json();
      })
      .then(async (data) => {
        const orderList: CustomerOrder[] = data.orders ?? [];
        setOrders(orderList);
        await loadReviewStatuses(orderList);
      })
      .catch((err) =>
        setError(
          mapAuthErrorMessage(
            err instanceof Error ? err.message : errorStates.orders.description,
          ),
        ),
      )
      .finally(() => setLoading(false));
  }, [loadReviewStatuses]);

  const handleReviewSubmitted = useCallback((productId: string) => {
    const key = parseShopifyProductId(productId);
    setReviewedProductIds((current) => ({
      ...current,
      [key]: true,
    }));
  }, []);

  if (loading) {
    return (
      <AccountLayoutShell title="Order History">
        <LoadingSpinner label="Loading your orders" />
      </AccountLayoutShell>
    );
  }

  if (error) {
    return (
      <AccountLayoutShell title="Order History">
        <ErrorState
          title={errorStates.orders.title}
          description={error}
          cta="Back to Account"
          ctaHref="/account"
        />
      </AccountLayoutShell>
    );
  }

  if (orders.length === 0) {
    return (
      <AccountLayoutShell title="Order History">
        <EmptyState
          title={emptyStates.orders.title}
          description={emptyStates.orders.description}
          cta={emptyStates.orders.cta}
          ctaHref={emptyStates.orders.ctaHref}
        />
      </AccountLayoutShell>
    );
  }

  return (
    <AccountLayoutShell title="Order History">
      <p className="mb-4 text-sm text-kobbo-muted">
        Track payment and delivery for each order. Once delivered, you can rate
        and review your toys right here.
      </p>
      <div className="space-y-5">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            reviewedProductIds={reviewedProductIds}
            onReviewSubmitted={handleReviewSubmitted}
          />
        ))}
      </div>
    </AccountLayoutShell>
  );
}
