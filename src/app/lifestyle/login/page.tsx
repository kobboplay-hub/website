import type { Metadata } from "next";
import { Suspense } from "react";

import LoginForm from "@/components/account/LoginForm";
import LifestyleAuthFallback from "@/components/lifestyle/LifestyleAuthFallback";
import { lifestyleMetadata } from "@/lib/storefront/lifestyle-seo";

export const metadata: Metadata = lifestyleMetadata({
  title: "Sign In | Kobbo Lifestyle",
  description: "Sign in to your Kobbo account to track orders and manage your wishlist.",
  path: "/lifestyle/login",
  noIndex: true,
});

export default function LifestyleLoginPage() {
  return (
    <Suspense fallback={<LifestyleAuthFallback />}>
      <LoginForm />
    </Suspense>
  );
}
