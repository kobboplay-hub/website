import { announcementBar } from "@/data/home-content";

export default function AnnouncementBar() {
  return (
    <div className="bg-kobbo-yellow text-kobbo-black">
      <div className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-medium sm:px-6 sm:text-sm lg:px-8">
        {announcementBar.text}
      </div>
    </div>
  );
}
