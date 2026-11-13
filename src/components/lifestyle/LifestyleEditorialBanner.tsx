import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { lifestyleEditorial } from "@/data/lifestyle";
import type { ShopifyImage } from "@/lib/shopify/types";

export default function LifestyleEditorialBanner({ image, imageTitle }: { image: ShopifyImage | null; imageTitle: string }) {
  return (
    <section aria-labelledby="lifestyle-editorial" className="bg-ls-sand">
      <div className={`mx-auto grid max-w-7xl lg:items-stretch ${image ? "lg:grid-cols-2" : ""}`}>
        {image && (
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
            <Image
              src={image.url}
              alt={image.altText || imageTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
        <div
          className={`flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-16 ${image ? "" : "items-center text-center"}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ls-accent">{lifestyleEditorial.eyebrow}</p>
          <h2
            id="lifestyle-editorial"
            className="mt-5 max-w-md font-ls-display text-[2rem] font-bold leading-[1.1] tracking-[-0.025em] text-balance text-ls-ink sm:text-[2.5rem]"
          >
            {lifestyleEditorial.heading}
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ls-ink-soft">{lifestyleEditorial.description}</p>
          <Link
            href="#all-products"
            className="group mt-8 inline-flex items-center gap-2 self-start text-sm font-medium text-ls-ink underline decoration-ls-ink/30 underline-offset-[6px] transition-colors hover:decoration-ls-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ls-ink"
          >
            {lifestyleEditorial.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.8} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
