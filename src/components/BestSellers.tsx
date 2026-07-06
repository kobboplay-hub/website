import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { JudgeMeProductSummary } from "@/lib/judgeme";
import { parseShopifyProductId } from "@/lib/judgeme";

interface BestSellersProps {
  products: Product[];
  reviewSummaries?: Record<string, JudgeMeProductSummary>;
}

export default function BestSellers({
  products,
  reviewSummaries = {},
}: BestSellersProps) {
  return (
    <section id="shop" className="bg-kobbo-cream py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
              Best Sellers
            </h2>
            <p className="mt-1 text-sm text-kobbo-muted">
              Our most-loved toys, chosen by kids and parents.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-kobbo-white p-8 text-center shadow-soft">
            <p className="text-sm text-kobbo-muted">
              Products are currently unavailable. Please check your Shopify
              connection.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
              {products.slice(0, 5).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  reviewSummary={
                    reviewSummaries[parseShopifyProductId(product.id)] ?? null
                  }
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                href="/shop"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-kobbo-black/10 bg-kobbo-white px-8 py-3 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:border-kobbo-yellow hover:shadow-soft-lg sm:w-auto"
              >
                View All Products
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
