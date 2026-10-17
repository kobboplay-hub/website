"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import ProductGrid from "@/components/shop/ProductGrid";
import type { Product } from "@/lib/shopify/types";
import type { ShopSortOption } from "@/lib/shopify";

const PAGE_SIZE = 12;

interface ShopInfiniteGridProps {
  initialProducts: Product[];
  initialCursor: string | null;
  initialHasNextPage: boolean;
  searchQuery: string;
  sort: ShopSortOption;
}

export default function ShopInfiniteGrid({
  initialProducts,
  initialCursor,
  initialHasNextPage,
  searchQuery,
  sort,
}: ShopInfiniteGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const cursorRef = useRef(initialCursor);
  const hasNextRef = useRef(initialHasNextPage);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasNextRef.current || !cursorRef.current) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        first: String(PAGE_SIZE),
        cursor: cursorRef.current,
        sort,
      });
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const response = await fetch(`/api/shop/products?${params.toString()}`);
      const data = (await response.json()) as {
        products?: Product[];
        endCursor?: string | null;
        hasNextPage?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load more products.");
      }

      const nextProducts = data.products ?? [];
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        return [
          ...prev,
          ...nextProducts.filter((product) => !existingIds.has(product.id)),
        ];
      });

      const nextCursor = data.endCursor ?? null;
      const nextHasMore = Boolean(data.hasNextPage);
      cursorRef.current = nextCursor;
      hasNextRef.current = nextHasMore;
      setHasNextPage(nextHasMore);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load more products. Please try again.",
      );
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [searchQuery, sort]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "480px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, loadMore, products.length]);

  return (
    <div>
      <p className="mb-4 text-center text-xs font-medium text-kobbo-muted sm:mb-5 sm:text-sm">
        Showing {products.length}
        {hasNextPage ? "+" : ""} products
      </p>

      <ProductGrid products={products} />

      <div ref={sentinelRef} className="h-8 w-full" aria-hidden />

      <div className="mt-2 flex flex-col items-center gap-3 pb-2">
        {isLoading && (
          <div className="inline-flex items-center gap-2 text-sm text-kobbo-muted">
            <Loader2 className="h-4 w-4 animate-spin text-kobbo-yellow" />
            Loading more toys...
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadMore()}
              className="rounded-full bg-kobbo-yellow px-5 py-2 text-sm font-bold text-kobbo-black shadow-soft"
            >
              Try again
            </button>
          </div>
        )}

        {hasNextPage && !isLoading && !error && (
          <button
            type="button"
            onClick={() => void loadMore()}
            className="rounded-full border-2 border-kobbo-beige bg-kobbo-white px-5 py-2 text-sm font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow hover:bg-kobbo-yellow/10"
          >
            Load more products
          </button>
        )}

        {!hasNextPage && products.length > 0 && !isLoading && (
          <p className="text-xs text-kobbo-muted sm:text-sm">
            You&apos;ve seen all products
          </p>
        )}
      </div>
    </div>
  );
}
