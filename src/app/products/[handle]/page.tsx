import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductFloatingVideoWidget from "@/components/product/ProductFloatingVideoWidget";
import ProductInfo from "@/components/product/ProductInfo";
import ProductVideo from "@/components/product/ProductVideo";
import ProductTabs from "@/components/product/ProductTabs";
import WhyParentsLoveIt from "@/components/product/WhyParentsLoveIt";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductReviews from "@/components/reviews/ProductReviews";
import FAQSection from "@/components/product/FAQSection";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { getProductByHandle, getProducts } from "@/lib/shopify";
import { getProductImageUrls } from "@/lib/shopify/types";
import { getProductReviewSummaries, getProductReviewSummary } from "@/lib/judgeme";
import {
  defaultFaqs,
  defaultWhyParentsLove,
  getProductTabsContent,
  getProductVideos,
  getPrimaryProductVideo,
} from "@/lib/productPageContent";
import { productMetadata, buildPageTitle } from "@/data/seo";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const products = await getProducts(20);
    return products.map((product) => ({ handle: product.handle }));
  } catch {
    return [];
  }
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  let product;
  let allProducts = [];

  try {
    [product, allProducts] = await Promise.all([
      getProductByHandle(handle),
      getProducts(20),
    ]);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    notFound();
  }

  if (!product) notFound();

  const [productReviewSummary, reviewSummaries] = await Promise.all([
    getProductReviewSummary(product.id),
    getProductReviewSummaries(
      allProducts
        .filter((p) => p.handle !== product.handle)
        .slice(0, 4)
        .map((p) => p.id),
    ),
  ]);

  const images = getProductImageUrls(product);
  const imageAltTexts = product.images.map((img) => img.altText);
  const relatedProducts = allProducts
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  const tabsContent = getProductTabsContent(product);
  const videos = getProductVideos(product);
  const primaryVideo = getPrimaryProductVideo(product);

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <ProductBreadcrumb productName={product.title} />

      <section className="pb-14 sm:pb-16 lg:pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
            <ProductGallery
              images={images}
              productName={product.title}
              altTexts={imageAltTexts}
            />
            <ProductInfo
              product={product}
              reviewSummary={productReviewSummary}
            />
          </div>
        </div>
      </section>

      {primaryVideo && (
        <ProductFloatingVideoWidget
          video={primaryVideo}
          productHandle={product.handle}
        />
      )}

      <ProductVideo videos={videos} />
      <ProductTabs content={tabsContent} />
      <WhyParentsLoveIt items={defaultWhyParentsLove} />
      <RelatedProducts
        products={relatedProducts}
        reviewSummaries={reviewSummaries}
      />
      <ProductReviews
        productId={product.id}
        productHandle={product.handle}
        productTitle={product.title}
      />
      <FAQSection faqs={defaultFaqs} />
      <RecentlyViewed
        currentHandle={product.handle}
        productPool={allProducts}
      />
    </SiteLayout>
  );
}
