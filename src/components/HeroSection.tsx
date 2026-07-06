import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&h=1100&fit=crop";

function HeroVisual() {
  return (
    <div className="relative w-full max-w-[420px] lg:max-w-[460px]">
      <div
        aria-hidden
        className="absolute -inset-3 -z-10 rounded-[2rem] bg-kobbo-yellow/20 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[1.5rem] shadow-soft-lg sm:rounded-[1.75rem]">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={HERO_IMAGE}
            alt="Colorful premium educational toys for children"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 460px"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-kobbo-black/15 to-transparent" />
        </div>

        <div className="absolute right-4 top-4 rounded-xl bg-kobbo-yellow px-3.5 py-2 shadow-soft sm:right-5 sm:top-5 sm:rounded-2xl sm:px-4 sm:py-2.5">
          <p className="font-heading text-xs font-bold text-kobbo-black sm:text-sm">
            Screen-Free Childhood
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-kobbo-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-12">
        <div className="text-center lg:text-left">
          <span className="inline-flex rounded-full bg-kobbo-yellow/20 px-3.5 py-1 text-xs font-semibold text-kobbo-black sm:text-sm">
            Designed to Learn Through Play
          </span>

          <h1 className="font-heading mt-4 text-4xl font-extrabold leading-tight tracking-tight text-kobbo-black sm:text-5xl lg:text-6xl">
            Toys That Grow{" "}
            <span className="text-kobbo-yellow">Curious Minds</span>
          </h1>

          <p className="font-heading mt-2 text-lg font-bold text-kobbo-black sm:text-xl">
            More Than Toys.
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-kobbo-muted sm:text-base lg:mx-0">
            Educational toys, creative kits and games designed for growing
            children.
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
              Our Story
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
