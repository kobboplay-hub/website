import type { Metadata } from "next";
import SiteLayout from "@/components/SiteLayout";
import Newsletter from "@/components/Newsletter";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopError from "@/components/shop/ShopError";
import EmptyState from "@/components/ui/EmptyState";
import { getProducts } from "@/lib/shopify";
import { getProductReviewSummaries } from "@/lib/judgeme";
import { shopMetadata } from "@/data/seo";
import { emptyStates } from "@/data/empty-states";
import type { Product } from "@/lib/shopify/types";

export const metadata: Metadata = shopMetadata;

export const revalidate = 3600;

export default async function ShopPage() {
  let products: Product[] = [];
  let hasError = false;

  let reviewSummaries = {};

  try {
    products = await getProducts(20);
    if (products.length > 0) {
      reviewSummaries = await getProductReviewSummaries(
        products.map((product) => product.id),
      );
    }
  } catch (error) {
    console.error("Failed to fetch shop products:", error);
    hasError = true;
  }

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ShopHeader productCount={hasError ? undefined : products.length} />

          {hasError ? (
            <ShopError />
          ) : products.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title={emptyStates.shop.title}
                description={emptyStates.shop.description}
              />
            </div>
          ) : (
            <div className="mt-8">
              <ProductGrid
                products={products}
                reviewSummaries={reviewSummaries}
              />
            </div>
          )}
        </div>
      </section>
      <Newsletter />
    </SiteLayout>
  );
}
