import {
  getProductImageUrl,
  type Product,
} from "@/lib/shopify/types";

export const RECENTLY_VIEWED_KEY = "kobbo-recently-viewed";
export const RECENTLY_VIEWED_MAX_STORED = 12;
export const RECENTLY_VIEWED_MAX_DISPLAY = 8;

export interface RecentlyViewedItem {
  id: string;
  handle: string;
  title: string;
  price: number;
  currencyCode: string;
  imageUrl: string | null;
  viewedAt: number;
}

function isValidItem(value: unknown): value is RecentlyViewedItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<RecentlyViewedItem>;
  return (
    typeof item.id === "string" &&
    typeof item.handle === "string" &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    typeof item.currencyCode === "string"
  );
}

/** Migrate legacy handle-only arrays to empty (can't rebuild without product data). */
function parseStored(raw: string | null): RecentlyViewedItem[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Legacy format: string[] of handles
    if (parsed.every((entry) => typeof entry === "string")) {
      return [];
    }

    return parsed.filter(isValidItem);
  } catch {
    return [];
  }
}

export function productToRecentlyViewedItem(
  product: Product,
): RecentlyViewedItem {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: product.price,
    currencyCode: product.currencyCode,
    imageUrl: getProductImageUrl(product),
    viewedAt: Date.now(),
  };
}

export function readRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  return parseStored(localStorage.getItem(RECENTLY_VIEWED_KEY));
}

export function trackRecentlyViewed(product: Product): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];

  const current = productToRecentlyViewedItem(product);
  const previous = readRecentlyViewed().filter(
    (item) => item.handle !== current.handle,
  );
  const updated = [current, ...previous].slice(0, RECENTLY_VIEWED_MAX_STORED);

  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {
    // Quota / private mode — ignore
  }

  return updated;
}

export function getRecentlyViewedForDisplay(
  excludeHandle?: string,
  limit = RECENTLY_VIEWED_MAX_DISPLAY,
): RecentlyViewedItem[] {
  return readRecentlyViewed()
    .filter((item) => (excludeHandle ? item.handle !== excludeHandle : true))
    .slice(0, limit);
}
