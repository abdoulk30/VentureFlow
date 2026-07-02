'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

interface ProfileData {
  primary_sector: string | null;
  city: string | null;
  funding_stage_or_target: string | null;
  company_name: string | null;
  full_name: string | null;
}

interface SettingsPanelProps {
  profile: ProfileData;
  userId: string;
}

export default function SettingsPanel({ profile, userId }: SettingsPanelProps) {
  const [sector, setSector] = useState(profile.primary_sector || '');
  const [city, setCity] = useState(profile.city || '');
  const [target, setTarget] = useState(profile.funding_stage_or_target || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const { error } = await supabase
      .from('profiles')
      .update({
        primary_sector: sector,
        city: city,
        funding_stage_or_target: target,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (!error) {
      setSaved(true);
      setTimeout(() => {
        window.location.href = '?tab=overview';
      }, 800);
    } else {
      alert('Error updating profile into database.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl bg-[#12111c] border border-[#1f1d29] rounded-xl overflow-hidden shadow-2xl mx-auto">
      <div className="p-5 border-b border-[#1f1d29] bg-[#161522] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-sm">Your Company Details</h3>
        </div>
        <span className="text-[10px] font-mono text-neutral-400 uppercase">Profile Form</span>
      </div>

      <form onSubmit={handleUpdateProfile} className="p-6 space-y-5 text-sm">
        <p className="text-xs text-neutral-400 leading-relaxed">
          Please fill out the information below. The details you enter are processed by our system to match your startup with investors looking to fund businesses in your exact industry.
        </p>

        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Information updated successfully! Updating matches...
          </div>
        )}

        <div className="space-y-4">
          {/* COMPLETE SECTOR OPTION ROADMAP FOR EVERY POSSIBLE STARTUP INDUSTRY */}
          <div>
            <label className="block text-xs font-mono tracking-wider text-neutral-400 uppercase mb-1.5">What industry is your company in?</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              required
              className="w-full bg-[#1b1926] border border-[#2d2a3d] rounded p-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">-- SELECT YOUR INDUSTRY --</option>
              <option value="AI / Machine Learning">Artificial Intelligence & Machine Learning</option>
              <option value="SaaS / Software">Business Software & Cloud Applications (SaaS)</option>
              <option value="Fintech (Financial Tech)">Financial Technology & Payment Systems (Fintech)</option>
              <option value="Healthcare / MedTech">Healthcare, Medical Devices & Biotech</option>
              <option value="E-commerce / Retail">E-commerce, Marketplaces & Consumer Brands</option>
              <option value="CleanTech / Climate">Clean Energy, Sustainability & Climate Tech</option>
              <option value="Hardware / Robotics">Physical Hardware, Electronics & Robotics</option>
              <option value="Cybersecurity">Information Security & Cybersecurity Protection</option>
              <option value="Web3 / Crypto">Blockchain Infrastructure & Digital Assets</option>
              <option value="Entertainment / Gaming">Media Platforms, Mobile Gaming & Content Creation</option>
              <option value="Logistics / Supply Chain">Shipping Logistics, PropTech & Supply Chain Tools</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono tracking-wider text-neutral-400 uppercase mb-1.5">Where is your company based?</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Chicago, New York, Houston"
                required
                className="w-full bg-[#1b1926] border border-[#2d2a3d] rounded p-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* LOGICAL ROADMAP FOR ALL CONTEXTUAL STAGES EXPLAINED */}
            <div>
              <label className="block text-xs font-mono tracking-wider text-neutral-400 uppercase mb-1.5">Current Stage of Your Business</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
                className="w-full bg-[#1b1926] border border-[#2d2a3d] rounded p-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">-- SELECT CURRENT MILESTONE --</option>
                <option value="Pre-Seed (Idea Stage)">Pre-Seed (Building the initial idea/prototype)</option>
                <option value="Seed Stage">Seed Stage (Product is built, looking for initial launch money)</option>
                <option value="Series A (Early Growth)">Series A (Have consistent customers, ready to scale up sales)</option>
                <option value="Series B (Expansion)">Series B (Proven business, scaling massive expansion)</option>
                <option value="Series C (Scaling Large Operations)">Series C+ (Established enterprise looking for major institutional funding)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1f1d29] flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold rounded text-xs transition-all flex items-center gap-2 font-mono uppercase tracking-wider"
          >
            {loading ? 'Saving Options...' : 'Save and Calculate Matches'}
          </button>
        </div>
      </form>
    </div>
  );
}