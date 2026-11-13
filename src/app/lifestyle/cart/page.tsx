import type { Metadata } from "next";

import CartPageContent from "@/components/cart/CartPageContent";
import { lifestyleMetadata } from "@/lib/storefront/lifestyle-seo";

export const metadata: Metadata = lifestyleMetadata({
  title: "Your Cart | Kobbo Lifestyle",
  description: "Review your cart and proceed to secure checkout.",
  path: "/lifestyle/cart",
  noIndex: true,
});

export default function LifestyleCartPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CartPageContent />
      </div>
    </section>
  );
}
