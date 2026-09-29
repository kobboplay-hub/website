"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { Brain, Sparkles } from "lucide-react";

const STAT_VALUE = 90;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const introList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const introItem: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const pillList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } },
};

const pillItem: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

const PILLS = [
  { label: "Neural Pathway Formation", iconClass: "text-kobbo-yellow" },
  { label: "Sensory-Rich Play", iconClass: "text-kobbo-green" },
];

export default function ResearchStatBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const statRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const revealed = useInView(sectionRef, { amount: 0.25, once: true });
  const statInView = useInView(statRef, { amount: 0.6, once: true });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mainY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const detailY = useTransform(scrollYProgress, [0, 1], [48, -40]);
  const blobY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  useEffect(() => {
    const node = statRef.current;
    if (!node || !statInView) return;
    if (reduceMotion) {
      node.textContent = String(STAT_VALUE);
      return;
    }
    const controls = animate(0, STAT_VALUE, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (value) => {
        node.textContent = String(Math.round(value));
      },
    });
    return () => controls.stop();
  }, [statInView, reduceMotion]);

  const state = revealed ? "show" : "hidden";

  return (
    <section
      ref={sectionRef}
      aria-labelledby="early-years-heading"
      className="relative overflow-hidden border-t border-kobbo-beige bg-kobbo-white py-12 sm:py-16 lg:py-20"
    >
      <motion.div
        aria-hidden="true"
        style={reduceMotion ? undefined : { y: blobY }}
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-kobbo-yellow/15 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-kobbo-beige/80 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#f6eedc_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-8 lg:px-8">
        {/* Intro copy */}
        <motion.div
          variants={introList}
          initial={reduceMotion ? false : "hidden"}
          animate={state}
          className="text-center lg:col-start-2 lg:row-start-1 lg:self-end lg:text-left"
        >
          <motion.div
            variants={introItem}
            className="inline-flex items-center gap-1.5 rounded-full border border-kobbo-beige bg-kobbo-cream px-3 py-1 text-xs font-bold text-kobbo-black shadow-2xs"
          >
            <Brain className="h-3.5 w-3.5 text-kobbo-green" aria-hidden="true" />
            <span>Early Brain Architecture</span>
          </motion.div>

          <motion.h2
            id="early-years-heading"
            variants={introItem}
            className="font-heading mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-kobbo-black sm:text-4xl lg:text-5xl"
          >
            The early years matter.{" "}
            <span className="relative isolate inline-block whitespace-nowrap">
              A lot.
              <motion.span
                aria-hidden="true"
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={revealed ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT }}
                className="absolute inset-x-[-4%] bottom-[0.08em] -z-10 h-[0.38em] origin-left rounded-full bg-kobbo-yellow/70"
              />
            </span>
          </motion.h2>

          <motion.p
            variants={introItem}
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-kobbo-black/75 sm:text-base sm:leading-relaxed lg:mx-0"
          >
            The first five years are a remarkable window for growth and
            development, and everyday experiences help shape the foundations
            for what comes next.
          </motion.p>

          <motion.ul
            variants={pillList}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
          >
            {PILLS.map((pill) => (
              <motion.li
                key={pill.label}
                variants={pillItem}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-kobbo-beige bg-kobbo-white px-3.5 py-1.5 text-xs font-semibold text-kobbo-black shadow-2xs"
              >
                <Sparkles className={`h-3.5 w-3.5 ${pill.iconClass}`} aria-hidden="true" />
                {pill.label}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Image collage */}
        <div className="relative mx-auto w-full max-w-md pb-10 pr-8 sm:max-w-lg sm:pb-12 sm:pr-14 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center lg:pb-14 lg:pr-20">
          <motion.div
            style={reduceMotion ? undefined : { y: mainY }}
            className="relative"
          >
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : { clipPath: "inset(100% 0% 0% 0% round 2rem)", scale: 1.08 }
              }
              animate={
                revealed
                  ? { clipPath: "inset(0% 0% 0% 0% round 2rem)", scale: 1 }
                  : undefined
              }
              transition={{ duration: 1.1, ease: EASE_OUT }}
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-kobbo-beige shadow-[0_30px_60px_-30px_rgba(31,31,31,0.35)]"
            >
              <Image
                src="/early-years-main.avif"
                alt="Toddler stacking colourful wooden blocks with a parent's help"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 85vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-kobbo-black/15 via-transparent to-transparent"
              />
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.9 }}
              animate={revealed ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ duration: 0.6, delay: 0.9, ease: EASE_OUT }}
              className="absolute left-3 top-3 sm:left-5 sm:top-5"
            >
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-1.5 rounded-full bg-kobbo-white/90 px-3 py-1.5 text-[11px] font-bold text-kobbo-black shadow-soft backdrop-blur sm:text-xs"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kobbo-yellow opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-kobbo-yellow" />
                </span>
                Learning through play
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            style={reduceMotion ? undefined : { y: detailY }}
            className="absolute bottom-0 right-0 w-[46%] sm:w-[44%]"
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8, rotate: -8 }}
              animate={revealed ? { opacity: 1, scale: 1, rotate: 3 } : undefined}
              transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.55 }}
              whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.03 }}
              className="relative aspect-square overflow-hidden rounded-3xl border-[5px] border-kobbo-white bg-kobbo-beige shadow-[0_24px_48px_-20px_rgba(31,31,31,0.4)] sm:border-[6px]"
            >
              <Image
                src="/early-years-detail.avif"
                alt="Small hands placing a ring on a wooden stacking toy"
                fill
                sizes="(min-width: 1024px) 18vw, (min-width: 640px) 13rem, 40vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
            animate={revealed ? { opacity: 1, scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.8 }}
            className="absolute -left-3 bottom-16 h-10 w-10 sm:-left-5 sm:h-14 sm:w-14"
          >
            <motion.div
              animate={reduceMotion ? undefined : { rotate: [12, -6, 12] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-full rounded-2xl bg-kobbo-yellow shadow-soft"
            />
          </motion.div>
        </div>

        {/* Stat card */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT }}
          className="lg:col-start-2 lg:row-start-2 lg:self-start"
        >
          <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-kobbo-beige bg-kobbo-cream p-6 shadow-soft sm:p-8 lg:mx-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-kobbo-yellow/25 blur-2xl"
            />

            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-7 sm:text-left">
              <p className="font-heading shrink-0 text-6xl font-black leading-none tracking-tight text-kobbo-black sm:text-7xl">
                <span className="sr-only">{STAT_VALUE}%</span>
                <span ref={statRef} aria-hidden="true">
                  {reduceMotion ? STAT_VALUE : 0}
                </span>
                <span aria-hidden="true" className="text-kobbo-yellow">
                  %
                </span>
              </p>

              <div className="w-full min-w-0">
                <p className="font-heading text-sm font-bold leading-snug text-kobbo-black sm:text-base">
                  By age 5, a child&apos;s brain has reached around 90% of its
                  adult size.
                </p>

                <div
                  className="mt-4 h-2 w-full overflow-hidden rounded-full bg-kobbo-white"
                  role="presentation"
                >
                  <motion.div
                    initial={reduceMotion ? false : { width: "0%" }}
                    animate={
                      statInView || reduceMotion
                        ? { width: `${STAT_VALUE}%` }
                        : undefined
                    }
                    transition={{ duration: 1.8, ease: EASE_OUT }}
                    style={reduceMotion ? { width: `${STAT_VALUE}%` } : undefined}
                    className="h-full rounded-full bg-gradient-to-r from-kobbo-yellow-light to-kobbo-yellow"
                  />
                </div>

                <span className="mt-3 block text-[11px] font-medium uppercase tracking-wider text-kobbo-muted">
                  Pediatric Neuroscience Research
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
