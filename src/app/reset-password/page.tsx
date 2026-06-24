import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ResetPasswordPageContent from "@/components/account/ResetPasswordPageContent";

export const metadata: Metadata = {
  title: "Reset Password — Kobbo",
  description: "Set a new password for your Kobbo account",
};

function ResetFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetFallback />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
