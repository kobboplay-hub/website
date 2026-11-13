import { Package, ShieldCheck, Truck, Wallet, type LucideIcon } from "lucide-react";

import { lifestyleTrustItems } from "@/data/lifestyle";

const icons: Record<(typeof lifestyleTrustItems)[number]["icon"], LucideIcon> = {
  shield: ShieldCheck,
  truck: Truck,
  wallet: Wallet,
  package: Package,
};

export default function LifestyleTrustSection() {
  return (
    <section aria-labelledby="lifestyle-trust" className="border-y border-ls-line py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="lifestyle-trust" className="sr-only">
          Why shop with Kobbo
        </h2>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {lifestyleTrustItems.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.title} className="flex gap-4">
                <Icon className="mt-0.5 size-6 shrink-0 text-ls-accent" strokeWidth={1.4} aria-hidden />
                <div>
                  <h3 className="font-ls-display text-[15px] font-semibold text-ls-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ls-muted">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
