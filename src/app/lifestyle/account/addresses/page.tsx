import type { Metadata } from "next";

import AddressesPageContent from "@/components/account/AddressesPageContent";
import { requireAuthRedirect } from "@/lib/auth/guard";
import { lifestyleMetadata } from "@/lib/storefront/lifestyle-seo";

export const metadata: Metadata = lifestyleMetadata({
  title: "My Addresses | Kobbo Lifestyle",
  description: "Manage your saved delivery addresses.",
  path: "/lifestyle/account/addresses",
  noIndex: true,
});

export default async function LifestyleAddressesPage() {
  await requireAuthRedirect("/lifestyle/account/addresses");
  return <AddressesPageContent />;
}
