"use client";

import Link from "next/link";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col justify-between p-6 transition-colors duration-200">
      
      {/* Top Bar Utilities */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center h-16">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-2 py-0.5 rounded-md font-mono text-lg">VF</span>
          VentureFlow
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="text-xs font-semibold hover:underline text-zinc-500 dark:text-zinc-400"
          >
            Skip to Layout Demo →
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Centerpiece Onboarding Form */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Welcome to VentureFlow
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
              Accelerating venture access through institutional data mapping and intelligent predictive matching models.
            </p>
          </div>
          
          {/* Rendering the wizard component we just created */}
          <OnboardingWizard />
        </div>
      </div>

      {/* Footer Branding Context */}
      <div className="w-full text-center text-[11px] text-zinc-400 dark:text-zinc-500 font-medium py-4 border-t border-zinc-200/50 dark:border-zinc-900/50 max-w-7xl mx-auto">
        VentureFlow Engineering Portal © 2026 • Live Environment Stable
      </div>
    </main>
  );
}