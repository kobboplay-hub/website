"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { LifestyleCardProduct } from "@/lib/storefront/lifestyle-card";
import LifestyleProductCard from "./LifestyleProductCard";

const PAGE_SIZE = 12;

interface Chip {
  slug: string;
  name: string;
  count: number;
}

export default function LifestyleProductGrid({ products }: { products: LifestyleCardProduct[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState({ category: "", count: PAGE_SIZE });

  const chips = useMemo<Chip[]>(() => {
    const map = new Map<string, Chip>();
    for (const product of products) {
      if (!product.category || !product.categorySlug) continue;
      const chip = map.get(product.categorySlug);
      if (chip) chip.count += 1;
      else map.set(product.categorySlug, { slug: product.categorySlug, name: product.category, count: 1 });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [products]);

  const requested = searchParams.get("category") ?? "";
  const activeCategory = chips.some((chip) => chip.slug === requested) ? requested : "";
  const filtered = activeCategory ? products.filter((product) => product.categorySlug === activeCategory) : products;
  // The page size resets whenever the category changes.
  const visibleCount = visible.category === activeCategory ? visible.count : PAGE_SIZE;
  const shown = filtered.slice(0, visibleCount);

  const selectCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}#all-products`, { scroll: false });
  };

  return (
    <div>
      {chips.length > 1 && (
        <div
          role="group"
          aria-label="Filter by category"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {[{ slug: "", name: "All", count: products.length }, ...chips].map((chip) => {
            const active = chip.slug === activeCategory;
            return (
              <button
                key={chip.slug || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => selectCategory(chip.slug)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink ${
                  active
                    ? "border-ls-ink bg-ls-ink text-ls-paper"
                    : "border-ls-line bg-transparent text-ls-ink-soft hover:border-ls-ink hover:text-ls-ink"
                }`}
              >
                {chip.name}
                <span className={`text-xs ${active ? "text-ls-paper/70" : "text-ls-muted"}`}>{chip.count}</span>
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-sm text-ls-muted" aria-live="polite">
        Showing {shown.length} of {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      {shown.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((product) => (
            <li key={product.id}>
              <LifestyleProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-[4px] border border-dashed border-ls-line px-6 py-16 text-center">
          <p className="font-ls-display text-lg font-semibold text-ls-ink">Nothing here yet</p>
          <p className="mt-2 text-sm text-ls-muted">Try another category or browse everything.</p>
          <button
            type="button"
            onClick={() => selectCategory("")}
            className="mt-6 inline-flex h-11 items-center rounded-[4px] border border-ls-ink px-6 text-sm font-medium text-ls-ink hover:bg-ls-ink hover:text-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
          >
            View all products
          </button>
        </div>
      )}

      {filtered.length > shown.length && (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible({ category: activeCategory, count: visibleCount + PAGE_SIZE })}
            className="inline-flex h-12 items-center rounded-[4px] border border-ls-ink px-8 text-sm font-medium text-ls-ink transition-colors hover:bg-ls-ink hover:text-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
