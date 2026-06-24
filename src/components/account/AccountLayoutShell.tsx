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
    <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
      <AccountSidebar activePath={pathname} onLogout={logout} />
      <div>
        {title && (
          <h1 className="font-heading text-2xl font-extrabold text-kobbo-black sm:text-3xl">
            {title}
          </h1>
        )}
        <div className={title ? "mt-6" : ""}>{children}</div>
      </div>
    </div>
  );
}
