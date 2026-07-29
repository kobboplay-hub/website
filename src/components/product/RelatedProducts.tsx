import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { JudgeMeProductSummary } from "@/lib/judgeme";
import { parseShopifyProductId } from "@/lib/judgeme";

interface RelatedProductsProps {
  products: Product[];
  reviewSummaries?: Record<string, JudgeMeProductSummary>;
}

export default function RelatedProducts({
  products,
  reviewSummaries = {},
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-kobbo-cream py-5 sm:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
          You May Also Like
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              reviewSummary={
                reviewSummaries[parseShopifyProductId(product.id)] ?? null
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
