'use client';

import React from 'react';
import { X, Building2, Sparkles, DollarSign, Globe, Briefcase, Clock } from 'lucide-react';
import { EcosystemParticipant } from '@/app/page';

interface InvestorDetailModalProps {
  investor: EcosystemParticipant;
  matchScore: number;
  currentTab: string;
}

export default function InvestorDetailModal({ investor, matchScore, currentTab }: InvestorDetailModalProps) {
  const handleClose = () => {
    window.location.href = `?tab=${currentTab}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all animate-fade-in">
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="bg-[#12111c] border border-[#2d2a3d] w-full max-w-lg rounded-xl overflow-hidden shadow-2xl relative z-10 animate-scale-up">
        
        {/* MODAL HEADER */}
        <div className="p-5 bg-[#161522] border-b border-[#1f1d29] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-purple-600/10 border border-purple-500/30 text-purple-400 flex items-center justify-center rounded">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{investor.name}</h3>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Verified Profile Identity</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded bg-[#1b1926] border border-[#2d2a3d] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL CONTAINER MAIN DECK */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* COMPATIBILITY ANALYSIS INDEX ROW */}
          <div className="p-4 bg-gradient-to-r from-purple-950/20 to-transparent border border-purple-500/20 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5 max-w-[75%]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Match Calculation
              </span>
              <p className="text-xs text-neutral-300 leading-normal">This firm is actively monitoring new opportunities matching your industry sector.</p>
            </div>
            <div className="text-right pl-3">
              <span className="text-2xl font-mono font-bold text-emerald-400">{matchScore}%</span>
              <span className="text-[8px] block font-mono text-neutral-500 uppercase tracking-widest">Score</span>
            </div>
          </div>

          {/* ITEM STRUCT DETAILS SPEC SHEET */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Investment Strategy</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#1b1926] border border-[#2d2a3d] rounded-lg">
                <span className="text-neutral-500 block text-[9px] uppercase mb-1">TARGET SECTOR:</span>
                <span className="text-white font-semibold">{investor.sector}</span>
              </div>
              <div className="p-3 bg-[#1b1926] border border-[#2d2a3d] rounded-lg">
                <span className="text-neutral-500 block text-[9px] uppercase mb-1">PREFERRED ROUND:</span>
                <span className="text-purple-400 font-semibold">{investor.stage}</span>
              </div>
            </div>

            <div className="p-3 bg-[#1b1926] border border-[#2d2a3d] rounded-lg flex items-center gap-3">
              <div className="w-7 h-7 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-neutral-500 block font-mono text-[9px] uppercase">CAPITAL INTENSITY:</span>
                <span className="text-white text-xs font-semibold">{investor.fundingValue}</span>
              </div>
            </div>

            {/* INTERACTIVE COMPONENT WEBSITE REDIRECT NODE */}
            <div className="p-3 bg-[#1b1926] border border-[#2d2a3d] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono text-[9px] uppercase">OFFICIAL WEBSITE:</span>
                  <span className="text-neutral-400 text-xs font-mono select-all break-all">{investor.website.replace('https://', '')}</span>
                </div>
              </div>
              <a 
                href={investor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-purple-400 hover:text-purple-300 underline decoration-dotted font-bold uppercase tracking-wider whitespace-nowrap pl-2"
              >
                Visit Site
              </a>
            </div>

            {/* KNOWN SUCCESS PORTFOLIO LIST BLOCK */}
            <div className="p-3 bg-[#1b1926] border border-[#2d2a3d] rounded-lg flex items-center gap-3">
              <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-neutral-500 block font-mono text-[9px] uppercase">NOTABLE PAST INVESTMENTS:</span>
                <span className="text-neutral-200 text-xs font-medium leading-relaxed">{investor.pastInvestments}</span>
              </div>
            </div>

            {/* SYSTEM RESPONSE VELOCITY TRACKER */}
            <div className="p-3 bg-[#1b1926] border border-[#2d2a3d] rounded-lg flex items-center gap-3">
              <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-neutral-500 block font-mono text-[9px] uppercase">PLATFORM ACTIVITY RATE:</span>
                <span className="text-emerald-400 text-xs font-semibold">{investor.responseTime}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Firm Overview</h4>
            <p className="text-xs text-neutral-400 bg-[#161522] border border-[#1f1d29] p-3.5 rounded-lg leading-relaxed italic">
              "{investor.description}"
            </p>
          </div>

        </div>

        {/* FOOTER ACTIONS BUTTON COMPONENT */}
        <div className="p-4 bg-[#161522] border-t border-[#1f1d29] flex justify-end gap-2">
          <button 
            onClick={handleClose}
            className="px-4 py-2 bg-[#1b1926] hover:bg-[#222030] text-neutral-300 font-semibold rounded text-xs transition-all font-mono uppercase tracking-wider border border-[#2d2a3d]"
          >
            Close Details
          </button>
          <button 
            onClick={() => alert(`Connect request initialized with ${investor.name}!`)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded text-xs transition-all font-mono uppercase tracking-wider shadow-lg shadow-purple-600/10"
          >
            Send Connect Request
          </button>
        </div>

      </div>
    </div>
  );
}