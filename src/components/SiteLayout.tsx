import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SiteLayoutProps {
  children: React.ReactNode;
  mainClassName?: string;
  /** Homepage: transparent nav merges into hero for immersive feel */
  immersiveHero?: boolean;
}

export default function SiteLayout({
  children,
  mainClassName = "",
  immersiveHero = false,
}: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <AnnouncementBar />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Header immersive={immersiveHero} />
        <main className={`flex flex-1 flex-col ${mainClassName}`.trim()}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
