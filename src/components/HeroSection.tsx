"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { heroContent } from "@/data/home-content";
import type { AgeGroup } from "@/lib/shopify/types";
import HeroButterflyFlight from "@/components/home/HeroButterflyFlight";
import TrustBadges from "@/components/TrustBadges";

function ScreenFreeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <circle cx="20" cy="20" r="20" fill="#E8F6EE" />
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
      className={`flex items-center border border-kobbo-beige/80 bg-white/95 backdrop-blur-xs shadow-soft-lg transition-all duration-300 ${compact
          ? "gap-1.5 rounded-full px-2.5 py-1.5"
          : "gap-2.5 rounded-2xl px-3.5 py-2.5 hover:shadow-xl"
        } ${className}`}
    >
      <ScreenFreeIcon
        className={`shrink-0 transition-transform duration-500 group-hover:scale-105 ${compact ? "h-7 w-7" : "h-10 w-10"
          }`}
      />
      <div className="min-w-0 leading-tight">
        <p
          className={`font-bold text-[#1A1A1A] ${compact ? "text-[11px]" : "text-sm"
            }`}
        >
          {title}
        </p>
        <p
          className={`font-semibold text-kobbo-green ${compact ? "text-[10px]" : "text-xs"
            }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/** Subtle floating decorative elements */
function HeroStar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none transition-transform duration-500 ease-out will-change-transform ${className}`}
      aria-hidden
    >
      <div className="animate-float-sparkle">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 drop-shadow-xs sm:h-6 sm:w-6">
          <path
            d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z"
            fill="#FFC700"
          />
          <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" fillOpacity="0.85" />
        </svg>
      </div>
    </div>
  );
}

function HeroLeaf({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none transition-transform duration-500 ease-out will-change-transform ${className}`}
      aria-hidden
    >
      <div className="animate-drift-leaf">
        <svg viewBox="0 0 28 28" fill="none" className="h-5 w-5 drop-shadow-xs sm:h-6 sm:w-6">
          <path
            d="M4 24C8 20 12 18 24 4C24 16 22 20 4 24Z"
            fill="#16A34A"
            fillOpacity="0.75"
          />
          <path
            d="M4 24C10 18 16 13 24 4"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
}

function HeroBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none transition-transform duration-500 ease-out will-change-transform ${className}`}
      aria-hidden
    >
      <div className="animate-float-block">
        <svg viewBox="0 0 32 36" fill="none" className="h-6 w-6 drop-shadow-xs sm:h-7 sm:w-7">
          <path d="M16 2L30 10L16 18L2 10L16 2Z" fill="#FFE58F" />
          <path d="M2 10L16 18V34L2 26V10Z" fill="#E8B923" />
          <path d="M16 18L30 10V26L16 34V18Z" fill="#C69412" />
        </svg>
      </div>
    </div>
  );
}

function HeroAgeButtons({ ageGroups, compact = false }: { ageGroups: AgeGroup[]; compact?: boolean }) {
  const sortedGroups = [...ageGroups]
    .sort((a, b) => Number(a.name.match(/\d+/)?.[0] ?? 99) - Number(b.name.match(/\d+/)?.[0] ?? 99))
    .slice(0, 2);
  const ageButtons = [
    { label: "2–3 years", group: sortedGroups[0] },
    { label: "3–5 years", group: sortedGroups[1] },
  ];

  return (
    <div className="hero-enter-cta mt-5 lg:mt-8">
      <p className="mb-2.5 text-xs font-bold text-kobbo-black sm:text-sm">Shop by your child&apos;s age</p>
      <div className="flex flex-wrap gap-2.5">
        {ageButtons.map(({ label, group }) => (
          <Link
            key={label}
            href="#play-kits"
            onClick={() => {
              if (group) window.dispatchEvent(new CustomEvent("kobbo:select-play-kit-age", { detail: group.id }));
            }}
            className={`inline-flex items-center justify-center rounded-full bg-kobbo-yellow font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black ${compact ? "min-h-10 px-5 text-xs" : "min-h-11 px-7 text-sm"}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection({ ageGroups }: { ageGroups: AgeGroup[] }) {
  const {
    headline,
    description,
    trustItems,
    imageBadgeTitle,
    imageBadgeSubtitle,
    imageDesktop,
    imageMobile,
    imageAlt,
  } = heroContent;

  const heroRef = useRef<HTMLElement>(null);

  // Smooth desktop mouse parallax effect (disabled on touch/mobile)
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!media.matches) return;

    const el = heroRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 2;
      targetY = y * 2;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      el.style.setProperty("--px", currentX.toFixed(4));
      el.style.setProperty("--py", currentY.toFixed(4));

      rafId = requestAnimationFrame(animate);
    };

    el.addEventListener("mousemove", onMouseMove, { passive: true });
    el.addEventListener("mouseleave", onMouseLeave, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const headlineWords = headline.trim().split(/\s+/);
  const headlineLast = headlineWords.pop() ?? "";
  const headlineFirst = headlineWords.join(" ");

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{ "--px": "0", "--py": "0" } as React.CSSProperties}
      className="relative overflow-hidden bg-kobbo-cream"
    >
      {/* ══════════ MOBILE — stable across all phone widths / aspect ratios ══════════ */}
      <div className="relative isolate min-h-[max(100svh,600px)] overflow-hidden sm:hidden">
        <div className="absolute inset-0 top-8 overflow-hidden">
          <Image
            src={imageMobile}
            alt={imageAlt}
            fill
            priority
            quality={95}
            sizes="100vw"
            className="animate-hero-image object-cover object-[center_15%]"
          />
        </div>

        {/* Cream wash keeps copy readable; child stays in lower half */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[50%] bg-[linear-gradient(180deg,rgba(255,251,240,0.92)_0%,rgba(255,251,240,0.88)_42%,rgba(255,251,240,0.55)_68%,rgba(255,251,240,0.18)_86%,transparent_100%)]"
          aria-hidden
        />

        {/* Fade the image gently behind the mobile benefit strip. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-52 bg-[linear-gradient(0deg,rgba(255,248,232,0.94)_0%,rgba(255,248,232,0.62)_42%,transparent_100%)]"
          aria-hidden
        />

        {/* Animated Traveling Butterfly with Sparkling Trail */}
        <HeroButterflyFlight variant="mobile" />

        {/* Subtle mobile floating decor */}
        <HeroStar className="absolute left-4 top-16 z-10" />
        <HeroLeaf className="absolute right-5 top-[44%] z-10" />

        <div className="relative z-10 px-6 pb-8 pt-[4.5rem]">
          <div className="relative w-full">
            {/* Staggered Layer 1: Headline & Floating Badge */}
            <div className="flex w-full items-start justify-between gap-3">
              <h1 className="hero-enter-headline font-heading min-w-0 flex-1 text-[clamp(1.85rem,8.2vw,2.35rem)] font-extrabold leading-[1.08] tracking-tight text-[#1A1A1A]">
                <span className="block">{headlineFirst}</span>
                <span className="block">
                  {headlineLast}
                  <span className="text-kobbo-yellow">.</span>
                </span>
              </h1>

              <div className="animate-badge-bob mt-4 shrink-0">
                <ScreenFreeBadge
                  title={imageBadgeTitle}
                  subtitle={imageBadgeSubtitle}
                  compact
                />
              </div>
            </div>

            {/* Staggered Layer 2: Description */}
            <p className="hero-enter-desc mt-3 max-w-[17rem] text-[clamp(0.8125rem,3.4vw,0.875rem)] font-medium leading-snug text-[#3A3A3A]">
              {description}
            </p>

            <HeroAgeButtons ageGroups={ageGroups} compact />

            {/* Staggered Layer 4: Trust Items */}
            <div className="hero-enter-trust mt-4 flex flex-col items-start gap-2">
              {trustItems.map((item) => (
                <div key={item.id} className="flex items-center gap-1.5">
                  {(item.icon as string) === "shield" ? (
                    <ShieldCheck
                      className="h-3.5 w-3.5 shrink-0 text-kobbo-black"
                      strokeWidth={2}
                    />
                  ) : (item.icon as string) === "sparkles" ? (
                    <Sparkles
                      className="h-3.5 w-3.5 shrink-0 text-kobbo-black"
                      strokeWidth={2}
                    />
                  ) : (
                    <Leaf
                      className="h-3.5 w-3.5 shrink-0 text-kobbo-green"
                      strokeWidth={2}
                    />
                  )}
                  <span className="text-[11px] font-semibold leading-none text-[#1A1A1A]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ DESKTOP / TABLET ══════════ */}
      <div className="relative hidden min-h-[720px] sm:block lg:min-h-[min(88svh,860px)]">
        {/* Soft Ambient Background Blur Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[8%] top-[12%] h-80 w-80 rounded-full bg-amber-200/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[15%] bottom-[16%] h-96 w-96 rounded-full bg-emerald-100/25 blur-3xl"
        />

        {/* Parallax Image Layer: moves opposite to cursor for subtle 3D depth */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform:
              "translate3d(calc(var(--px, 0) * -10px), calc(var(--py, 0) * -8px), 0)",
          }}
        >
          <Image
            src={imageDesktop}
            alt={imageAlt}
            fill
            priority
            quality={95}
            sizes="100vw"
            className="animate-hero-image object-cover object-[70%_22%] lg:object-[70%_18%] xl:object-[58%_15%]"
          />
        </div>

        {/* Soft gradient cream wash keeping text highly legible */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[68%] bg-[linear-gradient(90deg,#fffbf0_0%,#fffbf0_32%,rgba(255,251,240,0.94)_48%,rgba(255,251,240,0.72)_62%,rgba(255,251,240,0.28)_78%,transparent_100%)] lg:w-[62%]"
          aria-hidden
        />

        {/* Animated Traveling Butterflies with Sparkling Stardust Trail */}
        <HeroButterflyFlight variant="desktop" />

        {/* Floating Decorative Elements Layer: subtle parallax depth */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform:
              "translate3d(calc(var(--px, 0) * 20px), calc(var(--py, 0) * 16px), 0)",
          }}
          aria-hidden
        >
          {/* Golden Sparkle Star near headline top-left */}
          <HeroStar className="absolute left-[7%] top-[18%]" />

          {/* Gentle Botanical Leaf near trust badges */}
          <HeroLeaf className="absolute left-[44%] bottom-[14%] lg:left-[47%]" />

          {/* Pastel Montessori Wooden Block on right */}
          <HeroBlock className="absolute right-[6%] top-[38%] lg:right-[8%]" />
        </div>

        {/* Parallax Content Container */}
        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-6 pb-16 pt-28 lg:min-h-[min(88svh,860px)] lg:px-10 lg:pb-20 lg:pt-32">
          {/* Left Text Column: moves subtly with mouse */}
          <div
            className="relative z-20 w-full max-w-xl transition-transform duration-500 ease-out will-change-transform"
            style={{
              transform:
                "translate3d(calc(var(--px, 0) * 8px), calc(var(--py, 0) * 6px), 0)",
            }}
          >
            {/* Staggered Layer 1: Headline */}
            <h1 className="hero-enter-headline font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A] lg:text-6xl xl:text-[4.5rem]">
              {headline}
              <span className="text-kobbo-yellow">.</span>
            </h1>

            {/* Staggered Layer 2: Description */}
            <p className="hero-enter-desc mt-5 max-w-md text-base font-medium leading-relaxed text-[#3A3A3A] lg:mt-6 lg:text-lg">
              {description}
            </p>

            <HeroAgeButtons ageGroups={ageGroups} />

            {/* Staggered Layer 4: Trust Items */}
            <div className="hero-enter-trust mt-6 flex items-center gap-3 lg:mt-7">
              {trustItems.map((item, index) => (
                <Fragment key={item.id}>
                  {index > 0 && (
                    <span
                      aria-hidden
                      className="h-3.5 w-px shrink-0 bg-[#1A1A1A]/20"
                    />
                  )}
                  <div className="flex items-center gap-1.5">
                    {(item.icon as string) === "shield" ? (
                      <ShieldCheck
                        className="h-4 w-4 shrink-0 text-kobbo-black"
                        strokeWidth={2}
                      />
                    ) : (item.icon as string) === "sparkles" ? (
                      <Sparkles
                        className="h-4 w-4 shrink-0 text-kobbo-black"
                        strokeWidth={2}
                      />
                    ) : (
                      <Leaf
                        className="h-4 w-4 shrink-0 text-kobbo-green"
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

          {/* Floating Top-Right Badge: moves with independent parallax & soft bobbing */}
          <div
            className="pointer-events-none absolute right-6 top-[16%] z-20 transition-transform duration-500 ease-out will-change-transform lg:right-10 lg:top-[14%] xl:right-1"
            style={{
              transform:
                "translate3d(calc(var(--px, 0) * 16px), calc(var(--py, 0) * 14px), 0)",
            }}
          >
            <div className="animate-badge-bob">
              <ScreenFreeBadge
                title={imageBadgeTitle}
                subtitle={imageBadgeSubtitle}
              />
            </div>
          </div>
        </div>
      </div>
      <TrustBadges />
    </section>
  );
}
