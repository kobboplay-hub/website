import type { Metadata } from "next";
import SiteLayout from "@/components/SiteLayout";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { searchProducts } from "@/lib/shopify";
import { searchMetadata } from "@/data/seo";
import { emptyStates, errorStates } from "@/data/empty-states";
import type { Product } from "@/lib/shopify/types";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = searchMetadata;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let products: Product[] = [];
  let hasError = false;

  if (query) {
    try {
      products = await searchProducts(query, 24);
    } catch (error) {
      console.error("Search page failed:", error);
      hasError = true;
    }
  }

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="py-5 sm:py-6 lg:py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
              Search Results
            </h1>
            {query ? (
              <p className="mt-1 text-sm text-kobbo-muted">
                Showing results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <p className="mt-1 text-sm text-kobbo-muted">
                Enter a search term to find toys.
              </p>
            )}
          </div>

          {!query && (
            <EmptyState
              title={emptyStates.searchPrompt.title}
              description={emptyStates.searchPrompt.description}
              cta={emptyStates.searchPrompt.cta}
              ctaHref={emptyStates.searchPrompt.ctaHref}
              icon={<Search className="h-10 w-10 text-kobbo-muted" />}
            />
          )}

          {hasError && (
            <ErrorState
              title={errorStates.search.title}
              description={errorStates.search.description}
              cta="Browse Shop"
              ctaHref="/shop"
            />
          )}

          {!hasError && query && products.length === 0 && (
            <EmptyState
              title={emptyStates.search.title}
              description={emptyStates.search.description}
              cta={emptyStates.search.cta}
              ctaHref={emptyStates.search.ctaHref}
            />
          )}

          {products.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
