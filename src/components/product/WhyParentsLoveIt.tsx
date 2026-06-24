import { Palette, Hand, Sparkles } from "lucide-react";
import type { ProductHighlight } from "@/lib/productPageContent";

const icons = [Palette, Hand, Sparkles];

interface WhyParentsLoveItProps {
  items: ProductHighlight[];
}

export default function WhyParentsLoveIt({ items }: WhyParentsLoveItProps) {
  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-center text-2xl font-extrabold text-kobbo-black sm:text-3xl">
          Why Parents Love It
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <div
                key={item.title}
                className="rounded-2xl bg-kobbo-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-kobbo-yellow/30">
                  <Icon className="h-5 w-5 text-kobbo-black" />
                </div>
                <h3 className="font-heading mt-3 text-base font-bold text-kobbo-black">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-kobbo-muted">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
