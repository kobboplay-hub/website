import { Suspense } from "react";

import LifestyleEditorialBanner from "@/components/lifestyle/LifestyleEditorialBanner";
import LifestyleHero from "@/components/lifestyle/LifestyleHero";
import LifestyleJsonLd from "@/components/lifestyle/LifestyleJsonLd";
import type { LifestyleCardRating } from "@/components/lifestyle/LifestyleProductCard";
import LifestyleReviews from "@/components/lifestyle/LifestyleReviews";
import LifestyleShop from "@/components/lifestyle/LifestyleShop";
import LifestyleTrustSection from "@/components/lifestyle/LifestyleTrustSection";
import { getProductReviewSummaries } from "@/lib/judgeme";
import { getLifestyleCategories, getLifestyleProducts } from "@/lib/shopify/lifestyle";
import type { Product } from "@/lib/shopify/types";
import { toLifestyleCard } from "@/lib/storefront/lifestyle-card";
import { SITE_URL } from "@/lib/storefront/lifestyle-seo";
import { LIFESTYLE_BASE_PATH, getProductPath } from "@/lib/storefront/product-routing";

export const revalidate = 60;

/** Matches the grid's first page so above-the-fold cards render with their ratings. */
const RATED_ON_SERVER = 12;

async function getInitialRatings(products: Product[]): Promise<Record<string, LifestyleCardRating>> {
  try {
    return await getProductReviewSummaries(products.slice(0, RATED_ON_SERVER).map((product) => product.id));
  } catch (error) {
    console.error("Failed to load Lifestyle review summaries:", error);
    return {};
  }
}

export default async function LifestylePage() {
  let products: Product[] = [];
  let failed = false;
  try {
    products = await getLifestyleProducts();
  } catch (error) {
    console.error("Failed to load Lifestyle products:", error);
    failed = true;
  }

  const initialRatings = await getInitialRatings(products);

  return (
    <>
      {products.length > 0 && (
        <LifestyleJsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Kobbo Lifestyle",
            url: `${SITE_URL}${LIFESTYLE_BASE_PATH}`,
            itemListElement: products.slice(0, 30).map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${SITE_URL}${getProductPath(product)}`,
              name: product.title,
            })),
          }}
        />
      )}

      <LifestyleHero />
      <LifestyleShop
        products={products.map(toLifestyleCard)}
        categories={getLifestyleCategories(products)}
        initialRatings={initialRatings}
        failed={failed}
      />
      <LifestyleEditorialBanner />
      <LifestyleTrustSection />
      {products.length > 0 && (
        <Suspense fallback={null}>
          <LifestyleReviews products={products} />
        </Suspense>
      )}
    </>
  );
}
