import { Sparkles } from "lucide-react";
import { announcementBar } from "@/data/home-content";

export default function AnnouncementBar() {
  return (
    <div className="bg-kobbo-yellow text-kobbo-black">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center sm:px-6 lg:px-8">
        <Sparkles className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2.25} />
        <p className="text-xs font-semibold tracking-wide sm:text-sm">
          {announcementBar.text}
        </p>
      </div>
    </div>
  );
}
