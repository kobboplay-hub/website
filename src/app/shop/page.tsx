import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import Newsletter from "@/components/Newsletter";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopPagination from "@/components/shop/ShopPagination";
import ShopError from "@/components/shop/ShopError";
import EmptyState from "@/components/ui/EmptyState";
import {
  getShopProductsPage,
  SHOP_PRODUCTS_PER_PAGE,
  type ShopSortOption,
} from "@/lib/shopify";
import { getProductReviewSummaries } from "@/lib/judgeme";
import { shopMetadata } from "@/data/seo";
import { emptyStates } from "@/data/empty-states";

export const metadata: Metadata = shopMetadata;

export const revalidate = 0;

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

const validSorts: ShopSortOption[] = ["featured", "price-asc", "price-desc", "alpha"];

function parseSort(raw: string | undefined): ShopSortOption {
  return validSorts.includes(raw as ShopSortOption)
    ? (raw as ShopSortOption)
    : "featured";
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { page: pageParam, q, sort: sortParam } = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const searchQuery = (q ?? "").trim();
  const sort = parseSort(sortParam);

  let result;
  let hasError = false;
  let reviewSummaries = {};

  try {
    result = await getShopProductsPage(
      currentPage,
      SHOP_PRODUCTS_PER_PAGE,
      searchQuery,
      sort,
    );

    if (result.products.length > 0) {
      reviewSummaries = await getProductReviewSummaries(
        result.products.map((p) => p.id),
      );
    }
  } catch (error) {
    console.error("Failed to fetch shop products:", error);
    hasError = true;
  }

  if (!hasError && result && result.products.length === 0 && currentPage > 1) {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (sort !== "featured") params.set("sort", sort);
    const qs = params.toString();
    redirect(qs ? `/shop?${qs}` : "/shop");
  }

  const products = result?.products ?? [];
  const page = result?.page ?? currentPage;
  const hasNextPage = result?.hasNextPage ?? false;
  const hasPreviousPage = result?.hasPreviousPage ?? false;
  const showingFrom = products.length > 0 ? (page - 1) * SHOP_PRODUCTS_PER_PAGE + 1 : 0;
  const showingTo = showingFrom > 0 ? showingFrom + products.length - 1 : 0;

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="pb-8 pt-6 sm:pb-10 sm:pt-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ShopHeader
            showingFrom={hasError ? undefined : showingFrom}
            showingTo={hasError ? undefined : showingTo}
            hasMore={hasError ? undefined : hasNextPage}
            searchQuery={searchQuery}
          />

          <ShopFilters searchQuery={searchQuery} sort={sort} />

          {hasError ? (
            <ShopError />
          ) : products.length === 0 ? (
            <div className="mt-6 sm:mt-8">
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
              <ProductGrid
                products={products}
                reviewSummaries={reviewSummaries}
              />
              <ShopPagination
                page={page}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                searchQuery={searchQuery}
                sort={sort}
              />
            </div>
          )}
        </div>
      </section>
      <Newsletter />
    </SiteLayout>
  );
}
