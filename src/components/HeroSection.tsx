import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&h=1100&fit=crop";

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto lg:max-w-lg">
      <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-kobbo-yellow/30 blur-3xl" />
      <div className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-kobbo-beige blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl bg-kobbo-beige shadow-soft-lg ring-1 ring-kobbo-black/5">
        <div className="relative aspect-[4/5] w-full sm:aspect-[5/6]">
          <Image
            src={HERO_IMAGE}
            alt="Colorful premium wooden toys for children"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 512px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kobbo-black/10 via-transparent to-transparent" />
        </div>
      </div>

      <div className="absolute -bottom-3 left-4 rounded-2xl bg-kobbo-white px-4 py-2.5 shadow-soft sm:left-6">
        <p className="font-heading text-sm font-bold text-kobbo-black">
          Curated for Play
        </p>
        <p className="text-xs text-kobbo-muted">Premium toy picks</p>
      </div>

      <div className="absolute -right-2 top-6 rounded-2xl bg-kobbo-yellow px-3.5 py-2 shadow-soft sm:right-4">
        <p className="font-heading text-lg font-extrabold text-kobbo-black">
          500+
        </p>
        <p className="text-[10px] font-semibold text-kobbo-black/70">
          Happy Families
        </p>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-kobbo-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:flex lg:items-center lg:gap-12 lg:px-8 lg:py-12">
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-flex rounded-full bg-kobbo-beige px-3.5 py-1 text-xs font-semibold text-kobbo-black sm:text-sm">
            Premium Toys for Little Minds
          </span>

          <h1 className="font-heading mt-4 text-4xl font-extrabold leading-tight tracking-tight text-kobbo-black sm:text-5xl lg:text-6xl">
            Toy Dream
            <br />
            <span className="text-kobbo-yellow">Factory</span>
          </h1>

          <p className="font-heading mt-2 text-lg font-bold text-kobbo-muted sm:text-xl">
            Love to play from here
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-kobbo-muted sm:text-base lg:mx-0">
            Handpicked toys that spark curiosity, build skills and create joyful
            memories.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-kobbo-yellow px-7 py-3 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light hover:shadow-soft-lg"
            >
              Shop Now
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center justify-center rounded-full border-2 border-kobbo-black/10 bg-kobbo-white px-7 py-3 text-sm font-bold text-kobbo-black transition-all hover:-translate-y-0.5 hover:border-kobbo-yellow hover:shadow-soft"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-1 items-center justify-center lg:mt-0 lg:justify-end">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
