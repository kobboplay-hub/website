import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SiteLayoutProps {
  children: React.ReactNode;
  mainClassName?: string;
}

export default function SiteLayout({
  children,
  mainClassName = "",
}: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className={`flex flex-1 flex-col ${mainClassName}`.trim()}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
