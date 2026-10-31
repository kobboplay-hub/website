import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductFloatingVideoWidget from "@/components/product/ProductFloatingVideoWidget";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import InsidePlayKit from "@/components/product/InsidePlayKit";
import { ProductPurchaseProvider } from "@/components/product/ProductPurchaseContext";
import WhyParentsLoveIt from "@/components/product/WhyParentsLoveIt";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductReviews from "@/components/reviews/ProductReviews";
import FAQSection from "@/components/product/FAQSection";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { getHomepageAgeProducts, getProductByHandle, getProducts } from "@/lib/shopify";
import { getProductImageUrls, type Product } from "@/lib/shopify/types";
import { getProductReviewSummaries } from "@/lib/judgeme";
import {
  defaultWhyParentsLove,
  getProductFaqs,
  getProductTabsContent,
  getPrimaryProductVideo,
} from "@/lib/productPageContent";
import { productMetadata, buildPageTitle } from "@/data/seo";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const results = await Promise.allSettled([
    getProducts(20),
    getHomepageAgeProducts(),
  ]);
  const handles = new Set(
    results.flatMap((result) => result.status === "fulfilled" ? result.value.map((product) => product.handle) : []),
  );
  return [...handles].map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;

  try {
    const product = await getProductByHandle(handle);
    if (!product) {
      return { title: buildPageTitle("Product Not Found") };
    }

    return productMetadata(
      product.title,
      product.seo.description ?? product.description.slice(0, 160),
    );
  } catch {
    return { title: buildPageTitle("Product") };
  }
}

async function RelatedProductsSection({ product }: { product: Product }) {
  let relatedProducts: Product[];
  let reviewSummaries;
  try {
    const allProducts = await getProducts(20);
    relatedProducts = allProducts
      .filter((item) => item.handle !== product.handle)
      .slice(0, 4);
    if (relatedProducts.length === 0) return null;

    reviewSummaries = await getProductReviewSummaries(
      relatedProducts.map((item) => item.id),
    );
  } catch (error) {
    console.error("Failed to load related products:", error);
    return null;
  }
  return <RelatedProducts products={relatedProducts} reviewSummaries={reviewSummaries} />;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  let product;

  try {
    product = await getProductByHandle(handle);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    notFound();
  }

  if (!product) notFound();

  const images = getProductImageUrls(product);
  const imageAltTexts = product.images.map((img) => img.altText);

  const tabsContent = getProductTabsContent(product);
  const primaryVideo = getPrimaryProductVideo(product);
  const productFaqs = getProductFaqs(product);

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <ProductPurchaseProvider key={product.id} product={product}>
      <div className="min-w-0 overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <ProductBreadcrumb productName={product.title} />

        <section className="pb-14 sm:pb-16 lg:pb-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <ProductGallery
              images={images}
              productName={product.title}
              productHandle={product.handle}
              altTexts={imageAltTexts}
            />
              <div className="min-w-0">
                <ProductInfo
                  product={product}
                />
              </div>
            </div>
          </div>
        </section>

        {primaryVideo && (
          <ProductFloatingVideoWidget
            video={primaryVideo}
            productHandle={product.handle}
          />
        )}

        {product.isKit ? (
          <InsidePlayKit items={product.playKitItems} />
        ) : (
          <ProductTabs content={tabsContent} />
        )}
        <WhyParentsLoveIt items={defaultWhyParentsLove} />
        <Suspense fallback={null}>
          <RelatedProductsSection product={product} />
        </Suspense>
        <Suspense fallback={null}>
          <ProductReviews
            productId={product.id}
            productHandle={product.handle}
            productTitle={product.title}
          />
        </Suspense>
        <FAQSection faqs={productFaqs} />
        <RecentlyViewed currentProduct={product} />
      </div>
      </ProductPurchaseProvider>
    </SiteLayout>
  );
}
