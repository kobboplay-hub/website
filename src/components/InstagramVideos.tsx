import HomeProductVideosGrid from "@/components/HomeProductVideosGrid";
import { instagramSection } from "@/data/home-content";
import { getHomepageProductVideos } from "@/lib/productPageContent";
import type { Product } from "@/lib/shopify/types";

interface InstagramVideosProps {
  products: Product[];
}

export default function InstagramVideos({ products }: InstagramVideosProps) {
  const videos = getHomepageProductVideos(products, products.length);

  if (videos.length === 0) return null;

  return (
    <section aria-labelledby="play-moments-heading" className="bg-kobbo-cream py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="play-moments-heading" className="font-heading text-3xl font-extrabold text-kobbo-black sm:text-4xl">
          {instagramSection.title}
        </h2>
        <p className="mt-2 text-sm text-kobbo-muted sm:text-base">See our toys in action.</p>
        <HomeProductVideosGrid videos={videos} />
      </div>
    </section>
  );
}
