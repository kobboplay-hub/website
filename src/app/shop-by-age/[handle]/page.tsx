import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopError from "@/components/shop/ShopError";
import EmptyState from "@/components/ui/EmptyState";
import { ageGroupHref } from "@/lib/shop-by-age";
import {
  getAgeGroupByHandle,
  getProductsByAgeGroup,
  parseShopSort,
} from "@/lib/shopify";
import type { AgeGroup, Product } from "@/lib/shopify/types";
import { buildMetadata, buildPageTitle, ageGroupMetadata } from "@/data/seo";

export const revalidate = 60;

interface ShopByAgePageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({
  params,
}: ShopByAgePageProps): Promise<Metadata> {
  const { handle } = await params;
  const ageGroup = await getAgeGroupByHandle(handle).catch(() => null);

  if (!ageGroup) return buildMetadata(buildPageTitle("Shop by Age"));
  return ageGroupMetadata(ageGroup.name, ageGroupHref(ageGroup.handle));
}

export default async function ShopByAgePage({
  params,
  searchParams,
}: ShopByAgePageProps) {
  const [{ handle }, { sort: sortParam }] = await Promise.all([
    params,
    searchParams,
  ]);
  const sort = parseShopSort(sortParam);

  let ageGroup: AgeGroup | null = null;
  let products: Product[] = [];
  let hasError = false;

  try {
    ageGroup = await getAgeGroupByHandle(handle);
    if (ageGroup) {
      products = await getProductsByAgeGroup(ageGroup, sort);
    }
  } catch (error) {
    console.error("Failed to fetch Shop by Age products:", error);
    hasError = true;
  }

  if (!hasError && !ageGroup) notFound();

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="pb-6 pt-4 sm:pb-8 sm:pt-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ShopHeader
            eyebrow="Shop by Age"
            title={ageGroup?.name ?? "Shop by Age"}
            description={
              products.length > 0
                ? `${products.length} product${products.length === 1 ? "" : "s"}`
                : ""
            }
          />

          {hasError ? (
            <ShopError />
          ) : products.length === 0 ? (
            <div className="mt-5 sm:mt-6">
              <EmptyState
                title="Nothing here yet"
                description="No products are available for this age group yet."
                cta="Explore All Products"
                ctaHref="/shop"
              />
            </div>
          ) : (
            <>
              {products.length > 1 && ageGroup && (
                <ShopFilters
                  searchQuery=""
                  sort={sort}
                  basePath={ageGroupHref(ageGroup.handle)}
                  showSearch={false}
                />
              )}
              <div className="mt-5 sm:mt-6">
                <ProductGrid
                  products={products}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
