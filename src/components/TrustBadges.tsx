import { Sparkles, Puzzle, Heart, Smile } from "lucide-react";

const badges = [
  {
    icon: Sparkles,
    title: "Curated Toys",
    subtitle: "Handpicked for development",
  },
  {
    icon: Puzzle,
    title: "Skill Building",
    subtitle: "Montessori & STEM aligned",
  },
  {
    icon: Heart,
    title: "Parent Loved",
    subtitle: "Screen-free engagement",
  },
  {
    icon: Smile,
    title: "Joyful Play",
    subtitle: "Pure fun, natural learning",
  },
];

export default function TrustBadges() {
  return (
    <section className="border-b border-kobbo-beige/80 bg-gradient-to-b from-kobbo-cream via-kobbo-yellow/10 to-kobbo-cream py-3 sm:py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="group flex items-center gap-2.5 rounded-2xl border border-kobbo-beige bg-kobbo-yellow/15 p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-kobbo-yellow/25 hover:shadow-soft sm:gap-3 sm:p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-kobbo-white shadow-soft transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
                <badge.icon
                  className="h-4 w-4 text-kobbo-black sm:h-5 sm:w-5"
                  strokeWidth={2.2}
                />
              </div>
              <div className="min-w-0">
                <span className="block font-heading text-xs font-extrabold leading-tight text-kobbo-black sm:text-sm">
                  {badge.title}
                </span>
                <span className="hidden text-[11px] font-medium leading-none text-kobbo-muted sm:mt-0.5 sm:block">
                  {badge.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
