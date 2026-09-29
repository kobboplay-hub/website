"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Plus, Sparkles } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { whyParentsSection } from "@/data/home-content";

const SLIDE_DURATION_MS = 5500;
const ACCORDION_SETTLE_MS = 320;
const EASE = [0.22, 1, 0.36, 1] as const;

const { eyebrow, title, items } = whyParentsSection;

const copyVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 56,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE, staggerChildren: 0.09 },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -56,
    filter: "blur(6px)",
    transition: { duration: 0.4, ease: EASE },
  }),
};

const copyChildVariants: Variants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const imageVariants: Variants = {
  enter: (direction: number) => ({
    clipPath:
      direction > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    zIndex: 2,
  }),
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    zIndex: 2,
    transition: { duration: 0.95, ease: EASE },
  },
  exit: (direction: number) => ({
    x: `${direction * -14}%`,
    zIndex: 1,
    transition: { duration: 0.95, ease: EASE },
  }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

function SectionHeading({ id }: { id?: string }) {
  return (
    <div>
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a7b66] sm:text-sm">
        <Sparkles className="h-3.5 w-3.5 text-kobbo-yellow" strokeWidth={2.5} />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="font-heading mt-1.5 text-2xl font-extrabold leading-tight text-[#3f4430] sm:text-3xl lg:text-4xl"
      >
        {title}
      </h2>
    </div>
  );
}

export default function WhyParentsChooseUs() {
  const baseId = useId();
  const headingId = `${baseId}-heading`;
  const reduceMotion = useReducedMotion();
  const desktopRef = useRef<HTMLDivElement>(null);
  const inView = useInView(desktopRef, { amount: 0.3 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [slide, setSlide] = useState({ index: 0, direction: 1, cycle: 0 });
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [openItem, setOpenItem] = useState<number | null>(0);

  const activeTab = slide.index;
  const autoplay = !reduceMotion;
  const progressRunning =
    autoplay && inView && pageVisible && !hovered && !keyboardFocus;

  useEffect(() => {
    const onVisibility = () =>
      setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(
    () => () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    },
    [],
  );

  const goTo = (index: number, direction?: number) => {
    setSlide((current) => ({
      index,
      direction: direction ?? (index >= current.index ? 1 : -1),
      cycle: current.cycle + 1,
    }));
  };

  const goNext = () => goTo((activeTab + 1) % items.length, 1);

  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keyMap: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    const target = keyMap[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = (target + items.length) % items.length;
    goTo(next, target > index ? 1 : -1);
    tabRefs.current[next]?.focus();
  };

  const toggleItem = (index: number) => {
    const opening = openItem !== index;
    setOpenItem(opening ? index : null);
    if (!opening) return;

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(() => {
      itemRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, ACCORDION_SETTLE_MS);
  };

  const revealProps = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  const activeItem = items[activeTab];

  return (
    <section
      aria-labelledby={headingId}
      className="overflow-hidden border-t border-kobbo-beige bg-kobbo-cream py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tablet & desktop: tabs + sliding copy + image */}
        <div
          ref={desktopRef}
          className="hidden md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-x-10 md:gap-y-8 lg:grid-cols-12 lg:gap-x-10"
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
          <motion.div
            {...revealProps(0)}
            className="md:col-start-1 md:row-start-1 lg:col-span-3"
          >
            <SectionHeading id={headingId} />

            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label={title}
              className="mt-7 flex flex-col items-start gap-2.5"
            >
              {items.map((item, index) => {
                const selected = index === activeTab;
                return (
                  <button
                    key={item.title}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    id={`${baseId}-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => goTo(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={`relative isolate min-h-11 overflow-hidden rounded-full border px-5 py-2.5 text-left text-sm font-semibold transition-colors duration-300 ${
                      selected
                        ? "border-transparent text-kobbo-cream"
                        : "border-[#dccfb8] text-[#6f6453] hover:border-kobbo-yellow hover:bg-kobbo-yellow/10 hover:text-[#3f4430]"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`${baseId}-active-pill`}
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full bg-[#5c4b3b]"
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 34 }
                        }
                      />
                    )}
                    <span className="relative">{item.title}</span>
                    {selected && autoplay && (
                      <span
                        key={slide.cycle}
                        aria-hidden
                        onAnimationEnd={goNext}
                        className="absolute inset-x-5 bottom-1 h-0.5 origin-left rounded-full bg-kobbo-yellow"
                        style={{
                          animation: `slide-progress ${SLIDE_DURATION_MS}ms linear forwards`,
                          animationPlayState: progressRunning
                            ? "running"
                            : "paused",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            {...revealProps(0.1)}
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${activeTab}`}
            className="grid min-h-[9rem] md:col-start-1 md:row-start-2 lg:col-span-4 lg:col-start-4 lg:row-start-1"
          >
            <AnimatePresence initial={false} custom={slide.direction}>
              <motion.div
                key={activeTab}
                custom={slide.direction}
                variants={reduceMotion ? fadeVariants : copyVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="[grid-area:1/1] self-center"
              >
                <motion.span
                  variants={reduceMotion ? undefined : copyChildVariants}
                  aria-hidden
                  className="block h-1 w-10 rounded-full bg-kobbo-yellow"
                />
                <motion.h3
                  variants={reduceMotion ? undefined : copyChildVariants}
                  className="font-heading mt-4 text-2xl font-bold leading-snug text-[#3f4430] lg:text-3xl"
                >
                  {activeItem.title}
                </motion.h3>
                <motion.p
                  variants={reduceMotion ? undefined : copyChildVariants}
                  className="mt-2 text-base leading-relaxed text-[#6f6453] lg:text-lg"
                >
                  {activeItem.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            {...revealProps(0.2)}
            className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-kobbo-beige md:col-start-2 md:row-span-2 md:row-start-1 lg:col-span-5 lg:col-start-8 lg:row-span-1"
          >
            <AnimatePresence initial={false} custom={slide.direction}>
              <motion.div
                key={activeTab}
                custom={slide.direction}
                variants={reduceMotion ? fadeVariants : imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.4, ease: EASE }}
                >
                  <Image
                    src={activeItem.image.src}
                    alt={activeItem.image.alt}
                    fill
                    sizes="(min-width: 1280px) 520px, (min-width: 1024px) 40vw, 55vw"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {inView && (
              <div aria-hidden className="pointer-events-none invisible absolute">
                {items.map((item, index) =>
                  index === activeTab ? null : (
                    <Image
                      key={item.title}
                      src={item.image.src}
                      alt=""
                      width={16}
                      height={10}
                      sizes="(min-width: 1280px) 520px, (min-width: 1024px) 40vw, 55vw"
                      loading="eager"
                    />
                  ),
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Mobile: accordion */}
        <div className="md:hidden">
          <SectionHeading />

          <div className="mt-6 space-y-2.5">
            {items.map((item, index) => {
              const open = openItem === index;
              const panelId = `${baseId}-acc-panel-${index}`;
              const buttonId = `${baseId}-acc-button-${index}`;

              return (
                <div
                  key={item.title}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  className={`scroll-mt-20 overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    open
                      ? "border-[#5c4b3b]/25 bg-kobbo-white"
                      : "border-[#e6dac4] bg-kobbo-white/50"
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => toggleItem(index)}
                      className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span
                        className={`font-heading text-base font-bold leading-snug transition-colors duration-300 ${
                          open ? "text-[#3f4430]" : "text-[#5c5240]"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        aria-hidden
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                          open
                            ? "bg-[#5c4b3b] text-kobbo-cream"
                            : "bg-kobbo-beige text-[#5c4b3b]"
                        }`}
                      >
                        <Plus
                          className={`h-4 w-4 transition-transform duration-300 ease-out ${
                            open ? "rotate-45" : ""
                          }`}
                          strokeWidth={2.25}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out ${
                      open
                        ? "visible grid-rows-[1fr] opacity-100"
                        : "invisible grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4">
                        <p className="text-sm leading-relaxed text-[#6f6453]">
                          {item.description}
                        </p>
                        <div className="relative mt-3 aspect-[16/10] w-full overflow-hidden rounded-xl bg-kobbo-beige">
                          <motion.div
                            className="absolute inset-0"
                            initial={false}
                            animate={
                              reduceMotion
                                ? undefined
                                : { scale: open ? 1 : 1.08 }
                            }
                            transition={{ duration: 0.9, ease: EASE }}
                          >
                            <Image
                              src={item.image.src}
                              alt={item.image.alt}
                              fill
                              sizes="92vw"
                              className="object-cover"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
