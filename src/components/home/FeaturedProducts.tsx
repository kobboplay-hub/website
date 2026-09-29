"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { JudgeMeProductSummary } from "@/lib/judgeme";
import { parseShopifyProductId } from "@/lib/judgeme";

const CARD_IMAGE_SIZES =
  "(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 360px";
const AUTOPLAY_INTERVAL_MS = 4000;
const RESUME_AFTER_TOUCH_MS = 4000;
const SCROLL_SETTLE_MS = 140;
/** The list is rendered three times so it can loop endlessly in both directions */
const LOOP_COPIES = 3;
const EASE = [0.22, 1, 0.36, 1] as const;

const copyContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const copyItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

interface FeaturedProductsProps {
  products: Product[];
  reviewSummaries?: Record<string, JudgeMeProductSummary>;
}

export default function FeaturedProducts({
  products,
  reviewSummaries = {},
}: FeaturedProductsProps) {
  const count = products.length;
  const canLoop = count > 1;
  const slides = canLoop
    ? Array.from({ length: LOOP_COPIES }, (_, copy) =>
        products.map((product) => ({ product, copy })),
      ).flat()
    : products.map((product) => ({ product, copy: 0 }));

  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const revealed = useInView(sectionRef, { amount: 0.2, once: true });
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [touching, setTouching] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const autoplay = canLoop && !reduceMotion;
  const progressRunning =
    autoplay && inView && pageVisible && !hovered && !keyboardFocus && !touching;

  const getStep = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!track || !first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first.offsetWidth + gap;
  }, []);

  const getRawIndex = useCallback(() => {
    const track = trackRef.current;
    const step = getStep();
    if (!track || !step) return 0;
    return Math.round(track.scrollLeft / step);
  }, [getStep]);

  const scrollToIndex = useCallback(
    (index: number, smooth: boolean) => {
      const track = trackRef.current;
      const step = getStep();
      if (!track || !step) return;
      track.scrollTo({
        left: index * step,
        behavior: smooth && !reduceMotion ? "smooth" : "instant",
      });
    },
    [getStep, reduceMotion],
  );

  /** Silently re-centre on the middle copy once a slide finishes moving */
  const normalize = useCallback(() => {
    if (!canLoop) return;
    const index = getRawIndex();
    if (index >= count * 2) scrollToIndex(index - count, false);
    else if (index < count) scrollToIndex(index + count, false);
  }, [canLoop, count, getRawIndex, scrollToIndex]);

  const goTo = (index: number) => {
    setTick((value) => value + 1);
    scrollToIndex(index, true);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !canLoop) return;

    scrollToIndex(count, false);
    let lastWidth = track.clientWidth;
    const observer = new ResizeObserver(() => {
      if (track.clientWidth === lastWidth) return;
      lastWidth = track.clientWidth;
      const logical = ((getRawIndex() % count) + count) % count;
      scrollToIndex(count + logical, false);
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [canLoop, count, getRawIndex, scrollToIndex]);

  useEffect(() => {
    const onVisibility = () =>
      setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(
    () => () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    },
    [],
  );

  const handleScroll = () => {
    const index = getRawIndex();
    setActive(canLoop ? ((index % count) + count) % count : index);

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(normalize, SCROLL_SETTLE_MS);
  };

  const pauseForTouch = () => {
    setTouching(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const resumeAfterTouch = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(
      () => setTouching(false),
      RESUME_AFTER_TOUCH_MS,
    );
  };

  const goToProduct = (productIndex: number) => {
    if (!canLoop) return;
    const base = Math.floor(getRawIndex() / count) * count;
    goTo(base + productIndex);
  };

  if (count === 0) return null;

  const reveal = reduceMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.3 },
      };

  const arrowClass =
    "group flex h-11 w-11 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white text-kobbo-black shadow-soft transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-kobbo-yellow hover:bg-kobbo-yellow hover:shadow-soft-lg active:translate-y-0 active:scale-95";

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-toys-heading"
      className="relative overflow-hidden border-t border-kobbo-beige bg-kobbo-cream py-12 sm:py-16 lg:py-20"
    >
      {/* Soft ambient glow behind the carousel */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-kobbo-yellow/20 blur-3xl sm:h-96 sm:w-96"
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <motion.div
            variants={copyContainer}
            {...reveal}
            className="lg:col-span-5 lg:pr-4"
          >
            <motion.p
              variants={copyItem}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-kobbo-muted sm:text-sm"
            >
              <motion.span
                className="inline-flex"
                animate={
                  reduceMotion ? undefined : { rotate: [0, 18, -8, 0], scale: [1, 1.2, 1] }
                }
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  repeatDelay: 2.2,
                  ease: "easeInOut",
                }}
              >
                <Sparkles
                  className="h-3.5 w-3.5 text-kobbo-yellow"
                  strokeWidth={2.5}
                />
              </motion.span>
              Featured picks
            </motion.p>
            <motion.h2
              variants={copyItem}
              id="featured-toys-heading"
              className="font-heading mt-2 text-2xl font-extrabold leading-tight text-kobbo-black sm:text-3xl lg:text-4xl"
            >
              This Week&apos;s{" "}
              <span className="relative isolate inline-block">
                Featured Toys
                <motion.span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-2 w-full origin-left rounded-full bg-kobbo-yellow/45 sm:h-2.5"
                  style={{ zIndex: -1 }}
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
                />
              </span>
            </motion.h2>
            <motion.p
              variants={copyItem}
              className="mt-3 max-w-md text-sm leading-relaxed text-kobbo-muted sm:text-base"
            >
              Explore thoughtfully selected toys chosen for creativity, learning
              and meaningful play.
            </motion.p>
            <motion.div variants={copyItem} className="mt-5 hidden lg:block">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-1.5 font-heading text-sm font-extrabold text-kobbo-black"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
                  Explore All Toys
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          <div
            className="min-w-0 lg:col-span-7"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHovered(true);
            }}
            onPointerLeave={() => setHovered(false)}
            onFocus={(event) => {
              if ((event.target as HTMLElement).matches(":focus-visible")) {
                setKeyboardFocus(true);
              }
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setKeyboardFocus(false);
              }
            }}
          >
            <div
              ref={trackRef}
              onScroll={handleScroll}
              onTouchStart={pauseForTouch}
              onTouchEnd={resumeAfterTouch}
              onTouchCancel={resumeAfterTouch}
              role="region"
              aria-roledescription="carousel"
              aria-label="Featured toys"
              className="scrollbar-none -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-3 sm:mx-0 sm:scroll-px-0 sm:px-0 lg:gap-5"
            >
              {slides.map(({ product, copy }, index) => (
                <motion.div
                  key={`${product.id}-${copy}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${(index % count) + 1} of ${count}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.96 }}
                  animate={
                    revealed || reduceMotion
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 36, scale: 0.96 }
                  }
                  transition={{
                    duration: 0.75,
                    ease: EASE,
                    delay: 0.15 + (index % count) * 0.08,
                  }}
                  className="flex w-[82%] shrink-0 snap-start flex-col sm:w-[calc(50%-0.5rem)] lg:w-[calc(50%-0.625rem)] [&>article]:flex-1"
                >
                  <ProductCard
                    product={product}
                    reviewSummary={
                      reviewSummaries[parseShopifyProductId(product.id)] ??
                      null
                    }
                    badge="Featured"
                    layout="featured"
                    imageSizes={CARD_IMAGE_SIZES}
                  />
                </motion.div>
              ))}
            </div>

            {canLoop && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
                className="mt-3 flex min-h-11 items-center justify-between gap-4"
              >
                <div className="flex items-center">
                  {products.map((product, index) => {
                    const isActive = index === active;
                    return (
                      <button
                        key={product.id}
                        type="button"
                        aria-label={`Go to ${product.title}`}
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => goToProduct(index)}
                        className="flex h-8 items-center px-1"
                      >
                        <span
                          className={`relative block h-2 overflow-hidden rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isActive
                              ? "w-8 bg-kobbo-black/10"
                              : "w-2 bg-kobbo-black/15 hover:bg-kobbo-black/30"
                          }`}
                        >
                          {isActive &&
                            (autoplay ? (
                              <span
                                key={`${active}-${tick}`}
                                onAnimationEnd={() =>
                                  goTo(getRawIndex() + 1)
                                }
                                className="absolute inset-0 origin-left rounded-full bg-kobbo-yellow"
                                style={{
                                  animation: `slide-progress ${AUTOPLAY_INTERVAL_MS}ms linear forwards`,
                                  animationPlayState: progressRunning
                                    ? "running"
                                    : "paused",
                                }}
                              />
                            ) : (
                              <span className="absolute inset-0 rounded-full bg-kobbo-yellow" />
                            ))}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    type="button"
                    aria-label="Previous featured toy"
                    onClick={() => goTo(getRawIndex() - 1)}
                    className={arrowClass}
                  >
                    <ChevronLeft
                      className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                      strokeWidth={2.25}
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="Next featured toy"
                    onClick={() => goTo(getRawIndex() + 1)}
                    className={arrowClass}
                  >
                    <ChevronRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      strokeWidth={2.25}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
