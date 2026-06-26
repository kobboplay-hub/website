"use client";

import { useEffect, useState } from "react";
import ProductRatingBadge from "@/components/reviews/ProductRatingBadge";
import type { JudgeMeProductSummary } from "@/lib/judgeme";
import { parseShopifyProductId } from "@/lib/judgeme";

interface ProductCardRatingProps {
  productId: string;
  initialSummary?: JudgeMeProductSummary | null;
}

export default function ProductCardRating({
  productId,
  initialSummary,
}: ProductCardRatingProps) {
  const [summary, setSummary] = useState<JudgeMeProductSummary | null | undefined>(
    initialSummary,
  );

  useEffect(() => {
    if (initialSummary) return;

    const externalId = parseShopifyProductId(productId);

    fetch("/api/reviews/summaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: [externalId] }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.summaries?.[externalId]) {
          setSummary(data.summaries[externalId]);
        } else {
          setSummary(null);
        }
      })
      .catch(() => setSummary(null));
  }, [productId, initialSummary]);

  return (
    <ProductRatingBadge
      summary={summary ?? null}
      variant="card"
      className="mt-1.5 min-h-[22px]"
    />
  );
}
