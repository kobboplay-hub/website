import { Suspense } from "react";
import Link from "next/link";

import LifestyleCategorySection from "@/components/lifestyle/LifestyleCategorySection";
import LifestyleEditorialBanner from "@/components/lifestyle/LifestyleEditorialBanner";
import LifestyleFeaturedProducts from "@/components/lifestyle/LifestyleFeaturedProducts";
import LifestyleGridSkeleton from "@/components/lifestyle/LifestyleGridSkeleton";
import LifestyleHero from "@/components/lifestyle/LifestyleHero";
import LifestyleJsonLd from "@/components/lifestyle/LifestyleJsonLd";
import LifestyleProductGrid from "@/components/lifestyle/LifestyleProductGrid";
import LifestyleReviews from "@/components/lifestyle/LifestyleReviews";
import LifestyleSectionHeading from "@/components/lifestyle/LifestyleSectionHeading";
import LifestyleTrustSection from "@/components/lifestyle/LifestyleTrustSection";
import { getLifestyleCategories, getLifestyleProducts } from "@/lib/shopify/lifestyle";
import type { Product } from "@/lib/shopify/types";
import { toLifestyleCard } from "@/lib/storefront/lifestyle-card";
import { SITE_URL } from "@/lib/storefront/lifestyle-seo";
import { LIFESTYLE_BASE_PATH, getProductPath } from "@/lib/storefront/product-routing";

export const revalidate = 60;

const FEATURED_FALLBACK_COUNT = 4;

function pickFeatured(products: Product[]): Product[] {
  const flagged = products.filter((product) => product.merchandising.featured);
  if (flagged.length > 0) return flagged;
  // Without merchandising flags, only spotlight a few when the full grid has more to browse.
  return products.length > FEATURED_FALLBACK_COUNT ? products.slice(0, FEATURED_FALLBACK_COUNT) : [];
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

  const withImages = products.filter((product) => product.featuredImage ?? product.images[0]);
  const heroImages = withImages.slice(0, 3).map((product) => ({
    image: (product.featuredImage ?? product.images[0])!,
    title: product.title,
  }));
  const editorialSource = withImages[3] ?? withImages[0] ?? null;
  const editorialImage = editorialSource ? editorialSource.featuredImage ?? editorialSource.images[0] ?? null : null;
  const featured = pickFeatured(products).map(toLifestyleCard);
  const categories = getLifestyleCategories(products);
  const cards = products.map(toLifestyleCard);

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

      <LifestyleHero images={heroImages} showFeaturedCta={featured.length > 0} />
      <LifestyleCategorySection categories={categories} />
      <LifestyleFeaturedProducts products={featured} />
      {products.length > 0 && <LifestyleEditorialBanner image={editorialImage} imageTitle={editorialSource?.title ?? "Kobbo Lifestyle"} />}

      <section id="all-products" aria-labelledby="lifestyle-all-products" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LifestyleSectionHeading id="lifestyle-all-products" eyebrow="The collection" title="All products" />
          <div className="mt-8">
            {failed ? (
              <div role="alert" className="rounded-[4px] border border-ls-line bg-ls-paper px-6 py-14 text-center">
                <p className="font-ls-display text-lg font-semibold text-ls-ink">We couldn’t load the collection</p>
                <p className="mt-2 text-sm text-ls-muted">Please refresh the page in a moment.</p>
                <Link
                  href={LIFESTYLE_BASE_PATH}
                  className="mt-6 inline-flex h-11 items-center rounded-[4px] bg-ls-ink px-6 text-sm font-medium text-ls-paper hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
                >
                  Try again
                </Link>
              </div>
            ) : cards.length === 0 ? (
              <div className="rounded-[4px] border border-dashed border-ls-line px-6 py-16 text-center">
                <p className="font-ls-display text-lg font-semibold text-ls-ink">New products are on their way</p>
                <p className="mt-2 text-sm text-ls-muted">The Lifestyle collection will appear here as soon as it is available.</p>
              </div>
            ) : (
              <Suspense fallback={<LifestyleGridSkeleton />}>
                <LifestyleProductGrid products={cards} />
              </Suspense>
            )}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <Suspense fallback={null}>
          <LifestyleReviews products={products} />
        </Suspense>
      )}
      <LifestyleTrustSection />
    </>
  );
}
