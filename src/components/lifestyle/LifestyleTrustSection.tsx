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
    <section aria-labelledby="lifestyle-trust" className="border-y border-ls-line bg-ls-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-ls-accent">Shop with confidence</p>
          <h2 id="lifestyle-trust" className="mt-3 font-ls-display text-[1.75rem] font-bold leading-tight tracking-[-0.025em] text-ls-ink sm:text-[2.25rem]">
            Why Shop Kobbo
          </h2>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
          {lifestyleTrustItems.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.title} className="flex flex-col items-center text-center">
                <span className="flex size-12 items-center justify-center rounded-full border border-ls-line bg-ls-ivory text-ls-accent sm:size-14">
                  <Icon className="size-5 sm:size-6" strokeWidth={1.4} aria-hidden />
                </span>
                <h3 className="mt-4 font-ls-display text-[15px] font-semibold leading-snug text-ls-ink sm:mt-5 sm:text-base">{item.title}</h3>
                <p className="mt-2 max-w-[16rem] text-[13px] leading-relaxed text-ls-muted sm:text-sm">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
