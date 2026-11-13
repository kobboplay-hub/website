import Link from "next/link";

import { footerBrand, footerSocialLinks } from "@/data/footer";
import { lifestylePolicyLinks } from "@/data/lifestyle";
import { LIFESTYLE_BASE_PATH } from "@/lib/storefront/product-routing";
import type { LifestyleNavCategory } from "./LifestyleHeader";
import LifestyleNewsletter from "./LifestyleNewsletter";
import LifestyleWordmark from "./LifestyleWordmark";

const linkClass =
  "text-sm text-ls-paper/70 transition-colors hover:text-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-paper";

export default function LifestyleFooter({ categories = [] }: { categories?: LifestyleNavCategory[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ls-ink text-ls-paper">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <LifestyleWordmark tone="paper" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ls-paper/70">
              Everyday essentials for your home, your routine and everything in between.
            </p>
            <div className="mt-8 max-w-sm">
              <p className="font-ls-display text-sm font-semibold">Stay in the loop</p>
              <p className="mt-1 text-sm text-ls-paper/70">New arrivals and updates, straight to your inbox.</p>
              <div className="mt-4">
                <LifestyleNewsletter tone="dark" />
              </div>
            </div>
          </div>

          <nav aria-label="Lifestyle shop" className="lg:col-span-2 lg:col-start-6">
            <h2 className="font-ls-display text-xs font-semibold uppercase tracking-[0.18em] text-ls-paper/50">Shop</h2>
            <ul className="mt-5 space-y-3">
              <li><Link href={LIFESTYLE_BASE_PATH} className={linkClass}>Home</Link></li>
              <li><Link href={`${LIFESTYLE_BASE_PATH}#all-products`} className={linkClass}>Shop All</Link></li>
              {categories.slice(0, 5).map((category) => (
                <li key={category.slug}>
                  <Link href={`${LIFESTYLE_BASE_PATH}?category=${category.slug}#all-products`} className={linkClass}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer care" className="lg:col-span-2">
            <h2 className="font-ls-display text-xs font-semibold uppercase tracking-[0.18em] text-ls-paper/50">Help</h2>
            <ul className="mt-5 space-y-3">
              <li><Link href="/account/orders" className={linkClass}>Track Orders</Link></li>
              {lifestylePolicyLinks.map((link) => (
                <li key={link.slug}>
                  <Link href={`${LIFESTYLE_BASE_PATH}/${link.slug}`} className={linkClass}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-ls-display text-xs font-semibold uppercase tracking-[0.18em] text-ls-paper/50">Contact</h2>
            <ul className="mt-5 space-y-3">
              <li><a href={`mailto:${footerBrand.email}`} className={linkClass}>{footerBrand.email}</a></li>
              <li><a href={`tel:${footerBrand.phone.replace(/\s+/g, "")}`} className={linkClass}>{footerBrand.phone}</a></li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {footerSocialLinks.map((social) => (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ls-paper/15 pt-6 text-xs text-ls-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Kobbo. All rights reserved.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {footerBrand.paymentMethods.map((method) => (
              <li key={method} className="rounded border border-ls-paper/20 px-2 py-1 text-[11px] text-ls-paper/70">
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
