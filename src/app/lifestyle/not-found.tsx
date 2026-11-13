import Link from "next/link";

import { LIFESTYLE_BASE_PATH } from "@/lib/storefront/product-routing";

export default function LifestyleNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ls-accent">404</p>
      <h1 className="mt-4 font-ls-display text-3xl font-bold tracking-[-0.02em] text-ls-ink">We couldn’t find that page</h1>
      <p className="mt-3 text-sm text-ls-muted">The product may no longer be available, or the link may be incorrect.</p>
      <Link
        href={LIFESTYLE_BASE_PATH}
        className="mt-8 inline-flex h-11 items-center rounded-[4px] bg-ls-ink px-6 text-sm font-medium text-ls-paper hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
      >
        Back to Lifestyle
      </Link>
    </div>
  );
}
