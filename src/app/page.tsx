import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/HeroSection";
import ToyTrainTrack from "@/components/common/ToyTrainTrack";
import PlayKitsSection from "@/components/home/PlayKitsSection";
import WhyKobboKits from "@/components/home/WhyKobboKits";
import ResearchStatBanner from "@/components/home/ResearchStatBanner";
import InstagramVideos from "@/components/InstagramVideos";
import FounderNote from "@/components/home/FounderNote";
import { Suspense } from "react";
import {
  getAgeGroups,
  getHomepageAgeProducts,
  getProductsWithVideos,
} from "@/lib/shopify";
import type { AgeGroup, Product } from "@/lib/shopify/types";

export const revalidate = 60;

async function PlayKitsContent() {
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
  return <PlayKitsSection ageGroups={ageGroups} products={products} />;
}

async function PlayMomentsContent() {
  let products: Product[];
  try {
    products = await getProductsWithVideos();
  } catch (error) {
    console.error("Failed to fetch Shopify product videos:", error);
    return null;
  }
  return <InstagramVideos products={products} />;
}

export default function Home() {
  return (
    <SiteLayout immersiveHero>
      <HeroSection />
      <ToyTrainTrack />
      <Suspense fallback={<section id="play-kits" className="min-h-[28rem] bg-kobbo-white px-4 py-12 text-center"><h2 className="font-heading text-3xl font-extrabold text-kobbo-black">Choose Your Play Kit</h2><div className="mx-auto mt-8 h-64 max-w-5xl animate-pulse rounded-3xl bg-kobbo-cream" /></section>}>
        <PlayKitsContent />
      </Suspense>
      <ResearchStatBanner />
      <Suspense fallback={<section className="min-h-[24rem] bg-kobbo-cream px-4 py-12"><div className="mx-auto max-w-7xl"><h2 className="font-heading text-3xl font-extrabold text-kobbo-black">Unboxing &amp; Play Moments</h2><div className="mt-8 h-64 max-w-xs animate-pulse rounded-2xl bg-kobbo-beige" /></div></section>}>
        <PlayMomentsContent />
      </Suspense>
      <FounderNote />
      <WhyKobboKits />
    </SiteLayout>
  );
}
