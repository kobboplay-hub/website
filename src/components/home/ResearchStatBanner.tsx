import { Brain, Sparkles } from "lucide-react";

export default function ResearchStatBanner() {
  return (
    <section className="bg-kobbo-white py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-kobbo-beige bg-[#EEF5F0] p-6 shadow-soft sm:p-10 lg:p-12">
          {/* Subtle warm decorative glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-kobbo-yellow/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-[#CEEBDD]/40 blur-2xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-kobbo-beige bg-kobbo-white/90 px-3 py-1 text-xs font-bold text-kobbo-black shadow-2xs">
                <Brain className="h-3.5 w-3.5 text-kobbo-green" />
                <span>Early Brain Architecture</span>
              </div>

              <h2 className="font-heading mt-3 text-2xl font-extrabold tracking-tight text-kobbo-black sm:text-3xl lg:text-4xl">
                The early years matter. A lot.
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-kobbo-black/80 sm:text-base sm:leading-relaxed">
                The first five years are a remarkable window for growth and development, and everyday experiences help shape the foundations for what comes next.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-kobbo-beige/80 bg-kobbo-white/90 px-3 py-1 text-xs font-semibold text-kobbo-black shadow-2xs">
                  <Sparkles className="h-3 w-3 text-kobbo-yellow" />
                  Neural Pathway Formation
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-kobbo-beige/80 bg-kobbo-white/90 px-3 py-1 text-xs font-semibold text-kobbo-black shadow-2xs">
                  <Sparkles className="h-3 w-3 text-kobbo-green" />
                  Sensory-Rich Play
                </span>
              </div>
            </div>

            {/* Right Stat Callout Box in Kobbo card style */}
            <div className="lg:col-span-5">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-kobbo-beige bg-kobbo-white p-6 text-center shadow-soft sm:p-8">
                <span className="font-heading text-6xl font-black tracking-tight text-kobbo-black sm:text-7xl lg:text-8xl">
                  90%
                </span>
                <div className="mt-2 h-1.5 w-12 rounded-full bg-kobbo-yellow" />
                <p className="mt-3 max-w-xs font-heading text-sm font-bold leading-snug text-kobbo-black sm:text-base">
                  By age 5, a child&apos;s brain has reached around 90% of its adult size.
                </p>
                <span className="mt-2 text-[11px] font-medium uppercase tracking-wider text-kobbo-muted">
                  Pediatric Neuroscience Research
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
