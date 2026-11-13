"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import { LIFESTYLE_BASE_PATH, isLifestylePath } from "@/lib/storefront/product-routing";
import LifestyleSearch from "./LifestyleSearch";
import LifestyleWordmark from "./LifestyleWordmark";

const LOGIN_PATH = `${LIFESTYLE_BASE_PATH}/login`;
const ACCOUNT_PATH = `${LIFESTYLE_BASE_PATH}/account`;
const WISHLIST_PATH = `${LIFESTYLE_BASE_PATH}/account/wishlist`;
/** Signing in from these pages should land on the account, not loop back to the form. */
const AUTH_PATHS = new Set(["/login", "/register", "/forgot-password"].map((path) => `${LIFESTYLE_BASE_PATH}${path}`));

export interface LifestyleNavCategory {
  name: string;
  slug: string;
}

const iconButton =
  "relative flex size-10 items-center justify-center rounded-full text-ls-ink transition-colors hover:bg-ls-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink";

function CountBadge({ count, label }: { count: number; label: string }) {
  if (count <= 0) return null;
  return (
    <span
      aria-label={label}
      className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ls-ink px-1 text-[10px] font-semibold leading-none text-ls-paper"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function LifestyleHeader({ categories = [] }: { categories?: LifestyleNavCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isLoggedIn } = useAuth();
  const returnTo = isLifestylePath(pathname) && !AUTH_PATHS.has(pathname) ? pathname : null;
  const accountHref = isLoggedIn
    ? ACCOUNT_PATH
    : returnTo
      ? `${LOGIN_PATH}?redirect=${encodeURIComponent(returnTo)}`
      : LOGIN_PATH;

  const navLinks = [
    { label: "Home", href: LIFESTYLE_BASE_PATH },
    { label: "Shop All", href: `${LIFESTYLE_BASE_PATH}#all-products` },
    ...categories.slice(0, 3).map((category) => ({
      label: category.name,
      href: `${LIFESTYLE_BASE_PATH}?category=${category.slug}#all-products`,
    })),
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ls-line bg-ls-ivory/90 backdrop-blur-md supports-[backdrop-filter]:bg-ls-ivory/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
          <div className="flex items-center gap-1 lg:gap-0">
            <button
              type="button"
              className={`${iconButton} -ml-2 lg:hidden`}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="lifestyle-mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" strokeWidth={1.6} aria-hidden />
            </button>
            <LifestyleWordmark />
          </div>

          <nav aria-label="Lifestyle" className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const active = link.href === LIFESTYLE_BASE_PATH && pathname === LIFESTYLE_BASE_PATH;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="relative py-2 text-sm font-medium text-ls-ink-soft transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-ls-ink after:transition-transform hover:text-ls-ink hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ls-ink aria-[current=page]:text-ls-ink aria-[current=page]:after:scale-x-100"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="-mr-2 flex items-center gap-0.5">
            <button type="button" className={iconButton} aria-label="Search Lifestyle products" onClick={() => setSearchOpen(true)}>
              <Search className="size-5" strokeWidth={1.6} aria-hidden />
            </button>
            <Link href={accountHref} className={`${iconButton} hidden sm:flex`} aria-label={isLoggedIn ? "Your account" : "Sign in"}>
              <User className="size-5" strokeWidth={1.6} aria-hidden />
            </Link>
            <Link href={WISHLIST_PATH} className={`${iconButton} hidden sm:flex`} aria-label="Wishlist">
              <Heart className="size-5" strokeWidth={1.6} aria-hidden />
              <CountBadge count={wishlistCount} label={`${wishlistCount} saved items`} />
            </Link>
            <button
              type="button"
              className={iconButton}
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              onClick={openCart}
            >
              <ShoppingBag className="size-5" strokeWidth={1.6} aria-hidden />
              <CountBadge count={cartCount} label={`${cartCount} items in cart`} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-ls-ink/30 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden
      />
      <aside
        id="lifestyle-mobile-menu"
        aria-label="Lifestyle menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed inset-y-0 left-0 z-[61] flex w-[86%] max-w-sm flex-col bg-ls-ivory shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-ls-line px-4">
          <LifestyleWordmark onClick={closeMenu} />
          <button type="button" className={iconButton} aria-label="Close menu" onClick={closeMenu}>
            <X className="size-5" strokeWidth={1.6} aria-hidden />
          </button>
        </div>
        <nav aria-label="Lifestyle mobile" className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-3 font-ls-display text-lg font-semibold text-ls-ink transition-colors hover:bg-ls-sand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-ls-line pt-6">
            <ul className="space-y-1 text-sm">
              <li>
                <Link href={accountHref} onClick={closeMenu} className="flex items-center gap-3 rounded-lg px-3 py-3 text-ls-ink-soft hover:bg-ls-sand">
                  <User className="size-[18px]" strokeWidth={1.6} aria-hidden /> {isLoggedIn ? "Account" : "Sign in"}
                </Link>
              </li>
              <li>
                <Link href={WISHLIST_PATH} onClick={closeMenu} className="flex items-center gap-3 rounded-lg px-3 py-3 text-ls-ink-soft hover:bg-ls-sand">
                  <Heart className="size-[18px]" strokeWidth={1.6} aria-hidden /> Wishlist
                  {wishlistCount > 0 && <span className="ml-auto text-xs text-ls-muted">{wishlistCount}</span>}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <LifestyleSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
