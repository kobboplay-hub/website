import { Puzzle, Lightbulb, Gamepad2, ThumbsUp } from "lucide-react";
import type { ProductHighlight } from "@/lib/productPageContent";

const iconMap = [Puzzle, Lightbulb, Gamepad2, ThumbsUp];

interface ProductHighlightsProps {
  highlights: ProductHighlight[];
}

export default function ProductHighlights({
  highlights,
}: ProductHighlightsProps) {
  return (
    <section className="bg-kobbo-white py-3 sm:py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          {highlights.map((item, index) => {
            const Icon = iconMap[index] ?? Puzzle;
            return (
              <div
                key={item.title}
                className="rounded-xl bg-kobbo-cream p-3 shadow-soft sm:rounded-2xl sm:p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-kobbo-yellow/30">
                  <Icon className="h-4 w-4 text-kobbo-black" />
                </div>
                <h3 className="font-heading mt-2.5 text-sm font-bold text-kobbo-black">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-kobbo-muted">
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
