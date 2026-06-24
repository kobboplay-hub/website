interface ShopHeaderProps {
  productCount?: number;
}

export default function ShopHeader({ productCount }: ShopHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="font-heading text-3xl font-extrabold text-kobbo-black sm:text-4xl lg:text-5xl">
        Shop Toys
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-kobbo-muted sm:text-base">
        Explore playful, skill-building toys curated for little minds.
      </p>
      {productCount !== undefined && productCount > 0 && (
        <p className="mt-2 text-xs font-medium text-kobbo-muted">
          {productCount} {productCount === 1 ? "product" : "products"}
        </p>
      )}
    </div>
  );
}
