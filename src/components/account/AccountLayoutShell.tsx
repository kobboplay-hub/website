"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import AccountSidebar from "./AccountSidebar";

interface AccountLayoutShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function AccountLayoutShell({
  children,
  title,
}: AccountLayoutShellProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
      <AccountSidebar activePath={pathname} onLogout={() => logout("/")} />
      <div className="min-w-0 flex-1">
        {title && (
          <h1 className="mb-4 font-heading text-xl font-extrabold text-kobbo-black sm:mb-6 sm:text-2xl lg:text-3xl">
            {title}
          </h1>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
