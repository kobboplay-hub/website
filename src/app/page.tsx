import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import BestSellers from "@/components/BestSellers";
import BrandStory from "@/components/BrandStory";
import WhyParentsChooseUs from "@/components/WhyParentsChooseUs";
import InstagramVideos from "@/components/InstagramVideos";
import ParentReviews from "@/components/ParentReviews";
import Newsletter from "@/components/Newsletter";
import { getProductsWithVideos } from "@/lib/shopify";
import { getProductReviewSummaries } from "@/lib/judgeme";
import type { Product } from "@/lib/shopify/types";

export const revalidate = 3600;

export default async function Home() {
  let products: Product[] = [];

  let reviewSummaries = {};

  try {
    products = await getProductsWithVideos(50);
    if (products.length > 0) {
      reviewSummaries = await getProductReviewSummaries(
        products.slice(0, 5).map((product) => product.id),
      );
    }
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  return (
    <SiteLayout>
      <HeroSection />
      <TrustBadges />
      <BestSellers products={products} reviewSummaries={reviewSummaries} />
      <BrandStory />
      <WhyParentsChooseUs />
      <InstagramVideos products={products} />
      <ParentReviews />
      <Newsletter />
    </SiteLayout>
  );
}
