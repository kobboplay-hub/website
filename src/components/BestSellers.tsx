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
    <section id="shop" className="bg-kobbo-cream py-4 sm:py-5 lg:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
            Best Sellers
          </h2>
          <p className="mt-1.5 text-sm text-kobbo-muted sm:mt-1">
            Our most-loved toys, chosen by kids and parents.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-kobbo-white p-6 text-center shadow-soft sm:mt-6 sm:p-8">
            <p className="text-sm text-kobbo-muted">
              Products are currently unavailable. Please check your Shopify
              connection.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-5">
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

            <div className="mt-4 flex justify-center sm:mt-5">
              <Link
                href="/shop"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-kobbo-black/10 bg-kobbo-white px-8 py-3 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:border-kobbo-yellow hover:shadow-soft-lg sm:w-auto"
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
