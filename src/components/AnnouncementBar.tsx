import Link from "next/link";
import { Truck, Sparkles, ShieldCheck } from "lucide-react";
import { announcementBar } from "@/data/home-content";

function AnnouncementItem({
  item,
}: {
  item: (typeof announcementBar.items)[number];
}) {
  const isAccent = "accent" in item && Boolean(item.accent);
  const href = "href" in item ? (item as { href?: string }).href : undefined;

  const content = (
    <>
      {item.icon === "truck" && (
        <Truck className="h-3.5 w-3.5 shrink-0 text-kobbo-muted" strokeWidth={2} />
      )}
      {item.icon === "sparkles" && (
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-kobbo-black" strokeWidth={2} />
      )}
      {item.icon === "shield" && (
        <ShieldCheck
          className="h-3.5 w-3.5 shrink-0 text-kobbo-muted"
          strokeWidth={2}
        />
      )}
      <span
        className={`whitespace-nowrap text-[11px] font-medium tracking-wide sm:text-xs ${
          isAccent
            ? "rounded-full bg-kobbo-yellow/35 px-2 py-0.5 font-bold text-kobbo-black"
            : "text-kobbo-black/85"
        }`}
      >
        {item.label}
      </span>
    </>
  );

  return (
    <li className="flex shrink-0 items-center gap-6 sm:gap-10">
      {href ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
        >
          {content}
        </Link>
      ) : (
        <div className="inline-flex items-center gap-1.5">{content}</div>
      )}
      <span
        className="h-1 w-1 shrink-0 rounded-full bg-kobbo-muted/35"
        aria-hidden
      />
    </li>
  );
}

export default function AnnouncementBar() {
  // Duplicate track for seamless infinite scroll
  const track = [...announcementBar.items, ...announcementBar.items];

  return (
    <div className="relative z-30 overflow-hidden border-b border-kobbo-beige/70 bg-[#f7f1e8] text-kobbo-black">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#f7f1e8] to-transparent sm:w-12"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#f7f1e8] to-transparent sm:w-12"
        aria-hidden
      />
      <div className="flex overflow-hidden py-2">
        <ul className="announcement-marquee flex w-max items-center gap-6 sm:gap-10">
          {track.map((item, index) => (
            <AnnouncementItem
              key={`${item.id}-${index}`}
              item={item}
            />
          ))}
        </ul>
        <ul
          className="announcement-marquee flex w-max items-center gap-6 sm:gap-10"
          aria-hidden
        >
          {track.map((item, index) => (
            <AnnouncementItem
              key={`${item.id}-dup-${index}`}
              item={item}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
