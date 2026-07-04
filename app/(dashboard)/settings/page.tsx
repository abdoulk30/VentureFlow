import { createClient } from "@/utils/supabase/server";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const [{ data: marketRows }, { data: cityRows }] = await Promise.all([
    supabase.rpc("get_market_options", { limit_count: 60 }),
    supabase.rpc("get_city_options", { limit_count: 100 }),
  ]);
  const marketOptions = (marketRows ?? []).map((r: { market: string }) => r.market).sort((a: string, b: string) => a.localeCompare(b));
  const cityOptions = (cityRows ?? []).map((r: { city: string }) => r.city).sort((a: string, b: string) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono text-mutedText uppercase tracking-widest">
          Settings
        </p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">
          Account Settings
        </h1>
        <p className="text-xs text-mutedText mt-1">
          Manage your profile information.
        </p>
      </div>

      <SettingsForm
        userId={user!.id}
        email={user!.email ?? ""}
        profile={profile}
        marketOptions={marketOptions}
        cityOptions={cityOptions}
      />
    </div>
  );
}