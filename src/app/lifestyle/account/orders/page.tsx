import type { Metadata } from "next";

import OrdersPageContent from "@/components/account/OrdersPageContent";
import { requireAuthRedirect } from "@/lib/auth/guard";
import { lifestyleMetadata } from "@/lib/storefront/lifestyle-seo";

export const metadata: Metadata = lifestyleMetadata({
  title: "My Orders | Kobbo Lifestyle",
  description: "Track your Kobbo orders.",
  path: "/lifestyle/account/orders",
  noIndex: true,
});

export default async function LifestyleOrdersPage() {
  await requireAuthRedirect("/lifestyle/account/orders");
  return <OrdersPageContent />;
}
