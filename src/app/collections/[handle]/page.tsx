import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import Newsletter from "@/components/Newsletter";
import ProductGrid from "@/components/shop/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import { getCollectionProducts } from "@/lib/shopify";
import { getProductReviewSummaries } from "@/lib/judgeme";

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const data = await getCollectionProducts(handle, 1).catch(() => null);

  if (!data) {
    return { title: "Collection | Kobbo" };
  }

  return {
    title: `${data.collection.title} | Kobbo`,
    description:
      data.collection.description ||
      `Shop the ${data.collection.title} collection at Kobbo.`,
  };
}

export const revalidate = 60;

function isGanpati(title: string, handle: string): boolean {
  return `${title} ${handle}`.toLowerCase().includes("ganpati");
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;

  let collectionData;
  let reviewSummaries = {};

  try {
    collectionData = await getCollectionProducts(handle, 50);
  } catch (error) {
    console.error("Failed to fetch collection:", error);
  }

  if (!collectionData) notFound();

  const { collection, products } = collectionData;
  const festive = isGanpati(collection.title, collection.handle);

  if (products.length > 0) {
    reviewSummaries = await getProductReviewSummaries(
      products.map((product) => product.id),
    );
  }

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="relative overflow-hidden pb-5 pt-3 sm:pb-8 sm:pt-6 lg:py-8">
        {festive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#fff4d6] via-kobbo-cream to-kobbo-cream" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-40 ganpati-sparkle sm:h-40 sm:opacity-50" />
          </>
        )}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/#collections"
            className="inline-flex min-h-9 items-center gap-0.5 text-xs font-medium text-kobbo-muted transition-colors hover:text-kobbo-black sm:min-h-0 sm:gap-1 sm:text-sm"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            All collections
          </Link>

          <div className="mt-2 text-center sm:mt-4">
            {festive && (
              <div className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-[#e07a2f]/25 bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-[#e07a2f] shadow-soft sm:mb-2 sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Festive Season Special
              </div>
            )}
            <h1 className="font-heading text-xl font-extrabold leading-tight text-kobbo-black sm:text-4xl">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="mx-auto mt-1.5 max-w-2xl px-1 text-xs leading-relaxed text-kobbo-muted sm:mt-2 sm:text-base">
                {collection.description}
              </p>
            )}
            <p className="mt-1.5 text-[11px] font-medium text-kobbo-muted sm:mt-2 sm:text-sm">
              {products.length} product{products.length === 1 ? "" : "s"}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mt-4 sm:mt-6">
              <EmptyState
                title="No products yet"
                description="Products will appear here once they're added to this collection."
                cta="Shop all toys"
                ctaHref="/shop"
              />
            </div>
          ) : (
            <div className="mt-4 sm:mt-6">
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
