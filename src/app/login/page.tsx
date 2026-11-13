import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/account/LoginForm";
import { Loader2 } from "lucide-react";
import { StorefrontProvider } from "@/components/storefront/StorefrontContext";
import { getRequestStorefront } from "@/lib/storefront/server";

export const metadata: Metadata = {
  title: "Login — Kobbo",
  description: "Sign in to your Kobbo account",
};

function LoginFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
    </div>
  );
}

export default async function LoginPage() {
  return (
    <StorefrontProvider storefront={await getRequestStorefront()}>
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </StorefrontProvider>
  );
}
