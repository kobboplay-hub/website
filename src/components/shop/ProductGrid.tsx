"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { JudgeMeProductSummary } from "@/lib/judgeme";
import { parseShopifyProductId } from "@/lib/judgeme";

type SortOption = "featured" | "price-asc" | "price-desc" | "alpha";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alpha", label: "A-Z" },
];

interface ProductGridProps {
  products: Product[];
  reviewSummaries?: Record<string, JudgeMeProductSummary>;
}

export default function ProductGrid({
  products,
  reviewSummaries = {},
}: ProductGridProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = query
      ? products.filter((p) => p.title.toLowerCase().includes(query))
      : [...products];

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "alpha":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, search, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md sm:flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kobbo-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search on this page..."
            className="min-h-11 w-full rounded-full border-2 border-transparent bg-kobbo-white py-2.5 pl-11 pr-4 text-sm text-kobbo-black placeholder:text-kobbo-muted/60 shadow-soft outline-none transition-colors focus:border-kobbo-yellow"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort products"
          className="min-h-11 w-full rounded-full border-2 border-transparent bg-kobbo-white px-4 py-2.5 text-sm font-medium text-kobbo-black shadow-soft outline-none transition-colors focus:border-kobbo-yellow sm:min-w-[180px] sm:w-auto"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-kobbo-white px-5 py-12 text-center shadow-soft sm:mt-12 sm:rounded-3xl sm:px-6 sm:py-16">
          <p className="font-heading text-lg font-bold text-kobbo-black sm:text-xl">
            No toys found
          </p>
          <p className="mt-2 text-sm text-kobbo-muted">
            Try searching for something else on this page.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              reviewSummary={
                reviewSummaries[parseShopifyProductId(product.id)] ?? null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
