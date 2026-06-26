import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import RegisterForm from "@/components/account/RegisterForm";

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

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}
