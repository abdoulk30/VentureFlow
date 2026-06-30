"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  LayoutDashboard, 
  Layers, 
  GitPullRequest, 
  User, 
  Menu, 
  X, 
  TrendingUp 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core navigation items matching your PRD Sub-journeys
  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Predictor Hub", href: "/predict", icon: TrendingUp },
    { name: "Investor Matches", href: "/matches", icon: Layers },
    { name: "Connections Flow", href: "/connections", icon: GitPullRequest },
    { name: "Profile Settings", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      
      {/* 1. DESKTOP & LAPTOP PERMANENT LEFT SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-2 py-0.5 rounded-md font-mono text-lg">VF</span>
            VentureFlow
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all duration-150 group"
              >
                <Icon className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300">
              AB
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white truncate">Abdoul Ba</span>
              <span className="text-[10px] text-zinc-400 truncate">Founder Profile</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER / SLIDE-OUT MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. MOBILE DRAWER NAVIGATION PANEL */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-2 py-0.5 rounded-md font-mono text-lg">VF</span>
            VentureFlow
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-300">
              AB
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">Abdoul Ba</span>
              <span className="text-xs text-zinc-400">Founder Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE WRAPPER (CONTAINING STICKY TOP HEADER) */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* STICKY TOP HEADER */}
        <header className="sticky top-0 z-30 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Workspace / <span className="text-zinc-900 dark:text-white font-semibold">Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Controller button integrated cleanly */}
            <ThemeToggle />
            <div className="h-8 w-px bg-zinc-200 dark:border-zinc-800 hidden sm:block" />
            <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hidden sm:flex items-center justify-center font-mono font-bold text-xs shadow-sm">
              VF
            </div>
          </div>
        </header>

        {/* RECONFIGURING CONTENT INNER CORE AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}