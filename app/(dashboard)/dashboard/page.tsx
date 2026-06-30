"use client";

import React from "react";
import { TrendingUp, Users, ArrowUpRight, CheckCircle } from "lucide-react";

export default function GeneralDashboardPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Heading Banner */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Workspace Overview</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Welcome back to your VentureFlow command center. Here is your current platform activity overview.
        </p>
      </div>

      {/* Metrics Grid Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Match Probability Peak</span>
            <TrendingUp className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-zinc-900 dark:text-white">87%</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-1.5 py-0.5 rounded">Optimal</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Target VCs Indexed</span>
            <Users className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-zinc-900 dark:text-white">4,219</span>
            <span className="text-xs font-medium text-zinc-400">Live Pool</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Pipelines</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-zinc-900 dark:text-white">0</span>
            <span className="text-xs text-zinc-400">Pending Profile Onboarding</span>
          </div>
        </div>
      </div>

      {/* Quick Start Guide Section */}
      <div className="border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 rounded-2xl flex flex-col items-center text-center max-w-2xl mx-auto mt-6">
        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Next Step: Synchronize Live Data Streams</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
          Your layout framework is ready. In the upcoming phase, we will map your relational Supabase database hooks to hydrate this layout with real-time tracking streams.
        </p>
      </div>
    </div>
  );
}