import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  LayoutDashboard,
  Sparkles,
  Building2,
  Briefcase,
  Zap,
  AlertCircle,
  Settings as SettingsIcon,
  BarChart3,
} from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isProfileComplete = !!profile?.is_profile_complete;
  const isFounder = profile?.user_role === "founder";

  // Founders only browse investors; investors only browse startups.
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/predict", label: "Funding Likelihood", icon: Sparkles },
    isFounder
      ? { href: "/browse/investors", label: "Browse Investors", icon: Building2 }
      : { href: "/browse/startups", label: "Browse Startups", icon: Briefcase },
    { href: "/directories", label: "Directories", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="bg-background text-foreground h-screen flex overflow-hidden">
      <aside className="hidden lg:flex flex-col h-full w-60 shrink-0 border-r border-border bg-sidebarBg">
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-customBorder shrink-0">
          <div className="size-7 rounded-md bg-accentPrimary flex items-center justify-center shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">
            VentureFlow
          </span>
        </div>

        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded bg-surfaceMuted border border-customBorder">
            {isFounder ? (
              <Briefcase size={12} className="text-accentPrimary shrink-0" />
            ) : (
              <Building2 size={12} className="text-accentSuccess shrink-0" />
            )}
            <span className="text-xs text-mutedText">
              {isFounder ? "Founder Portal" : "Investor Portal"}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-mutedText hover:bg-surfaceMuted hover:text-white transition-colors"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {!isProfileComplete && (
          <div className="mx-3 mb-3 p-3 rounded-lg border border-dashed border-accentPrimary/40 bg-accentPrimary/5">
            <div className="flex items-start gap-2">
              <AlertCircle size={13} className="text-accentPrimary shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-white font-medium">Profile incomplete</p>
                <p className="text-[10px] text-mutedText mt-0.5 leading-relaxed">
                  Finish your profile to unlock funding predictions.
                </p>
                <Link
                  href="/onboarding"
                  className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider text-accentPrimary hover:underline"
                >
                  Complete Profile &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-customBorder px-4 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-gradient-to-br from-accentPrimary to-accentSuccess flex items-center justify-center shrink-0">
              <span className="text-[11px] font-semibold text-white">
                {profile?.full_name?.charAt(0) ?? "?"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">
                {profile?.full_name ?? "Unknown"}
              </p>
              <p className="text-[10px] text-mutedText truncate">
                {profile?.company_name || (isFounder ? "Founder" : "Investor")}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto px-4 lg:px-6 py-5">
          {children}
        </main>
      </div>
    </div>
  );
}