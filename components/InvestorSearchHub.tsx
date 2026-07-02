'use client';

import React, { useState } from 'react';
import { Search, Building2, ChevronRight } from 'lucide-react';
import { EcosystemParticipant } from '@/app/page';

interface InvestorSearchHubProps {
  investors: EcosystemParticipant[]; // Fixed parameter naming definition typo from parent deck
}

export default function InvestorSearchHub({ investors }: InvestorSearchHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');

  const sectorFilters = ['All Sectors', 'AI / Machine Learning', 'SaaS / Software', 'Fintech (Financial Tech)'];

  // Added explicit type declaration (firm: EcosystemParticipant) to clear compiler type checking
  const filteredInvestors = investors.filter((firm: EcosystemParticipant) => {
    const matchesSearch = firm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          firm.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'All Sectors' || firm.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* TITLE INTRO REGION */}
      <div>
        <h2 className="text-xl font-bold tracking-tight">Ecosystem Directory</h2>
        <p className="text-xs text-neutral-400 mt-1">Browse, filter, and review verified institutional investment funds with open capital deployment pipelines.</p>
      </div>

      {/* FILTER SEARCH CONTROL CONSOLE TRAY */}
      <div className="bg-[#12111c] border border-[#1f1d29] p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* TEXT SEARCH INPUT BLOCK */}
        <div className="relative w-full md:max-w-md flex items-center">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3" />
          <input 
            type="text" 
            placeholder="Search by firm name, thesis, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1b1926] border border-[#2d2a3d] rounded-lg p-2 pl-9 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 w-full"
          />
        </div>

        {/* HORIZONTAL CATEGORY CHIP BUTTONS */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          {sectorFilters.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider transition-all border ${
                selectedSector === sector 
                  ? 'bg-purple-600 border-purple-500 text-white font-bold' 
                  : 'bg-[#1b1926] border-[#2d2a3d] text-neutral-400 hover:text-white'
              }`}
            >
              {sector.split(' ')[0]} {sector.includes('/') ? '/' + sector.split('/')[1].trim().split(' ')[0] : ''}
              {sector === 'All Sectors' ? 'All' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* EXPLORER RESULTS GRID LAYOUT CONTAINER */}
      {filteredInvestors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Added explicit type declaration (firm: EcosystemParticipant) here too */}
          {filteredInvestors.map((firm: EcosystemParticipant) => (
            <a
              key={firm.id}
              href={`?tab=search&viewing=${firm.id}`}
              className="p-5 bg-[#12111c] border border-[#1f1d29] rounded-xl hover:border-purple-500/40 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#1b1926] border border-[#2d2a3d] rounded flex items-center justify-center text-purple-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">{firm.name}</h3>
                  </div>
                  <span className="text-[9px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded uppercase">
                    {firm.stage.split(' ')[0]}
                  </span>
                </div>
                
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">{firm.description}</p>
              </div>

              <div className="pt-3 border-t border-[#1f1d29]/60 flex items-center justify-between text-[10px] font-mono">
                <div className="space-y-0.5">
                  <span className="text-neutral-500 block text-[8px] uppercase">CAPITAL VALUE:</span>
                  <span className="text-emerald-400 font-semibold">{firm.fundingValue.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400 font-bold uppercase tracking-wider text-[9px] group-hover:translate-x-0.5 transition-transform">
                  View Profile <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        /* FALLBACK EMPTY SEARCH STATE */
        <div className="border border-dashed border-[#1f1d29] p-12 rounded-xl text-center flex flex-col items-center justify-center">
          <p className="text-xs font-mono text-neutral-500">No investment firms match your current search queries or filter selections.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedSector('All Sectors'); }}
            className="mt-3 text-[10px] font-mono text-purple-400 underline uppercase tracking-wider font-bold"
          >
            Clear Search Filters
          </button>
        </div>
      )}

    </div>
  );
}