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
      className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-kobbo-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-kobbo-black">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <li>
          <Link
            href="/shop"
            className="transition-colors hover:text-kobbo-black"
          >
            Shop
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <li className="font-medium text-kobbo-black">{productName}</li>
      </ol>
    </nav>
  );
}
