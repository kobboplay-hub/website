import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/account/LoginForm";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Login — Kobbo",
  description: "Sign in to your Kobbo account",
};

function LoginFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
