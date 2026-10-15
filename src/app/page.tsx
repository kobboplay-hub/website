import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/HeroSection";
import ToyTrainTrack from "@/components/common/ToyTrainTrack";
import PlayKitsSection from "@/components/home/PlayKitsSection";
import WhyKobboKits from "@/components/home/WhyKobboKits";
import ResearchStatBanner from "@/components/home/ResearchStatBanner";
import InstagramVideos from "@/components/InstagramVideos";
import FounderNote from "@/components/home/FounderNote";
import {
  getAgeGroups,
  getHomepageAgeProducts,
  getProductsWithVideos,
} from "@/lib/shopify";
import type { AgeGroup, Product } from "@/lib/shopify/types";

export const revalidate = 60;

export default async function Home() {
  let ageGroups: AgeGroup[] = [];
  let products: Product[] = [];
  let videoProducts: Product[] = [];

  const [ageResult, productResult, videoResult] = await Promise.allSettled([
    getAgeGroups(),
    getHomepageAgeProducts(),
    getProductsWithVideos(),
  ]);
  if (ageResult.status === "fulfilled") ageGroups = ageResult.value;
  else console.error("Failed to fetch Shopify age groups:", ageResult.reason);
  if (productResult.status === "fulfilled") products = productResult.value;
  else console.error("Failed to fetch Shopify age-group products:", productResult.reason);
  if (videoResult.status === "fulfilled") videoProducts = videoResult.value;
  else console.error("Failed to fetch Shopify product videos:", videoResult.reason);

  return (
    <SiteLayout immersiveHero>
      <HeroSection ageGroups={ageGroups} />
      <ToyTrainTrack />
      <PlayKitsSection ageGroups={ageGroups} products={products} />
      <ResearchStatBanner />
      <InstagramVideos products={videoProducts} />
      <FounderNote />
      <WhyKobboKits />
    </SiteLayout>
  );
}
