import Image from "next/image";
import Link from "next/link";

const HERO_BG_DESKTOP = "/ChatGPT Image Jul 27, 2026, 04_37_01 PM.png";
const HERO_BG_MOBILE = "/ChatGPT Image Jul 27, 2026, 04_56_18 PM.png";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">

      {/* ══════════ MOBILE (<sm) ══════════ */}
      <div className="relative h-[480px] sm:hidden">
        {/* Background image */}
        <Image
          src={HERO_BG_MOBILE}
          alt="Child playing with colorful toys"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Bottom dark overlay for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

        {/* Text — absolute bottom aligned */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-7">
          <span className="inline-flex rounded-full bg-kobbo-yellow px-3 py-1 text-xs font-semibold text-kobbo-black shadow-soft">
            Designed to Learn Through Play
          </span>

          <h1 className="font-heading mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow">
            Toys That Grow{" "}
            <span className="text-kobbo-yellow">Curious Minds</span>
          </h1>

          <p className="mt-1 text-sm font-semibold text-white/90">
            More Than Toys.
          </p>

          <p className="mt-1 text-xs leading-snug text-white/75">
            Educational toys, creative kits and games for growing children.
          </p>

          <div className="mt-3 flex gap-2">
            <Link
              href="/shop"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-kobbo-yellow py-2.5 text-sm font-bold text-kobbo-black shadow-soft active:scale-[0.98]"
            >
              Shop Now
            </Link>
            <Link
              href="#about"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-white/50 bg-white/20 py-2.5 text-sm font-bold text-white backdrop-blur-sm active:scale-[0.98]"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════ DESKTOP / TABLET (≥sm) ══════════ */}
      <div className="relative hidden sm:block">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_BG_DESKTOP}
            alt="Child playing with colorful toys"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/65 to-white/5 lg:from-white/85 lg:via-white/50 lg:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-kobbo-cream/60 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-24 lg:min-h-[640px] lg:px-8">
          <div className="max-w-lg">
            <span className="inline-flex rounded-full bg-kobbo-yellow/90 px-3.5 py-1 text-sm font-semibold text-kobbo-black shadow-soft backdrop-blur-sm">
              Designed to Learn Through Play
            </span>

            <h1 className="font-heading mt-4 text-5xl font-extrabold leading-tight tracking-tight text-kobbo-black lg:text-6xl">
              Toys That Grow{" "}
              <span className="text-kobbo-yellow">Curious Minds</span>
            </h1>

            <p className="font-heading mt-2 text-xl font-bold text-kobbo-black">
              More Than Toys.
            </p>

            <p className="mt-3 max-w-sm text-base leading-relaxed text-kobbo-black/70">
              Educational toys, creative kits and games designed for growing
              children.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-kobbo-yellow px-7 py-3 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light hover:shadow-soft-lg"
              >
                Shop Now
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center justify-center rounded-full border-2 border-kobbo-black/15 bg-kobbo-white/80 px-7 py-3 text-sm font-bold text-kobbo-black backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-kobbo-yellow hover:shadow-soft"
              >
                Our Story
              </Link>
            </div>

            <div className="mt-5 inline-flex rounded-2xl bg-kobbo-white/80 px-4 py-2 shadow-soft backdrop-blur-sm">
              <p className="font-heading text-sm font-bold text-kobbo-black">
                ✨ Screen-Free Childhood
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
