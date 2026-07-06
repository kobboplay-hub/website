import SiteLayout from "@/components/SiteLayout";
import { ProductCardSkeleton } from "@/components/ui/SkeletonCard";

export default function SearchLoading() {
  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="animate-pulse py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 rounded-xl bg-kobbo-beige" />
          <div className="mt-2 h-4 w-64 rounded-lg bg-kobbo-beige" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
