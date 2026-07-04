import { createClient } from "@/utils/supabase/server";
import { Briefcase, Building2, MapPin, Tag, Layers, PieChart } from "lucide-react";
import CapitalDensityMap from "@/components/CapitalDensityMap";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

interface CountRow {
  label: string;
  count: number;
}

// Flattens an array column (e.g. categories: text[]) across all rows and
// counts real occurrences of each distinct value. Used for both directories
// since both have array-typed category/stage fields.
function countArrayField(rows: Record<string, unknown>[], field: string): CountRow[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const values = (row[field] as string[] | null) ?? [];
    for (const v of values) {
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

// Same, but for a plain scalar text column (e.g. state, status).
function countScalarField(rows: Record<string, unknown>[], field: string): CountRow[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const v = row[field] as string | null;
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function BreakdownList({ data, max }: { data: CountRow[]; max: number }) {
  if (data.length === 0) {
    return <p className="text-xs text-mutedText">No data available.</p>;
  }
  const highest = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-3">
      {data.slice(0, max).map((d) => (
        <div key={d.label}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-secondaryText">{d.label}</span>
            <span className="font-mono text-xs text-foreground">{formatNumber(d.count)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-surfaceMuted overflow-hidden">
            <div
              className="h-full rounded-full bg-accentPrimary"
              style={{ width: `${(d.count / highest) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function DirectoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: profile },
    { data: startups, error: startupsError },
    { data: investors, error: investorsError },
    { data: marketRows },
  ] = await Promise.all([
    supabase.from("profiles").select("user_role").eq("id", user!.id).single(),
    supabase.from("startups_directory").select("*"),
    supabase.from("investors_directory").select("*"),
    supabase.rpc("get_market_options", { limit_count: 60 }),
  ]);

  const isFounder = profile?.user_role === "founder";

  const marketOptions = (marketRows ?? [])
    .map((r: { market: string }) => r.market)
    .sort((a: string, b: string) => a.localeCompare(b));

  const startupRows = (startups ?? []) as Record<string, unknown>[];
  const investorRows = (investors ?? []) as Record<string, unknown>[];

  const startupCategories = countArrayField(startupRows, "categories");
  const startupStates = countScalarField(startupRows, "state");
  const startupStatus = countScalarField(startupRows, "status");

  const investorCategories = countArrayField(investorRows, "categories");
  const investorStates = countScalarField(investorRows, "state");
  const investorStages = countArrayField(investorRows, "stage_focus");

  const startupsSection = (
    <div key="startups">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase size={14} className="text-accentPrimary" />
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
          Startup Directory
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Tag size={13} className="text-accentPrimary" />
            <h3 className="text-sm font-semibold text-foreground">
              Top Industries
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            How many startups fall into each category.
          </p>
          <BreakdownList data={startupCategories} max={8} />
        </div>

        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={13} className="text-accentSuccess" />
            <h3 className="text-sm font-semibold text-foreground">
              Startups by State
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            Where our real, curated startups are headquartered.
          </p>
          <BreakdownList data={startupStates} max={8} />
        </div>

        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <PieChart size={13} className="text-accentInfo" />
            <h3 className="text-sm font-semibold text-foreground">
              Startup Company Status
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            Whether these real startup companies are still operating, were
            bought by another company (acquired), or shut down (closed).
          </p>
          <BreakdownList data={startupStatus} max={8} />
        </div>
      </div>
    </div>
  );

  const investorsSection = (
    <div key="investors">
      <div className="flex items-center gap-2 mb-3">
        <Building2 size={14} className="text-accentSuccess" />
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
          Investor Directory
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Tag size={13} className="text-accentPrimary" />
            <h3 className="text-sm font-semibold text-foreground">
              Top Industries Covered
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            How many investors focus on each industry.
          </p>
          <BreakdownList data={investorCategories} max={8} />
        </div>

        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={13} className="text-accentSuccess" />
            <h3 className="text-sm font-semibold text-foreground">
              Investors by State
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            Where our real, curated investment firms are headquartered.
          </p>
          <BreakdownList data={investorStates} max={8} />
        </div>

        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={13} className="text-accentInfo" />
            <h3 className="text-sm font-semibold text-foreground">
              Funding Stage Focus
            </h3>
          </div>
          <p className="text-[11px] text-mutedText mb-4">
            Which funding stages investors say they focus on.
          </p>
          <BreakdownList data={investorStages} max={8} />
        </div>
      </div>
    </div>
  );

  // Founders see investor listings first (who might fund them); investors
  // see startup listings first (who they might fund).
  const orderedSections = isFounder
    ? [investorsSection, startupsSection]
    : [startupsSection, investorsSection];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono text-mutedText uppercase tracking-widest">
          Directories
        </p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">Directories</h1>
        <p className="text-xs text-mutedText mt-1">
          Real counts computed from the {startupRows.length} startups and{" "}
          {investorRows.length} investors in our directories -- not
          estimates.
        </p>
      </div>

      {(startupsError || investorsError) && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
          {startupsError?.message || investorsError?.message}
        </div>
      )}

      {orderedSections}

      <CapitalDensityMap
        marketOptions={marketOptions}
        metric={isFounder ? "funding" : "count"}
      />
    </div>
  );
}