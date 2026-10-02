import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import ToyTrainTrack from "@/components/common/ToyTrainTrack";
import PlayKitsSection from "@/components/home/PlayKitsSection";
import ResearchStatBanner from "@/components/home/ResearchStatBanner";
import WhyParentsChooseUs from "@/components/WhyParentsChooseUs";
import InstagramVideos from "@/components/InstagramVideos";
import FounderNote from "@/components/home/FounderNote";
import {
  getAgeGroups,
  getHomepageAgeProducts,
} from "@/lib/shopify";
import type { AgeGroup, Product } from "@/lib/shopify/types";

export const revalidate = 60;

export default async function Home() {
  let ageGroups: AgeGroup[] = [];
  let products: Product[] = [];

  const [ageResult, productResult] = await Promise.allSettled([
    getAgeGroups(),
    getHomepageAgeProducts(),
  ]);
  if (ageResult.status === "fulfilled") ageGroups = ageResult.value;
  else console.error("Failed to fetch Shopify age groups:", ageResult.reason);
  if (productResult.status === "fulfilled") products = productResult.value;
  else console.error("Failed to fetch Shopify age-group products:", productResult.reason);

  return (
    <SiteLayout immersiveHero>
      <HeroSection />
      <TrustBadges />
      <ToyTrainTrack />
      <PlayKitsSection ageGroups={ageGroups} products={products} />
      <ResearchStatBanner />
      <InstagramVideos />
      <WhyParentsChooseUs />
      <FounderNote />
    </SiteLayout>
  );
}
