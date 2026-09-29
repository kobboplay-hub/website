"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  User,
  Store,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useWishlist } from "@/context/wishlist-context";
import AccountLayoutShell from "@/components/account/AccountLayoutShell";
import { AccountCardSkeleton } from "@/components/ui/SkeletonCard";
import { SummaryCard } from "@/components/account/OrderCard";
import { formatOrderDate } from "@/data/account";
import { getIndianProvinceName, isIndiaCountry } from "@/lib/data/india-provinces";
import type { CustomerOrder } from "@/lib/shopify/customer-types";

export default function AccountDashboard() {
  const { user, logout } = useAuth();
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
  const userInitial = (user?.firstName?.[0] || user?.lastName?.[0] || "K").toUpperCase();

  return (
    <AccountLayoutShell>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-kobbo-yellow/30 bg-gradient-to-br from-kobbo-yellow/20 via-kobbo-cream to-kobbo-white p-4 shadow-soft sm:rounded-3xl sm:p-7">
        <div className="flex items-center gap-3.5 sm:gap-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-kobbo-yellow text-base font-black text-kobbo-black shadow-xs sm:h-14 sm:w-14 sm:text-xl">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-lg font-extrabold text-kobbo-black sm:text-2xl lg:text-3xl">
              Welcome back, {user?.firstName || "there"}! 👋
            </h1>
            <p className="truncate text-xs font-medium text-kobbo-muted sm:text-sm">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Metrics Grid — 3 columns across mobile and desktop */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
        <SummaryCard
          title="Orders"
          value={loading ? "…" : String(orders.length)}
          href="/account/orders"
          linkLabel="View"
          icon={Package}
        />
        <SummaryCard
          title="Wishlist"
          value={String(wishlistCount)}
          href="/account/wishlist"
          linkLabel="View"
          icon={Heart}
        />
        <SummaryCard
          title="Addresses"
          value={String(addressCount)}
          href="/account/addresses"
          linkLabel="Manage"
          icon={MapPin}
        />
      </div>

      {/* Two-Column Details Grid */}
      <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
        {/* Profile Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-kobbo-beige/70 bg-kobbo-white p-4 shadow-soft sm:p-6">
          <div>
            <div className="flex items-center gap-2.5 border-b border-kobbo-beige/60 pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-kobbo-cream text-kobbo-black">
                <User className="h-4 w-4" />
              </span>
              <h2 className="font-heading text-sm font-extrabold text-kobbo-black sm:text-base">
                Personal Details
              </h2>
            </div>
            <dl className="mt-2.5 divide-y divide-kobbo-beige/40 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2">
                <dt className="text-kobbo-muted">Name</dt>
                <dd className="text-right font-bold text-kobbo-black">
                  {user?.firstName} {user?.lastName}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-kobbo-muted">Email</dt>
                <dd className="max-w-[180px] truncate text-right font-bold text-kobbo-black sm:max-w-none">
                  {user?.email}
                </dd>
              </div>
              {user?.phone && (
                <div className="flex items-center justify-between py-2">
                  <dt className="text-kobbo-muted">Phone</dt>
                  <dd className="text-right font-bold text-kobbo-black">
                    {user.phone}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Default Address or Recent Order Card */}
        {defaultAddress ? (
          <div className="flex flex-col justify-between rounded-2xl border border-kobbo-beige/70 bg-kobbo-white p-4 shadow-soft sm:p-6">
            <div>
              <div className="flex items-center justify-between border-b border-kobbo-beige/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-kobbo-cream text-kobbo-black">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <h2 className="font-heading text-sm font-extrabold text-kobbo-black sm:text-base">
                    Default Address
                  </h2>
                </div>
                <span className="rounded-full bg-kobbo-yellow/30 px-2 py-0.5 text-[10px] font-bold text-kobbo-black">
                  Primary
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-kobbo-black/80 sm:text-sm">
                <span className="font-bold text-kobbo-black">
                  {defaultAddress.firstName} {defaultAddress.lastName}
                </span>
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
            </div>
            <Link
              href="/account/addresses"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-kobbo-black hover:underline sm:text-sm"
            >
              <span>Manage all addresses</span>
              <span>→</span>
            </Link>
          </div>
        ) : latestOrder ? (
          <div className="flex flex-col justify-between rounded-2xl border border-kobbo-beige/70 bg-kobbo-white p-4 shadow-soft sm:p-6">
            <div>
              <div className="flex items-center justify-between border-b border-kobbo-beige/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-kobbo-cream text-kobbo-black">
                    <Package className="h-4 w-4" />
                  </span>
                  <h2 className="font-heading text-sm font-extrabold text-kobbo-black sm:text-base">
                    Recent Order
                  </h2>
                </div>
                <span className="rounded-full bg-kobbo-cream px-2 py-0.5 text-[10px] font-bold text-kobbo-black">
                  #{latestOrder.orderNumber}
                </span>
              </div>
              <div className="mt-2.5 space-y-1">
                <p className="text-xs text-kobbo-muted sm:text-sm">
                  Placed on {formatOrderDate(latestOrder.processedAt)}
                </p>
                <p className="font-heading text-xs font-extrabold text-kobbo-black sm:text-sm">
                  {latestOrder.lineItems.length}{" "}
                  {latestOrder.lineItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <Link
              href="/account/orders"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-kobbo-black hover:underline sm:text-sm"
            >
              <span>View all orders</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col justify-between rounded-2xl border border-kobbo-beige/70 bg-kobbo-white p-4 shadow-soft sm:p-6">
            <div>
              <div className="flex items-center gap-2.5 border-b border-kobbo-beige/60 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-kobbo-cream text-kobbo-black">
                  <Store className="h-4 w-4" />
                </span>
                <h2 className="font-heading text-sm font-extrabold text-kobbo-black sm:text-base">
                  Start Shopping
                </h2>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-kobbo-muted sm:text-sm">
                Discover our curated collection of developmental toys designed for joyful, mindful play.
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-kobbo-black hover:underline sm:text-sm"
            >
              <span>Browse toy collection</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="mt-5 sm:mt-8">
        <h2 className="font-heading text-sm font-extrabold text-kobbo-black sm:text-base">
          Quick Actions
        </h2>
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {[
            { href: "/shop", label: "Shop Toys", icon: Store },
            { href: "/account/orders", label: "My Orders", icon: Package },
            { href: "/account/wishlist", label: "My Wishlist", icon: Heart },
            { href: "/cart", label: "View Cart", icon: ShoppingCart },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-xl border border-kobbo-beige/80 bg-kobbo-white p-2.5 text-xs font-bold text-kobbo-black transition-colors hover:border-kobbo-yellow hover:bg-kobbo-cream active:bg-kobbo-beige sm:p-3 sm:text-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-kobbo-cream text-kobbo-black sm:h-7 sm:w-7">
                <link.icon className="h-3.5 w-3.5" />
              </span>
              <span className="truncate">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Logout Button at Bottom of Page */}
      <div className="mt-6 border-t border-kobbo-beige/60 pt-4 lg:hidden">
        <button
          type="button"
          onClick={() => logout("/")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/70 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 active:bg-red-200 sm:text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out of Account</span>
        </button>
      </div>

      {loading && <AccountCardSkeleton />}
    </AccountLayoutShell>
  );
}
