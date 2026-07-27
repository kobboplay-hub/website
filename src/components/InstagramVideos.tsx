import Link from "next/link";
import { ExternalLink } from "lucide-react";
import HomeProductVideosGrid from "@/components/HomeProductVideosGrid";
import { instagramSection } from "@/data/home-content";
import { getHomepageProductVideos } from "@/lib/productPageContent";
import type { Product } from "@/lib/shopify/types";

interface InstagramVideosProps {
  products: Product[];
}

export default function InstagramVideos({ products }: InstagramVideosProps) {
  const videos = getHomepageProductVideos(products);

  if (videos.length === 0) return null;

  return (
    <section className="bg-kobbo-cream py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
            {instagramSection.title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-kobbo-muted sm:text-base">
            {instagramSection.subtitle}
          </p>
        </div>

        <HomeProductVideosGrid videos={videos} />

        <div className="mt-6 text-center sm:mt-8">
          <Link
            href={instagramSection.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-kobbo-black/10 bg-kobbo-white px-6 py-2.5 text-sm font-bold text-kobbo-black transition-all hover:border-kobbo-yellow hover:shadow-soft"
          >
            {instagramSection.viewOnInstagramLabel}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
