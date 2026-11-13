import type { Metadata } from "next";

import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";
import { lifestyleMetadata } from "@/lib/storefront/lifestyle-seo";

export const metadata: Metadata = lifestyleMetadata({
  title: "Forgot Password | Kobbo Lifestyle",
  description: "Reset the password for your Kobbo account.",
  path: "/lifestyle/forgot-password",
  noIndex: true,
});

export default function LifestyleForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
