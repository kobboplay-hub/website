import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  cta?: string;
  ctaHref?: string;
  emoji?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  cta,
  ctaHref,
  emoji,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl bg-kobbo-white px-5 py-12 text-center shadow-soft sm:px-6 sm:py-16">
      {emoji && (
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-kobbo-cream text-4xl">
          {emoji}
        </div>
      )}
      {icon && <div className="flex justify-center">{icon}</div>}
      <p className="font-heading mt-5 text-xl font-bold text-kobbo-black sm:text-2xl">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-kobbo-muted">
        {description}
      </p>
      {cta && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-kobbo-yellow px-8 py-3 text-sm font-bold text-kobbo-black shadow-soft transition-colors hover:bg-kobbo-yellow-light"
        >
          {cta}
        </Link>
      )}
    </div>
  );
}
