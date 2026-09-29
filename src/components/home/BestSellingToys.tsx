import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { JudgeMeProductSummary } from "@/lib/judgeme";
import { parseShopifyProductId } from "@/lib/judgeme";

const MAX_PRODUCTS = 10;
const CARD_IMAGE_SIZES =
  "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw";

interface BestSellingToysProps {
  products: Product[];
  reviewSummaries?: Record<string, JudgeMeProductSummary>;
}

export default function BestSellingToys({
  products,
  reviewSummaries = {},
}: BestSellingToysProps) {
  if (products.length === 0) return null;

  return (
    <section
      aria-labelledby="best-selling-heading"
      className="border-t border-kobbo-beige bg-kobbo-cream py-10 sm:py-14 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:items-end sm:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-kobbo-yellow/50 bg-kobbo-yellow/25 px-3 py-0.5 text-xs font-bold text-kobbo-black">
              <Trophy className="h-3.5 w-3.5 text-kobbo-black" />
              Parents&apos; Favourites
            </div>
            <h2
              id="best-selling-heading"
              className="font-heading mt-2 text-2xl font-extrabold text-kobbo-black sm:text-3xl lg:text-4xl"
            >
              Best-Selling Toys
            </h2>
            <p className="mt-1 text-sm text-kobbo-muted sm:text-base">
              The toys Kobbo parents pick again and again.
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-1.5 font-heading text-sm font-extrabold text-kobbo-black transition-colors hover:text-kobbo-black/70 sm:inline-flex"
          >
            <span>Explore All Toys</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.slice(0, MAX_PRODUCTS).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              reviewSummary={
                reviewSummaries[parseShopifyProductId(product.id)] ?? null
              }
              badge="Best Seller"
              imageSizes={CARD_IMAGE_SIZES}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border-2 border-kobbo-beige bg-kobbo-white px-6 py-2.5 font-heading text-sm font-bold text-kobbo-black shadow-soft transition-colors hover:border-kobbo-yellow hover:bg-kobbo-cream"
          >
            <span>Explore All Toys</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
