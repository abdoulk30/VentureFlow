"use client";

import { useState } from "react";
import { Sparkles, Loader2, Activity } from "lucide-react";
import { STAGES } from "@/lib/constants";

interface PredictResult {
  hasData: boolean;
  totalMatches: number;
  totalScore?: number;
  breakdown?: {
    sectorAlignment: number;
    cityDensity: number;
    stageFit: number;
    trendVelocity: number;
  };
  message?: string;
  error?: string;
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative size-[168px] shrink-0">
      <svg width="168" height="168" viewBox="0 0 168 168">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c5cfc" />
            <stop offset="100%" stopColor="#00e5a0" />
          </linearGradient>
        </defs>
        <circle
          cx="84"
          cy="84"
          r={radius}
          fill="none"
          stroke="#1a1a28"
          strokeWidth="12"
        />
        <circle
          cx="84"
          cy="84"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 84 84)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white font-mono">{score}</span>
        <span className="text-xs text-mutedText">/100</span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-neutral-300">{label}</span>
        <span className="text-sm font-semibold text-white">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-surfaceMuted overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: "linear-gradient(90deg, #7c5cfc, #00e5a0)",
          }}
        />
      </div>
    </div>
  );
}

export default function PredictForm({
  defaultCity,
  defaultMarket,
  defaultStage,
  marketOptions,
  cityOptions,
}: {
  defaultCity: string;
  defaultMarket: string;
  defaultStage: string;
  marketOptions: string[];
  cityOptions: string[];
}) {
  const [city, setCity] = useState(
    cityOptions.includes(defaultCity) ? defaultCity : ""
  );
  const [market, setMarket] = useState(
    marketOptions.includes(defaultMarket) ? defaultMarket : ""
  );
  const [stage, setStage] = useState(defaultStage ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, market, stage }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        hasData: false,
        totalMatches: 0,
        error: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-cardBg border border-customBorder rounded-xl p-6 space-y-4"
      >
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-mutedText mb-1.5">
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-white outline-none focus:border-accentPrimary/50"
          >
            <option value="">Select a city...</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-mutedText mb-1.5">
            Industry
          </label>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            required
            className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-white outline-none focus:border-accentPrimary/50"
          >
            <option value="">Select an industry...</option>
            {marketOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-mutedText mb-1.5">
            Funding Stage
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            required
            className="w-full bg-surfaceMuted border border-customBorder rounded px-3 py-2 text-sm text-white outline-none focus:border-accentPrimary/50"
          >
            <option value="">Select...</option>
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 disabled:opacity-50 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          Calculate
        </button>
      </form>

      {result && (
        <div className="bg-cardBg border border-customBorder rounded-xl p-6 sm:p-8">
          {result.error ? (
            <p className="text-sm text-destructive">{result.error}</p>
          ) : !result.hasData ? (
            <p className="text-sm text-mutedText text-center">{result.message}</p>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-mutedText">
                    Funding Likelihood Score
                  </p>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Based on Real Historical Data
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-accentSuccess text-xs font-mono">
                  <Activity size={12} />
                  Live
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ScoreGauge score={result.totalScore ?? 0} />
                <div className="flex-1 w-full space-y-4">
                  <BreakdownBar
                    label="Sector Alignment"
                    value={result.breakdown!.sectorAlignment}
                  />
                  <BreakdownBar
                    label="City Density"
                    value={result.breakdown!.cityDensity}
                  />
                  <BreakdownBar
                    label="Stage Fit"
                    value={result.breakdown!.stageFit}
                  />
                  <BreakdownBar
                    label="Trend Velocity"
                    value={result.breakdown!.trendVelocity}
                  />
                </div>
              </div>

              <div className="border-t border-customBorder pt-4">
                <p className="text-xs text-mutedText">
                  Based on <span className="text-white font-semibold">{result.totalMatches} real historical companies</span> &middot; {market} &times; {city}
                </p>
                <p className="text-[10px] text-mutedText mt-2 leading-relaxed">
                  <span className="text-neutral-400">Sector Alignment</span>: how established this industry is overall.{" "}
                  <span className="text-neutral-400">City Density</span>: how much of this industry's activity happens in this city.{" "}
                  <span className="text-neutral-400">Stage Fit</span>: what % of similar companies reached your selected stage.{" "}
                  <span className="text-neutral-400">Trend Velocity</span>: what % were founded in the last 5 years. Each is a real statistic from historical data, not a prediction model.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}