import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";
import { StorefrontProvider } from "@/components/storefront/StorefrontContext";
import { getRequestStorefront } from "@/lib/storefront/server";

export const metadata: Metadata = {
  title: "Forgot Password — Kobbo",
  description: "Reset your Kobbo account password",
};

export default async function ForgotPasswordPage() {
  return (
    <StorefrontProvider storefront={await getRequestStorefront()}>
      <ForgotPasswordForm />
    </StorefrontProvider>
  );
}
