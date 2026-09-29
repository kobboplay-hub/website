import SiteLayout from "@/components/SiteLayout";

export default function ShopByAgeLoading() {
  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <div className="animate-pulse">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8 lg:py-8">
          <div className="text-center">
            <div className="mx-auto h-3 w-24 rounded bg-kobbo-beige" />
            <div className="mx-auto mt-3 h-9 w-40 rounded-xl bg-kobbo-beige sm:h-11 sm:w-56" />
            <div className="mx-auto mt-3 h-4 w-20 rounded-lg bg-kobbo-beige" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
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
    </SiteLayout>
  );
}
