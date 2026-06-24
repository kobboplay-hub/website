"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/shopify/types";

type SortOption = "featured" | "price-asc" | "price-desc" | "alpha";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alpha", label: "A-Z" },
];

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
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
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kobbo-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search toys..."
            className="w-full rounded-full border-2 border-transparent bg-kobbo-white py-2.5 pl-11 pr-4 text-sm text-kobbo-black placeholder:text-kobbo-muted/60 shadow-soft outline-none transition-colors focus:border-kobbo-yellow"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort products"
          className="rounded-full border-2 border-transparent bg-kobbo-white px-4 py-2.5 text-sm font-medium text-kobbo-black shadow-soft outline-none transition-colors focus:border-kobbo-yellow sm:min-w-[180px]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-12 rounded-3xl bg-kobbo-white px-6 py-16 text-center shadow-soft">
          <p className="font-heading text-xl font-bold text-kobbo-black">
            No toys found
          </p>
          <p className="mt-2 text-sm text-kobbo-muted">
            Try searching for something else.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
