import type { Metadata } from "next";
import ResetPasswordForm from "@/components/account/ResetPasswordForm";
import { StorefrontProvider } from "@/components/storefront/StorefrontContext";
import { getRequestStorefront } from "@/lib/storefront/server";

export const metadata: Metadata = {
  title: "Reset Password — Kobbo",
};

interface ResetPasswordRouteProps {
  params: Promise<{
    customerId: string;
    resetToken: string;
  }>;
}

export default async function AccountResetPage({
  params,
}: ResetPasswordRouteProps) {
  const { customerId, resetToken } = await params;

  return (
    <StorefrontProvider storefront={await getRequestStorefront()}>
      <ResetPasswordForm
        customerId={customerId}
        resetToken={resetToken}
        allowManualLink={false}
      />
    </StorefrontProvider>
  );
}
