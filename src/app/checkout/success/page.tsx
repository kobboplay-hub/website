import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, CheckCircle2, PackageCheck, Truck } from "lucide-react";

import SiteLayout from "@/components/SiteLayout";
import LifestyleShell from "@/components/lifestyle/LifestyleShell";
import { footerBrand } from "@/data/footer";
import { getLifestyleNavCategories } from "@/lib/shopify/lifestyle";
import { getStorefrontHomePath, getStorefrontPath, parseStorefront } from "@/lib/storefront/product-routing";

export const metadata: Metadata = {
  title: "Order confirmed — Kobbo",
  robots: { index: false },
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  upi: "UPI",
  card: "Card",
  netbanking: "Netbanking",
  wallet: "Wallet",
  emi: "EMI",
  cardless_emi: "EMI",
  paylater: "Pay Later",
};

function formatRupees(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);
}

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; method?: string; total?: string; store?: string }>;
}) {
  const { order, method, total, store } = await searchParams;
  const storefront = parseStorefront(store);
  const orderNumber = order && /^\d{1,12}$/.test(order) ? order : null;
  const paymentMethod = method && /^[a-z_]{1,20}$/.test(method) ? method : null;
  const totalPaise = total && /^\d{1,10}$/.test(total) ? Number(total) : null;
  const isCod = paymentMethod === "cod";

  const steps = [
    { icon: CheckCircle2, title: "Order confirmed", detail: "We have received your order.", done: true },
    { icon: PackageCheck, title: "Packed & dispatched", detail: "Usually within 5 business days. You'll get a tracking link." },
    {
      icon: isCod ? Banknote : Truck,
      title: "Delivered to your door",
      detail: isCod
        ? "Typically 7–15 days after dispatch. Keep the amount due ready at delivery."
        : "Typically 7–15 days after dispatch.",
    },
  ];

  const content = (
      <section className="px-4 py-10 sm:py-16">
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

              {(orderNumber || paymentMethod || totalPaise !== null) && (
                <dl className="mt-7 divide-y divide-kobbo-beige rounded-2xl border border-kobbo-beige bg-kobbo-cream/60 text-left text-sm">
                  {orderNumber && (
                    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                      <dt className="text-kobbo-muted">Order number</dt>
                      <dd className="font-heading text-lg font-extrabold text-kobbo-black">#{orderNumber}</dd>
                    </div>
                  )}
                  {paymentMethod && (
                    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                      <dt className="text-kobbo-muted">Payment</dt>
                      <dd className="font-semibold text-kobbo-black">{PAYMENT_LABELS[paymentMethod] ?? "Paid online"}</dd>
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

              <ol className="mt-7 space-y-4 text-left">
                {steps.map(({ icon: Icon, title, detail, done }) => (
                  <li key={title} className="flex gap-4">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                        done ? "bg-kobbo-green text-kobbo-white" : "bg-kobbo-yellow/20 text-kobbo-black"
                      }`}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-kobbo-black">{title}</p>
                      <p className="text-sm text-kobbo-muted">{detail}</p>
                    </div>
                  </li>
                ))}
              </ol>

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
