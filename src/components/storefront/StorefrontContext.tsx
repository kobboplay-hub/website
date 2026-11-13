"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import {
  STOREFRONT_COOKIE,
  getStorefrontPath,
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

const STOREFRONT_EVENT = "kobbo:storefront";

/** Re-reads the cookie when a storefront page marks itself, e.g. the cart drawer on checkout pages. */
function subscribeToStorefront(onChange: () => void) {
  window.addEventListener(STOREFRONT_EVENT, onChange);
  return () => window.removeEventListener(STOREFRONT_EVENT, onChange);
}

/**
 * The storefront the visitor is shopping in: an explicit provider wins, then the URL,
 * then the cookie left by the last storefront page (for shared pages like the cart drawer).
 */
export function useStorefront(): Storefront {
  const provided = useContext(StorefrontContext);
  const pathname = usePathname();
  const fromCookie = useSyncExternalStore(subscribeToStorefront, readStorefrontCookie, () => null);

  if (provided) return provided;
  if (isLifestylePath(pathname)) return "lifestyle";
  return fromCookie ?? "toys";
}

/** Maps a shared login/account path (e.g. `/account/orders`) into the current storefront. */
export function useStorefrontPath(): (path: string) => string {
  const storefront = useStorefront();
  return useCallback((path: string) => getStorefrontPath(storefront, path), [storefront]);
}

/** Records the storefront being browsed so shared pages can render the matching header and footer. */
export function StorefrontMarker({ storefront }: { storefront: Storefront }) {
  useEffect(() => {
    document.cookie = `${STOREFRONT_COOKIE}=${storefront}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    window.dispatchEvent(new Event(STOREFRONT_EVENT));
  }, [storefront]);
  return null;
}
