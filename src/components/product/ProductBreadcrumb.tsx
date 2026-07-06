import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  productName: string;
}

export default function ProductBreadcrumb({
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
    >
      <ol className="flex items-center gap-1 text-xs text-kobbo-muted sm:gap-1.5 sm:text-sm">
        <li className="shrink-0">
          <Link href="/" className="transition-colors hover:text-kobbo-black">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
        <li className="shrink-0">
          <Link href="/shop" className="transition-colors hover:text-kobbo-black">
            Shop
          </Link>
        </li>
        <ChevronRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
        <li className="min-w-0 truncate font-medium text-kobbo-black">
          {productName}
        </li>
      </ol>
    </nav>
  );
}
