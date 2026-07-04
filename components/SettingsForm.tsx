"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { STAGES, US_STATES } from "@/lib/constants";

interface Profile {
  full_name: string | null;
  company_name: string | null;
  city: string | null;
  state: string | null;
  primary_sector: string | null;
  funding_stage_or_target: string | null;
  description: string | null;
  goals: string | null;
  user_role: string | null;
}

export default function SettingsForm({
  userId,
  email,
  profile,
  marketOptions,
  cityOptions,
}: {
  userId: string;
  email: string;
  profile: Profile | null;
  marketOptions: string[];
  cityOptions: string[];
}) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [companyName, setCompanyName] = useState(profile?.company_name ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [state, setState] = useState(profile?.state ?? "");
  const [sector, setSector] = useState(profile?.primary_sector ?? "");
  const [stage, setStage] = useState(profile?.funding_stage_or_target ?? "");
  const [description, setDescription] = useState(profile?.description ?? "");
  const [goals, setGoals] = useState(profile?.goals ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFounder = profile?.user_role === "founder";

  const checklist = isFounder
    ? [
        { label: "Basic Info", done: !!(fullName && companyName) },
        { label: "City", done: !!city },
        { label: "Industry", done: !!sector },
        { label: "Funding Stage", done: !!stage },
        { label: "Description", done: !!description },
        { label: "Goals", done: !!goals },
      ]
    : [
        { label: "Basic Info", done: !!(fullName && companyName) },
        { label: "City", done: !!city },
        { label: "Industry", done: !!sector },
        { label: "Description", done: !!description },
        { label: "What You're Looking For", done: !!goals },
      ];
  const completeness = Math.round(
    (checklist.filter((c) => c.done).length / checklist.length) * 100
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const isCoreComplete = isFounder ? !!(city && sector && stage) : !!(city && sector);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        company_name: companyName,
        city,
        state,
        primary_sector: sector,
        funding_stage_or_target: stage,
        description,
        goals,
        is_profile_complete: isCoreComplete,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form
        onSubmit={handleSave}
        className="lg:col-span-2 bg-cardBg border border-customBorder rounded-xl p-6 space-y-5"
      >
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-mutedText mb-3">
            Company Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-mutedText mb-1.5">
                Company Name
              </label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-foreground outline-none focus:border-accentPrimary/50"
              />
            </div>
            <div>
              <label className="block text-xs text-mutedText mb-1.5">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-foreground outline-none focus:border-accentPrimary/50"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-mutedText mb-1.5">
            Email (cannot be changed here)
          </label>
          <input
            value={email}
            disabled
            className="w-full bg-surfaceMuted/40 border border-customBorder rounded px-3 py-2 text-sm text-mutedText outline-none cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-mutedText mb-1.5">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-foreground outline-none focus:border-accentPrimary/50"
            >
              <option value="">Select...</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-mutedText mb-1.5">State</label>
            <select
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-mutedText mb-1.5">
              Industry
            </label>
            <select
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
          </div>
        </div>

        {isFounder && (
          <div>
            <label className="block text-xs text-mutedText mb-1.5">
              Funding Stage
            </label>
            <select
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
          </div>
        )}

        <div>
          <label className="block text-xs text-mutedText mb-1.5">
            Company Description (optional)
          </label>
          <textarea
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="A short summary of what you do."
            className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-foreground placeholder-mutedText outline-none focus:border-accentPrimary/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-mutedText mb-1.5">
            {isFounder ? "Goals (optional)" : "What Are You Looking For? (optional)"}
          </label>
          <textarea
            value={goals ?? ""}
            onChange={(e) => setGoals(e.target.value)}
            rows={2}
            placeholder={
              isFounder
                ? "What are you hoping to achieve?"
                : "Describe the kind of startups you want to invest in (sectors, stages, deal size, etc)."
            }
            className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-foreground placeholder-mutedText outline-none focus:border-accentPrimary/50 resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded text-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 disabled:opacity-50 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </form>

      <div className="space-y-4">
        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <div className="size-16 rounded-full bg-gradient-to-br from-accentPrimary to-accentSuccess flex items-center justify-center mx-auto">
            <span className="text-xl font-bold text-foreground">
              {fullName?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          </div>
          <p className="text-center text-sm font-semibold text-foreground mt-3">
            {fullName || "Your Name"}
          </p>
          <p className="text-center text-xs text-mutedText">
            {companyName || (isFounder ? "Founder" : "Investor")}
          </p>
        </div>

        <div className="bg-cardBg border border-customBorder rounded-xl p-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-mutedText mb-3">
            Profile Completeness
          </p>
          <div className="space-y-2 mb-4">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                {item.done ? (
                  <CheckCircle2 size={13} className="text-accentSuccess shrink-0" />
                ) : (
                  <Circle size={13} className="text-mutedText shrink-0" />
                )}
                <span className={item.done ? "text-foreground" : "text-mutedText"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-mutedText mb-1">
            <span>Completeness</span>
            <span className="text-accentPrimary">{completeness}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surfaceMuted overflow-hidden">
            <div
              className="h-full rounded-full bg-accentPrimary transition-all"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}