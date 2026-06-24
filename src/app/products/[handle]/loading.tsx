export default function ProductLoading() {
  return (
    <div className="animate-pulse bg-kobbo-cream">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="h-4 w-48 rounded bg-kobbo-beige" />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="aspect-square rounded-3xl bg-kobbo-beige" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 rounded-xl bg-kobbo-beige" />
            <div className="h-6 w-1/3 rounded-lg bg-kobbo-beige" />
            <div className="h-8 w-1/4 rounded-lg bg-kobbo-beige" />
            <div className="h-20 w-full rounded-xl bg-kobbo-beige" />
            <div className="h-12 w-full rounded-full bg-kobbo-beige" />
          </div>
        </div>
      </div>
    </div>
  );
}
