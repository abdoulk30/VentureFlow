import { createClient } from "@/utils/supabase/server";
import { getCurrentUserAndProfile } from "@/utils/supabase/get-profile";
import { MapPin, Layers, GitBranch, AlertCircle, TrendingUp } from "lucide-react";
import MatchedInvestors, { MatchedInvestor } from "@/components/MatchedInvestors";
import MatchedStartups, { MatchedStartup } from "@/components/MatchedStartups";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

interface CityFunding {
  city: string;
  total_funding: number;
  deal_count: number;
}
interface CityDealCount {
  city: string;
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
interface StatusDist {
  status: string;
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
  const { profile } = await getCurrentUserAndProfile();

  const isFounder = profile?.user_role === "founder";
  const isProfileComplete = !!profile?.is_profile_complete;

  // Shared query for both roles: industry breakdown is equally useful to
  // founders (where's the competition/company) and investors (where's the
  // deal flow by sector).
  const marketsQuery = supabase.rpc("get_market_distribution", { limit_count: 8 });

  // Founder-only queries: total $ raised by city, and how many times
  // companies re-raised (their own likely trajectory).
  const founderCitiesQuery = supabase.rpc("get_top_cities_by_funding", { limit_count: 8 });
  const roundsQuery = supabase.rpc("get_funding_rounds_distribution");

  // Investor-only queries: deal COUNT by city (where deal flow concentrates,
  // not just total $), and real company outcomes (survivorship signal).
  const investorCitiesQuery = supabase.rpc("get_top_cities_by_deal_count", { limit_count: 8 });
  const statusQuery = supabase.rpc("get_company_status_distribution");

  const [markets, founderCities, rounds, investorCities, statuses] = await Promise.all([
    marketsQuery,
    isFounder ? founderCitiesQuery : Promise.resolve({ data: null, error: null }),
    isFounder ? roundsQuery : Promise.resolve({ data: null, error: null }),
    !isFounder ? investorCitiesQuery : Promise.resolve({ data: null, error: null }),
    !isFounder ? statusQuery : Promise.resolve({ data: null, error: null }),
  ]);

  const marketData = (markets.data ?? []) as MarketDist[];
  const cityFundingData = (founderCities.data ?? []) as CityFunding[];
  const roundsData = (rounds.data ?? []) as RoundsDist[];
  const cityCountData = (investorCities.data ?? []) as CityDealCount[];
  const statusData = (statuses.data ?? []) as StatusDist[];

  const rpcError =
    markets.error ||
    (isFounder ? founderCities.error || rounds.error : investorCities.error || statuses.error);

  const maxMarketCount = Math.max(...marketData.map((m) => m.deal_count), 1);
  const maxCityFunding = Math.max(...cityFundingData.map((c) => c.total_funding), 1);
  const maxCityCount = Math.max(...cityCountData.map((c) => c.deal_count), 1);

  // Matched Investors: founders with a complete profile only.
  let matchedInvestors: MatchedInvestor[] = [];
  if (isFounder && isProfileComplete) {
    const { data: investors } = await supabase.from("investors_directory").select("*");

    const founderSector = (profile.primary_sector ?? "").trim().toLowerCase();
    const founderStage = (profile.funding_stage_or_target ?? "").trim().toLowerCase();
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
      .filter((inv) => inv.matchScore > 0 && (inv.sectorMatch || inv.stageMatch))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }

  // Matched Startups: investors with a complete profile only. No stage
  // dimension here -- startups_directory has no real funding stage data,
  // so the calculation is industry + location only.
  let matchedStartups: MatchedStartup[] = [];
  if (!isFounder && isProfileComplete) {
    const { data: startupsForMatch } = await supabase.from("startups_directory").select("*");

    const investorSector = (profile.primary_sector ?? "").trim().toLowerCase();
    const investorCity = (profile.city ?? "").trim().toLowerCase();
    const investorState = (profile.state ?? "").trim().toLowerCase();

    matchedStartups = (startupsForMatch ?? [])
      .map((s) => {
        const sectorMatch = (s.categories ?? []).some(
          (c: string) => c.trim().toLowerCase() === investorSector
        );

        const sCity = (s.city ?? "").trim().toLowerCase();
        const sState = (s.state ?? "").trim().toLowerCase();
        let locationMatch: "city" | "state" | "none" = "none";
        if (investorCity && sCity === investorCity) {
          locationMatch = "city";
        } else if (investorState && sState && sState === investorState) {
          locationMatch = "state";
        }

        const matchScore =
          (sectorMatch ? 60 : 0) +
          (locationMatch === "city" ? 40 : locationMatch === "state" ? 20 : 0);

        return { ...s, matchScore, sectorMatch, locationMatch };
      })
      .filter((s) => s.sectorMatch)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono text-mutedText uppercase tracking-widest">
          Overview
        </p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">
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

      {!isFounder && isProfileComplete && (
        <MatchedStartups
          startups={matchedStartups}
          investorSector={profile.primary_sector ?? ""}
          investorCity={profile.city ?? ""}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={13} className="text-accentPrimary" />
            <h3 className="text-sm font-semibold text-foreground">
              {isFounder ? "Cities Where Startup Companies Raised the Most Money" : "Most Active Cities"}
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            {isFounder
              ? "Total dollars raised historically by startup companies in each city."
              : "Real number of startup companies per city -- where deal flow is concentrated, not just where the biggest checks were."}
          </p>
          <div className="space-y-3">
            {isFounder ? (
              <>
                {cityFundingData.length === 0 && (
                  <p className="text-xs text-mutedText">No data available.</p>
                )}
                {cityFundingData.map((c) => (
                  <div key={c.city}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-secondaryText">{c.city}</span>
                      <span className="font-mono text-xs text-foreground">
                        {formatUSD(c.total_funding)} &middot; {formatNumber(c.deal_count)} startup companies
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surfaceMuted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accentPrimary"
                        style={{ width: `${(c.total_funding / maxCityFunding) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {cityCountData.length === 0 && (
                  <p className="text-xs text-mutedText">No data available.</p>
                )}
                {cityCountData.map((c) => (
                  <div key={c.city}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-secondaryText">{c.city}</span>
                      <span className="font-mono text-xs text-foreground">
                        {formatNumber(c.deal_count)} startup companies
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surfaceMuted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accentPrimary"
                        style={{ width: `${(c.deal_count / maxCityCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={13} className="text-accentSuccess" />
            <h3 className="text-sm font-semibold text-foreground">
              Number of Startup Companies by Industry
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            How many startup companies in our data belong to each industry.
          </p>
          <div className="space-y-3">
            {marketData.length === 0 && (
              <p className="text-xs text-mutedText">No data available.</p>
            )}
            {marketData.map((m) => (
              <div key={m.market}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-secondaryText">{m.market}</span>
                  <span className="font-mono text-xs text-foreground">
                    {formatNumber(m.deal_count)} startup companies
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surfaceMuted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accentSuccess"
                    style={{ width: `${(m.deal_count / maxMarketCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isFounder ? (
        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <GitBranch size={13} className="text-accentInfo" />
            <h3 className="text-sm font-semibold text-foreground">
              How Many Times Startup Companies Raised Money
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
                <p className="text-lg font-bold text-foreground font-mono">{formatNumber(r.deal_count)}</p>
                <p className="text-[10px] text-mutedText mt-1">
                  {ROUNDS_LABELS[r.rounds_bucket] ?? r.rounds_bucket}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={13} className="text-accentInfo" />
            <h3 className="text-sm font-semibold text-foreground">Startup Company Outcomes</h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            What eventually happened to real startup companies in our
            historical data: still running (<span className="text-secondaryText">Operating</span>),
            bought by another company (<span className="text-secondaryText">Acquired</span>),
            or shut down (<span className="text-secondaryText">Closed</span>). A real
            outcome/risk signal, not a prediction.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {statusData.length === 0 && (
              <p className="text-xs text-mutedText">No data available.</p>
            )}
            {statusData.map((s) => (
              <div
                key={s.status}
                className="flex-1 min-w-[120px] max-w-[180px] p-3 rounded-lg bg-surfaceMuted border border-customBorder text-center"
              >
                <p className="text-lg font-bold text-foreground font-mono">
                  {formatNumber(s.deal_count)}
                </p>
                <p className="text-[10px] text-mutedText mt-1">{s.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}