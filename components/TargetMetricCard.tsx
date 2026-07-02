'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Target, Edit2, Check } from 'lucide-react';

interface TargetMetricCardProps {
  initialValue: string | null;
  userId: string;
  isFounder: boolean;
}

export default function TargetMetricCard({ initialValue, userId, isFounder }: TargetMetricCardProps) {
  // Extract numbers only
  const getCleanNumber = (val: string | null) => {
    if (!val) return '';
    const numbersOnly = val.replace(/[^0-9]/g, '');
    return numbersOnly || '';
  };

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync with database values safely on load
  useEffect(() => {
    const cleanNum = getCleanNumber(initialValue);
    setInputValue(cleanNum);
    setDisplayValue(cleanNum);
    
    // If there's no real number saved yet, open edit mode immediately
    if (!cleanNum) {
      setIsEditing(true);
    }
  }, [initialValue]);

  // Turn plain numbers like 150000 into beautiful currency text: $150,000 USD
  const formatCurrency = (amountStr: string) => {
    const num = parseFloat(amountStr);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num) + ' USD';
  };

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ funding_stage_or_target: inputValue.trim() })
      .eq('id', userId);

    if (!error) {
      setDisplayValue(inputValue.trim());
      setIsEditing(false);
    } else {
      alert('Failed to save amount.');
    }
    setLoading(false);
  };

  const placeholderText = isFounder ? 'Set Fundraising Target' : 'Set Allocation Target';

  return (
    <div className="bg-[#12111c] border border-[#1f1d29] p-5 rounded-xl transition-all hover:border-[#2d2a3d]">
      <div className="text-neutral-400 font-mono text-[10px] uppercase tracking-wider flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-purple-400" /> 
          {isFounder ? "Capital Target" : "Investment Allocation"}
        </div>
        {!isEditing && displayValue && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-neutral-500 hover:text-purple-400 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="mt-3">
        {isEditing ? (
          <div className="flex gap-2">
            <div className="relative w-full flex items-center">
              <span className="absolute left-2.5 text-xs font-mono text-neutral-500">$</span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isFounder ? "e.g. 150000" : "e.g. 1000000"}
                className="bg-[#1b1926] border border-[#2d2a3d] rounded p-1.5 pl-6 text-xs focus:outline-none focus:border-purple-500 text-white w-full font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={loading || !inputValue.trim()}
              className="bg-purple-600 hover:bg-purple-700 p-1.5 rounded text-white flex items-center justify-center transition-all disabled:opacity-40"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            {displayValue ? (
              <p className="text-xl font-bold text-white tracking-tight">
                {formatCurrency(displayValue)}
              </p>
            ) : (
              /* Fallback button so you can always click it if it gets lost */
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors underline decoration-dotted pt-1"
              >
                {placeholderText}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full bg-[#1f1d29] h-1 rounded-full mt-3 overflow-hidden">
        <div className={`bg-purple-500 h-full rounded-full transition-all duration-300 ${displayValue ? 'w-1/3' : 'w-0'}`} />
      </div>
    </div>
  );
}