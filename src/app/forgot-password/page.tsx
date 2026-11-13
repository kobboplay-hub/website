import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";
import { StorefrontProvider } from "@/components/storefront/StorefrontContext";

export const metadata: Metadata = {
  title: "Forgot Password — Kobbo",
  description: "Reset your Kobbo account password",
};

export default function ForgotPasswordPage() {
  return (
    <StorefrontProvider storefront="toys">
      <ForgotPasswordForm />
    </StorefrontProvider>
  );
}
