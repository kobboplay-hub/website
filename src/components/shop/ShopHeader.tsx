interface ShopHeaderProps {
  showingFrom?: number;
  showingTo?: number;
  hasMore?: boolean;
  searchQuery?: string;
}

export default function ShopHeader({
  showingFrom,
  showingTo,
  hasMore,
  searchQuery,
}: ShopHeaderProps) {
  const hasRange =
    showingFrom !== undefined &&
    showingTo !== undefined &&
    showingTo >= showingFrom;

  return (
    <div className="text-center">
      <h1 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-4xl lg:text-5xl">
        {searchQuery ? "Search Results" : "Shop Toys"}
      </h1>
      <p className="mx-auto mt-2 max-w-xl px-2 text-sm text-kobbo-muted sm:mt-3 sm:text-base">
        {searchQuery
          ? `Showing results for "${searchQuery}" across all products.`
          : "Explore playful, skill-building toys curated for little minds."}
      </p>
      {hasRange && (
        <p className="mt-2 text-xs font-medium text-kobbo-muted sm:text-sm">
          Showing {showingFrom}–{showingTo}
          {hasMore ? "+" : ""} products
        </p>
      )}
    </div>
  );
}
