import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { lifestyleHero } from "@/data/lifestyle";
import type { ShopifyImage } from "@/lib/shopify/types";

interface LifestyleHeroProps {
  /** Real Lifestyle product photography from Shopify; the hero is typographic when empty. */
  images: { image: ShopifyImage; title: string }[];
  showFeaturedCta: boolean;
}

export default function LifestyleHero({ images, showFeaturedCta }: LifestyleHeroProps) {
  const [main, ...rest] = images;
  const side = rest.slice(0, 2);

  return (
    <section aria-labelledby="lifestyle-hero-heading" className="border-b border-ls-line">
      <div
        className={`mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:gap-16 lg:px-8 lg:py-20 ${
          main ? "lg:grid-cols-12 lg:items-center" : "text-center"
        }`}
      >
        <div className={main ? "lg:col-span-5" : "mx-auto max-w-3xl"}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ls-accent">{lifestyleHero.eyebrow}</p>
          <h1
            id="lifestyle-hero-heading"
            className="mt-5 font-ls-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-balance text-ls-ink sm:text-5xl lg:text-[3.75rem]"
          >
            {lifestyleHero.heading}
          </h1>
          <p className={`mt-6 text-base leading-relaxed text-ls-ink-soft sm:text-lg ${main ? "max-w-md" : "mx-auto max-w-xl"}`}>
            {lifestyleHero.description}
          </p>
          <div className={`mt-9 flex flex-col gap-3 sm:flex-row ${main ? "" : "sm:justify-center"}`}>
            <Link
              href="#all-products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-ls-ink px-7 text-sm font-medium text-ls-paper transition-colors hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
            >
              {lifestyleHero.primaryCta}
              <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
            </Link>
            {showFeaturedCta && (
              <Link
                href="#featured"
                className="inline-flex h-12 items-center justify-center rounded-[4px] border border-ls-ink/25 px-7 text-sm font-medium text-ls-ink transition-colors hover:border-ls-ink hover:bg-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
              >
                {lifestyleHero.secondaryCta}
              </Link>
            )}
          </div>
        </div>

        {main && (
          <div className={`grid gap-3 sm:gap-4 lg:col-span-7 ${side.length ? "grid-cols-3" : "grid-cols-1"}`}>
            <div className={`relative aspect-[4/5] overflow-hidden rounded-[4px] bg-ls-sand ${side.length ? "col-span-2" : "mx-auto w-full max-w-md"}`}>
              <Image
                src={main.image.url}
                alt={main.image.altText || main.title}
                fill
                priority
                sizes="(max-width: 1024px) 66vw, 40vw"
                className="object-cover"
              />
            </div>
            {side.length > 0 && (
              <div className="grid gap-3 sm:gap-4">
                {side.map(({ image, title }) => (
                  <div key={image.url} className="relative overflow-hidden rounded-[4px] bg-ls-sand">
                    <Image
                      src={image.url}
                      alt={image.altText || title}
                      fill
                      sizes="(max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
