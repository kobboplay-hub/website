export default function ShopLoading() {
  return (
    <div className="animate-pulse bg-kobbo-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-10 w-48 rounded-xl bg-kobbo-beige" />
          <div className="mx-auto mt-3 h-4 w-72 max-w-full rounded-lg bg-kobbo-beige" />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="h-11 flex-1 rounded-full bg-kobbo-beige sm:max-w-md" />
          <div className="h-11 w-full rounded-full bg-kobbo-beige sm:w-44" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-kobbo-white shadow-soft">
              <div className="aspect-square bg-kobbo-beige" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-kobbo-beige" />
                <div className="h-5 w-1/3 rounded bg-kobbo-beige" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
