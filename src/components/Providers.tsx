"use client";

import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { AgeGroupsProvider } from "@/context/age-groups-context";
import CartDrawer from "@/components/cart/CartDrawer";
import type { AgeGroup } from "@/lib/shopify/types";

export default function Providers({
  children,
  ageGroups = [],
}: {
  children: React.ReactNode;
  ageGroups?: AgeGroup[];
}) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <AgeGroupsProvider ageGroups={ageGroups}>
            {children}
            <CartDrawer />
          </AgeGroupsProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
