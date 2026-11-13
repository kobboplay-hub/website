import type { Metadata } from "next";
import type { ReactNode } from "react";

import AccountGuard from "@/components/account/AccountGuard";
import { lifestyleMetadata } from "@/lib/storefront/lifestyle-seo";

export const metadata: Metadata = lifestyleMetadata({
  title: "My Account | Kobbo Lifestyle",
  description: "Manage your Kobbo orders, addresses and wishlist.",
  path: "/lifestyle/account",
  noIndex: true,
});

/** Same customer session, orders and addresses as the Toys account, inside the Lifestyle storefront. */
export default function LifestyleAccountLayout({ children }: { children: ReactNode }) {
  return (
    <section className="ls-themed py-6 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <AccountGuard>{children}</AccountGuard>
      </div>
    </section>
  );
}
