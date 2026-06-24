import type { Metadata } from "next";
import PageShell from "@/components/account/PageShell";
import AccountGuard from "@/components/account/AccountGuard";
import AddressesPageContent from "@/components/account/AddressesPageContent";
import { requireAuthRedirect } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "My Addresses — Kobbo",
};

export default async function AddressesPage() {
  await requireAuthRedirect("/account/addresses");

  return (
    <PageShell>
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccountGuard>
            <AddressesPageContent />
          </AccountGuard>
        </div>
      </section>
    </PageShell>
  );
}
