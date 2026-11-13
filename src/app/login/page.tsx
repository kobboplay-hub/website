import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/account/LoginForm";
import { Loader2 } from "lucide-react";
import { StorefrontProvider } from "@/components/storefront/StorefrontContext";
import { redirectToLifestyleAuthPage, type AuthSearchParams } from "@/lib/storefront/auth-routing";

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

export default async function LoginPage({ searchParams }: { searchParams: AuthSearchParams }) {
  await redirectToLifestyleAuthPage("/login", searchParams);

  return (
    <StorefrontProvider storefront="toys">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </StorefrontProvider>
  );
}
