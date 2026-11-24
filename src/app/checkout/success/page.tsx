import type { Metadata } from "next";
import Link from "next/link";

import SiteLayout from "@/components/SiteLayout";
import LifestyleShell from "@/components/lifestyle/LifestyleShell";
import PurchaseTracker from "@/components/checkout/PurchaseTracker";
import { footerBrand } from "@/data/footer";
import { getLifestyleNavCategories } from "@/lib/shopify/lifestyle";
import { getStorefrontHomePath, getStorefrontPath, parseStorefront } from "@/lib/storefront/product-routing";

interface OrderConfirmedPageProps {
  searchParams: Promise<{ order?: string; method?: string; total?: string; store?: string }>;
}

export async function generateMetadata({ searchParams }: OrderConfirmedPageProps): Promise<Metadata> {
  const { store } = await searchParams;
  return {
    title: parseStorefront(store) === "lifestyle" ? "Order confirmed | Kobbo Lifestyle" : "Order confirmed — Kobbo",
    robots: { index: false },
  };
}

function formatRupees(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);
}

export default async function OrderConfirmedPage({ searchParams }: OrderConfirmedPageProps) {
  const { order, method, total, store } = await searchParams;
  const storefront = parseStorefront(store);
  const isNumericOrder = order && /^\d{1,12}$/.test(order);
  const orderNumber = isNumericOrder ? order : null;
  const referenceId = order && /^[A-Za-z0-9_-]{4,64}$/.test(order) ? order : null;
  const paymentMethod = method && /^[a-z_]{1,20}$/.test(method) ? method : null;
  const totalPaise = total && /^\d{1,10}$/.test(total) ? Number(total) : null;

  const content = (
      <section className={`px-4 py-10 sm:py-16 ${storefront === "lifestyle" ? "ls-themed" : ""}`}>
        <PurchaseTracker
          orderNumber={orderNumber || referenceId}
          totalPaise={totalPaise}
          paymentMethod={paymentMethod}
        />
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-kobbo-beige bg-kobbo-white p-6 text-center shadow-soft-lg sm:p-10">
            <div className="order-success-badge mx-auto flex size-20 items-center justify-center rounded-full bg-kobbo-green/10">
              <svg viewBox="0 0 52 52" className="size-12 text-kobbo-green" aria-hidden>
                <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="3" className="order-success-circle" />
                <path d="M15 27l7 7 15-15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="order-success-check" />
              </svg>
            </div>

            <div className="order-success-content">
              <h1 className="mt-6 font-heading text-3xl font-extrabold text-kobbo-black sm:text-4xl">
                Thank you! Your order is confirmed
              </h1>
              <p className="mt-3 text-base text-kobbo-muted">
                Order updates will be sent to the phone number and email you shared at checkout.
              </p>

              {(orderNumber || totalPaise !== null) && (
                <dl className="mt-7 divide-y divide-kobbo-beige rounded-2xl border border-kobbo-beige bg-kobbo-cream/60 text-left text-sm">
                  {orderNumber && (
                    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                      <dt className="text-kobbo-muted">Order number</dt>
                      <dd className="font-heading text-lg font-extrabold text-kobbo-black">#{orderNumber}</dd>
                    </div>
                  )}
                  {totalPaise !== null && (
                    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                      <dt className="text-kobbo-muted">Order total</dt>
                      <dd className="font-semibold text-kobbo-black">{formatRupees(totalPaise)}</dd>
                    </div>
                  )}
                </dl>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={getStorefrontPath(storefront, "/account/orders")}
                  className="flex flex-1 items-center justify-center rounded-full bg-kobbo-black px-6 py-3.5 font-bold text-kobbo-white transition-colors hover:bg-kobbo-black/90"
                >
                  View my orders
                </Link>
                <Link
                  href={getStorefrontHomePath(storefront)}
                  className="flex flex-1 items-center justify-center rounded-full border-2 border-kobbo-black px-6 py-3.5 font-bold text-kobbo-black transition-colors hover:bg-kobbo-yellow"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-kobbo-muted">
            Need help with your order?{" "}
            {storefront === "lifestyle" ? (
              <a href={`mailto:${footerBrand.email}`} className="font-semibold text-kobbo-black underline underline-offset-4">
                {footerBrand.email}
              </a>
            ) : (
              <Link href="/contact" className="font-semibold text-kobbo-black underline underline-offset-4">
                Contact us
              </Link>
            )}
          </p>
        </div>
      </section>
  );

  if (storefront === "lifestyle") {
    return <LifestyleShell categories={await getLifestyleNavCategories()}>{content}</LifestyleShell>;
  }
  return <SiteLayout mainClassName="bg-kobbo-cream">{content}</SiteLayout>;
}
