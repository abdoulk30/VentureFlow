import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OnboardingWizard } from "@/components/onboarding-wizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
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

  const { data: marketRows } = await supabase.rpc("get_market_options", {
    limit_count: 60,
  });
  const marketOptions = (marketRows ?? []).map((r: { market: string }) => r.market).sort((a: string, b: string) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <OnboardingWizard
        userId={user.id}
        initialCity={profile?.city ?? ""}
        initialState={profile?.state ?? ""}
        initialSector={profile?.primary_sector ?? ""}
        initialStage={profile?.funding_stage_or_target ?? ""}
        marketOptions={marketOptions}
      />
    </div>
  );
}