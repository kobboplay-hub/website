"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import AccountMenu from "@/components/account/AccountMenu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/#about" },
  { label: "Contact Us", href: "/#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { isLoggedIn } = useAuth();

  const accountHref = isLoggedIn ? "/account" : "/login";
  const wishlistHref = isLoggedIn ? "/account/wishlist" : "/login";

  return (
    <header className="sticky top-0 z-50 bg-kobbo-white/95 shadow-soft backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between lg:h-16">
          <Link
            href="/"
            className="font-heading text-2xl font-extrabold tracking-tight text-kobbo-black"
          >
            Kobbo
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-kobbo-black transition-colors hover:text-kobbo-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search"
              className="rounded-full p-2 transition-colors hover:bg-kobbo-beige"
            >
              <Search className="h-5 w-5 text-kobbo-black" />
            </button>
            <AccountMenu />
            <Link
              href={wishlistHref}
              aria-label="Wishlist"
              className="hidden rounded-full p-2 transition-colors hover:bg-kobbo-beige sm:block"
            >
              <Heart className="h-5 w-5 text-kobbo-black" />
            </Link>
            <button
              type="button"
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              onClick={openCart}
              className="relative rounded-full p-2 transition-colors hover:bg-kobbo-beige"
            >
              <ShoppingCart className="h-5 w-5 text-kobbo-black" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-kobbo-yellow px-0.5 text-[9px] font-bold text-kobbo-black">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label="Toggle menu"
              className="rounded-full p-2 transition-colors hover:bg-kobbo-beige lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-kobbo-beige py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-kobbo-black transition-colors hover:bg-kobbo-beige"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={accountHref}
                className="rounded-xl px-3 py-2 text-sm font-medium text-kobbo-black transition-colors hover:bg-kobbo-beige"
                onClick={() => setMobileOpen(false)}
              >
                {isLoggedIn ? "My Account" : "Login"}
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    href="/account/orders"
                    className="rounded-xl px-3 py-2 text-sm font-medium text-kobbo-black transition-colors hover:bg-kobbo-beige"
                    onClick={() => setMobileOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="rounded-xl px-3 py-2 text-sm font-medium text-kobbo-black transition-colors hover:bg-kobbo-beige"
                    onClick={() => setMobileOpen(false)}
                  >
                    Wishlist
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
