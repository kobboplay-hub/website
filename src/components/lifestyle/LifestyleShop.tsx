"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

import { lifestyleShop } from "@/data/lifestyle";
import type { ShopifyImage } from "@/lib/shopify/types";
import type { LifestyleCardProduct } from "@/lib/storefront/lifestyle-card";
import LifestyleProductCard, { type LifestyleCardRating } from "./LifestyleProductCard";

const PAGE_SIZE = 12;
const LISTING_ID = "all-products";
const CATEGORY_EVENT = "lifestyle:category";

export interface LifestyleShopCategory {
  name: string;
  slug: string;
  count: number;
  image: ShopifyImage | null;
}

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

interface LifestyleShopProps {
  products: LifestyleCardProduct[];
  categories: LifestyleShopCategory[];
  /** Judge.me summaries for the first page, keyed by numeric Shopify product ID */
  initialRatings: Record<string, LifestyleCardRating>;
  failed?: boolean;
}

/* The URL is the single source of truth for the category, so links from the header,
   footer and product pages filter this grid without separate category pages. */
function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CATEGORY_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CATEGORY_EVENT, onChange);
  };
}
const readCategory = () => new URLSearchParams(window.location.search).get("category") ?? "";
const readServerCategory = () => "";

/** Re-reads the URL after Next.js client navigations (e.g. a header category link). */
function SearchParamsSync() {
  const searchParams = useSearchParams();
  useEffect(() => {
    window.dispatchEvent(new Event(CATEGORY_EVENT));
  }, [searchParams]);
  return null;
}

function productNumericId(id: string): string {
  return id.split("/").pop() ?? id;
}

function sortProducts(products: LifestyleCardProduct[], sort: SortKey): LifestyleCardProduct[] {
  if (sort === "featured") return products;
  const sorted = [...products];
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  if (sort === "newest") sorted.sort((a, b) => Date.parse(b.publishedAt ?? "") - Date.parse(a.publishedAt ?? ""));
  return sorted;
}

/** Desktop tiles share the row between 4 and 5 columns so a short category list never looks stranded. */
const desktopTileWidth: Record<number, string> = {
  4: "lg:w-[calc((100%-4.5rem)/4)]",
  5: "lg:w-[calc((100%-6rem)/5)]",
};
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ls-ink";

export default function LifestyleShop({ products, categories, initialRatings, failed = false }: LifestyleShopProps) {
  const urlCategory = useSyncExternalStore(subscribe, readCategory, readServerCategory);
  const [sort, setSort] = useState<SortKey>("featured");
  const [visible, setVisible] = useState({ key: "", count: PAGE_SIZE });
  const [ratings, setRatings] = useState<Record<string, LifestyleCardRating>>(initialRatings);
  const requested = useRef(new Set(Object.keys(initialRatings)));
  const railRef = useRef<HTMLUListElement>(null);
  const [rail, setRail] = useState({ prev: false, next: false });

  const updateRail = useCallback(() => {
    const element = railRef.current;
    if (!element) return;
    const prev = element.scrollLeft > 4;
    const next = element.scrollLeft + element.clientWidth < element.scrollWidth - 4;
    setRail((current) => (current.prev === prev && current.next === next ? current : { prev, next }));
  }, []);

  const scrollRail = (direction: "prev" | "next") => {
    const element = railRef.current;
    if (!element) return;
    element.scrollBy({ left: (direction === "next" ? 1 : -1) * element.clientWidth * 0.8 });
  };

  useEffect(() => {
    const element = railRef.current;
    if (!element) return;
    const observer = new ResizeObserver(updateRail);
    observer.observe(element);
    return () => observer.disconnect();
  }, [updateRail]);

  const activeCategory = categories.some((category) => category.slug === urlCategory) ? urlCategory : "";
  const canSortByNewest = products.length > 1 && products.every((product) => product.publishedAt);

  const filtered = useMemo(() => {
    const inCategory = activeCategory ? products.filter((product) => product.categorySlug === activeCategory) : products;
    return sortProducts(inCategory, sort);
  }, [products, activeCategory, sort]);

  // Paging restarts whenever the category or sort order changes.
  const viewKey = `${activeCategory}|${sort}`;
  const visibleCount = visible.key === viewKey ? visible.count : PAGE_SIZE;
  const shown = filtered.slice(0, visibleCount);
  const shownIds = shown.map((product) => productNumericId(product.id)).join(",");

  useEffect(() => {
    const missing = shownIds.split(",").filter((id) => id && !requested.current.has(id));
    if (missing.length === 0) return;
    missing.forEach((id) => requested.current.add(id));
    fetch("/api/reviews/summaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: missing }),
    })
      .then((response) => (response.ok ? response.json() : { summaries: {} }))
      .then((data: { summaries?: Record<string, LifestyleCardRating> }) => {
        if (data.summaries) setRatings((current) => ({ ...current, ...data.summaries }));
      })
      .catch(() => missing.forEach((id) => requested.current.delete(id)));
  }, [shownIds]);

  const selectCategory = (slug: string, scrollToListing: boolean) => {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("category", slug);
    else url.searchParams.delete("category");
    url.hash = "";
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(CATEGORY_EVENT));
    if (scrollToListing) document.getElementById(LISTING_ID)?.scrollIntoView({ block: "start" });
  };

  const filterOptions = [{ slug: "", name: "All Products", count: products.length }, ...categories];
  const tileColumns = Math.min(Math.max(categories.length + 1, 4), 5);
  const tileWidth = `w-[44%] shrink-0 snap-start sm:w-[30%] ${desktopTileWidth[tileColumns]}`;
  const fewProducts = shown.length > 0 && shown.length < 4;

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsSync />
      </Suspense>

      {categories.length > 0 && (
        <section id="categories" aria-labelledby="lifestyle-categories" className="scroll-mt-24 pt-16 sm:pt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-ls-accent">{lifestyleShop.categories.eyebrow}</p>
                <h2 id="lifestyle-categories" className="mt-3 font-ls-display text-[1.75rem] font-bold leading-tight tracking-[-0.025em] text-ls-ink sm:text-[2.25rem]">
                  {lifestyleShop.categories.heading}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ls-muted">{lifestyleShop.categories.description}</p>
              </div>
              {(rail.prev || rail.next) && (
                <div className="hidden shrink-0 gap-2 lg:flex">
                  {(["prev", "next"] as const).map((direction) => (
                    <button
                      key={direction}
                      type="button"
                      onClick={() => scrollRail(direction)}
                      disabled={!rail[direction]}
                      aria-label={direction === "prev" ? "Previous categories" : "More categories"}
                      className="flex size-11 items-center justify-center rounded-full border border-ls-line text-ls-ink transition-colors hover:border-ls-ink disabled:cursor-default disabled:opacity-35 disabled:hover:border-ls-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
                    >
                      {direction === "prev" ? (
                        <ChevronLeft className="size-5" strokeWidth={1.6} aria-hidden />
                      ) : (
                        <ChevronRight className="size-5" strokeWidth={1.6} aria-hidden />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <ul
              ref={railRef}
              onScroll={updateRail}
              aria-label="Shop by category"
              className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
              <li className={tileWidth}>
                <button
                  type="button"
                  onClick={() => selectCategory("", true)}
                  aria-pressed={activeCategory === ""}
                  className={`group block w-full text-left ${focusRing}`}
                >
                  <span
                    className={`relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[6px] bg-ls-ink p-5 text-ls-paper transition-shadow sm:p-6 ${
                      activeCategory === "" ? "ring-2 ring-ls-accent ring-offset-2 ring-offset-ls-ivory" : ""
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ls-paper/60">Everything</span>
                    <span>
                      <span className="block font-ls-display text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-[1.75rem]">
                        Shop the full range
                      </span>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm text-ls-paper/80">
                        View all
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" strokeWidth={1.8} aria-hidden />
                      </span>
                    </span>
                  </span>
                  <span className="mt-3 block font-ls-display text-[15px] font-semibold leading-snug text-ls-ink underline-offset-4 group-hover:underline">
                    All Products
                  </span>
                  <span className="mt-0.5 block text-xs text-ls-muted">
                    {products.length} {products.length === 1 ? "product" : "products"}
                  </span>
                </button>
              </li>
              {categories.map((category) => {
                const active = category.slug === activeCategory;
                return (
                  <li key={category.slug} className={tileWidth}>
                    <button
                      type="button"
                      onClick={() => selectCategory(category.slug, true)}
                      aria-pressed={active}
                      className={`group block w-full text-left ${focusRing}`}
                    >
                      <span
                        className={`relative block aspect-[4/5] overflow-hidden rounded-[6px] bg-[#f1ece4] ${
                          active ? "ring-2 ring-ls-accent ring-offset-2 ring-offset-ls-ivory" : ""
                        }`}
                      >
                        {category.image ? (
                          <Image
                            src={category.image.url}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 20vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                        ) : (
                          <ImageOff className="absolute inset-0 m-auto size-6 text-ls-muted" strokeWidth={1.5} aria-hidden />
                        )}
                        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ls-ink/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </span>
                      <span className="mt-3 block font-ls-display text-[15px] font-semibold leading-snug text-ls-ink underline-offset-4 group-hover:underline">
                        {category.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-ls-muted">
                        {category.count} {category.count === 1 ? "product" : "products"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section id={LISTING_ID} aria-labelledby="lifestyle-listing" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-ls-accent">{lifestyleShop.listing.eyebrow}</p>
            <h2 id="lifestyle-listing" className="mt-3 font-ls-display text-[1.75rem] font-bold leading-tight tracking-[-0.025em] text-ls-ink sm:text-[2.25rem]">
              {lifestyleShop.listing.heading}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ls-muted">{lifestyleShop.listing.description}</p>
          </div>

          {failed ? (
            <div role="alert" className="mt-10 rounded-[6px] border border-ls-line bg-ls-paper px-6 py-16 text-center">
              <p className="font-ls-display text-lg font-semibold text-ls-ink">We couldn’t load the products</p>
              <p className="mt-2 text-sm text-ls-muted">Please refresh the page in a moment.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex h-11 items-center rounded-[4px] bg-ls-ink px-6 text-sm font-semibold text-ls-paper hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="mt-10 rounded-[6px] border border-ls-line bg-ls-paper px-6 py-20 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-ls-accent">Coming soon</p>
              <p className="mt-3 font-ls-display text-xl font-semibold text-ls-ink">New everyday essentials are on their way</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ls-muted">
                Our Lifestyle range will appear here as soon as it is available.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 flex flex-col gap-4 border-y border-ls-line py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                {categories.length > 0 ? (
                  <div
                    role="group"
                    aria-label="Filter by category"
                    className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:min-w-0 lg:flex-1 lg:px-0 lg:[mask-image:linear-gradient(to_right,#000_calc(100%-3rem),transparent)] [&::-webkit-scrollbar]:hidden"
                  >
                    {filterOptions.map((option) => {
                      const active = option.slug === activeCategory;
                      return (
                        <button
                          key={option.slug || "all"}
                          type="button"
                          aria-pressed={active}
                          onClick={() => selectCategory(option.slug, false)}
                          className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink ${
                            active
                              ? "border-ls-ink bg-ls-ink text-ls-paper"
                              : "border-ls-line bg-ls-paper/60 text-ls-ink-soft hover:border-ls-ink hover:text-ls-ink"
                          }`}
                        >
                          {option.name}
                          <span className={`tabular-nums ${active ? "text-ls-paper/65" : "text-ls-muted"}`}>{option.count}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span />
                )}

                <div className="flex shrink-0 items-center justify-between gap-4 lg:justify-end">
                  <p className="text-[13px] text-ls-muted" aria-live="polite">
                    {filtered.length} {filtered.length === 1 ? "product" : "products"}
                  </p>
                  {products.length > 1 && (
                    <label className="relative flex items-center gap-2 text-[13px] text-ls-muted">
                      Sort by
                      <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value as SortKey)}
                        className="h-9 cursor-pointer appearance-none rounded-full border border-ls-line bg-ls-paper/60 pl-4 pr-9 text-[13px] font-medium text-ls-ink transition-colors hover:border-ls-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        {canSortByNewest && <option value="newest">Newest</option>}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-ls-ink" strokeWidth={1.8} aria-hidden />
                    </label>
                  )}
                </div>
              </div>

              {shown.length > 0 ? (
                <ul
                  className={
                    fewProducts
                      ? "mt-10 flex flex-wrap justify-center gap-x-4 gap-y-12 sm:gap-x-6 [&>li]:w-[calc((100%-1rem)/2)] sm:[&>li]:w-[calc((100%-1.5rem)/2)] md:[&>li]:w-[calc((100%-3rem)/3)] xl:[&>li]:w-[calc((100%-4.5rem)/4)]"
                      : "mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4"
                  }
                >
                  {shown.map((product, index) => (
                    <li key={product.id}>
                      <LifestyleProductCard product={product} rating={ratings[productNumericId(product.id)] ?? null} eager={index < 4} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-10 rounded-[6px] border border-dashed border-ls-line px-6 py-16 text-center">
                  <p className="font-ls-display text-lg font-semibold text-ls-ink">Nothing here yet</p>
                  <p className="mt-2 text-sm text-ls-muted">Try another category or browse everything.</p>
                  <button
                    type="button"
                    onClick={() => selectCategory("", false)}
                    className="mt-6 inline-flex h-11 items-center rounded-[4px] border border-ls-ink px-6 text-sm font-semibold text-ls-ink hover:bg-ls-ink hover:text-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
                  >
                    View all products
                  </button>
                </div>
              )}

              {filtered.length > shown.length && (
                <div className="mt-16 flex flex-col items-center gap-4">
                  <p className="text-[13px] text-ls-muted">
                    Showing {shown.length} of {filtered.length} products
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisible({ key: viewKey, count: visibleCount + PAGE_SIZE })}
                    className="inline-flex h-12 items-center rounded-[4px] border border-ls-ink px-10 text-sm font-semibold text-ls-ink transition-colors hover:bg-ls-ink hover:text-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
