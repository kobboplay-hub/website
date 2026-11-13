/** Route-level loading placeholders that mirror the real Lifestyle layouts, so nothing shifts on arrival. */

function Bar({ className }: { className: string }) {
  return <span aria-hidden className={`ls-shimmer block rounded-[3px] ${className}`} />;
}

export function LifestyleCardSkeleton() {
  return (
    <div aria-hidden>
      <span className="ls-shimmer block aspect-[4/5] rounded-[6px]" />
      <Bar className="mt-4 h-2.5 w-16" />
      <Bar className="mt-2.5 h-4 w-4/5" />
      <Bar className="mt-3 h-4 w-20" />
    </div>
  );
}

export function LifestyleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <LifestyleCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function LifestyleHomeSkeleton() {
  return (
    <div role="status" aria-label="Loading Lifestyle">
      <section className="bg-[#f3eee6] lg:grid lg:min-h-[clamp(560px,calc(100svh-8rem),650px)] lg:grid-cols-2 xl:grid-cols-[minmax(0,48fr)_minmax(0,52fr)]">
        <div className="px-4 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-16 lg:flex lg:flex-col lg:justify-center lg:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-10">
          <span className="sr-only">Loading Lifestyle…</span>
          <Bar className="h-3 w-32" />
          <Bar className="mt-6 h-11 w-11/12 max-w-md" />
          <Bar className="mt-3 h-11 w-3/4 max-w-sm" />
          <Bar className="mt-6 h-4 w-full max-w-md" />
          <Bar className="mt-2 h-4 w-2/3 max-w-xs" />
          <div className="mt-8 flex gap-3">
            <Bar className="h-12 w-44" />
            <Bar className="h-12 w-40" />
          </div>
        </div>
        <div className="sm:px-6 lg:px-0">
          <span aria-hidden className="ls-shimmer block aspect-[4/3] sm:aspect-[16/10] sm:rounded-[4px] lg:h-full lg:aspect-auto lg:rounded-none" />
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Bar className="h-3 w-28" />
        <Bar className="mt-4 h-9 w-56" />
        <div className="mt-10">
          <LifestyleGridSkeleton />
        </div>
      </div>
    </div>
  );
}

export function LifestyleAccountSkeleton() {
  return (
    <div role="status" aria-label="Loading your account" className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
      <span aria-hidden className="ls-shimmer hidden h-72 rounded-3xl lg:block" />
      <div className="min-w-0">
        <span aria-hidden className="ls-shimmer block h-24 rounded-2xl sm:h-28 sm:rounded-3xl" />
        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} aria-hidden className="ls-shimmer block h-24 rounded-2xl" />
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
          <span aria-hidden className="ls-shimmer block h-44 rounded-2xl" />
          <span aria-hidden className="ls-shimmer block h-44 rounded-2xl" />
        </div>
      </div>
      <span className="sr-only">Loading your account…</span>
    </div>
  );
}

export function LifestyleProductSkeleton() {
  return (
    <div role="status" aria-label="Loading product" className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
      <Bar className="h-3 w-48" />
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-7 lg:grid lg:grid-cols-[76px_1fr] lg:gap-4">
          <div className="hidden flex-col gap-3 lg:flex">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} aria-hidden className="ls-shimmer block aspect-[4/5] rounded-[3px]" />
            ))}
          </div>
          <span aria-hidden className="ls-shimmer block aspect-[4/5] rounded-[4px]" />
        </div>
        <div className="min-w-0 lg:col-span-5 lg:pt-2">
          <Bar className="h-3 w-24" />
          <Bar className="mt-4 h-9 w-11/12" />
          <Bar className="mt-2 h-9 w-2/3" />
          <Bar className="mt-7 h-7 w-32" />
          <Bar className="mt-6 h-4 w-20" />
          <Bar className="mt-7 h-4 w-full" />
          <Bar className="mt-2 h-4 w-5/6" />
          <Bar className="mt-9 h-4 w-16" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Bar key={i} className="h-11 w-20" />
            ))}
          </div>
          <Bar className="mt-8 h-12 w-full" />
          <Bar className="mt-3 h-12 w-full" />
        </div>
      </div>
      <span className="sr-only">Loading product…</span>
    </div>
  );
}
