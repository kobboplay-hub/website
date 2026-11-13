import type { Metadata } from "next";

import AccountLayoutShell from "@/components/account/AccountLayoutShell";
import WishlistGrid from "@/components/account/WishlistGrid";
import { requireAuthRedirect } from "@/lib/auth/guard";
import { lifestyleMetadata } from "@/lib/storefront/lifestyle-seo";

export const metadata: Metadata = lifestyleMetadata({
  title: "My Wishlist | Kobbo Lifestyle",
  description: "Products you have saved for later.",
  path: "/lifestyle/account/wishlist",
  noIndex: true,
});

export default async function LifestyleWishlistPage() {
  await requireAuthRedirect("/lifestyle/account/wishlist");
  return (
    <AccountLayoutShell title="My Wishlist">
      <WishlistGrid />
    </AccountLayoutShell>
  );
}
