"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Home,
  Store,
  Info,
  PhoneCall,
  ChevronRight,
  Package,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import AccountMenu from "@/components/account/AccountMenu";
import SearchOverlay from "@/components/search/SearchOverlay";
import {
  ShopByAgeAccordion,
  ShopByAgeDropdown,
} from "@/components/nav/ShopByAgeMenu";
import { SHOP_BY_AGE_PATH } from "@/lib/shop-by-age";
import { useAgeGroups } from "@/context/age-groups-context";

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Renders the dynamic Shopify age-group menu; `href` is the fallback link */
  ageMenu?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop by Age", href: "/shop", icon: Store, ageMenu: true },
  { label: "About Us", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: PhoneCall },
];

function isNavLinkActive(link: NavLink, pathname: string): boolean {
  if (link.href === "/") return pathname === "/";
  if (
    link.ageMenu &&
    (pathname === SHOP_BY_AGE_PATH || pathname.startsWith(`${SHOP_BY_AGE_PATH}/`))
  ) {
    return true;
  }
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

function MobileMenuRow({
  icon: Icon,
  label,
  onClick,
  href,
  iconVariant = "cream",
  badge,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
  iconVariant?: "cream" | "yellow";
  badge?: number;
  active?: boolean;
}) {
  const iconBg = active
    ? "bg-kobbo-yellow text-kobbo-black"
    : iconVariant === "yellow"
      ? "bg-kobbo-yellow/25 text-kobbo-black"
      : "bg-kobbo-cream text-kobbo-black";

  const inner = (
    <>
      <span
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${iconBg}`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-kobbo-yellow px-0.5 text-[9px] font-bold leading-none text-kobbo-black ring-1 ring-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span
        className={`min-w-0 flex-1 text-sm leading-tight transition-colors ${
          active
            ? "font-bold text-kobbo-black"
            : "font-semibold text-kobbo-black/90 hover:text-kobbo-black"
        }`}
      >
        {label}
      </span>
      <ChevronRight
        className={`h-4 w-4 shrink-0 transition-colors ${
          active ? "text-kobbo-black" : "text-kobbo-muted/70"
        }`}
        strokeWidth={2}
      />
    </>
  );

  const className = `flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors ${
    active
      ? "bg-kobbo-cream font-bold"
      : "hover:bg-kobbo-cream/80 active:bg-kobbo-beige"
  }`;

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
  const [mobileAgeOpen, setMobileAgeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const ageGroups = useAgeGroups();
  const hasAgeMenu = ageGroups.length > 0;

  const accountHref = isLoggedIn ? "/account" : "/login";

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileAgeOpen(false);
    document.body.style.overflow = "";
  };

  const handleNavClick = (href: string) => {
    closeMobile();
    if (href === "/" && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileAgeOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) closeMobile();
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


  const isFixed = mobileOpen || (immersive && scrolled);
  const solidNav = !immersive || scrolled || mobileOpen;

  const headerPositionClass = isFixed
    ? "fixed inset-x-0 top-0"
    : immersive
      ? "absolute inset-x-0 top-0"
      : "sticky top-0";

  const iconBtn = solidNav
    ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-kobbo-black transition-colors hover:bg-kobbo-cream active:bg-kobbo-beige"
    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-kobbo-black transition-colors hover:bg-white/50 active:bg-white/70";

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu backdrop"
          className="fixed inset-0 z-40 bg-kobbo-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={closeMobile}
        />
      )}

      <header
        className={`z-50 transition-all duration-300 ${headerPositionClass} ${
          solidNav
            ? `border-b border-kobbo-beige bg-kobbo-white ${
                mobileOpen || (immersive && scrolled)
                  ? "shadow-soft-lg"
                  : "shadow-soft"
              }`
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top bar — logo & icons center-aligned */}
          <div className="flex h-14 items-center justify-between gap-2 sm:gap-3 lg:h-16">
            <Link
              href="/"
              onClick={() => {
                closeMobile();
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex h-10 items-center font-heading text-[1.75rem] font-extrabold lowercase leading-none tracking-tight text-kobbo-yellow sm:text-[2rem] lg:text-[2.5rem] xl:text-[2.65rem]"
            >
              kobbo
            </Link>

            <nav
              className="hidden items-center gap-8 lg:flex"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(link, pathname);

                if (link.ageMenu && hasAgeMenu) {
                  return (
                    <ShopByAgeDropdown
                      key={link.label}
                      label={link.label}
                      ageGroups={ageGroups}
                      pathname={pathname}
                      active={isActive}
                    />
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === "/" && pathname === "/") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
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
              {/* Search button: always accessible on mobile and desktop */}
              <button
                type="button"
                aria-label="Search toys"
                onClick={() => {
                  closeMobile();
                  setSearchOpen(true);
                }}
                className={iconBtn}
              >
                <Search className="h-5 w-5" strokeWidth={2} />
              </button>

              {/* Account menu on tablet/desktop */}
              <div className="hidden sm:block">
                <AccountMenu />
              </div>

              {/* Shopping cart button: always accessible, with count badge */}
              <button
                type="button"
                aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
                onClick={() => {
                  closeMobile();
                  openCart();
                }}
                className={`relative ${iconBtn}`}
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] translate-x-0.5 -translate-y-0.5 items-center justify-center rounded-full bg-kobbo-yellow px-1 text-[10px] font-bold leading-none text-kobbo-black shadow-xs">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger / close toggle */}
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

          {/* Mobile menu drawer — attached to header, scrolls if viewport is short */}
          {mobileOpen && (
            <nav
              className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-t border-kobbo-beige px-1 pb-6 pt-3 lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="space-y-0.5">
                {navLinks.map((link) => {
                  const isActive = isNavLinkActive(link, pathname);

                  if (link.ageMenu && hasAgeMenu) {
                    return (
                      <ShopByAgeAccordion
                        key={link.label}
                        label={link.label}
                        icon={link.icon}
                        ageGroups={ageGroups}
                        pathname={pathname}
                        active={isActive}
                        expanded={mobileAgeOpen}
                        onToggle={() => setMobileAgeOpen((open) => !open)}
                        onNavigate={closeMobile}
                      />
                    );
                  }

                  return (
                    <MobileMenuRow
                      key={link.label}
                      icon={link.icon}
                      label={link.label}
                      href={link.href}
                      iconVariant="yellow"
                      active={isActive}
                      onClick={() => handleNavClick(link.href)}
                    />
                  );
                })}
              </div>

              <div className="my-2.5 border-t border-kobbo-beige/80" />

              <div className="space-y-0.5">
                {isLoggedIn ? (
                  <>
                    <MobileMenuRow
                      icon={User}
                      label="My Account"
                      href="/account"
                      active={pathname === "/account"}
                      onClick={closeMobile}
                    />
                    <MobileMenuRow
                      icon={Package}
                      label="My Orders"
                      href="/account/orders"
                      active={pathname === "/account/orders"}
                      onClick={closeMobile}
                    />
                  </>
                ) : (
                  <MobileMenuRow
                    icon={User}
                    label="Login / Sign In"
                    href="/login"
                    active={pathname === "/login"}
                    onClick={closeMobile}
                  />
                )}

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

                {isLoggedIn && (
                  <MobileMenuRow
                    icon={LogOut}
                    label="Logout"
                    onClick={async () => {
                      closeMobile();
                      await logout("/");
                    }}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  setSearchOpen(true);
                }}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-kobbo-beige bg-kobbo-cream text-sm font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow hover:bg-kobbo-yellow/10 active:bg-kobbo-yellow/20"
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
