import { Sparkles, Hand, Timer } from "lucide-react";

interface WhyParentsLoveItProps {
  items: { title: string; description: string }[];
}

const icons = [Sparkles, Hand, Timer];

export default function WhyParentsLoveIt({ items }: WhyParentsLoveItProps) {
  return (
    <section className="bg-kobbo-cream py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-center text-2xl font-extrabold text-kobbo-black sm:text-3xl">
          Why Parents Love It
        </h2>
        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={item.title}
                className="rounded-2xl bg-kobbo-white p-5 shadow-soft sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-kobbo-yellow/20">
                  <Icon className="h-5 w-5 text-kobbo-black" strokeWidth={2} />
                </div>
                <h3 className="mt-3 font-heading text-lg font-bold text-kobbo-black">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-kobbo-muted">
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
