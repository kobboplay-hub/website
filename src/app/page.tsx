import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import BestSellers from "@/components/BestSellers";
import BrandStory from "@/components/BrandStory";
import WhyParentsChooseUs from "@/components/WhyParentsChooseUs";
import InstagramVideos from "@/components/InstagramVideos";
import ParentReviews from "@/components/ParentReviews";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

export const revalidate = 3600;

export default async function Home() {
  let products: Product[] = [];

  try {
    products = await getProducts(20);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <TrustBadges />
        <BestSellers products={products} />
        <BrandStory />
        <WhyParentsChooseUs />
        <InstagramVideos />
        <ParentReviews />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
