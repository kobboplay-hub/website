import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headset, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

import { lifestyleHero, lifestyleHeroTrust } from "@/data/lifestyle";
import heroImage from "../../../public/lifestyle/hero-essentials.jpg";

const PRODUCTS_ANCHOR = "#all-products";

const trustIcons: Record<(typeof lifestyleHeroTrust)[number]["icon"], LucideIcon> = {
  truck: Truck,
  shield: ShieldCheck,
  support: Headset,
};

function TrustRow({ className, itemClassName }: { className: string; itemClassName: string }) {
  return (
    <ul className={className} aria-label="Why shop with Kobbo">
      {lifestyleHeroTrust.map(({ icon, label }) => {
        const Icon = trustIcons[icon];
        return (
          <li key={label} className={`flex font-medium leading-tight text-ls-ink-soft ${itemClassName}`}>
            <Icon className="size-[18px] shrink-0 text-ls-accent" strokeWidth={1.5} aria-hidden />
            {label}
          </li>
        );
      })}
    </ul>
  );
}

export default function LifestyleHero() {
  return (
    <section
      aria-labelledby="lifestyle-hero-heading"
      className="@container relative isolate overflow-hidden border-b border-ls-line bg-[#f7f3ed]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_15%_30%,rgba(255,255,255,0.8),transparent_70%),linear-gradient(180deg,#f8f5ef_0%,#f1e9de_100%)]"
      />

      <div className="lg:grid lg:min-h-[clamp(560px,calc(100svh-8rem),650px)] lg:grid-cols-2 xl:grid-cols-[minmax(0,48fr)_minmax(0,52fr)]">
        <div className="flex flex-col justify-center px-4 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-16 lg:py-16 lg:pl-[max(2rem,calc((100cqw-80rem)/2+2rem))] lg:pr-10 xl:pr-12">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-ls-accent motion-safe:animate-ls-rise">
            {lifestyleHero.eyebrow}
            <span aria-hidden className="h-px w-10 bg-ls-accent/40" />
          </p>

          <h1
            id="lifestyle-hero-heading"
            className="mt-5 font-ls-display text-[clamp(1.875rem,9.2vw,2.25rem)] font-bold leading-[1.06] tracking-[-0.035em] text-ls-ink motion-safe:animate-ls-rise motion-safe:[animation-delay:80ms] sm:text-[3.25rem] lg:text-[2.875rem] xl:text-[3.5rem]"
          >
            <span className="block">Everyday Essentials.</span>
            <span className="mt-1 block font-ls-serif text-[0.97em] font-medium italic tracking-[-0.03em] text-ls-accent">
              Thoughtfully Chosen.
            </span>
          </h1>

          <p className="mt-5 max-w-[30rem] text-[15px] leading-relaxed text-ls-muted motion-safe:animate-ls-rise motion-safe:[animation-delay:160ms] sm:mt-6 sm:text-[17px]">
            {lifestyleHero.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 motion-safe:animate-ls-rise motion-safe:[animation-delay:240ms] sm:flex-row">
            <Link
              href={PRODUCTS_ANCHOR}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-ls-ink px-7 text-sm font-semibold text-ls-paper shadow-[0_8px_24px_-12px_rgba(29,28,26,0.55)] transition-colors hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
            >
              {lifestyleHero.primaryCta}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                strokeWidth={1.8}
                aria-hidden
              />
            </Link>
            <Link
              href={PRODUCTS_ANCHOR}
              className="inline-flex h-12 items-center justify-center rounded-[4px] border border-ls-ink/20 bg-ls-paper/50 px-7 text-sm font-semibold text-ls-ink transition-colors hover:border-ls-ink hover:bg-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
            >
              {lifestyleHero.secondaryCta}
            </Link>
          </div>

          <TrustRow
            className="mt-10 hidden flex-wrap items-center gap-x-6 gap-y-3 motion-safe:animate-ls-rise motion-safe:[animation-delay:320ms] lg:flex xl:gap-x-8"
            itemClassName="items-center gap-2.5 text-[13px]"
          />
        </div>

        <div className="sm:px-6 lg:relative lg:px-0">
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] sm:rounded-[4px] lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-none lg:[mask-image:linear-gradient(to_right,transparent,#000_30%)]">
            <Image
              src={heroImage}
              alt="Folded cotton towels, ceramic bottles, a canvas backpack, sneakers and a plant arranged on stone podiums in warm sunlight"
              fill
              loading="eager"
              fetchPriority="high"
              placeholder="blur"
              sizes="(min-width: 1280px) 52vw, (min-width: 1024px) 50vw, (min-width: 640px) calc(100vw - 3rem), 100vw"
              className="object-cover object-[50%_60%] motion-safe:animate-ls-settle"
            />          </div>
        </div>

        <TrustRow
          className="grid grid-cols-3 gap-3 px-4 py-6 sm:px-6 lg:hidden"
          itemClassName="flex-col items-start gap-2 text-xs sm:flex-row sm:items-center sm:gap-2.5 sm:text-[13px]"
        />
      </div>
    </section>
  );
}
