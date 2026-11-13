import { lifestyleAnnouncements } from "@/data/lifestyle";

export default function LifestyleAnnouncementBar() {
  return (
    <div className="bg-ls-ink text-ls-paper">
      <ul className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-6 overflow-hidden px-4 text-[11px] font-medium tracking-[0.08em] uppercase sm:gap-10 sm:text-xs">
        {lifestyleAnnouncements.map((message, index) => (
          <li
            key={message}
            className={`whitespace-nowrap ${index > 0 ? "hidden md:block" : ""}`}
          >
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
}
