import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TargetMetricCard from '../components/TargetMetricCard';
import SettingsPanel from '../components/SettingsPanel';
import InvestorDetailModal from '../components/InvestorDetailModal';
import InvestorSearchHub from '@/components/InvestorSearchHub'; // New import
import { 
  Zap, User, Building2, TrendingUp, Sparkles, 
  Layers, Target, Briefcase, ChevronRight, BarChart3,
  Search, SlidersHorizontal, MessageSquare, Settings, AlertTriangle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SearchParams {
  tab?: string;
  viewing?: string;
}

export interface EcosystemParticipant {
  id: string;
  name: string;
  description: string;
  sector: string;
  stage: string;
  fundingValue: string;
  website: string;
  pastInvestments: string;
  responseTime: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const cookieStore = await cookies();
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || 'overview';
  const viewingId = resolvedParams.viewing || null;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0b0a0f] text-white flex flex-col items-center justify-center p-6">
        <p className="text-destructive font-mono text-xs mb-4">ERROR: Could not load your profile.</p>
        <a href="/auth" className="px-4 py-2 bg-purple-600 text-xs rounded font-semibold uppercase tracking-wider">Log In Again</a>
      </div>
    );
  }

  const isFounder = profile.user_role === 'founder';
  const isProfileComplete = !!(profile.primary_sector && profile.city && profile.funding_stage_or_target);

  const realInvestorPool: EcosystemParticipant[] = [
    { 
      id: "gradient", 
      name: "Gradient Ventures", 
      description: "Google's early-stage fund focused on artificial intelligence and software automation.", 
      sector: "AI / Machine Learning", 
      stage: "Seed Stage", 
      fundingValue: "$500K - $3M check size",
      website: "https://www.gradient.com",
      pastInvestments: "Cursor, Hebbia AI, Rasa, Streamlit",
      responseTime: "Usually responds within 48 hours"
    },
    { 
      id: "conviction", 
      name: "Conviction", 
      description: "A specialist firm partnering early with software builders and intelligence tools.", 
      sector: "AI / Machine Learning", 
      stage: "Pre-Seed (Idea Stage)", 
      fundingValue: "$1M - $4M check size",
      website: "https://www.conviction.com",
      pastInvestments: "Physical Intelligence, Seek AI, Harvey",
      responseTime: "Usually responds within 3 days"
    },
    { 
      id: "bessemer", 
      name: "Bessemer Venture Partners", 
      description: "A top-tier firm investing in business software, cloud tech, and digital platforms.", 
      sector: "SaaS / Software", 
      stage: "Series A (Early Growth)", 
      fundingValue: "$2M - $10M check size",
      website: "https://www.bvp.com",
      pastInvestments: "Shopify, LinkedIn, Pinterest, Twilio",
      responseTime: "Usually responds within 5 days"
    },
    { 
      id: "plugandplay", 
      name: "Plug and Play Tech Center", 
      description: "Global accelerator that makes high-volume, early checks into startups worldwide.", 
      sector: "SaaS / Software", 
      stage: "Pre-Seed (Idea Stage)", 
      fundingValue: "$100K - $500K check size",
      website: "https://www.plugandplaytechcenter.com",
      pastInvestments: "PayPal, Dropbox, LendingClub, Honey",
      responseTime: "Highly responsive (within 24 hours)"
    },
    { 
      id: "ribbit", 
      name: "Ribbit Capital", 
      description: "An investment firm dedicated to financial software, payments, and modern banking platforms.", 
      sector: "Fintech (Financial Tech)", 
      stage: "Seed Stage", 
      fundingValue: "$1M - $5M check size",
      website: "https://ribbitcap.com",
      pastInvestments: "Robinhood, Coinbase, Revolut, Chime",
      responseTime: "Usually responds within 4 days"
    }
  ];

  const realStartupPool: EcosystemParticipant[] = [
    { id: "cursor", name: "Cursor", description: "An AI code editor that helps developers build applications faster.", sector: "AI / Machine Learning", stage: "Series A (Early Growth)", fundingValue: "Seeking $15M", website: "https://www.cursor.com", pastInvestments: "N/A", responseTime: "Highly Active" },
    { id: "hebbia", name: "Hebbia AI", description: "AI search engines built explicitly for professional research and finance markets.", sector: "AI / Machine Learning", stage: "Seed Stage", fundingValue: "Seeking $3.5M", website: "https://www.hebbia.ai", pastInvestments: "N/A", responseTime: "Active" }
  ];

  const allEntities = [...realInvestorPool, ...realStartupPool];
  const selectedInvestor = allEntities.find(e => e.id === viewingId) || null;

  let filteredPool: EcosystemParticipant[] = [];
  if (isProfileComplete) {
    const userSector = profile.primary_sector?.toLowerCase() || '';
    const userStage = profile.funding_stage_or_target?.toLowerCase() || '';
    
    filteredPool = (isFounder ? realInvestorPool : realStartupPool).filter(entity => {
      const matchSector = entity.sector.toLowerCase();
      const matchStage = entity.stage.toLowerCase();
      return matchSector.includes(userSector) || userSector.includes(matchSector) || matchStage === userStage;
    });
  }

  const calculateAiMatchScore = (entitySector: string, entityStage: string) => {
    if (!isProfileComplete) return 0;
    
    let baseScore = 75; 
    const userSector = profile.primary_sector || '';
    const userStage = profile.funding_stage_or_target || '';

    if (userSector.toLowerCase() === entitySector.toLowerCase()) baseScore += 14;
    if (userStage.toLowerCase() === entityStage.toLowerCase()) baseScore += 10;

    return Math.min(baseScore, 99);
  };

  return (
    <div className="min-h-screen bg-[#0b0a0f] text-white font-sans selection:bg-purple-600/30">
      {selectedInvestor && (
        <InvestorDetailModal 
          investor={selectedInvestor} 
          matchScore={calculateAiMatchScore(selectedInvestor.sector, selectedInvestor.stage)}
          currentTab={currentTab}
        />
      )}

      {/* HEADER LOGO BAR */}
      <header className="border-b border-[#1f1d29] bg-[#0f0e17]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-purple-600 flex items-center justify-center rounded shadow-lg shadow-purple-600/20">
            <Zap className="w-4 h-4 text-white fill-white/15" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">VentureFlow</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1b1926] border border-[#2d2a3d] text-purple-400 uppercase tracking-wider font-semibold">
            {isFounder ? "Founder View" : "Investor View"}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
          <span>{profile.full_name}</span>
          <div className="w-8 h-8 rounded-full bg-[#1b1926] border border-[#2d2a3d] flex items-center justify-center text-purple-400 font-bold text-xs uppercase">
            {profile.full_name?.charAt(0)}
          </div>
        </div>
      </header>

      {/* TABS SUB-NAV */}
      <div className="bg-[#0f0e17] border-b border-[#1f1d29] px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex gap-6 text-xs font-mono tracking-wider uppercase">
            <a href={`?tab=overview${viewingId ? `&viewing=${viewingId}` : ''}`} className={`py-3.5 px-1 font-semibold border-b-2 transition-all ${currentTab === 'overview' ? 'border-purple-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>Main Dashboard</a>
            
            {/* BRAND NEW UPDATED SUB-NAV BUTTON LINK */}
            <a href={`?tab=search${viewingId ? `&viewing=${viewingId}` : ''}`} className={`py-3.5 px-1 font-semibold border-b-2 transition-all ${currentTab === 'search' ? 'border-purple-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
              <div className="flex items-center gap-1.5"><Search className="w-3.5 h-3.5" /> Explore Investors</div>
            </a>
            
            <a href={`?tab=settings${viewingId ? `&viewing=${viewingId}` : ''}`} className={`py-3.5 px-1 font-semibold border-b-2 transition-all ${currentTab === 'settings' ? 'border-purple-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
              <div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" /> Edit Profile Settings</div>
            </a>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {currentTab === 'settings' ? (
          <SettingsPanel profile={profile} userId={user.id} />
        ) : currentTab === 'search' ? (
          /* CONDITIONALLY RENDERING THE NEW EXPLORATION BLOCK */
          <InvestorSearchHub investors={realInvestorPool} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT MAIN DATA REGION */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, {profile.full_name?.split(' ')[0]}</h1>
                <p className="text-sm text-neutral-400 mt-1">
                  Viewing dashboard for <span className="text-purple-400 font-semibold">{profile.company_name || 'Your Company'}</span>
                </p>
              </div>

              {/* THREE CORE STATUS BOXES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TargetMetricCard initialValue={profile.funding_stage_or_target} userId={user.id} isFounder={isFounder} />
                
                <div className="bg-[#12111c] border border-[#1f1d29] p-5 rounded-xl">
                  <div className="text-neutral-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> Profile Status
                  </div>
                  <p className="text-xl font-bold mt-2 text-white">{isProfileComplete ? "Looking Good" : "Incomplete"}</p>
                  <span className={`text-[10px] font-mono mt-1 block ${isProfileComplete ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                    {isProfileComplete ? "Ready for matching" : "Waiting for profile updates"}
                  </span>
                </div>

                <div className="bg-[#12111c] border border-[#1f1d29] p-5 rounded-xl">
                  <div className="text-neutral-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Matches Found
                  </div>
                  <p className="text-xl font-bold mt-2 text-white">
                    {isProfileComplete ? `${filteredPool.length} Active Firms` : "0 Matches"}
                  </p>
                  <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
                    {isProfileComplete ? "Filtered by your business needs" : "Complete your setup to see matches"}
                  </span>
                </div>
              </div>

              {/* CURRENT ACCOUNT SPECS SLAB */}
              <div className="bg-[#12111c] border border-[#1f1d29] rounded-xl overflow-hidden">
                <div className="p-5 border-b border-[#1f1d29] bg-[#161522] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-sm">Your Information</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Account Summary</span>
                </div>
                <div className="p-6 space-y-4 text-sm text-neutral-300">
                  <div className="p-4 bg-[#1b1926] border border-[#2d2a3d] rounded-lg grid grid-cols-2 gap-4 font-mono text-xs">
                    <div><span className="text-neutral-500">YOUR INDUSTRY:</span> {profile.primary_sector || "NOT CHOSEN YET"}</div>
                    <div><span className="text-neutral-500">GROWTH ROUND:</span> {profile.funding_stage_or_target || "NOT CHOSEN YET"}</div>
                    <div><span className="text-neutral-500">YOUR CITY:</span> {profile.city || "NOT CHOSEN YET"}</div>
                    <div><span className="text-neutral-500">ACCOUNT CREATED:</span> {new Date(profile.updated_at).toLocaleDateString()}</div>
                  </div>
                  {!isProfileComplete && (
                    <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-lg flex items-center justify-between">
                      <span className="text-xs text-purple-300 font-medium">Please add your company's industry, city, and target funding round to unlock the AI match tracker.</span>
                      <a href="?tab=settings" className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs text-white font-mono uppercase tracking-wider font-bold transition-all">Fill Out Profile</a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE MATCH PREDICTOR CONTAINER */}
            <div className="space-y-6">
              <div className="bg-[#12111c] border border-[#1f1d29] rounded-xl overflow-hidden shadow-2xl relative">
                <div className="p-5 bg-gradient-to-r from-[#1c1630] to-[#12111c] border-b border-[#1f1d29] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-sm bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">AI Match Predictor</h3>
                  </div>
                  <span className="text-[9px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded uppercase">V1 Engine</span>
                </div>

                <div className="p-5 relative min-h-[350px]">
                  {!isProfileComplete ? (
                    <div className="absolute inset-0 bg-[#12111c]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
                      <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center mb-3">
                        <AlertTriangle className="w-5 h-5 text-purple-400" />
                      </div>
                      <h4 className="font-bold text-sm text-white">Feature Locked</h4>
                      <p className="text-xs text-neutral-400 mt-2 max-w-[220px]">
                        Complete profile setup to access this feature. We need to know your industry to accurately calculate potential business matches.
                      </p>
                      <a href="?tab=settings" className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs rounded font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-600/10">
                        Setup Profile
                      </a>
                    </div>
                  ) : null}

                  <p className="text-xs text-neutral-400 mb-4">
                    Our system ranks verified investment firms looking for companies exactly like yours based on your profile inputs:
                  </p>

                  <div className="space-y-3">
                    {filteredPool.map((entity, idx) => {
                      const matchScore = calculateAiMatchScore(entity.sector, entity.stage);

                      return (
                        <a 
                          key={idx} 
                          href={`?tab=${currentTab}&viewing=${entity.id}`}
                          className="p-3.5 bg-[#161522] border border-[#222030] rounded-lg flex items-center justify-between hover:border-purple-500/40 transition-colors group w-full"
                        >
                          <div className="space-y-1 max-w-[70%]">
                            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-all">{entity.name}</h4>
                            <p className="text-[10px] text-neutral-400 line-clamp-2 leading-normal">{entity.description}</p>
                            <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500 pt-1">
                              <span>{entity.sector}</span>
                              <span>•</span>
                              <span className="text-purple-400">{entity.stage}</span>
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono pt-0.5">
                              {entity.fundingValue}
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div className="space-y-0.5">
                              <div className="text-xs font-mono font-bold text-emerald-400">{matchScore}%</div>
                              <div className="text-[8px] font-mono uppercase tracking-widest text-neutral-500">Compatibility</div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-purple-400 transition-transform" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}