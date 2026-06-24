import { Sparkles, Puzzle, Heart, Smile } from "lucide-react";

const badges = [
  { icon: Sparkles, title: "Curated Toys" },
  { icon: Puzzle, title: "Skill Building" },
  { icon: Heart, title: "Parent Loved" },
  { icon: Smile, title: "Joyful Play" },
];

export default function TrustBadges() {
  return (
    <section className="border-y border-kobbo-beige bg-kobbo-white py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-2.5 rounded-2xl bg-kobbo-cream px-3 py-2.5 sm:justify-center sm:px-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-kobbo-yellow/30">
                <badge.icon className="h-4 w-4 text-kobbo-black" />
              </div>
              <span className="font-heading text-xs font-bold text-kobbo-black sm:text-sm">
                {badge.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
