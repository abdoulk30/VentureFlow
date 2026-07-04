import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import BrowseGrid from "@/components/BrowseGrid";

export const dynamic = "force-dynamic";

export default async function BrowseStartupsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_role")
    .eq("id", user!.id)
    .single();

  // Real access control: founders browse investors, not other startups.
  if (profile?.user_role === "founder") {
    redirect("/browse/investors");
  }

  const { data, error } = await supabase
    .from("startups_directory")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono text-mutedText uppercase tracking-widest">
          Archive
        </p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">
          Startup Archive
        </h1>
        <p className="text-xs text-mutedText mt-1">
          Real historical startups, mostly Y Combinator alumni across the
          US -- a mix of currently operating, acquired, and closed
          companies. This isn't a live "seeking funding" list. Click a
          card to see full details.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
          Could not load startups: {error.message}
        </div>
      )}

      <BrowseGrid
        items={data ?? []}
        emptyLabel="No startups match your search."
      />
    </div>
  );
}