import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ResetPasswordPageContent from "@/components/account/ResetPasswordPageContent";
import { StorefrontProvider } from "@/components/storefront/StorefrontContext";
import { getRequestStorefront } from "@/lib/storefront/server";

export const metadata: Metadata = {
  title: "Reset Password — Kobbo",
  description: "Set a new password for your Kobbo account",
};

function ResetFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
    </div>
  );
}

export default async function ResetPasswordPage() {
  return (
    <StorefrontProvider storefront={await getRequestStorefront()}>
      <Suspense fallback={<ResetFallback />}>
        <ResetPasswordPageContent />
      </Suspense>
    </StorefrontProvider>
  );
}
