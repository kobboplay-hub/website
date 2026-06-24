import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartPageContent from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Your Cart — Kobbo",
  description: "Review your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-kobbo-cream py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CartPageContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
