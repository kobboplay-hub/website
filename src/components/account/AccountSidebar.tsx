import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

interface AccountSidebarProps {
  activePath: string;
  onLogout: () => void;
}

export default function AccountSidebar({
  activePath,
  onLogout,
}: AccountSidebarProps) {
  return (
    <aside className="rounded-3xl bg-kobbo-white p-4 shadow-soft sm:p-5">
      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? activePath === href
            : activePath.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-kobbo-yellow/25 text-kobbo-black"
                  : "text-kobbo-muted hover:bg-kobbo-cream hover:text-kobbo-black"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-kobbo-muted transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log Out
        </button>
      </nav>
    </aside>
  );
}
