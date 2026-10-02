"use client";

import { motion, useReducedMotion } from "motion/react";

const paragraphs = [
  "I've always found the toy aisle a little overwhelming.",
  "So many choices. So many things labelled educational. And so much time spent wondering what is actually worth bringing home.",
  "That got me thinking, what if someone just did the choosing for you?",
  "That's the idea behind Kobbo.",
  "We bring together thoughtful toys and activities for different ages and kinds of play, and put them together in a way that makes choosing a little easier.",
];

export default function FounderNote() {
  const reduceMotion = useReducedMotion();
  const reveal = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay: reduceMotion ? 0 : delay, ease: "easeOut" as const },
  });

  return (
    <section aria-labelledby="founder-heading" className="overflow-hidden bg-kobbo-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-kobbo-beige bg-kobbo-cream shadow-soft-lg md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex min-h-60 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_25%,#fff8e8_0%,#ffe17b_50%,#ffc700_100%)] p-8 sm:min-h-80 md:min-h-full"
          >
            {/* Replace this panel with Ruchi's portrait when the client supplies it. */}
            <div className="relative flex aspect-[4/5] w-40 max-w-full flex-col items-center justify-center rounded-[7rem] border border-white/70 bg-white/35 text-center shadow-soft backdrop-blur-sm sm:w-52">
              <span className="font-heading text-7xl font-extrabold text-kobbo-black/70 sm:text-8xl" aria-hidden>R</span>
              <span className="px-4 text-xs font-semibold text-kobbo-black/70">Ruchi&apos;s portrait coming soon</span>
            </div>
          </motion.div>

          <div className="p-6 sm:p-10 lg:p-14">
            <motion.h2 {...reveal(0)} id="founder-heading" className="font-heading text-3xl font-extrabold tracking-tight text-kobbo-black sm:text-4xl">
              A Note From Founder
            </motion.h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-kobbo-black/85 sm:text-base sm:leading-7">
              {paragraphs.map((paragraph, index) => (
                <motion.p key={paragraph} {...reveal(0.08 + index * 0.12)} className={index === 3 ? "font-bold text-kobbo-black" : ""}>
                  {paragraph}
                </motion.p>
              ))}
            </div>
            <motion.p {...reveal(0.8)} className="mt-8 border-t border-kobbo-beige pt-5 font-heading text-2xl font-bold italic text-kobbo-black sm:text-3xl">
              — Love, Ruchi
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
