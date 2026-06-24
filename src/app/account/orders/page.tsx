import type { Metadata } from "next";
import PageShell from "@/components/account/PageShell";
import AccountGuard from "@/components/account/AccountGuard";
import OrdersPageContent from "@/components/account/OrdersPageContent";
import { requireAuthRedirect } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "My Orders — Kobbo",
};

export default async function OrdersPage() {
  await requireAuthRedirect("/account/orders");

  return (
    <PageShell>
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccountGuard>
            <OrdersPageContent />
          </AccountGuard>
        </div>
      </section>
    </PageShell>
  );
}
