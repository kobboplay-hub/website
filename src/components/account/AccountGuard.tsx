"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function AccountGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname)}`,
      );
    }
  }, [isLoggedIn, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
