import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";

import type { LifestyleCategory } from "@/lib/shopify/lifestyle";
import { LIFESTYLE_BASE_PATH } from "@/lib/storefront/product-routing";
import LifestyleSectionHeading from "./LifestyleSectionHeading";

export default function LifestyleCategorySection({ categories }: { categories: LifestyleCategory[] }) {
  // One category is not a choice; the section only appears when there is something to discover.
  if (categories.length < 2) return null;

  return (
    <section aria-labelledby="lifestyle-categories" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LifestyleSectionHeading id="lifestyle-categories" eyebrow="Shop by category" title="Find what fits your day" />
        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
          {categories.slice(0, 10).map((category) => (
            <li key={category.slug} className="w-[62%] shrink-0 snap-start sm:w-auto">
              <Link
                href={`${LIFESTYLE_BASE_PATH}?category=${category.slug}#all-products`}
                scroll={false}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ls-ink"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-ls-sand">
                  {category.image ? (
                    <Image
                      src={category.image.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 62vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : (
                    <ImageOff className="absolute inset-0 m-auto size-6 text-ls-muted" strokeWidth={1.5} aria-hidden />
                  )}
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="font-ls-display text-[15px] font-semibold text-ls-ink group-hover:underline group-hover:underline-offset-4">
                    {category.name}
                  </span>
                  <span className="text-xs text-ls-muted">
                    {category.count} {category.count === 1 ? "item" : "items"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
