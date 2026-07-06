"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useWishlist } from "@/context/wishlist-context";
import AccountLayoutShell from "@/components/account/AccountLayoutShell";
import { AccountCardSkeleton } from "@/components/ui/SkeletonCard";
import { SummaryCard } from "@/components/account/OrderCard";
import { formatOrderDate } from "@/data/account";
import { getIndianProvinceName, isIndiaCountry } from "@/lib/data/india-provinces";
import type { CustomerOrder } from "@/lib/shopify/customer-types";

export default function AccountDashboard() {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/orders")
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const latestOrder = orders[0];
  const defaultAddress = user?.defaultAddress;
  const addressCount = user?.addresses.length ?? 0;

  return (
    <AccountLayoutShell>
      <div className="rounded-3xl bg-kobbo-yellow/20 p-6 shadow-soft sm:p-8">
        <h1 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
          Welcome back, {user?.firstName || "there"}! 👋
        </h1>
        <p className="mt-2 text-sm text-kobbo-muted">{user?.email}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Orders"
          value={loading ? "…" : String(orders.length)}
          href="/account/orders"
          linkLabel="View orders"
        />
        <SummaryCard
          title="Wishlist"
          value={String(wishlistCount)}
          href="/account/wishlist"
          linkLabel="View wishlist"
        />
        <SummaryCard
          title="Addresses"
          value={String(addressCount)}
          href="/account/addresses"
          linkLabel="Manage addresses"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-kobbo-white p-5 shadow-soft">
          <h2 className="font-heading font-bold text-kobbo-black">Profile</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-kobbo-muted">Name</dt>
              <dd className="text-right font-medium text-kobbo-black">
                {user?.firstName} {user?.lastName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-kobbo-muted">Email</dt>
              <dd className="text-right font-medium text-kobbo-black">
                {user?.email}
              </dd>
            </div>
          </dl>
        </div>

        {defaultAddress ? (
          <div className="rounded-2xl bg-kobbo-white p-5 shadow-soft">
            <h2 className="font-heading font-bold text-kobbo-black">
              Default Address
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-kobbo-muted">
              {defaultAddress.firstName} {defaultAddress.lastName}
              <br />
              {defaultAddress.address1}
              {defaultAddress.address2 && <>, {defaultAddress.address2}</>}
              <br />
              {defaultAddress.city},{" "}
              {isIndiaCountry(defaultAddress.country ?? "")
                ? getIndianProvinceName(defaultAddress.province)
                : defaultAddress.province}{" "}
              {defaultAddress.zip}
            </p>
            <Link
              href="/account/addresses"
              className="mt-3 inline-block text-sm font-semibold text-kobbo-black hover:underline"
            >
              Manage addresses →
            </Link>
          </div>
        ) : latestOrder ? (
          <div className="rounded-2xl bg-kobbo-white p-5 shadow-soft">
            <h2 className="font-heading font-bold text-kobbo-black">
              Latest Order
            </h2>
            <p className="mt-2 text-sm text-kobbo-muted">
              #{latestOrder.orderNumber} ·{" "}
              {formatOrderDate(latestOrder.processedAt)}
            </p>
            <Link
              href="/account/orders"
              className="mt-3 inline-block text-sm font-semibold text-kobbo-black hover:underline"
            >
              View all orders →
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-kobbo-white p-5 shadow-soft">
            <h2 className="font-heading font-bold text-kobbo-black">
              Start Shopping
            </h2>
            <p className="mt-2 text-sm text-kobbo-muted">
              Explore our curated toys for joyful play.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-sm font-semibold text-kobbo-black hover:underline"
            >
              Browse shop →
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-heading font-bold text-kobbo-black">Quick Links</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { href: "/shop", label: "Shop Toys" },
            { href: "/account/orders", label: "Order History" },
            { href: "/account/wishlist", label: "My Wishlist" },
            { href: "/cart", label: "View Cart" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border-2 border-kobbo-beige bg-kobbo-white px-4 py-2 text-sm font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {loading && <AccountCardSkeleton />}
    </AccountLayoutShell>
  );
}
