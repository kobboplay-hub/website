import Link from "next/link";
import { Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { announcementBar } from "@/data/home-content";

function GanpatiIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 2.2c-1.1 0-2 .7-2.3 1.7-.9.2-1.7.8-2.1 1.6-.5.9-.4 2 .2 2.8-.6.5-1 1.3-1 2.1 0 .4.1.8.2 1.1-.7.5-1.2 1.3-1.2 2.2 0 1.1.7 2.1 1.7 2.5v1.3c0 1.8 1.4 3.3 3.2 3.5.4.9 1.3 1.5 2.3 1.5s1.9-.6 2.3-1.5c1.8-.2 3.2-1.7 3.2-3.5v-1.3c1-.4 1.7-1.4 1.7-2.5 0-.9-.5-1.7-1.2-2.2.1-.3.2-.7.2-1.1 0-.8-.4-1.6-1-2.1.6-.8.7-1.9.2-2.8-.4-.8-1.2-1.4-2.1-1.6C14 2.9 13.1 2.2 12 2.2zm0 1.6c.5 0 .9.3 1 .7H11c.1-.4.5-.7 1-.7zm-3.1 2.5c.3-.5.8-.8 1.4-.9h3.4c.6.1 1.1.4 1.4.9.2.4.2.8 0 1.2H8.9c-.2-.4-.2-.8 0-1.2zm-.7 2.8h7.6c.4.2.7.6.7 1.1 0 .4-.2.7-.5.9H8.4c-.3-.2-.5-.5-.5-.9 0-.5.3-.9.7-1.1zm-.5 3.1h8.6c.4.2.7.6.7 1.1s-.3.9-.7 1.1v1.1c0 1.1-.9 2-2 2h-.3c-.3.7-.9 1.2-1.7 1.2s-1.4-.5-1.7-1.2H10c-1.1 0-2-.9-2-2v-1.1c-.4-.2-.7-.6-.7-1.1s.3-.9.7-1.1z" />
    </svg>
  );
}

function AnnouncementItem({
  item,
}: {
  item: (typeof announcementBar.items)[number];
}) {
  const isAccent = "accent" in item && Boolean(item.accent);
  const href = "href" in item ? item.href : undefined;

  const content = (
    <>
      {item.icon === "truck" && (
        <Truck className="h-3.5 w-3.5 shrink-0 text-kobbo-muted" strokeWidth={2} />
      )}
      {item.icon === "returns" && (
        <RefreshCw
          className="h-3.5 w-3.5 shrink-0 text-kobbo-muted"
          strokeWidth={2}
        />
      )}
      {item.icon === "ganpati" && (
        <GanpatiIcon className="h-4 w-4 shrink-0 text-[#e07a2f]" />
      )}
      {item.icon === "shield" && (
        <ShieldCheck
          className="h-3.5 w-3.5 shrink-0 text-kobbo-muted"
          strokeWidth={2}
        />
      )}
      <span
        className={`whitespace-nowrap text-[11px] font-medium tracking-wide sm:text-xs ${
          isAccent ? "font-semibold text-[#e07a2f]" : "text-kobbo-black/80"
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
    <div className="relative z-[60] overflow-hidden border-b border-kobbo-beige/70 bg-[#f7f1e8] text-kobbo-black">
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
