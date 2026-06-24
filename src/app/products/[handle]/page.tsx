import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductHighlights from "@/components/product/ProductHighlights";
import ProductVideo from "@/components/product/ProductVideo";
import ProductTabs from "@/components/product/ProductTabs";
import WhyParentsLoveIt from "@/components/product/WhyParentsLoveIt";
import RelatedProducts from "@/components/product/RelatedProducts";
import CustomerReviews from "@/components/product/CustomerReviews";
import FAQSection from "@/components/product/FAQSection";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { getProductByHandle, getProducts } from "@/lib/shopify";
import { getProductImageUrls } from "@/lib/shopify/types";
import {
  defaultFaqs,
  defaultHighlights,
  defaultRatingBreakdown,
  defaultReviews,
  defaultWhyParentsLove,
  getProductTabsContent,
  getProductVideoThumbnail,
} from "@/lib/productPageContent";

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
    if (!product) return { title: "Product Not Found — Kobbo" };

    return {
      title: product.seo.title ?? `${product.title} — Kobbo`,
      description:
        product.seo.description ?? product.description.slice(0, 160),
    };
  } catch {
    return { title: "Product — Kobbo" };
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

  const images = getProductImageUrls(product);
  const imageAltTexts = product.images.map((img) => img.altText);
  const relatedProducts = allProducts
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);
  const tabsContent = getProductTabsContent(product);
  const video = getProductVideoThumbnail(product);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-kobbo-cream">
        <ProductBreadcrumb productName={product.title} />

        <section className="pb-8 sm:pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <ProductGallery
                images={images}
                productName={product.title}
                altTexts={imageAltTexts}
              />
              <ProductInfo product={product} />
            </div>
          </div>
        </section>

        <ProductHighlights highlights={defaultHighlights} />
        <ProductVideo video={video} />
        <ProductTabs content={tabsContent} />
        <WhyParentsLoveIt items={defaultWhyParentsLove} />
        <RelatedProducts products={relatedProducts} />
        <CustomerReviews
          rating={4.8}
          reviewCount={defaultReviews.length * 40}
          ratingBreakdown={defaultRatingBreakdown}
          reviews={defaultReviews}
        />
        <FAQSection faqs={defaultFaqs} />
        <RecentlyViewed
          currentHandle={product.handle}
          productPool={allProducts}
        />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
