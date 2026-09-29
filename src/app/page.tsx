import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import ShopByCategories from "@/components/home/ShopByCategories";
import ToyTrainTrack from "@/components/common/ToyTrainTrack";
import BestSellingToys from "@/components/home/BestSellingToys";
import ResearchStatBanner from "@/components/home/ResearchStatBanner";
import WhyParentsChooseUs from "@/components/WhyParentsChooseUs";
import InstagramVideos from "@/components/InstagramVideos";
import ParentReviews from "@/components/ParentReviews";
import FounderNote from "@/components/home/FounderNote";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import {
  getProductsWithVideos,
  getBestSellingProducts,
  getCollections,
  getFeaturedProducts,
} from "@/lib/shopify";
import {
  getProductReviewSummaries,
  type JudgeMeProductSummary,
} from "@/lib/judgeme";
import type { Product, Collection } from "@/lib/shopify/types";

export const revalidate = 60;

export default async function Home() {
  let collections: Collection[] = [];
  let bestSellingProducts: Product[] = [];
  let productsWithVideos: Product[] = [];
  let bestSellingReviewSummaries: Record<string, JudgeMeProductSummary> = {};
  let featuredProducts: Product[] = [];
  let featuredReviewSummaries: Record<string, JudgeMeProductSummary> = {};

  try {
    collections = await getCollections(12);
  } catch (error) {
    console.error("Failed to fetch Shopify collections:", error);
  }

  try {
    bestSellingProducts = await getBestSellingProducts();
    if (bestSellingProducts.length > 0) {
      bestSellingReviewSummaries = await getProductReviewSummaries(
        bestSellingProducts.map((product) => product.id),
      );
    }
  } catch (error) {
    console.error("Failed to fetch best-selling products:", error);
  }

  try {
    featuredProducts = await getFeaturedProducts();
    if (featuredProducts.length > 0) {
      featuredReviewSummaries = await getProductReviewSummaries(
        featuredProducts.map((product) => product.id),
      );
    }
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
  }

  try {
    productsWithVideos = await getProductsWithVideos(50);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  return (
    <SiteLayout immersiveHero>
      <HeroSection />
      <TrustBadges />
      <ShopByCategories collections={collections} />
      <ToyTrainTrack />
      <BestSellingToys
        products={bestSellingProducts}
        reviewSummaries={bestSellingReviewSummaries}
      />
      <ResearchStatBanner />
      <FeaturedProducts
        products={featuredProducts}
        reviewSummaries={featuredReviewSummaries}
      />
      <WhyParentsChooseUs />
      <InstagramVideos products={productsWithVideos} />
      <ParentReviews />
      <FounderNote />
    </SiteLayout>
  );
}
