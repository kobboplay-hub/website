"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  LogOut,
} from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

interface AccountSidebarProps {
  activePath: string;
  onLogout: () => void;
}

export default function AccountSidebar({
  activePath,
  onLogout,
}: AccountSidebarProps) {
  const { count: wishlistCount } = useWishlist();

  return (
    <>
      {/* Mobile Horizontal Navigation Tabs (< lg) */}
      <div className="lg:hidden">
        <nav
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
          aria-label="Account navigation tabs"
        >
          {links.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? activePath === href
              : activePath.startsWith(href);

            const isWishlist = href === "/account/wishlist";

            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                  isActive
                    ? "bg-kobbo-yellow text-kobbo-black shadow-xs ring-1 ring-kobbo-yellow-dark/20"
                    : "bg-kobbo-white text-kobbo-black/75 border border-kobbo-beige/80 hover:bg-kobbo-cream active:bg-kobbo-beige"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
                {isWishlist && wishlistCount > 0 && (
                  <span
                    className={`ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ${
                      isActive
                        ? "bg-kobbo-black text-kobbo-white"
                        : "bg-kobbo-yellow text-kobbo-black"
                    }`}
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={onLogout}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 active:bg-red-200"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>

      {/* Desktop Vertical Sidebar Card (lg:) */}
      <aside className="hidden rounded-3xl bg-kobbo-white p-5 shadow-soft lg:block">
        <nav className="space-y-1" aria-label="Account navigation">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? activePath === href
              : activePath.startsWith(href);

            const isWishlist = href === "/account/wishlist";

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-kobbo-yellow/25 text-kobbo-black font-bold"
                    : "text-kobbo-muted hover:bg-kobbo-cream hover:text-kobbo-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </div>
                {isWishlist && wishlistCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-kobbo-yellow px-1 text-[10px] font-bold leading-none text-kobbo-black">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-kobbo-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
