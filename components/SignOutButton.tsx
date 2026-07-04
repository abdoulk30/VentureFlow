"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      title="Sign out"
      className="text-mutedText hover:text-foreground transition-colors shrink-0"
    >
      <LogOut size={14} />
    </button>
  );
}