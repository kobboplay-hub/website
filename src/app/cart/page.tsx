import type { Metadata } from "next";
import SiteLayout from "@/components/SiteLayout";
import CartPageContent from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Your Cart — Kobbo",
  description: "Review your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CartPageContent />
        </div>
      </section>
    </SiteLayout>
  );
}
