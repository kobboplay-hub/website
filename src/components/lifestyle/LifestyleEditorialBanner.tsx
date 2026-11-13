import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { lifestyleEditorial } from "@/data/lifestyle";
import editorialImage from "../../../public/lifestyle/editorial-entryway.jpg";

export default function LifestyleEditorialBanner() {
  return (
    <section aria-labelledby="lifestyle-editorial" className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-ls-sand sm:rounded-[8px] lg:min-h-[520px]">
          <div className="relative aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
            <Image
              src={editorialImage}
              alt="A sunlit entryway bench with a leather tote, a folded knit throw, a mug and a basket of rolled towels"
              fill
              placeholder="blur"
              sizes="(min-width: 1280px) 1216px, (min-width: 640px) calc(100vw - 3rem), 100vw"
              className="object-cover object-[72%_center] lg:object-[60%_center]"
            />
            <div
              aria-hidden
              className="absolute inset-0 hidden bg-gradient-to-r from-[#f4ede2]/85 via-[#f4ede2]/35 via-45% to-transparent to-70% lg:block"
            />
          </div>

          <div className="relative px-6 py-12 sm:px-10 sm:py-14 lg:flex lg:min-h-[520px] lg:max-w-[34rem] lg:flex-col lg:justify-center lg:px-14 lg:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-ls-accent">{lifestyleEditorial.eyebrow}</p>
            <h2
              id="lifestyle-editorial"
              className="mt-4 font-ls-display text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] text-ls-ink sm:text-[2.5rem] lg:text-[2.75rem]"
            >
              {lifestyleEditorial.heading}
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ls-ink-soft sm:text-base">{lifestyleEditorial.description}</p>
            <Link
              href="#all-products"
              className="group mt-8 inline-flex h-12 items-center gap-2 self-start rounded-[4px] bg-ls-ink px-7 text-sm font-semibold text-ls-paper transition-colors hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
            >
              {lifestyleEditorial.cta}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                strokeWidth={1.8}
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
