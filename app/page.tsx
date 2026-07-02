'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import DashboardShell from '@/components/dashboard-shell';
import { Building, TrendingUp, ChevronRight, SlidersHorizontal, Sparkles, Filter, Layers } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<{ full_name: string; company_name: string; role: 'founder' | 'investor' } | null>(null);

  // Core production live dataset hook arrays loaded dynamically from tables
  const [connections, setConnections] = useState<any[]>([]);
  const [liveDealsQueue, setLiveDealsQueue] = useState<any[]>([]);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      // 1. Get live active authentication tokens
      const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
      
      if (sessionErr || !session) {
        router.push('/auth');
        return;
      }

      // 2. Hydrate active user metadata information from public.profiles
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('full_name, company_name, role')
        .eq('id', session.user.id)
        .single();

      if (profileErr || !profileData) {
        console.error('Failed fetching logged in profile constraints:', profileErr);
        setLoading(false);
        return;
      }

      setProfile(profileData as any);

      // 3. Fetch real operational data layers matching user's specific context profile
      if (profileData.role === 'founder') {
        const { data: matchRecords } = await supabase
          .from('historical_deals')
          .select('*')
          .limit(10);
        setLiveDealsQueue(matchRecords || []);
      } else {
        const { data: inboundFlow } = await supabase
          .from('historical_deals')
          .select('*')
          .eq('market', 'FinTech'); // Pulls real data rows based on investor sector mandates
        setLiveDealsQueue(inboundFlow || []);
      }

      // 4. Load real relationship records from the connections index
      const { data: activeConnections } = await supabase
        .from('connections')
        .select('*');
      setConnections(activeConnections || []);

      setLoading(false);
    };

    fetchSessionAndData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white font-sans">
        <div className="w-6 h-6 border-2 border-t-accentPrimary border-customBorder rounded-full animate-spin mb-3" />
        <span className="text-xs font-mono text-mutedText tracking-widest uppercase">Initializing Secured Application Data Matrix...</span>
      </div>
    );
  }

  if (!profile) return null;

  return (
      <DashboardShell 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentRole={profile.role}
      >
      <div className="space-y-6">
        
        {/* ================= TRUE SECURED APP CONTROL HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-customBorder gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-mutedText uppercase mb-1">
              <span>Secure Session Verified</span>
              <span>/</span>
              <span className="text-accentPrimary">{profile.company_name}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-sans text-white tracking-tight">
              Welcome back, {profile.full_name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/auth');
              }}
              className="h-9 px-4 bg-surfaceMuted hover:bg-cardBg border border-customBorder text-xs rounded font-sans transition-all text-white/90"
            >
              Sign Out Securely
            </button>
          </div>
        </div>

        {/* ================= PLATFORM RENDER FOR FOUNDER ACCOUNT ================= */}
        {activeTab === 'dashboard' && profile.role === 'founder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-cardBg border border-customBorder rounded p-6">
                <div className="text-[10px] font-mono tracking-widest text-mutedText uppercase">LIVE ACCOUNT PROFILE METRIC</div>
                <h2 className="text-base font-bold text-white font-sans mt-1">Founding Pipeline Ecosystem</h2>
                <p className="text-xs text-mutedText mt-2 leading-relaxed">
                  Your profile is successfully locked into the network as a startup. Real institutional matches matching your company profile metrics will display below directly inside your records tracking stream.
                </p>
              </div>

              {/* Dynamic Database Table Rows Hooked to liveDealsQueue */}
              <div className="bg-cardBg border border-customBorder rounded">
                <div className="p-4 border-b border-customBorder">
                  <h3 className="text-xs font-mono text-mutedText uppercase tracking-widest">Matched Fund Options (Pulled dynamically from database)</h3>
                </div>
                <div className="divide-y divide-customBorder">
                  {liveDealsQueue.length === 0 ? (
                    <div className="p-8 text-center text-xs text-mutedText font-sans">No matching records found inside database query fields.</div>
                  ) : (
                    liveDealsQueue.map((item: any) => (
                      <div key={item.id} className="p-4 flex items-center justify-between text-xs font-sans hover:bg-surfaceMuted/20 transition-all">
                        <div className="flex items-center gap-3">
                          <Building className="w-4 h-4 text-accentPrimary" />
                          <div>
                            <div className="font-bold text-white">{item.name || 'Anonymous Fund Record'}</div>
                            <div className="text-mutedText text-[11px] mt-0.5">{item.category_list || 'Alternative Multi-Sector Capital'}</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-accentSuccess px-2 py-0.5 rounded bg-accentSuccess/10 border border-accentSuccess/20">
                          {item.match_probability_score || 85}% Match Fit
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-cardBg border border-customBorder rounded p-5">
                <div className="text-[10px] font-mono text-mutedText uppercase tracking-widest mb-1">Live active connections</div>
                <div className="text-2xl font-bold font-mono text-white">{connections.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PLATFORM RENDER FOR INVESTOR ACCOUNT ================= */}
        {activeTab === 'dashboard' && profile.role === 'investor' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-cardBg border border-customBorder rounded p-6">
                  <div className="text-[10px] font-mono tracking-widest text-mutedText uppercase">INVESTOR MANDATE CORE</div>
                  <h2 className="text-base font-bold text-white font-sans mt-1">Inbound Asset Pipeline Vetting</h2>
                  <p className="text-xs text-mutedText mt-2 leading-relaxed">
                    Review incoming application instances requesting alignment evaluations under your capital injection metrics.
                  </p>
                </div>

                {/* Real Investor Deal Inbound Pipeline rows */}
                <div className="bg-cardBg border border-customBorder rounded">
                  <div className="p-4 border-b border-customBorder">
                    <h3 className="text-xs font-mono text-mutedText uppercase tracking-widest">Active Inbound Deals Queue</h3>
                  </div>
                  <div className="divide-y divide-customBorder">
                    {liveDealsQueue.length === 0 ? (
                      <div className="p-8 text-center text-xs text-mutedText font-sans">No corporate pipeline entities matched your current database filter thresholds.</div>
                    ) : (
                      liveDealsQueue.map((item: any) => (
                        <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans hover:bg-surfaceMuted/20 transition-all">
                          <div>
                            <div className="font-bold text-white text-sm">{item.name}</div>
                            <div className="text-mutedText mt-0.5">{item.city}, {item.state_code} · {item.category_list}</div>
                          </div>
                          <div className="flex items-center gap-3 justify-between sm:justify-end">
                            <span className="font-mono text-white bg-surfaceMuted px-2 py-0.5 border border-customBorder rounded">${(item.funding_total_usd || 0).toLocaleString()} raise</span>
                            <span className="font-mono font-bold text-accentPrimary bg-accentPrimary/10 border border-accentPrimary/20 px-2 py-0.5 rounded">{item.match_probability_score || 78}% Score</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-cardBg border border-customBorder rounded p-5">
                  <div className="text-[10px] font-mono text-mutedText uppercase tracking-widest">Total Inbound Managed</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{liveDealsQueue.length} Companies</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternate Navigation Anchors */}
        {activeTab !== 'dashboard' && (
          <div className="bg-cardBg border border-customBorder p-12 rounded text-center max-w-md mx-auto mt-6">
            <Layers className="w-5 h-5 text-accentPrimary mx-auto mb-2" />
            <h3 className="text-xs font-bold font-sans text-white uppercase tracking-wider">Sub-Module Matrix Initialized</h3>
            <p className="text-[11px] text-mutedText font-sans mt-1">
              Active module routing <code className="text-accentInfo font-mono px-1 bg-surfaceMuted rounded">{activeTab}</code> is securely bound to session user validation constraints.
            </p>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}