export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-kobbo-white shadow-soft animate-pulse">
      <div className="aspect-square bg-kobbo-beige" />
      <div className="space-y-2 p-3 sm:p-4">
        <div className="h-4 w-3/4 rounded bg-kobbo-beige" />
        <div className="h-3 w-1/2 rounded bg-kobbo-beige" />
        <div className="flex justify-between pt-2">
          <div className="h-5 w-16 rounded bg-kobbo-beige" />
          <div className="h-8 w-8 rounded-full bg-kobbo-beige" />
        </div>
      </div>
    </div>
  );
}

export function AccountCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-28 rounded-3xl bg-kobbo-beige" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-kobbo-beige" />
        ))}
      </div>
    </div>
  );
}
