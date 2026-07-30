import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import BestSellers from "@/components/BestSellers";
import CollectionsSection from "@/components/CollectionsSection";
import BrandStory from "@/components/BrandStory";
import WhyParentsChooseUs from "@/components/WhyParentsChooseUs";
import InstagramVideos from "@/components/InstagramVideos";
import ParentReviews from "@/components/ParentReviews";
import {
  getCollections,
  getProductsWithVideos,
  getRecentProducts,
} from "@/lib/shopify";
import { getProductReviewSummaries } from "@/lib/judgeme";
import type { Collection, Product } from "@/lib/shopify/types";

export const revalidate = 60;

export default async function Home() {
  let recentProducts: Product[] = [];
  let productsWithVideos: Product[] = [];
  let collections: Collection[] = [];
  let reviewSummaries = {};

  try {
    recentProducts = await getRecentProducts(5);
    if (recentProducts.length > 0) {
      reviewSummaries = await getProductReviewSummaries(
        recentProducts.map((product) => product.id),
      );
    }
  } catch (error) {
    console.error("Failed to fetch recent products:", error);
  }

  try {
    productsWithVideos = await getProductsWithVideos(50);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  try {
    collections = await getCollections(20);
  } catch (error) {
    console.error("Failed to fetch Shopify collections:", error);
  }

  return (
    <SiteLayout immersiveHero>
      <HeroSection />
      <TrustBadges />
      <BestSellers
        products={recentProducts}
        reviewSummaries={reviewSummaries}
      />
      <CollectionsSection collections={collections} />
      <WhyParentsChooseUs />
      <InstagramVideos products={productsWithVideos} />
      <ParentReviews />
      <BrandStory />
    </SiteLayout>
  );
}
