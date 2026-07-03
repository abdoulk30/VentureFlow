import { createClient } from "@/utils/supabase/server";
import { MapPin, Layers, GitBranch, AlertCircle } from "lucide-react";
import MatchedInvestors, { MatchedInvestor } from "@/components/MatchedInvestors";

export const dynamic = "force-dynamic";

interface CityFunding {
  city: string;
  total_funding: number;
  deal_count: number;
}
interface MarketDist {
  market: string;
  deal_count: number;
}
interface RoundsDist {
  rounds_bucket: string;
  deal_count: number;
}

// Plain-language relabeling of the raw bucket names the database returns.
const ROUNDS_LABELS: Record<string, string> = {
  "No recorded rounds": "Never raised money (on record)",
  "1 round": "Raised money once",
  "2 rounds": "Raised money twice",
  "3 rounds": "Raised money 3 times",
  "4+ rounds": "Raised money 4+ times",
};

function formatUSD(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, cities, markets, rounds] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase.rpc("get_top_cities_by_funding", { limit_count: 8 }),
    supabase.rpc("get_market_distribution", { limit_count: 8 }),
    supabase.rpc("get_funding_rounds_distribution"),
  ]);

  const cityData = (cities.data ?? []) as CityFunding[];
  const marketData = (markets.data ?? []) as MarketDist[];
  const roundsData = (rounds.data ?? []) as RoundsDist[];

  const rpcError = cities.error || markets.error || rounds.error;

  const maxCityFunding = Math.max(...cityData.map((c) => c.total_funding), 1);
  const maxMarketCount = Math.max(...marketData.map((m) => m.deal_count), 1);

  const isFounder = profile?.user_role === "founder";
  const isProfileComplete = !!profile?.is_profile_complete;

  // Matched Investors: only meaningful for founders with a complete
  // profile (consistent with the rule used everywhere else -- browsing is
  // open to anyone, but matching requires a profile to match against).
  let matchedInvestors: MatchedInvestor[] = [];
  if (isFounder && isProfileComplete) {
    const { data: investors } = await supabase
      .from("investors_directory")
      .select("*");

    const founderSector = (profile.primary_sector ?? "").trim().toLowerCase();
    const founderStage = (profile.funding_stage_or_target ?? "").trim().toLowerCase();
    // Now using the dedicated `state` column instead of parsing it out of
    // the free-text `city` field -- reliable regardless of how city was
    // typed in.
    const founderCity = (profile.city ?? "").trim().toLowerCase();
    const founderState = (profile.state ?? "").trim().toLowerCase();

    matchedInvestors = (investors ?? [])
      .map((inv) => {
        const sectorMatch = (inv.categories ?? []).some(
          (c: string) => c.trim().toLowerCase() === founderSector
        );
        const stageMatch = (inv.stage_focus ?? []).some(
          (s: string) => s.trim().toLowerCase() === founderStage
        );

        const invCity = (inv.city ?? "").trim().toLowerCase();
        const invState = (inv.state ?? "").trim().toLowerCase();
        let locationMatch: "city" | "state" | "none" = "none";
        if (founderCity && invCity === founderCity) {
          locationMatch = "city";
        } else if (founderState && invState && invState === founderState) {
          locationMatch = "state";
        }

        const matchScore =
          (sectorMatch ? 40 : 0) +
          (stageMatch ? 30 : 0) +
          (locationMatch === "city" ? 30 : locationMatch === "state" ? 15 : 0);

        return { ...inv, matchScore, sectorMatch, stageMatch, locationMatch };
      })
      // Require at least a real industry or stage match -- pure
      // same-state-but-unrelated-focus investors shouldn't be "top
      // recommendations" even though they'd get nonzero points.
      .filter((inv) => inv.matchScore > 0 && (inv.sectorMatch || inv.stageMatch))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono text-mutedText uppercase tracking-widest">
          Overview
        </p>
        <h1 className="text-xl font-bold text-white mt-0.5">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-xs text-mutedText mt-1">
          Real numbers pulled from our historical database of past funding
          deals -- not estimates.
        </p>
      </div>

      {rpcError && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono flex items-start gap-2">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>
            Could not load dashboard data: {rpcError.message}. Make sure the
            SQL migrations have been run in Supabase.
          </span>
        </div>
      )}

      {isFounder && isProfileComplete && (
        <MatchedInvestors
          investors={matchedInvestors}
          founderSector={profile.primary_sector ?? ""}
          founderStage={profile.funding_stage_or_target ?? ""}
          founderCity={profile.city ?? ""}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={13} className="text-accentPrimary" />
            <h3 className="text-sm font-semibold text-white">
              Cities Where Companies Raised the Most Money
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            Total dollars raised historically by companies in each city.
          </p>
          <div className="space-y-3">
            {cityData.length === 0 && (
              <p className="text-xs text-mutedText">No data available.</p>
            )}
            {cityData.map((c) => (
              <div key={c.city}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-neutral-300">{c.city}</span>
                  <span className="font-mono text-xs text-white">
                    {formatUSD(c.total_funding)} &middot; {c.deal_count} companies
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surfaceMuted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accentPrimary"
                    style={{
                      width: `${(c.total_funding / maxCityFunding) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={13} className="text-accentSuccess" />
            <h3 className="text-sm font-semibold text-white">
              Number of Companies by Industry
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            How many companies in our data belong to each industry.
          </p>
          <div className="space-y-3">
            {marketData.length === 0 && (
              <p className="text-xs text-mutedText">No data available.</p>
            )}
            {marketData.map((m) => (
              <div key={m.market}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-neutral-300">{m.market}</span>
                  <span className="font-mono text-xs text-white">
                    {m.deal_count} companies
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surfaceMuted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accentSuccess"
                    style={{
                      width: `${(m.deal_count / maxMarketCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-cardBg border border-customBorder rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <GitBranch size={13} className="text-accentInfo" />
          <h3 className="text-sm font-semibold text-white">
            How Many Times Companies Raised Money
          </h3>
        </div>
        <p className="text-[11px] text-mutedText mb-4">
          Each time a company gets an investment, that's one "round." Some
          companies only ever raise money once; others raise it several
          times as they grow.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {roundsData.map((r) => (
            <div
              key={r.rounds_bucket}
              className="p-3 rounded-lg bg-surfaceMuted border border-customBorder text-center"
            >
              <p className="text-lg font-bold text-white font-mono">
                {r.deal_count}
              </p>
              <p className="text-[10px] text-mutedText mt-1">
                {ROUNDS_LABELS[r.rounds_bucket] ?? r.rounds_bucket}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}