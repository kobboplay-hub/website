import { formatPrice } from "@/lib/shopify/types";
import { getDiscountPercent } from "@/lib/storefront/lifestyle-card";

interface LifestylePriceProps {
  price: number;
  compareAtPrice: number | null;
  currencyCode: string;
  size?: "sm" | "lg";
  /** Product cards show the discount as an image badge instead. */
  showSavings?: boolean;
}

export default function LifestylePrice({ price, compareAtPrice, currencyCode, size = "sm", showSavings = true }: LifestylePriceProps) {
  const discount = getDiscountPercent(price, compareAtPrice);
  const large = size === "lg";

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${large ? "text-2xl" : "text-[15px]"}`}>
      <span className="font-semibold tabular-nums text-ls-ink">
        <span className="sr-only">{discount ? "Sale price " : "Price "}</span>
        {formatPrice(price, currencyCode)}
      </span>
      {discount && compareAtPrice && (
        <>
          <span className={`tabular-nums text-ls-muted line-through ${large ? "text-base" : "text-[13px]"}`}>
            <span className="sr-only">Regular price </span>
            {formatPrice(compareAtPrice, currencyCode)}
          </span>
          {showSavings && <span className={`font-medium text-ls-accent ${large ? "text-sm" : "text-xs"}`}>Save {discount}%</span>}
        </>
      )}
    </p>
  );
}
