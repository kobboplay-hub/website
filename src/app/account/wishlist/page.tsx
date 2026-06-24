import type { Metadata } from "next";
import PageShell from "@/components/account/PageShell";
import AccountGuard from "@/components/account/AccountGuard";
import AccountLayoutShell from "@/components/account/AccountLayoutShell";
import WishlistGrid from "@/components/account/WishlistGrid";
import { requireAuthRedirect } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "My Wishlist — Kobbo",
};

export default async function WishlistPage() {
  await requireAuthRedirect("/account/wishlist");

  return (
    <PageShell>
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccountGuard>
            <AccountLayoutShell title="My Wishlist">
              <WishlistGrid />
            </AccountLayoutShell>
          </AccountGuard>
        </div>
      </section>
    </PageShell>
  );
}
