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
}: {
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-soft-lg backdrop-blur-sm ${className}`}
    >
      <ScreenFreeIcon className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <div className="leading-tight">
        <p className="text-xs font-bold text-kobbo-black sm:text-sm">{title}</p>
        <p className="text-[11px] font-medium text-kobbo-green sm:text-xs">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function HeroContent({
  ratingValue,
  ratingLabel,
  headline,
  description,
  primaryCta,
  trustItems,
  imageBadgeTitle,
  imageBadgeSubtitle,
  variant,
}: {
  ratingValue: string;
  ratingLabel: string;
  headline: string;
  description: string;
  primaryCta: { label: string; href: string };
  trustItems: { id: string; label: string; icon: "shield" | "leaf" }[];
  imageBadgeTitle: string;
  imageBadgeSubtitle: string;
  variant: "mobile" | "desktop";
}) {
  const isMobile = variant === "mobile";

  return (
    <div className={`relative w-full ${isMobile ? "max-w-none" : "max-w-xl"}`}>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-soft backdrop-blur-sm">
        <Star
          className="h-3.5 w-3.5 fill-kobbo-yellow text-kobbo-yellow"
          strokeWidth={0}
        />
        <p className="text-[11px] font-semibold text-kobbo-black sm:text-sm">
          <span className="font-bold">{ratingValue}</span>{" "}
          <span className="font-medium text-kobbo-black/80">{ratingLabel}</span>
        </p>
      </div>

      <h1
        className={`font-heading font-extrabold leading-[1.05] tracking-tight text-kobbo-black ${
          isMobile
            ? "mt-4 max-w-[72%] text-[2.35rem]"
            : "mt-6 text-5xl lg:text-6xl xl:text-[4.25rem]"
        }`}
      >
        {headline}
        <span className="text-kobbo-yellow">.</span>
      </h1>

      <p
        className={`leading-relaxed text-kobbo-muted ${
          isMobile
            ? "mt-3 max-w-[85%] text-sm"
            : "mt-5 max-w-md text-lg"
        }`}
      >
        {description}
      </p>

      <div className={isMobile ? "mt-5" : "mt-8"}>
        <Link
          href={primaryCta.href}
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-kobbo-yellow font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light hover:shadow-soft-lg ${
            isMobile
              ? "min-h-11 px-6 py-2.5 text-sm"
              : "min-h-[3.25rem] px-8 py-3 text-base"
          }`}
        >
          {primaryCta.label}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>

      <div
        className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-kobbo-muted ${
          isMobile ? "mt-5" : "mt-8"
        }`}
      >
        {trustItems.map((item, index) => (
          <div key={item.id} className="flex items-center gap-3">
            {index > 0 && (
              <span
                aria-hidden
                className="h-3.5 w-px bg-kobbo-muted/30"
              />
            )}
            <div className="flex items-center gap-1.5">
              {item.icon === "shield" ? (
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
              ) : (
                <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
              )}
              <span className="text-[11px] font-medium sm:text-sm">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isMobile && (
        <ScreenFreeBadge
          title={imageBadgeTitle}
          subtitle={imageBadgeSubtitle}
          className="absolute right-0 top-[7.5rem] max-w-[9.5rem]"
        />
      )}
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

  const contentProps = {
    ratingValue,
    ratingLabel,
    headline,
    description,
    primaryCta,
    trustItems,
    imageBadgeTitle,
    imageBadgeSubtitle,
  };

  return (
    <section className="relative overflow-hidden bg-kobbo-cream">
      {/* ══════════ MOBILE ══════════ */}
      <div className="relative min-h-[600px] sm:hidden">
        <div className="absolute inset-0">
          <Image
            src={imageMobile}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf6ef]/98 via-[#faf6ef]/88 via-45% to-transparent" />
        </div>

        <div className="relative px-4 pb-8 pt-5">
          <HeroContent {...contentProps} variant="mobile" />
        </div>
      </div>

      {/* ══════════ DESKTOP / TABLET ══════════ */}
      <div className="relative hidden min-h-[560px] sm:block lg:min-h-[640px]">
        <div className="absolute inset-0">
          <Image
            src={imageDesktop}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f1e8]/92 via-[#f7f1e8]/55 to-transparent lg:via-[#f7f1e8]/40" />
        </div>

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-20 lg:min-h-[640px] lg:px-8 lg:py-24">
          <HeroContent {...contentProps} variant="desktop" />

          <div className="pointer-events-none absolute right-8 top-[42%] hidden -translate-y-1/2 sm:block lg:right-12 xl:right-16">
            <div className="animate-[float_4s_ease-in-out_infinite]">
              <ScreenFreeBadge
                title={imageBadgeTitle}
                subtitle={imageBadgeSubtitle}
                className="gap-2.5 px-3.5 py-2.5"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
