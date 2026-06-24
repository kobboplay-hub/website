import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-kobbo-cream">{children}</main>
      <Footer />
    </>
  );
}

interface AuthCardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCardShell({ children, title, subtitle }: AuthCardShellProps) {
  return (
    <PageShell>
      <section className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Link
              href="/"
              className="font-heading text-2xl font-extrabold text-kobbo-black"
            >
              Kobbo
            </Link>
          </div>
          <div className="rounded-3xl bg-kobbo-white p-6 shadow-soft-lg sm:p-8">
            <h1 className="font-heading text-2xl font-extrabold text-kobbo-black">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-kobbo-muted">{subtitle}</p>
            )}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
