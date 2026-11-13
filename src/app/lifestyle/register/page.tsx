import type { Metadata } from "next";
import { Suspense } from "react";

import RegisterForm from "@/components/account/RegisterForm";
import LifestyleAuthFallback from "@/components/lifestyle/LifestyleAuthFallback";
import { lifestyleMetadata } from "@/lib/storefront/lifestyle-seo";

export const metadata: Metadata = lifestyleMetadata({
  title: "Create Account | Kobbo Lifestyle",
  description: "Create your Kobbo account to check out faster and track your orders.",
  path: "/lifestyle/register",
  noIndex: true,
});

export default function LifestyleRegisterPage() {
  return (
    <Suspense fallback={<LifestyleAuthFallback />}>
      <RegisterForm />
    </Suspense>
  );
}
