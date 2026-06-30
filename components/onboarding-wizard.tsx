"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, ShieldCheck, Briefcase, Landmark } from "lucide-react";

type Role = "founder" | "investor" | null;

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  
  // Shared Form State
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [primarySector, setPrimarySector] = useState("");

  // Founder Specific State
  const [companyName, setCompanyName] = useState("");
  const [fundingStage, setFundingStage] = useState("");
  const [fundsNeeded, setFundsNeeded] = useState("");

  // Investor Specific State
  const [fundName, setFundName] = useState("");
  const [maxCheckSize, setMaxCheckSize] = useState("");

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleRoleSelection = (selectedRole: Role) => {
    setRole(selectedRole);
    handleNext();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Account Simulation Complete! Role: ${role}, Complete Profile: True`);
    // This will connect directly to our Supabase database hook in Phase 4
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-10 transition-colors duration-200">
      
      {/* Progress Metric Tracker */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Step {step} of 3
          </span>
          <span className="text-xs font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
            {step === 1 && "Account Fundamentals"}
            {step === 2 && "Select Target Path"}
            {step === 3 && "Tailor Mandate Variables"}
          </span>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-zinc-900 dark:bg-white h-1.5 transition-all duration-300 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ================= STEP 1: GENERAL METADATA ================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Initialize Your Profile</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Let's get the absolute baseline fundamentals out of the way.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Abdoul Ba"
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Operational City Hub</label>
                <input 
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., New York, San Francisco"
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Primary Operational Sector</label>
                <select
                  required
                  value={primarySector}
                  onChange={(e) => setPrimarySector(e.target.value)}
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
                >
                  <option value="">Select a market vector...</option>
                  <option value="FinTech">FinTech (Financial Technology)</option>
                  <option value="B2B SaaS">B2B SaaS / Enterprise Infrastructure</option>
                  <option value="AI / Machine Learning">AI / Machine Learning Systems</option>
                  <option value="Biotech">Biotech / Healthcare Systems</option>
                  <option value="Logistics">Logistics / Supply Chain Logistics</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={!fullName || !city || !primarySector}
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              Continue Configuration <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ================= STEP 2: THE CONDITIONAL FORK IN THE ROAD ================= */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Choose Your Workspace Identity</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Select the path matching your explicit platform goals.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleRoleSelection("founder")}
                className={`flex flex-col p-5 border text-left rounded-xl transition-all group hover:border-zinc-400 dark:hover:border-zinc-600 ${role === "founder" ? "border-zinc-900 dark:border-white bg-zinc-50/50 dark:bg-zinc-900/50" : "border-zinc-200 dark:border-zinc-800"}`}
              >
                <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Briefcase className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white text-base">I am a Founder</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Looking to test funding models, view local viability, and secure direct matchmaking funnels.
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelection("investor")}
                className={`flex flex-col p-5 border text-left rounded-xl transition-all group hover:border-zinc-400 dark:hover:border-zinc-600 ${role === "investor" ? "border-zinc-900 dark:border-white bg-zinc-50/50 dark:bg-zinc-900/50" : "border-zinc-200 dark:border-zinc-800"}`}
              >
                <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Landmark className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white text-base">I am an Investor</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Looking to calibrate specific investment mandates and parse highly ranked, high-probability deal flow.
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white pt-4 transition-colors font-medium"
            >
              <ArrowLeft className="h-3 w-3" /> Go Back
            </button>
          </div>
        )}

        {/* ================= STEP 3A: THE FOUNDER QUESTION DATA SET ================= */}
        {step === 3 && role === "founder" && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Startup Specifications</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Configure your target milestones to initialize the algorithmic baseline.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Company Name</label>
                <input 
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., VentureFlow Technology Labs"
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Target Stage</label>
                  <select
                    required
                    value={fundingStage}
                    onChange={(e) => setFundingStage(e.target.value)}
                    className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed Stage</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Capital Needed (USD)</label>
                  <input 
                    type="number"
                    required
                    value={fundsNeeded}
                    onChange={(e) => setFundsNeeded(e.target.value)}
                    placeholder="e.g., 500000"
                    className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
                  />
                </div>
              </div>

              {/* Two-Tiered Quality Notification Box */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-start gap-3 mt-4">
                <ShieldCheck className="h-5 w-5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  <span className="font-semibold text-zinc-900 dark:text-white block mb-0.5">Two-Tiered Fast-Track Enabled</span>
                  You can jump right in with this baseline profile! Deep semantic items like company descriptions and long-term milestones remain completely optional and can be filled out anytime inside your dashboard hub to boost your final predictive match alignment.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
              >
                <ArrowLeft className="h-3 w-3" /> Change Role
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-colors shadow"
              >
                Launch Custom Dashboard
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3B: THE INVESTOR QUESTION DATA SET ================= */}
        {step === 3 && role === "investor" && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Fund Parameters & Limits</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Calibrate your deployment criteria to establish your automatic inbound filtering.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fund or Institutional Name</label>
                <input 
                  type="text"
                  required
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                  placeholder="e.g., Matrix Capital Ventures"
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Maximum Preferred Check Size (USD)</label>
                <input 
                  type="number"
                  required
                  value={maxCheckSize}
                  onChange={(e) => setMaxCheckSize(e.target.value)}
                  placeholder="e.g., 2000000"
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
              >
                <ArrowLeft className="h-3 w-3" /> Change Role
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-colors shadow"
              >
                Initialize Allocation Engine
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}