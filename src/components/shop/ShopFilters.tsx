"use client";

import { useCallback, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { ShopSortOption } from "@/lib/shopify";

const sortOptions: { value: ShopSortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alpha", label: "A-Z" },
];

interface ShopFiltersProps {
  searchQuery: string;
  sort: ShopSortOption;
}

export default function ShopFilters({ searchQuery, sort }: ShopFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const buildUrl = useCallback(
    (q: string, s: ShopSortOption) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (s !== "featured") params.set("sort", s);
      const qs = params.toString();
      return qs ? `/shop?${qs}` : "/shop";
    },
    [],
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        router.push(buildUrl(q, sort));
      });
    }, 450);
  }

  function clearSearch() {
    if (inputRef.current) inputRef.current.value = "";
    startTransition(() => {
      router.push(buildUrl("", sort));
    });
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const s = e.target.value as ShopSortOption;
    const q = inputRef.current?.value ?? searchQuery;
    startTransition(() => {
      router.push(buildUrl(q, s));
    });
  }

  return (
    <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Search input */}
      <div className="relative w-full sm:max-w-md sm:flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kobbo-muted" />
        <input
          ref={inputRef}
          type="search"
          defaultValue={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search all products..."
          className="min-h-11 w-full rounded-full border-2 border-transparent bg-kobbo-white py-2.5 pl-11 pr-10 text-sm text-kobbo-black placeholder:text-kobbo-muted/60 shadow-soft outline-none transition-colors focus:border-kobbo-yellow"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-kobbo-muted hover:text-kobbo-black"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {isPending && (
          <span className="absolute right-10 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-kobbo-yellow border-t-transparent" />
        )}
      </div>

      {/* Sort select */}
      <select
        value={sort}
        onChange={handleSortChange}
        aria-label="Sort products"
        className="min-h-11 w-full rounded-full border-2 border-transparent bg-kobbo-white px-4 py-2.5 text-sm font-medium text-kobbo-black shadow-soft outline-none transition-colors focus:border-kobbo-yellow sm:min-w-[180px] sm:w-auto"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
