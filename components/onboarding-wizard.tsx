"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { STAGES, US_STATES } from "@/lib/constants";

// Simplified on purpose: only fields that actually exist in `profiles` and
// actually get saved. Industry options come from real data (marketOptions),
// not a made-up list, so this stays consistent with the Funding Likelihood
// page later.

export function OnboardingWizard({
  userId,
  initialCity,
  initialState,
  initialSector,
  initialStage,
  marketOptions,
}: {
  userId: string;
  initialCity: string;
  initialState: string;
  initialSector: string;
  initialStage: string;
  marketOptions: string[];
}) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity ?? "");
  const [state, setState] = useState(initialState ?? "");
  const [sector, setSector] = useState(
    marketOptions.includes(initialSector) ? initialSector : ""
  );
  const [stage, setStage] = useState(initialStage ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        city,
        state,
        primary_sector: sector,
        funding_stage_or_target: stage,
        is_profile_complete: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md bg-cardBg border border-customBorder rounded-xl p-8">
      <h2 className="text-lg font-bold text-foreground">Complete Your Profile</h2>
      <p className="text-xs text-mutedText mt-1 mb-6">
        This unlocks the Funding Likelihood tool. You can already browse
        without filling this out.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-mutedText mb-1.5">
              City
            </label>
            <input
              required
              value={city ?? ""}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. New York"
              className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-foreground placeholder-mutedText outline-none focus:border-accentPrimary/50"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-mutedText mb-1.5">
              State
            </label>
            <select
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-foreground outline-none focus:border-accentPrimary/50"
            >
              <option value="">Select...</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-mutedText mb-1.5">
            Industry
          </label>
          <select
            required
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-foreground outline-none focus:border-accentPrimary/50"
          >
            <option value="">Select...</option>
            {marketOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-mutedText mt-1">
            What kind of business you run (e.g. Software, Biotech, E-Commerce).
          </p>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-mutedText mb-1.5">
            Funding Stage
          </label>
          <select
            required
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-foreground outline-none focus:border-accentPrimary/50"
          >
            <option value="">Select...</option>
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-mutedText mt-1">
            How far along you are in raising money.
          </p>
        </div>

        <div className="bg-surfaceMuted/50 border border-dashed border-customBorder p-3 rounded-lg flex items-start gap-2.5">
          <ShieldCheck size={14} className="text-mutedText shrink-0 mt-0.5" />
          <p className="text-[11px] text-mutedText leading-relaxed">
            These three fields are all that's needed to mark your profile
            complete. You can add more details later in Settings.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 disabled:opacity-50 text-white text-sm font-bold rounded transition-colors"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <>
              Save & Continue <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}