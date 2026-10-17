"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { JudgeMeProductSummary } from "@/lib/judgeme";
import { parseShopifyProductId } from "@/lib/judgeme";

interface ProductGridProps {
  products: Product[];
  reviewSummaries?: Record<string, JudgeMeProductSummary>;
}

const EMPTY_SUMMARIES: Record<string, JudgeMeProductSummary> = {};

export default function ProductGrid({
  products,
  reviewSummaries = EMPTY_SUMMARIES,
}: ProductGridProps) {
  const [loadedSummaries, setLoadedSummaries] = useState<Record<string, JudgeMeProductSummary>>({});
  const pendingIds = useRef(new Set<string>());

  useEffect(() => {
    const missingIds = products
      .map((product) => parseShopifyProductId(product.id))
      .filter((id) => id && !reviewSummaries[id] && !loadedSummaries[id] && !pendingIds.current.has(id));
    if (missingIds.length === 0) return;

    missingIds.forEach((id) => pendingIds.current.add(id));
    fetch("/api/reviews/summaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: missingIds }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const summaries = data?.summaries ?? {};
        setLoadedSummaries((current) => ({
          ...current,
          ...Object.fromEntries(missingIds.map((id) => [
            id,
            summaries[id] ?? { shopifyProductId: id, averageRating: 0, reviewCount: 0 },
          ])),
        }));
      })
      .catch(() => {
        setLoadedSummaries((current) => ({
          ...current,
          ...Object.fromEntries(missingIds.map((id) => [
            id,
            { shopifyProductId: id, averageRating: 0, reviewCount: 0 },
          ])),
        }));
      })
      .finally(() => missingIds.forEach((id) => pendingIds.current.delete(id)));
  }, [products, reviewSummaries, loadedSummaries]);

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          reviewSummary={reviewSummaries[parseShopifyProductId(product.id)] ?? loadedSummaries[parseShopifyProductId(product.id)] ?? null}
          deferRating
          badge={product.merchandising.featured ? "Featured" : undefined}
        />
      ))}
    </div>
  );
}
