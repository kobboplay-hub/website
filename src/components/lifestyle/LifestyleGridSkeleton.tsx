export default function LifestyleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <div className="aspect-[4/5] animate-pulse rounded-[4px] bg-ls-sand motion-reduce:animate-none" />
          <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-ls-sand motion-reduce:animate-none" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-ls-sand motion-reduce:animate-none" />
          <div className="mt-2 h-4 w-1/4 animate-pulse rounded bg-ls-sand motion-reduce:animate-none" />
        </li>
      ))}
    </ul>
  );
}
