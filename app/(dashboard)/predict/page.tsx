"use client";

import React from "react";
import { Sparkles, BarChart3 } from "lucide-react";

export default function PredictorHubPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">AI Funding Likelihood Predictor</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Evaluate company operational matrices against 50,000+ historical corporate investment allocations.
        </p>
      </div>

      <div className="p-8 bg-zinc-900 text-white rounded-2xl border border-zinc-800 shadow-md relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 dark:to-zinc-950">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 h-40 w-40 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-md">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white px-2.5 py-1 rounded-md text-xs font-semibold mb-4 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 fill-white/20" /> Advanced Semantic Model
          </div>
          <h2 className="text-xl font-bold">Algorithmic Brain Active</h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Once you finalize onboarding registration, your descriptive goals and sector metadata vectors will be parsed here using text embedding distance filters to calculate alignment.
          </p>
        </div>
      </div>
    </div>
  );
}