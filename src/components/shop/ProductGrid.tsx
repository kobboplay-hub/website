import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { JudgeMeProductSummary } from "@/lib/judgeme";
import { parseShopifyProductId } from "@/lib/judgeme";

interface ProductGridProps {
  products: Product[];
  reviewSummaries?: Record<string, JudgeMeProductSummary>;
}

export default function ProductGrid({
  products,
  reviewSummaries = {},
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          reviewSummary={reviewSummaries[parseShopifyProductId(product.id)] ?? null}
          badge={product.merchandising.featured ? "Featured" : undefined}
        />
      ))}
    </div>
  );
}
