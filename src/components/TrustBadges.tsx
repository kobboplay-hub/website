import { Sparkles, Puzzle, Heart, Truck } from "lucide-react";

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
    title: "Thoughtful Play",
    subtitle: "Screen-free engagement",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    subtitle: "Right to your door",
  },
];

function BenefitBadge({ badge }: { badge: (typeof badges)[number] }) {
  const Icon = badge.icon;

  return (
    <div className="group flex min-w-0 items-center gap-1.5 p-2 sm:gap-2.5 sm:p-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-kobbo-white/90 transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9 sm:rounded-xl">
        <Icon className="h-3.5 w-3.5 text-kobbo-black sm:h-4 sm:w-4" strokeWidth={2.2} />
      </div>
      <div
        className="min-w-0"
        style={{ textShadow: "0 1px 3px #fff8e8, 0 0 8px rgba(255, 248, 232, 0.9)" }}
      >
        <span className="block font-heading text-[11px] font-extrabold leading-tight text-kobbo-black sm:text-xs lg:text-sm">
          {badge.title}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-tight text-[#303030] sm:text-xs">
          {badge.subtitle}
        </span>
      </div>
    </div>
  );
}

export default function TrustBadges() {
  return (
    <div role="group" aria-label="Why families choose Kobbo" className="absolute inset-x-0 bottom-12 z-20 hidden sm:block">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {badges.map((badge) => (
            <BenefitBadge key={badge.title} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
}
