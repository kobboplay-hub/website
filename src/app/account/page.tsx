import type { Metadata } from "next";
import PageShell from "@/components/account/PageShell";
import AccountGuard from "@/components/account/AccountGuard";
import AccountDashboard from "@/components/account/AccountDashboard";
import { requireAuthRedirect } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "My Account — Kobbo",
  description: "Manage your Kobbo account",
};

export default async function AccountPage() {
  await requireAuthRedirect("/account");

  return (
    <PageShell>
      <section className="py-5 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
          <AccountGuard>
            <AccountDashboard />
          </AccountGuard>
        </div>
      </section>
    </PageShell>
  );
}
