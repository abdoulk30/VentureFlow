"use client";

import { useState } from "react";
import { Briefcase, ChevronRight, Filter, Check, X, Minus } from "lucide-react";
import DetailModal, { DirectoryItem } from "@/components/DetailModal";

export interface MatchedStartup extends DirectoryItem {
  matchScore: number;
  sectorMatch: boolean;
  locationMatch: "city" | "state" | "none";
}

function scoreColor(score: number) {
  if (score >= 80) return "text-accentSuccess border-accentSuccess/30 bg-accentSuccess/10";
  if (score >= 50) return "text-accentPrimary border-accentPrimary/30 bg-accentPrimary/10";
  return "text-mutedText border-customBorder bg-surfaceMuted";
}

function ReasonChip({
  matched,
  label,
}: {
  matched: "yes" | "partial" | "no";
  label: string;
}) {
  const styles = {
    yes: "text-accentSuccess",
    partial: "text-accentPrimary",
    no: "text-mutedText",
  }[matched];
  const Icon = matched === "yes" ? Check : matched === "partial" ? Minus : X;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] ${styles}`}>
      <Icon size={10} />
      {label}
    </span>
  );
}

export default function MatchedStartups({
  startups,
  investorSector,
  investorCity,
}: {
  startups: MatchedStartup[];
  investorSector: string;
  investorCity: string;
}) {
  const [selected, setSelected] = useState<MatchedStartup | null>(null);

  return (
    <div className="bg-cardBg border border-customBorder rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-customBorder">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-mutedText">
            Matched Startups
          </p>
          <h3 className="text-base font-bold text-foreground mt-0.5">
            Top Recommendations
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-mutedText border border-customBorder rounded px-3 py-1.5">
          <Filter size={12} />
          Filter
        </div>
      </div>

      {startups.length === 0 ? (
        <p className="text-xs text-mutedText px-5 py-6 text-center">
          No startups currently overlap with your industry. Try browsing the
          full directory instead.
        </p>
      ) : (
        <div>
          {startups.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="w-full flex items-center gap-4 px-5 py-4 border-b border-customBorder last:border-b-0 hover:bg-surfaceMuted/50 transition-colors text-left"
            >
              <div className="size-9 rounded-lg bg-surfaceMuted border border-customBorder flex items-center justify-center shrink-0 text-mutedText">
                <Briefcase size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {s.name}
                </p>
                <p className="text-xs text-mutedText truncate mb-1.5">
                  {(s.categories ?? []).join(" \u00b7 ") || "General"}
                  {s.city ? ` \u00b7 ${s.city}, ${s.state}` : ""}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <ReasonChip
                    matched={s.sectorMatch ? "yes" : "no"}
                    label={`Industry: ${investorSector}`}
                  />
                  <ReasonChip
                    matched={
                      s.locationMatch === "city"
                        ? "yes"
                        : s.locationMatch === "state"
                        ? "partial"
                        : "no"
                    }
                    label={
                      s.locationMatch === "city"
                        ? `Same city as you (${investorCity})`
                        : s.locationMatch === "state"
                        ? "Same state"
                        : "Different location"
                    }
                  />
                </div>
              </div>

              <span
                className={`shrink-0 text-xs font-mono font-semibold px-2.5 py-1 rounded border ${scoreColor(
                  s.matchScore
                )}`}
              >
                {s.matchScore}%
              </span>

              <ChevronRight size={14} className="text-mutedText shrink-0" />
            </button>
          ))}
        </div>
      )}

      <div className="px-5 py-3 bg-surfaceMuted/30 border-t border-customBorder">
        <p className="text-[10px] text-mutedText leading-relaxed">
          Match % = 60% if your industry matches, plus up to 40% for
          location (40% same city, 20% same state). There's no funding
          stage data for startups in our directory, so stage isn't part of
          this calculation. Only startups with a real industry match are
          shown -- this is a transparent overlap calculation, not a
          machine-learning prediction.
        </p>
      </div>

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}