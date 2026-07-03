import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { AlertTriangle } from "lucide-react";
import PredictForm from "@/components/PredictForm";

export const dynamic = "force-dynamic";

export default async function PredictPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const isProfileComplete = !!profile?.is_profile_complete;

  const [{ data: marketRows }, { data: cityRows }] = await Promise.all([
    supabase.rpc("get_market_options", { limit_count: 60 }),
    supabase.rpc("get_city_options", { limit_count: 100 }),
  ]);
  const marketOptions = (marketRows ?? []).map((r: { market: string }) => r.market).sort((a: string, b: string) => a.localeCompare(b));
  const cityOptions = (cityRows ?? []).map((r: { city: string }) => r.city);

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div>
        <p className="text-[10px] font-mono text-mutedText uppercase tracking-widest">
          Funding Likelihood
        </p>
        <h1 className="text-xl font-bold text-white mt-0.5">
          What are my odds of raising money again?
        </h1>
        <p className="text-xs text-mutedText mt-1 max-w-lg mx-auto">
          Pick a city, industry, and funding stage. We'll show you a real
          score built from actual historical companies -- not a guess.
        </p>
      </div>

      {!isProfileComplete ? (
        <div className="bg-cardBg border border-customBorder rounded-xl p-8 flex flex-col items-center text-center max-w-md">
          <div className="size-10 bg-accentPrimary/10 border border-accentPrimary/30 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle size={18} className="text-accentPrimary" />
          </div>
          <h2 className="text-sm font-bold text-white">Finish your profile first</h2>
          <p className="text-xs text-mutedText mt-2 leading-relaxed">
            We need your city, industry, and funding stage before we can
            calculate this for you.
          </p>
          <Link
            href="/onboarding"
            className="mt-4 px-4 py-2 bg-accentPrimary hover:bg-accentPrimary/90 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      ) : (
        <div className="w-full">
          <PredictForm
            defaultCity={profile.city ?? ""}
            defaultMarket={profile.primary_sector ?? ""}
            defaultStage={profile.funding_stage_or_target ?? ""}
            marketOptions={marketOptions}
            cityOptions={cityOptions}
          />
        </div>
      )}
    </div>
  );
}