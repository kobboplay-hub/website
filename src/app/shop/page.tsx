import type { Metadata } from "next";
import SiteLayout from "@/components/SiteLayout";
import Newsletter from "@/components/Newsletter";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopError from "@/components/shop/ShopError";
import { getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

export const metadata: Metadata = {
  title: "Shop Toys — Kobbo",
  description:
    "Explore playful, skill-building toys curated for little minds.",
};

export const revalidate = 3600;

export default async function ShopPage() {
  let products: Product[] = [];
  let hasError = false;

  try {
    products = await getProducts(20);
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
            <div className="mt-12 rounded-3xl bg-kobbo-white px-6 py-16 text-center shadow-soft">
              <p className="font-heading text-xl font-bold text-kobbo-black">
                No toys found
              </p>
              <p className="mt-2 text-sm text-kobbo-muted">
                Check back soon for new arrivals.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <ProductGrid products={products} />
            </div>
          )}
        </div>
      </section>
      <Newsletter />
    </SiteLayout>
  );
}
