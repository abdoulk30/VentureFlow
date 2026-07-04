import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUserAndProfile } from "@/utils/supabase/get-profile";
import { AlertTriangle } from "lucide-react";
import PredictForm from "@/components/PredictForm";

export const dynamic = "force-dynamic";

export default async function MarketExplorerPage() {
  const supabase = await createClient();
  const { profile } = await getCurrentUserAndProfile();

  // Market Explorer is investor-only -- founders get Funding Likelihood
  // instead, which reuses the exact same real underlying data.
  if (profile?.user_role === "founder") {
    redirect("/predict");
  }

  const isProfileComplete = !!profile?.is_profile_complete;

  const [{ data: marketRows }, { data: cityRows }] = await Promise.all([
    supabase.rpc("get_market_options", { limit_count: 60 }),
    supabase.rpc("get_city_options", { limit_count: 100 }),
  ]);
  const marketOptions = (marketRows ?? [])
    .map((r: { market: string }) => r.market)
    .sort((a: string, b: string) => a.localeCompare(b));
  const cityOptions = (cityRows ?? [])
    .map((r: { city: string }) => r.city)
    .sort((a: string, b: string) => a.localeCompare(b));

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div>
        <p className="text-[10px] font-mono text-mutedText uppercase tracking-widest">
          Market Explorer
        </p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">
          How has this market performed historically?
        </h1>
        <p className="text-xs text-mutedText mt-1 max-w-lg mx-auto">
          Pick a city, industry, and funding stage to explore. We'll show
          you a real score built from actual historical startup companies
          -- useful for sizing up a market before you dig into individual
          deals.
        </p>
      </div>

      {!isProfileComplete ? (
        <div className="bg-cardBg border border-customBorder rounded-xl p-8 flex flex-col items-center text-center max-w-md">
          <div className="size-10 bg-accentPrimary/10 border border-accentPrimary/30 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle size={18} className="text-accentPrimary" />
          </div>
          <h2 className="text-sm font-bold text-foreground">Finish your profile first</h2>
          <p className="text-xs text-mutedText mt-2 leading-relaxed">
            We need your city and industry before we can run this analysis.
          </p>
          <Link
            href="/settings"
            className="mt-4 px-4 py-2 bg-accentPrimary hover:bg-accentPrimary/90 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      ) : (
        <div className="w-full">
          <PredictForm
            defaultCity={profile?.city ?? ""}
            defaultMarket={profile?.primary_sector ?? ""}
            defaultStage=""
            marketOptions={marketOptions}
            cityOptions={cityOptions}
          />
        </div>
      )}
    </div>
  );
}