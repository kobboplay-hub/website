"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import AccountLayoutShell from "@/components/account/AccountLayoutShell";
import OrderCard from "@/components/account/OrderCard";
import type { CustomerOrder } from "@/lib/shopify/customer-types";

export default function OrdersPageContent() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customer/orders")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to load orders");
        }
        return res.json();
      })
      .then((data) => setOrders(data.orders ?? []))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load orders",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AccountLayoutShell title="Order History">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
        </div>
      </AccountLayoutShell>
    );
  }

  if (error) {
    return (
      <AccountLayoutShell title="Order History">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      </AccountLayoutShell>
    );
  }

  if (orders.length === 0) {
    return (
      <AccountLayoutShell title="Order History">
        <div className="rounded-3xl bg-kobbo-white px-6 py-16 text-center shadow-soft">
          <p className="font-heading text-xl font-bold text-kobbo-black">
            No orders yet
          </p>
          <p className="mt-2 text-sm text-kobbo-muted">
            When you place an order, it will show up here.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-kobbo-yellow px-6 py-3 text-sm font-bold text-kobbo-black shadow-soft"
          >
            Start Shopping
          </Link>
        </div>
      </AccountLayoutShell>
    );
  }

  return (
    <AccountLayoutShell title="Order History">
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </AccountLayoutShell>
  );
}
