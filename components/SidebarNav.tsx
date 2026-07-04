"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Building2,
  Briefcase,
  BarChart3,
  Settings as SettingsIcon,
} from "lucide-react";

// Icons are imported and the nav list is built HERE, inside the client
// component, rather than being passed in as props from the server layout.
// Icon components are functions, and Server Components can't pass
// functions/component references to Client Components -- only plain,
// serializable data (like the isFounder boolean below) can cross that
// boundary.
export default function SidebarNav({ isFounder }: { isFounder: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    isFounder
      ? { href: "/predict", label: "Funding Likelihood", icon: Sparkles }
      : { href: "/market-explorer", label: "Market Explorer", icon: Sparkles },
    isFounder
      ? { href: "/browse/investors", label: "Browse Investors", icon: Building2 }
      : { href: "/browse/startups", label: "Startup Archive", icon: Briefcase },
    { href: "/directories", label: "Directories", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname?.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
              isActive
                ? "bg-sidebarActive text-foreground font-medium"
                : "text-mutedText hover:bg-surfaceMuted hover:text-foreground"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}