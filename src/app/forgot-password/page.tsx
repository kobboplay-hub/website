import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password — Kobbo",
  description: "Reset your Kobbo account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
