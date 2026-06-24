import { Gem, Puzzle, Award, ShoppingBag } from "lucide-react";

const benefits = [
  {
    icon: Gem,
    title: "Thoughtfully Curated",
    description: "Handpicked for every age",
  },
  {
    icon: Puzzle,
    title: "Skill-Based Play",
    description: "Learn while having fun",
  },
  {
    icon: Award,
    title: "Quality Selection",
    description: "Premium toys we stand by",
  },
  {
    icon: ShoppingBag,
    title: "Easy Shopping",
    description: "Simple, smooth checkout",
  },
];

export default function WhyParentsChooseUs() {
  return (
    <section className="bg-kobbo-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-center text-xl font-extrabold text-kobbo-black sm:text-2xl">
          Why Parents Choose Us
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex flex-col items-center rounded-2xl bg-kobbo-cream px-3 py-4 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-kobbo-yellow/30">
                <benefit.icon className="h-5 w-5 text-kobbo-black" />
              </div>
              <h3 className="font-heading mt-2.5 text-xs font-bold text-kobbo-black sm:text-sm">
                {benefit.title}
              </h3>
              <p className="mt-0.5 text-[11px] text-kobbo-muted sm:text-xs">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
