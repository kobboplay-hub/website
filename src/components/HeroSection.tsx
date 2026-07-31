import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight, Leaf, ShieldCheck, Star } from "lucide-react";
import { heroContent } from "@/data/home-content";

function ScreenFreeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <circle cx="20" cy="20" r="20" fill="#E8F6EE" />
      {/* Mind / brain icon */}
      <path
        d="M20 10.5c-2.6 0-4.4 1.5-5.1 3.5-.9-.5-2-.5-2.9.2-1.1.9-1.4 2.4-.8 3.7-.8.7-1.2 1.8-1 2.9.3 1.5 1.5 2.5 3 2.7v2.1c0 .7.6 1.3 1.3 1.3h2.2c.4 0 .7-.2.9-.5.5.7 1.4 1.2 2.4 1.2s1.9-.5 2.4-1.2c.2.3.5.5.9.5h2.2c.7 0 1.3-.6 1.3-1.3v-2.1c1.5-.2 2.7-1.2 3-2.7.2-1.1-.2-2.2-1-2.9.6-1.3.3-2.8-.8-3.7-.9-.7-2-.7-2.9-.2-.7-2-2.5-3.5-5.1-3.5z"
        fill="#16A34A"
      />
      <path
        d="M20 14.2v10.2M16.8 16.5c1 .8 2.1 1.2 3.2 1.2s2.2-.4 3.2-1.2M16.8 20.2c1 .8 2.1 1.2 3.2 1.2s2.2-.4 3.2-1.2"
        stroke="#E8F6EE"
        strokeWidth="1.35"
        strokeLinecap="round"
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
      className={`flex items-center border border-kobbo-beige/80 bg-white shadow-soft-lg ${
        compact
          ? "gap-1.5 rounded-full px-2.5 py-1.5"
          : "gap-2.5 rounded-2xl px-3.5 py-2.5"
      } ${className}`}
    >
      <ScreenFreeIcon
        className={`shrink-0 ${compact ? "h-7 w-7" : "h-10 w-10"}`}
      />
      <div className="leading-tight">
        <p
          className={`font-bold text-[#1A1A1A] ${
            compact ? "text-[11px]" : "text-sm"
          }`}
        >
          {title}
        </p>
        <p
          className={`font-semibold text-kobbo-green ${
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

  const headlineWords = headline.trim().split(/\s+/);
  const headlineLast = headlineWords.pop() ?? "";
  const headlineFirst = headlineWords.join(" ");

  return (
    <section id="hero" className="relative overflow-hidden bg-kobbo-cream">
      {/* ══════════ MOBILE — text fade into image (reference feel) ══════════ */}
      <div className="relative min-h-[100svh] overflow-hidden sm:hidden">
        <div className="absolute inset-0 ">
          <Image
            src={imageMobile}
            alt={imageAlt}
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-left object-[center_32%] mt-  "
          />
        </div>

        <div className="relative z-10 px-6 pb-8 pt-[4.75rem]">
          {/* Cream soft shadow — only behind text block (same feel as desktop) */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[78%] bg-[linear-gradient(180deg,rgba(255,251,240,0.8)_0%,rgba(255,251,240,0.8)_38%,rgba(255,251,240,0.7)_55%,rgba(255,251,240,0.45)_72%,rgba(255,251,240,0.15)_88%,transparent_100%)]"
            aria-hidden
          />

          <div className="relative">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-kobbo-beige bg-white px-4 py-2 shadow-soft">
            <Star
              className="h-4 w-4 fill-kobbo-yellow text-kobbo-yellow"
              strokeWidth={0}
            />
            <p className="text-xs font-semibold text-[#1A1A1A]">
              <span className="font-bold">{ratingValue}</span>{" "}
              <span className="font-semibold">{ratingLabel}</span>
            </p>
          </div>

          <div className="mt-5 flex items-start justify-between gap-3">
            <h1 className="font-heading min-w-0 flex-1 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A]">
              <span className="whitespace-nowrap">{headlineFirst}</span>
              <br />
              {headlineLast}
              <span className="text-kobbo-yellow">.</span>
            </h1>

            <ScreenFreeBadge
              title={imageBadgeTitle}
              subtitle={imageBadgeSubtitle}
              compact
              className="mt-4 shrink-0"
            />
          </div>

          <p className="mt-4 max-w-[16.5rem] text-[13px] font-medium leading-snug text-[#3A3A3A]">
            {description}
          </p>

          <div className="mt-6">
            <Link
              href={primaryCta.href}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-kobbo-yellow px-5 py-2 text-xs font-bold text-[#1A1A1A] shadow-soft transition-transform active:scale-[0.98]"
            >
              {primaryCta.label}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="mt-5 flex flex-col items-start gap-2">
            {trustItems.map((item) => (
              <div key={item.id} className="flex items-center gap-1.5">
                {item.icon === "shield" ? (
                  <ShieldCheck
                    className="h-3.5 w-3.5 shrink-0 text-[#1A1A1A]"
                    strokeWidth={2}
                  />
                ) : (
                  <Leaf
                    className="h-3.5 w-3.5 shrink-0 text-[#1A1A1A]"
                    strokeWidth={2}
                  />
                )}
                <span className="whitespace-nowrap text-[11px] font-semibold leading-none text-[#1A1A1A]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* ══════════ DESKTOP / TABLET — cream gradient like mobile ══════════ */}
      <div className="relative hidden min-h-[720px] sm:block lg:min-h-[min(88svh,860px)]">
        <div className="absolute inset-0">
          <Image
            src={imageDesktop}
            alt={imageAlt}
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-[70%_22%] lg:object-[70%_18%] xl:object-[58%_15%]"
          />
        </div>

        {/* Soft cream fade from left — same feel as mobile opacity wash */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[68%] bg-[linear-gradient(90deg,#fffbf0_0%,#fffbf0_32%,rgba(255,251,240,0.94)_48%,rgba(255,251,240,0.72)_62%,rgba(255,251,240,0.28)_78%,transparent_100%)] lg:w-[62%]"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-6 pb-16 pt-28 lg:min-h-[min(88svh,860px)] lg:px-10 lg:pb-20 lg:pt-32">
          <div className="relative w-full max-w-xl">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-kobbo-beige bg-white px-4 py-2 shadow-soft">
              <Star
                className="h-4 w-4 fill-kobbo-yellow text-kobbo-yellow"
                strokeWidth={0}
              />
              <p className="text-sm font-semibold text-[#1A1A1A]">
                <span className="font-bold">{ratingValue}</span>{" "}
                <span className="font-semibold">{ratingLabel}</span>
              </p>
            </div>

            <h1 className="font-heading mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A] lg:mt-6 lg:text-6xl xl:text-[4.5rem]">
              {headline}
              <span className="text-kobbo-yellow">.</span>
            </h1>

            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-[#3A3A3A] lg:mt-6 lg:text-lg">
              {description}
            </p>

            <div className="mt-8 lg:mt-9">
              <Link
                href={primaryCta.href}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-8 py-2.5 text-sm font-bold text-[#1A1A1A] shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light hover:shadow-soft-lg"
              >
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-3 lg:mt-7">
              {trustItems.map((item, index) => (
                <Fragment key={item.id}>
                  {index > 0 && (
                    <span
                      aria-hidden
                      className="h-3.5 w-px shrink-0 bg-[#1A1A1A]/20"
                    />
                  )}
                  <div className="flex items-center gap-1.5">
                    {item.icon === "shield" ? (
                      <ShieldCheck
                        className="h-4 w-4 shrink-0 text-[#1A1A1A]"
                        strokeWidth={2}
                      />
                    ) : (
                      <Leaf
                        className="h-4 w-4 shrink-0 text-[#1A1A1A]"
                        strokeWidth={2}
                      />
                    )}
                    <span className="whitespace-nowrap text-sm font-semibold leading-none text-[#1A1A1A]">
                      {item.label}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute right-6 top-[16%] lg:right-10 lg:top-[14%] xl:right-1">
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
