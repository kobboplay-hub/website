import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Star } from "lucide-react";
import { heroContent } from "@/data/home-content";

function ScreenFreeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <circle cx="20" cy="20" r="20" fill="#E8F6EE" />
      <path
        d="M20 11.5c-3.2 0-5.5 2.1-5.5 5.2 0 2.4 1.3 4.1 3.2 5.1v1.4c0 .5.4.9.9.9h2.8c.5 0 .9-.4.9-.9v-1.4c1.9-1 3.2-2.7 3.2-5.1 0-3.1-2.3-5.2-5.5-5.2z"
        fill="#16A34A"
        opacity="0.9"
      />
      <path
        d="M12 28.5l16-17"
        stroke="#16A34A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect
        x="24.5"
        y="22"
        width="6"
        height="8"
        rx="1.2"
        stroke="#16A34A"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}

function ScreenFreeBadge({
  title,
  subtitle,
  className = "",
  compact = false,
}: {
  title: string;
  subtitle: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center rounded-2xl bg-white/95 shadow-soft-lg backdrop-blur-sm ${
        compact ? "gap-1.5 px-2.5 py-1.5" : "gap-2.5 px-3.5 py-2.5"
      } ${className}`}
    >
      <ScreenFreeIcon
        className={`shrink-0 ${compact ? "h-8 w-8" : "h-10 w-10"}`}
      />
      <div className="leading-tight">
        <p
          className={`font-bold text-kobbo-black ${
            compact ? "text-[11px]" : "text-sm"
          }`}
        >
          {title}
        </p>
        <p
          className={`font-medium text-kobbo-green ${
            compact ? "text-[10px]" : "text-xs"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const {
    ratingValue,
    ratingLabel,
    headline,
    description,
    primaryCta,
    trustItems,
    imageBadgeTitle,
    imageBadgeSubtitle,
    imageDesktop,
    imageMobile,
    imageAlt,
  } = heroContent;

  return (
    <section id="hero" className="relative overflow-hidden bg-kobbo-cream">
      {/* ══════════ MOBILE ══════════ */}
      <div className="relative h-[min(88svh,620px)] sm:hidden">
        <div className="absolute inset-0">
          <Image
            src={imageMobile}
            alt={imageAlt}
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-[center_22%]"
          />
          {/* Light bottom wash only — keep photo crisp */}
          <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>

        <div className="pointer-events-none absolute right-3 top-[4.75rem] z-10">
          <ScreenFreeBadge
            title={imageBadgeTitle}
            subtitle={imageBadgeSubtitle}
            compact
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 pt-10 text-center">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-[#fff8e8]/95 px-3 py-1.5 shadow-soft backdrop-blur-sm">
            <Star
              className="h-3.5 w-3.5 fill-kobbo-yellow text-kobbo-yellow"
              strokeWidth={0}
            />
            <p className="text-[11px] font-semibold text-kobbo-black">
              <span className="font-bold">{ratingValue}</span>{" "}
              <span className="font-medium text-kobbo-black/75">
                {ratingLabel}
              </span>
            </p>
          </div>

          <h1 className="font-heading mx-auto mt-3 max-w-[15ch] text-[2.35rem] font-extrabold leading-[1.05] tracking-tight text-kobbo-black">
            {headline}
            <span className="text-kobbo-yellow">.</span>
          </h1>

          <p className="mx-auto mt-2.5 max-w-[28ch] text-sm leading-relaxed text-kobbo-muted">
            {description}
          </p>

          <div className="mt-4 flex justify-center">
            <Link
              href={primaryCta.href}
              className="inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-8 py-3 text-sm font-bold text-kobbo-black shadow-soft transition-transform active:scale-[0.98]"
            >
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-kobbo-muted">
            {trustItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                {index > 0 && (
                  <span aria-hidden className="h-3.5 w-px bg-kobbo-muted/30" />
                )}
                <div className="flex items-center gap-1.5">
                  {item.icon === "shield" ? (
                    <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <Leaf className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                  <span className="text-[11px] font-medium">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ DESKTOP / TABLET — crisp immersive ══════════ */}
      <div className="relative hidden min-h-[100svh] max-h-[900px] sm:block lg:min-h-[720px]">
        <div className="absolute inset-0">
          <Image
            src={imageDesktop}
            alt={imageAlt}
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-[72%_center]"
          />
          {/* Soft left readability only — no heavy fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/20 via-40% to-transparent lg:from-white/45 lg:via-white/10" />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-h-[900px] max-w-7xl items-center px-6 pb-16 pt-28 lg:min-h-[720px] lg:px-8 lg:pb-20 lg:pt-32">
          <div className="relative w-full max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff8e8]/95 px-3.5 py-1.5 shadow-soft backdrop-blur-sm">
              <Star
                className="h-3.5 w-3.5 fill-kobbo-yellow text-kobbo-yellow"
                strokeWidth={0}
              />
              <p className="text-sm font-semibold text-kobbo-black">
                <span className="font-bold">{ratingValue}</span>{" "}
                <span className="font-medium text-kobbo-black/80">
                  {ratingLabel}
                </span>
              </p>
            </div>

            <h1 className="font-heading mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-kobbo-black lg:mt-6 lg:text-6xl xl:text-[4.35rem]">
              {headline}
              <span className="text-kobbo-yellow">.</span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-kobbo-muted lg:mt-5 lg:text-lg">
              {description}
            </p>

            <div className="mt-7 lg:mt-8">
              <Link
                href={primaryCta.href}
                className="inline-flex min-h-[3.25rem] min-w-[200px] items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-10 py-3.5 text-base font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light hover:shadow-soft-lg"
              >
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-kobbo-muted lg:mt-8">
              {trustItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4">
                  {index > 0 && (
                    <span aria-hidden className="h-4 w-px bg-kobbo-muted/30" />
                  )}
                  <div className="flex items-center gap-1.5">
                    {item.icon === "shield" ? (
                      <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Leaf className="h-4 w-4" strokeWidth={2} />
                    )}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute right-8 top-[48%] -translate-y-1/2 lg:right-14 xl:right-20">
            <div className="animate-[float_4s_ease-in-out_infinite]">
              <ScreenFreeBadge
                title={imageBadgeTitle}
                subtitle={imageBadgeSubtitle}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
