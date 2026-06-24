"use client";

import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/account/ResetPasswordForm";

export default function ResetPasswordPageContent() {
  const searchParams = useSearchParams();

  const resetUrl = searchParams.get("reset_url");
  const customerId = searchParams.get("id") ?? searchParams.get("customer_id");
  const resetToken =
    searchParams.get("token") ?? searchParams.get("reset_token");

  return (
    <ResetPasswordForm
      resetUrl={resetUrl}
      customerId={customerId}
      resetToken={resetToken}
      allowManualLink
    />
  );
}
