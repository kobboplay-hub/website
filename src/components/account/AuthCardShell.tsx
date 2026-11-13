"use client";

import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import LifestyleShell from "@/components/lifestyle/LifestyleShell";
import { useStorefront } from "@/components/storefront/StorefrontContext";
import { getStorefrontHomePath } from "@/lib/storefront/product-routing";

interface AuthCardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCardShell({ children, title, subtitle }: AuthCardShellProps) {
  const storefront = useStorefront();

  if (storefront === "lifestyle") {
    return (
      <LifestyleShell>
        <section className="flex flex-1 items-center justify-center px-4 py-14 sm:px-6">
          <div className="w-full max-w-md rounded-[4px] border border-ls-line bg-ls-paper p-6 sm:p-8">
            <h1 className="font-ls-display text-2xl font-bold tracking-[-0.02em] text-ls-ink">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-ls-muted">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </section>
      </LifestyleShell>
    );
  }

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Link
              href={getStorefrontHomePath(storefront)}
              className="font-heading text-2xl font-extrabold text-kobbo-black"
            >
              Kobbo
            </Link>
          </div>
          <div className="rounded-3xl bg-kobbo-white p-6 shadow-soft-lg sm:p-8">
            <h1 className="font-heading text-2xl font-extrabold text-kobbo-black">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-kobbo-muted">{subtitle}</p>
            )}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
