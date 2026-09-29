import Link from "next/link";
import {
  Baby,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { ageGroupHref } from "@/lib/shop-by-age";

interface Highlight {
  label: string;
  icon: LucideIcon;
}

function getHighlights(product: Product): Highlight[] {
  const { featured, bestSelling, trending } = product.merchandising;
  const highlights: Highlight[] = [];
  if (bestSelling) highlights.push({ label: "Best Seller", icon: Trophy });
  if (trending) highlights.push({ label: "Trending", icon: TrendingUp });
  if (featured) highlights.push({ label: "Featured", icon: Sparkles });
  return highlights;
}

export default function ProductHighlights({ product }: { product: Product }) {
  const highlights = getHighlights(product);
  const { ageGroup } = product;

  if (highlights.length === 0 && !ageGroup) return null;

  return (
    <ul
      aria-label="Product highlights"
      className="mb-2.5 flex flex-wrap items-center gap-1.5 sm:mb-3 sm:gap-2"
    >
      {highlights.map(({ label, icon: Icon }) => (
        <li
          key={label}
          className="inline-flex items-center gap-1 rounded-full bg-kobbo-yellow/25 px-2.5 py-1 text-[11px] font-bold leading-none text-kobbo-black sm:text-xs"
        >
          <Icon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
          {label}
        </li>
      ))}

      {ageGroup && (
        <li>
          <Link
            href={ageGroupHref(ageGroup.handle)}
            aria-label={`Age group: ${ageGroup.name}. Shop more toys for ${ageGroup.name}`}
            className="group inline-flex min-h-7 items-center gap-1 rounded-full border border-kobbo-beige bg-kobbo-white px-2.5 py-1 text-[11px] font-semibold leading-none text-kobbo-black transition-colors hover:border-kobbo-yellow hover:bg-kobbo-yellow/10 sm:text-xs"
          >
            <Baby className="h-3 w-3 shrink-0 text-kobbo-muted sm:h-3.5 sm:w-3.5" strokeWidth={2.25} />
            <span className="text-kobbo-muted">Age:</span>
            {ageGroup.name}
            <ChevronRight className="h-3 w-3 shrink-0 text-kobbo-muted transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      )}
    </ul>
  );
}
