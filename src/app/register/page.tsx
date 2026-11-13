import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import RegisterForm from "@/components/account/RegisterForm";
import { StorefrontProvider } from "@/components/storefront/StorefrontContext";
import { redirectToLifestyleAuthPage, type AuthSearchParams } from "@/lib/storefront/auth-routing";

export const metadata: Metadata = {
  title: "Create Account — Kobbo",
  description: "Create your Kobbo account",
};

function RegisterFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
    </div>
  );
}

export default async function RegisterPage({ searchParams }: { searchParams: AuthSearchParams }) {
  await redirectToLifestyleAuthPage("/register", searchParams);

  return (
    <StorefrontProvider storefront="toys">
      <Suspense fallback={<RegisterFallback />}>
        <RegisterForm />
      </Suspense>
    </StorefrontProvider>
  );
}
