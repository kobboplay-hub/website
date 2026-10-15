const pillars = ["Neural Pathway Formation", "Sensory-Rich Play", "Learning through play"];

export default function ResearchStatBanner() {
  return (
    <section
      aria-labelledby="early-years-heading"
      className="border-y border-kobbo-beige bg-kobbo-cream py-8 sm:py-14 lg:py-16"
    >
      <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:gap-9 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:px-8">
        <div>
          <p className="hidden text-xs font-bold uppercase tracking-widest text-kobbo-green sm:block">
            Early Brain Architecture
          </p>
          <h2
            id="early-years-heading"
            className="font-heading max-w-[18ch] text-[1.75rem] font-extrabold leading-[1.12] tracking-tight text-kobbo-black sm:mt-3 sm:max-w-[17ch] sm:text-4xl lg:text-5xl"
          >
            The early years matter. <span className="bg-gradient-to-t from-kobbo-yellow/60 from-30% to-transparent">A lot.</span>
          </h2>
          <p className="mt-4 hidden max-w-xl text-sm leading-relaxed text-kobbo-black/75 sm:block sm:text-base">
            The first five years are a remarkable window for growth and
            development, and everyday experiences help shape the foundations
            for what comes next.
          </p>
          <ul className="mt-5 hidden flex-wrap gap-2 sm:flex">
            {pillars.map((pillar) => (
              <li key={pillar} className="rounded-full border border-kobbo-beige bg-kobbo-white/75 px-3 py-1.5 text-xs font-semibold text-kobbo-black">
                {pillar}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4 sm:gap-7 lg:gap-8">
          <p className="font-heading shrink-0 text-[3.75rem] font-black leading-none tracking-tight text-kobbo-black sm:text-[clamp(4.5rem,9vw,7rem)]">
            90<span className="text-kobbo-yellow">%</span>
          </p>
          <div className="max-w-md">
            <p className="font-heading text-sm font-bold leading-snug text-kobbo-black sm:text-xl">
              By age 5, a child&apos;s brain has reached around 90% of its adult size.
            </p>
            <p className="mt-3 hidden text-[11px] font-semibold uppercase tracking-wider text-kobbo-muted sm:block">
              Pediatric Neuroscience Research
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
