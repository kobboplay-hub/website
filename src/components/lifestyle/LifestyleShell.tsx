import type { ReactNode } from "react";

import { StorefrontMarker, StorefrontProvider } from "@/components/storefront/StorefrontContext";
import { fraunces, manrope } from "./fonts";
import LifestyleAnnouncementBar from "./LifestyleAnnouncementBar";
import LifestyleFooter from "./LifestyleFooter";
import LifestyleHeader, { type LifestyleNavCategory } from "./LifestyleHeader";

interface LifestyleShellProps {
  children: ReactNode;
  categories?: LifestyleNavCategory[];
}

/** Lifestyle header, footer and theme; also used by shared pages (account, login) visited from Lifestyle. */
export default function LifestyleShell({ children, categories = [] }: LifestyleShellProps) {
  return (
    <StorefrontProvider storefront="lifestyle">
      <div
        className={`${manrope.variable} ${fraunces.variable} flex min-h-screen flex-col overflow-x-clip bg-ls-ivory font-ls-body text-ls-ink antialiased`}
      >
        <StorefrontMarker storefront="lifestyle" />
        <a
          href="#lifestyle-main"
          className="sr-only z-[90] rounded-md bg-ls-ink px-4 py-2 text-sm text-ls-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <LifestyleAnnouncementBar />
        <LifestyleHeader categories={categories} />
        <main id="lifestyle-main" className="flex flex-1 flex-col">
          {children}
        </main>
        <LifestyleFooter categories={categories} />
      </div>
    </StorefrontProvider>
  );
}
