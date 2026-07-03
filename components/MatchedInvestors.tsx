"use client";

import { useState } from "react";
import { Building2, ChevronRight, Filter, Check, X, Minus } from "lucide-react";
import DetailModal, { DirectoryItem } from "@/components/DetailModal";

export interface MatchedInvestor extends DirectoryItem {
  matchScore: number;
  sectorMatch: boolean;
  stageMatch: boolean;
  locationMatch: "city" | "state" | "none";
}

function scoreColor(score: number) {
  if (score >= 70) return "text-accentSuccess border-accentSuccess/30 bg-accentSuccess/10";
  if (score >= 40) return "text-accentPrimary border-accentPrimary/30 bg-accentPrimary/10";
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

export default function MatchedInvestors({
  investors,
  founderSector,
  founderStage,
  founderCity,
}: {
  investors: MatchedInvestor[];
  founderSector: string;
  founderStage: string;
  founderCity: string;
}) {
  const [selected, setSelected] = useState<MatchedInvestor | null>(null);

  return (
    <div className="bg-cardBg border border-customBorder rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-customBorder">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-mutedText">
            Matched Investors
          </p>
          <h3 className="text-base font-bold text-white mt-0.5">
            Top Recommendations
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-mutedText border border-customBorder rounded px-3 py-1.5">
          <Filter size={12} />
          Filter
        </div>
      </div>

      {investors.length === 0 ? (
        <p className="text-xs text-mutedText px-5 py-6 text-center">
          No investors currently overlap with your industry or funding
          stage. Try browsing the full directory instead.
        </p>
      ) : (
        <div>
          {investors.map((inv) => (
            <button
              key={inv.id}
              onClick={() => setSelected(inv)}
              className="w-full flex items-center gap-4 px-5 py-4 border-b border-customBorder last:border-b-0 hover:bg-surfaceMuted/50 transition-colors text-left"
            >
              <div className="size-9 rounded-lg bg-surfaceMuted border border-customBorder flex items-center justify-center shrink-0 text-mutedText">
                <Building2 size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {inv.name}
                </p>
                <p className="text-xs text-mutedText truncate mb-1.5">
                  {(inv.categories ?? []).join(" \u00b7 ") || "General"}
                  {inv.city ? ` \u00b7 ${inv.city}, ${inv.state}` : ""}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <ReasonChip
                    matched={inv.sectorMatch ? "yes" : "no"}
                    label={`Industry: ${founderSector}`}
                  />
                  <ReasonChip
                    matched={inv.stageMatch ? "yes" : "no"}
                    label={`Stage: ${founderStage}`}
                  />
                  <ReasonChip
                    matched={
                      inv.locationMatch === "city"
                        ? "yes"
                        : inv.locationMatch === "state"
                        ? "partial"
                        : "no"
                    }
                    label={
                      inv.locationMatch === "city"
                        ? `Same city as you (${founderCity})`
                        : inv.locationMatch === "state"
                        ? "Same state"
                        : "Different location"
                    }
                  />
                </div>
              </div>

              <span
                className={`shrink-0 text-xs font-mono font-semibold px-2.5 py-1 rounded border ${scoreColor(
                  inv.matchScore
                )}`}
              >
                {inv.matchScore}%
              </span>

              <ChevronRight size={14} className="text-mutedText shrink-0" />
            </button>
          ))}
        </div>
      )}

      <div className="px-5 py-3 bg-surfaceMuted/30 border-t border-customBorder">
        <p className="text-[10px] text-mutedText leading-relaxed">
          Match % = 40% if your industry matches, 30% if your funding stage
          matches, and up to 30% for location (30% same city, 15% same
          state). Only investors with at least one industry or stage match
          are shown. This is a transparent overlap calculation based on
          your profile, not a machine-learning prediction.
        </p>
      </div>

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}