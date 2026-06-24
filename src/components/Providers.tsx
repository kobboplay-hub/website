"use client";

import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { WishlistProvider } from "@/context/wishlist-context";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
