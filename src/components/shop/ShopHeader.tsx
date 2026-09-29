interface ShopHeaderProps {
  searchQuery?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export default function ShopHeader({
  searchQuery,
  eyebrow,
  title,
  description,
}: ShopHeaderProps) {
  const subtitle =
    description ??
    (searchQuery
      ? `Showing results for "${searchQuery}" across all products.`
      : "Explore playful, skill-building toys curated for little minds.");

  return (
    <div className="text-center">
      {eyebrow && (
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-kobbo-muted sm:mb-2 sm:text-xs">
          {eyebrow}
        </p>
      )}
      <h1 className="break-words font-heading text-2xl font-extrabold text-kobbo-black sm:text-4xl lg:text-5xl">
        {title ?? (searchQuery ? "Search Results" : "Shop Toys")}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-2 max-w-xl px-2 text-sm text-kobbo-muted sm:mt-3 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
