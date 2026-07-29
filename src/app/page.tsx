import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import BestSellers from "@/components/BestSellers";
import CollectionsSection from "@/components/CollectionsSection";
import BrandStory from "@/components/BrandStory";
import WhyParentsChooseUs from "@/components/WhyParentsChooseUs";
import InstagramVideos from "@/components/InstagramVideos";
import ParentReviews from "@/components/ParentReviews";
import Newsletter from "@/components/Newsletter";
import { getCollections, getProductsWithVideos } from "@/lib/shopify";
import { getProductReviewSummaries } from "@/lib/judgeme";
import type { Collection, Product } from "@/lib/shopify/types";

export const revalidate = 60;

export default async function Home() {
  let products: Product[] = [];
  let collections: Collection[] = [];
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

  try {
    collections = await getCollections(20);
  } catch (error) {
    console.error("Failed to fetch Shopify collections:", error);
  }

  return (
    <SiteLayout>
      <HeroSection />
      <TrustBadges />
      <BestSellers products={products} reviewSummaries={reviewSummaries} />
      <CollectionsSection collections={collections} />
      <BrandStory />
      <WhyParentsChooseUs />
      <InstagramVideos products={products} />
      <ParentReviews />
      <Newsletter />
    </SiteLayout>
  );
}
