import type { Metadata } from "next";
import SiteLayout from "@/components/SiteLayout";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopInfiniteGrid from "@/components/shop/ShopInfiniteGrid";
import ShopError from "@/components/shop/ShopError";
import EmptyState from "@/components/ui/EmptyState";
import {
  getShopProductsByCursor,
  parseShopSort,
  SHOP_PRODUCTS_PER_PAGE,
} from "@/lib/shopify";
import { shopMetadata } from "@/data/seo";
import { emptyStates } from "@/data/empty-states";

export const metadata: Metadata = shopMetadata;

export const revalidate = 0;

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q, sort: sortParam } = await searchParams;
  const searchQuery = (q ?? "").trim();
  const sort = parseShopSort(sortParam);

  let result;
  let hasError = false;

  try {
    result = await getShopProductsByCursor(
      SHOP_PRODUCTS_PER_PAGE,
      searchQuery,
      sort,
      null,
    );

  } catch (error) {
    console.error("Failed to fetch shop products:", error);
    hasError = true;
  }

  const products = result?.products ?? [];
  const hasNextPage = result?.hasNextPage ?? false;
  const endCursor = result?.endCursor ?? null;

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="pb-6 pt-4 sm:pb-8 sm:pt-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ShopHeader searchQuery={searchQuery} />

          <ShopFilters searchQuery={searchQuery} sort={sort} />

          {hasError ? (
            <ShopError />
          ) : products.length === 0 ? (
            <div className="mt-5 sm:mt-6">
              <EmptyState
                title={searchQuery ? "No products found" : emptyStates.shop.title}
                description={
                  searchQuery
                    ? `No toys matched "${searchQuery}". Try a different search.`
                    : emptyStates.shop.description
                }
              />
            </div>
          ) : (
            <div className="mt-5 sm:mt-6">
              <ShopInfiniteGrid
                key={`${searchQuery}:${sort}`}
                initialProducts={products}
                initialCursor={endCursor}
                initialHasNextPage={hasNextPage}
                searchQuery={searchQuery}
                sort={sort}
              />
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
