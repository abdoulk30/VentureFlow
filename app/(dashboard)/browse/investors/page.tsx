import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import BrowseGrid from "@/components/BrowseGrid";

export const dynamic = "force-dynamic";

export default async function BrowseInvestorsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_role")
    .eq("id", user!.id)
    .single();

  // Real access control, not just a hidden nav link: investors browse
  // startups, not other investors, so this page isn't for them even if
  // they type the URL directly.
  if (profile?.user_role !== "founder") {
    redirect("/browse/startups");
  }

  const { data, error } = await supabase
    .from("investors_directory")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono text-mutedText uppercase tracking-widest">
          Browse
        </p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">
          Investor Directory
        </h1>
        <p className="text-xs text-mutedText mt-1">
          Real investment firms, from across the US. Click a card to see full
          details.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
          Could not load investors: {error.message}
        </div>
      )}

      <BrowseGrid
        items={data ?? []}
        emptyLabel="No investors match your search."
      />
    </div>
  );
}