import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShopPaginationProps {
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function getPageHref(pageNumber: number): string {
  return pageNumber <= 1 ? "/shop" : `/shop?page=${pageNumber}`;
}

export default function ShopPagination({
  page,
  hasNextPage,
  hasPreviousPage,
}: ShopPaginationProps) {
  if (!hasPreviousPage && !hasNextPage) return null;

  const pageNumbers = [
    ...(hasPreviousPage ? [page - 1] : []),
    page,
    ...(hasNextPage ? [page + 1] : []),
  ];

  return (
    <nav
      className="mt-8 flex flex-col items-center gap-4 sm:mt-10"
      aria-label="Shop pagination"
    >
      <div className="flex w-full max-w-md items-center justify-center gap-1.5 sm:gap-2">
        {hasPreviousPage ? (
          <Link
            href={getPageHref(page - 1)}
            aria-label="Previous page"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-kobbo-beige bg-kobbo-white px-3 text-sm font-semibold text-kobbo-black shadow-soft transition-all hover:border-kobbo-yellow hover:shadow-soft-lg sm:px-4"
          >
            <ChevronLeft className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Prev</span>
          </Link>
        ) : (
          <span
            aria-hidden
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-transparent px-3 text-kobbo-muted/30 sm:px-4"
          >
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {pageNumbers.map((pageNumber) => {
            const isCurrent = pageNumber === page;

            return (
              <Link
                key={pageNumber}
                href={getPageHref(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={isCurrent ? "page" : undefined}
                className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border-2 px-3 text-sm font-bold transition-all ${
                  isCurrent
                    ? "border-kobbo-yellow bg-kobbo-yellow text-kobbo-black shadow-soft"
                    : "border-kobbo-beige bg-kobbo-white text-kobbo-black hover:border-kobbo-yellow"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>

        {hasNextPage ? (
          <Link
            href={getPageHref(page + 1)}
            aria-label="Next page"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-kobbo-beige bg-kobbo-white px-3 text-sm font-semibold text-kobbo-black shadow-soft transition-all hover:border-kobbo-yellow hover:shadow-soft-lg sm:px-4"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-1" />
          </Link>
        ) : (
          <span
            aria-hidden
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-transparent px-3 text-kobbo-muted/30 sm:px-4"
          >
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>

      <p className="text-center text-xs text-kobbo-muted sm:text-sm">
        Page {page}
        {hasNextPage ? "+" : ""}
      </p>
    </nav>
  );
}
