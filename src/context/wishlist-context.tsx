"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const WISHLIST_STORAGE_KEY = "kobbo-wishlist-handles";

export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: number;
  currencyCode: string;
  image: string | null;
  merchandiseId: string | null;
  availableForSale: boolean;
}

interface WishlistContextValue {
  handles: string[];
  count: number;
  isWishlisted: (handle: string) => boolean;
  toggleWishlist: (handle: string) => void;
  removeFromWishlist: (handle: string) => void;
  items: WishlistItem[];
  isLoading: boolean;
  refreshItems: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [handles, setHandles] = useState<string[]>([]);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          queueMicrotask(() => setHandles(parsed.filter((h) => typeof h === "string")));
        }
      } catch {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      }
    }
    queueMicrotask(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(handles));
  }, [handles, hydrated]);

  const refreshItems = useCallback(async () => {
    if (handles.length === 0) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handles }),
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.items ?? []);
      }
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [handles]);

  useEffect(() => {
    if (hydrated) {
      queueMicrotask(() => { void refreshItems(); });
    }
  }, [hydrated, refreshItems]);

  const isWishlisted = useCallback(
    (handle: string) => handles.includes(handle),
    [handles],
  );

  const toggleWishlist = useCallback((handle: string) => {
    setHandles((prev) =>
      prev.includes(handle)
        ? prev.filter((h) => h !== handle)
        : [...prev, handle],
    );
  }, []);

  const removeFromWishlist = useCallback((handle: string) => {
    setHandles((prev) => prev.filter((h) => h !== handle));
  }, []);

  const value = useMemo(
    () => ({
      handles,
      count: handles.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      items,
      isLoading,
      refreshItems,
    }),
    [
      handles,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      items,
      isLoading,
      refreshItems,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
