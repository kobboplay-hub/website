"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  User,
  Home,
  Store,
  Info,
  Star,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import AccountMenu from "@/components/account/AccountMenu";
import SearchOverlay from "@/components/search/SearchOverlay";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop Toys", href: "/shop", icon: Store },
  { label: "About Us", href: "/#about", icon: Info },
  { label: "Reviews", href: "/#reviews", icon: Star },
];

function MobileMenuRow({
  icon: Icon,
  label,
  onClick,
  href,
  iconVariant = "cream",
  badge,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
  iconVariant?: "cream" | "yellow";
  badge?: number;
}) {
  const iconBg =
    iconVariant === "yellow" ? "bg-kobbo-yellow/25" : "bg-kobbo-cream";

  const inner = (
    <>
      <span
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon className="h-[18px] w-[18px] text-kobbo-black" strokeWidth={2} />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-kobbo-yellow px-0.5 text-[9px] font-bold leading-none text-kobbo-black">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1 text-sm font-semibold leading-tight text-kobbo-black">
        {label}
      </span>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-kobbo-muted/80"
        strokeWidth={2}
      />
    </>
  );

  const className =
    "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-kobbo-cream/80 active:bg-kobbo-beige";

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

export default function Header({ immersive = false }: { immersive?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const { isLoggedIn } = useAuth();

  const accountHref = isLoggedIn ? "/account" : "/login";
  const wishlistHref = isLoggedIn ? "/account/wishlist" : "/login";

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!immersive) return;

    const hero = document.getElementById("hero");
    if (!hero) {
      const onScroll = () => setScrolled(window.scrollY > 80);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    // Sticky solid header once the hero leaves the top of the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [immersive]);

  const solidNav = !immersive || scrolled || mobileOpen;
  const stickySolid = immersive && scrolled;

  const iconBtn = solidNav
    ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-kobbo-black transition-colors hover:bg-kobbo-cream active:bg-kobbo-beige"
    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-kobbo-black transition-colors hover:bg-white/50 active:bg-white/70";

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu backdrop"
          className="fixed inset-0 z-40 bg-kobbo-black/20 backdrop-blur-[1px] lg:hidden"
          onClick={closeMobile}
        />
      )}

      <header
        className={`z-50 transition-all duration-300 ${
          immersive
            ? stickySolid
              ? "fixed inset-x-0 top-0"
              : "absolute inset-x-0 top-0"
            : "sticky top-0"
        } ${
          solidNav
            ? `border-b border-kobbo-beige bg-kobbo-white ${
                mobileOpen || stickySolid
                  ? "shadow-soft-lg"
                  : "shadow-soft"
              }`
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top bar — logo & icons perfectly center-aligned */}
          <div className="flex h-14 items-center justify-between gap-3 lg:h-16">
            <Link
              href="/"
              onClick={closeMobile}
              className="flex h-10 items-center font-heading text-[1.85rem] font-extrabold lowercase leading-none tracking-tight text-kobbo-yellow sm:text-[2rem] lg:text-[2.5rem] xl:text-[2.65rem]"
            >
              kobbo
            </Link>

            <nav
              className="hidden items-center gap-8 lg:flex"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors hover:text-kobbo-black/70 ${
                      isActive
                        ? "font-semibold text-kobbo-black after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-kobbo-yellow"
                        : "text-kobbo-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex h-10 items-center gap-0.5 sm:gap-1">
              {!mobileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Search toys"
                    onClick={() => setSearchOpen(true)}
                    className={iconBtn}
                  >
                    <Search className="h-5 w-5" strokeWidth={2} />
                  </button>
                  <div className="hidden sm:block">
                    <AccountMenu />
                  </div>
                  <Link
                    href={wishlistHref}
                    aria-label="Wishlist"
                    className={iconBtn}
                  >
                    <Heart className="h-5 w-5" strokeWidth={2} />
                  </Link>
                  <button
                    type="button"
                    aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
                    onClick={openCart}
                    className={`relative ${iconBtn}`}
                  >
                    <ShoppingCart className="h-5 w-5" strokeWidth={2} />
                    {cartCount > 0 && (
                      <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] translate-x-0.5 -translate-y-0.5 items-center justify-center rounded-full bg-kobbo-yellow px-1 text-[10px] font-bold leading-none text-kobbo-black">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className={`${iconBtn} lg:hidden`}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" strokeWidth={2} />
                ) : (
                  <Menu className="h-5 w-5" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu — attached to header, no overlap */}
          {mobileOpen && (
            <nav
              className="border-t border-kobbo-beige pb-4 pt-2 lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="space-y-0.5">
                {navLinks.map((link) => (
                  <MobileMenuRow
                    key={link.label}
                    icon={link.icon}
                    label={link.label}
                    href={link.href}
                    iconVariant="yellow"
                    onClick={closeMobile}
                  />
                ))}
              </div>

              <div className="my-2 border-t border-kobbo-beige" />

              <div className="space-y-0.5">
                <MobileMenuRow
                  icon={User}
                  label={isLoggedIn ? "My Account" : "Login"}
                  href={accountHref}
                  onClick={closeMobile}
                />
                <MobileMenuRow
                  icon={Heart}
                  label="Wishlist"
                  href={wishlistHref}
                  onClick={closeMobile}
                />
                <MobileMenuRow
                  icon={ShoppingCart}
                  label={
                    cartCount > 0
                      ? `Cart · ${cartCount} item${cartCount === 1 ? "" : "s"}`
                      : "Cart"
                  }
                  badge={cartCount}
                  onClick={() => {
                    closeMobile();
                    openCart();
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  setSearchOpen(true);
                }}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-kobbo-beige bg-kobbo-cream text-sm font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow hover:bg-kobbo-yellow/10"
              >
                <Search className="h-4 w-4" strokeWidth={2} />
                Search toys
              </button>
            </nav>
          )}
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
