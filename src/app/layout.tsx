import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import { homeMetadata } from "@/data/seo";
import { getNavAgeGroups } from "@/lib/shopify";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = homeMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ageGroups = await getNavAgeGroups();

  return (
    <html
      lang="en"
      className={`${baloo.variable} ${inter.variable} min-h-screen antialiased`}
    >
      <body className="min-h-screen bg-kobbo-cream text-kobbo-black antialiased">
        <Providers ageGroups={ageGroups}>{children}</Providers>
      </body>
    </html>
  );
}
