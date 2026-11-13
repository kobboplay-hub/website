"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import {
  STOREFRONT_COOKIE,
  isLifestylePath,
  parseStorefront,
  type Storefront,
} from "@/lib/storefront/product-routing";

const StorefrontContext = createContext<Storefront | null>(null);

export function StorefrontProvider({ storefront, children }: { storefront: Storefront; children: ReactNode }) {
  return <StorefrontContext.Provider value={storefront}>{children}</StorefrontContext.Provider>;
}

function readStorefrontCookie(): Storefront | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${STOREFRONT_COOKIE}=([^;]*)`));
  return match ? parseStorefront(decodeURIComponent(match[1])) : null;
}

const subscribeToNothing = () => () => {};

/**
 * The storefront the visitor is shopping in: an explicit provider wins, then the URL,
 * then the cookie left by the last storefront page (for shared pages like the cart drawer).
 */
export function useStorefront(): Storefront {
  const provided = useContext(StorefrontContext);
  const pathname = usePathname();
  const fromCookie = useSyncExternalStore(subscribeToNothing, readStorefrontCookie, () => null);

  if (provided) return provided;
  if (isLifestylePath(pathname)) return "lifestyle";
  return fromCookie ?? "toys";
}

/** Records the storefront being browsed so shared pages can render the matching header and footer. */
export function StorefrontMarker({ storefront }: { storefront: Storefront }) {
  useEffect(() => {
    document.cookie = `${STOREFRONT_COOKIE}=${storefront}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  }, [storefront]);
  return null;
}
