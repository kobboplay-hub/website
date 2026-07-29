interface ShopHeaderProps {
  searchQuery?: string;
}

export default function ShopHeader({ searchQuery }: ShopHeaderProps) {
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
    </div>
  );
}
