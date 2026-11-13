import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import LifestyleJsonLd from "@/components/lifestyle/LifestyleJsonLd";
import LifestyleProductCard from "@/components/lifestyle/LifestyleProductCard";
import LifestyleProductDetail from "@/components/lifestyle/LifestyleProductDetail";
import LifestyleProductReviews from "@/components/lifestyle/LifestyleProductReviews";
import LifestyleRecentlyViewed from "@/components/lifestyle/LifestyleRecentlyViewed";
import { getProductReviews, type JudgeMeProductReviewData } from "@/lib/judgeme";
import { getLifestyleProductDetails } from "@/lib/productPageContent";
import { getLifestyleProductByHandle, getLifestyleProducts } from "@/lib/shopify/lifestyle";
import { getProductImageUrls, type Product } from "@/lib/shopify/types";
import { hasSelectableOptions, toLifestyleCard } from "@/lib/storefront/lifestyle-card";
import { slugifyCategory } from "@/lib/storefront/lifestyle-category";
import { SITE_URL, lifestyleProductMetadata } from "@/lib/storefront/lifestyle-seo";
import { LIFESTYLE_BASE_PATH, getProductPath } from "@/lib/storefront/product-routing";

export const revalidate = 300;

interface LifestyleProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  try {
    return (await getLifestyleProducts()).map((product) => ({ handle: product.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: LifestyleProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getLifestyleProductByHandle(handle).catch(() => null);
  if (!product) return { title: "Product not found | Kobbo Lifestyle", robots: { index: false } };
  return lifestyleProductMetadata(product);
}

function relatedProducts(product: Product, all: Product[]): Product[] {
  const others = all.filter((item) => item.id !== product.id);
  const sameCategory = others.filter((item) => item.category && item.category === product.category);
  const rest = others.filter((item) => !sameCategory.includes(item));
  return [...sameCategory, ...rest].slice(0, 4);
}

const EMPTY_REVIEWS: JudgeMeProductReviewData = { averageRating: 0, reviewCount: 0, ratingBreakdown: [], reviews: [] };

export default async function LifestyleProductPage({ params }: LifestyleProductPageProps) {
  const { handle } = await params;
  const product = await getLifestyleProductByHandle(handle);
  if (!product) notFound();

  const [reviews, catalog] = await Promise.all([
    getProductReviews(product.id).catch(() => EMPTY_REVIEWS),
    getLifestyleProducts().catch(() => [] as Product[]),
  ]);
  const related = relatedProducts(product, catalog).map(toLifestyleCard);
  const details = getLifestyleProductDetails(product);
  const descriptionParagraphs = product.description.split(/\n{2,}|\r\n\r\n/).map((part) => part.trim()).filter(Boolean);
  const summary = descriptionParagraphs[0] && descriptionParagraphs[0].length <= 220 ? descriptionParagraphs[0] : "";
  const detailParagraphs = summary ? descriptionParagraphs.slice(1) : descriptionParagraphs;
  const imageUrls = getProductImageUrls(product);
  const url = `${SITE_URL}${getProductPath(product)}`;
  const images = product.images.length > 0 ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const offersVariants = hasSelectableOptions(product) ? product.variants : product.variants.slice(0, 1);

  return (
    <>
      <LifestyleJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description.slice(0, 5000),
          image: imageUrls,
          url,
          brand: { "@type": "Brand", name: product.vendor || "Kobbo" },
          ...(product.category ? { category: product.category } : {}),
          offers: offersVariants.map((variant) => ({
            "@type": "Offer",
            url,
            price: variant.price.amount,
            priceCurrency: variant.price.currencyCode,
            availability: variant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          })),
          ...(reviews.reviewCount > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: reviews.averageRating.toFixed(1),
                  reviewCount: reviews.reviewCount,
                },
              }
            : {}),
        }}
      />
      <LifestyleJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Lifestyle", item: `${SITE_URL}${LIFESTYLE_BASE_PATH}` },
            { "@type": "ListItem", position: 2, name: product.title, item: url },
          ],
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ls-muted">
            <li>
              <Link href={LIFESTYLE_BASE_PATH} className="hover:text-ls-ink hover:underline hover:underline-offset-4">
                Lifestyle
              </Link>
            </li>
            {product.category && (
              <>
                <ChevronRight className="size-3" aria-hidden />
                <li>
                  <Link
                    href={`${LIFESTYLE_BASE_PATH}?category=${slugifyCategory(product.category)}#all-products`}
                    className="hover:text-ls-ink hover:underline hover:underline-offset-4"
                  >
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <ChevronRight className="size-3" aria-hidden />
            <li aria-current="page" className="max-w-[60vw] truncate text-ls-ink">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="mt-6">
          <LifestyleProductDetail
            product={{
              id: product.id,
              handle: product.handle,
              title: product.title,
              category: product.category,
              vendor: product.vendor,
              currencyCode: product.currencyCode,
              availableForSale: product.availableForSale,
              images,
              variants: product.variants,
              options: product.options,
            }}
            rating={{ averageRating: reviews.averageRating, reviewCount: reviews.reviewCount }}
            summary={summary}
          />
        </div>
      </div>

      {(detailParagraphs.length > 0 || details.features.length > 0 || details.specifications.length > 0 || details.careInstructions.length > 0) && (
        <section aria-labelledby="lifestyle-product-details" className="border-t border-ls-line bg-ls-paper py-14 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-7">
              <h2 id="lifestyle-product-details" className="font-ls-display text-2xl font-bold tracking-[-0.02em] text-ls-ink">
                Product details
              </h2>
              {detailParagraphs.length > 0 && (
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ls-ink-soft">
                  {detailParagraphs.map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {details.features.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-ls-display text-base font-semibold text-ls-ink">Features</h3>
                  <ul className="mt-4 space-y-2.5 text-[15px] text-ls-ink-soft">
                    {details.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span className="mt-2.5 size-1 shrink-0 rounded-full bg-ls-accent" aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-10 lg:col-span-5">
              {details.specifications.length > 0 && (
                <div>
                  <h3 className="font-ls-display text-base font-semibold text-ls-ink">Specifications</h3>
                  <dl className="mt-4 divide-y divide-ls-line border-y border-ls-line text-sm">
                    {details.specifications.map((row) => (
                      <div key={`${row.label}-${row.value}`} className="grid grid-cols-5 gap-4 py-3">
                        <dt className="col-span-2 text-ls-muted">{row.label}</dt>
                        <dd className="col-span-3 text-ls-ink">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {details.careInstructions.length > 0 && (
                <div>
                  <h3 className="font-ls-display text-base font-semibold text-ls-ink">Care</h3>
                  <ul className="mt-4 space-y-2 text-sm text-ls-ink-soft">
                    {details.careInstructions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <LifestyleProductReviews productId={product.id} productHandle={product.handle} productTitle={product.title} data={reviews} />

      {related.length > 0 && (
        <section aria-labelledby="lifestyle-related" className="border-t border-ls-line py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="lifestyle-related" className="font-ls-display text-2xl font-bold tracking-[-0.02em] text-ls-ink">
              You may also like
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.id}>
                  <LifestyleProductCard product={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <LifestyleRecentlyViewed currentProduct={product} />
    </>
  );
}
