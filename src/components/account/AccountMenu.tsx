"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function AccountMenu() {
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        aria-label="Login"
        className="hidden rounded-full p-2 transition-colors hover:bg-kobbo-beige sm:block"
      >
        <User className="h-5 w-5 text-kobbo-black" />
      </Link>
    );
  }

  const handleLogout = async () => {
    setOpen(false);
    await logout("/");
  };

  return (
    <div ref={menuRef} className="relative hidden sm:block">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-0.5 rounded-full p-2 transition-colors hover:bg-kobbo-beige"
      >
        <User className="h-5 w-5 text-kobbo-black" />
        <ChevronDown className="h-3.5 w-3.5 text-kobbo-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-kobbo-beige bg-kobbo-white py-1 shadow-soft-lg">
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-medium text-kobbo-black hover:bg-kobbo-cream"
          >
            My Account
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-medium text-kobbo-black hover:bg-kobbo-cream"
          >
            Orders
          </Link>
          <Link
            href="/account/wishlist"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-medium text-kobbo-black hover:bg-kobbo-cream"
          >
            Wishlist
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-kobbo-muted hover:bg-kobbo-cream hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
