import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
  cta?: string;
  ctaHref?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title,
  description,
  cta,
  ctaHref,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-kobbo-yellow/30 bg-kobbo-yellow/10 px-5 py-10 text-center sm:px-6 sm:py-12"
    >
      <AlertCircle className="mx-auto h-10 w-10 text-kobbo-black/60" />
      <p className="font-heading mt-4 text-lg font-bold text-kobbo-black sm:text-xl">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-kobbo-muted">
        {description}
      </p>
      <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-kobbo-yellow px-6 py-2.5 text-sm font-bold text-kobbo-black transition-colors hover:bg-kobbo-yellow-light"
          >
            Try Again
          </button>
        )}
        {cta && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-kobbo-beige bg-kobbo-white px-6 py-2.5 text-sm font-bold text-kobbo-black transition-colors hover:border-kobbo-yellow"
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}
