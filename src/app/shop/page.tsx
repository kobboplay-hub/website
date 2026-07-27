import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import Newsletter from "@/components/Newsletter";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopPagination from "@/components/shop/ShopPagination";
import ShopError from "@/components/shop/ShopError";
import EmptyState from "@/components/ui/EmptyState";
import { getProductsPage, SHOP_PRODUCTS_PER_PAGE } from "@/lib/shopify";
import { getProductReviewSummaries } from "@/lib/judgeme";
import { shopMetadata } from "@/data/seo";
import { emptyStates } from "@/data/empty-states";

export const metadata: Metadata = shopMetadata;

export const revalidate = 3600;

interface ShopPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  let productsPage;
  let hasError = false;
  let reviewSummaries = {};

  try {
    productsPage = await getProductsPage(currentPage, SHOP_PRODUCTS_PER_PAGE);

    if (productsPage.products.length > 0) {
      reviewSummaries = await getProductReviewSummaries(
        productsPage.products.map((product) => product.id),
      );
    }
  } catch (error) {
    console.error("Failed to fetch shop products:", error);
    hasError = true;
  }

  if (
    !hasError &&
    productsPage &&
    productsPage.products.length === 0 &&
    currentPage > 1
  ) {
    redirect("/shop");
  }

  const products = productsPage?.products ?? [];
  const page = productsPage?.page ?? currentPage;
  const hasNextPage = productsPage?.hasNextPage ?? false;
  const hasPreviousPage = productsPage?.hasPreviousPage ?? false;
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
          />

          {hasError ? (
            <ShopError />
          ) : products.length === 0 ? (
            <div className="mt-6 sm:mt-8">
              <EmptyState
                title={emptyStates.shop.title}
                description={emptyStates.shop.description}
              />
            </div>
          ) : (
            <div className="mt-6 sm:mt-8">
              <ProductGrid
                products={products}
                reviewSummaries={reviewSummaries}
              />
              <ShopPagination
                page={page}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
              />
            </div>
          )}
        </div>
      </section>
      <Newsletter />
    </SiteLayout>
  );
}
