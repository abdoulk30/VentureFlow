'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Building, 
  LayoutDashboard, 
  Users, 
  GitFork, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  Zap
} from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: 'founder' | 'investor';
}

export default function DashboardShell({ 
  children, 
  activeTab, 
  setActiveTab, 
  currentRole
}: ShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'matches', label: 'Matches', icon: Users, badge: currentRole === 'founder' ? 47 : 5, badgeType: 'success' },
    { id: 'pipeline', label: 'Pipeline', icon: GitFork, badge: currentRole === 'founder' ? 4 : 12, badgeType: 'primary' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex text-white relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen">
        <div className="flex flex-col h-full bg-sidebarBg border-r border-customBorder text-white w-[240px]">
          <div className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-accentPrimary flex items-center justify-center rounded">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-lg tracking-tight font-sans">VentureFlow</span>
            </div>
            
            {/* Strict Dynamic Role Badge */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-cardBg border border-customBorder text-xs rounded text-white/90">
              {currentRole === 'founder' ? (
                <>
                  <Briefcase className="w-4 h-4 text-accentPrimary" />
                  <span className="font-semibold font-sans">Founder Portal</span>
                </>
              ) : (
                <>
                  <Building className="w-4 h-4 text-accentSuccess" />
                  <span className="font-semibold font-sans">Investor Portal</span>
                </>
              )}
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-1 py-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors duration-150 rounded ${
                    isActive 
                      ? 'bg-surfaceMuted text-white border-l-2 border-accentPrimary' 
                      : 'text-mutedText hover:text-white hover:bg-cardBg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-accentPrimary' : ''}`} />
                    <span className="font-sans">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-customBorder bg-sidebarBg flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <div className="relative w-full hidden sm:block">
              <Search className="w-4 h-4 text-mutedText absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full bg-[#13121a] border border-customBorder text-sm rounded pl-10 pr-4 py-2 text-white placeholder-mutedText focus:outline-none focus:border-accentPrimary transition-colors font-sans"
              />
            </div>
          </div>

          {/* Clean Right Header Layout (Toggle Button is Completely Removed Here) */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded bg-surfaceMuted border border-customBorder text-white/80 uppercase">
              {currentRole} Access
            </span>
            <button className="relative p-2 bg-[#13121a] border border-customBorder rounded text-mutedText hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}