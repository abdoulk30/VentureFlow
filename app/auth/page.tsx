'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Zap, Building2, User, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'founder' | 'investor'>('founder');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your credentials.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              company_name: companyName,
              user_role: role,
            }
          }
        });

        if (authError) throw authError;

        if (authData?.user) {
          // Sync with the updated database schema permissions layout
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              full_name: fullName,
              company_name: companyName,
              user_role: role, 
              updated_at: new Date().toISOString(),
            });

          if (profileError) throw profileError;
          
          setSuccessMsg('Registration initialized! Please check your email inbox to verify your secure portal link.');
        }
      } else {
        // Log in utilizing the modern cookie framework matching the server environment
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;

        // Force a full window refresh to ensure the server component reads the new cookies perfectly
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white font-sans">
      <div className="sm:mx-auto w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-8 h-8 bg-accentPrimary flex items-center justify-center rounded">
            <Zap className="w-4 h-4 text-white fill-white/20" />
          </div>
          <span className="font-bold text-xl tracking-tight">VentureFlow</span>
        </div>
        <h2 className="text-center text-xl font-extrabold tracking-tight text-white">
          {isSignUp ? 'Create your ecosystem workspace account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-mutedText">
          {isSignUp ? 'Already built your company portal? ' : 'New to our matching network? '}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccessMsg(null);
              setPassword('');
              setConfirmPassword('');
            }} 
            className="font-medium text-accentPrimary hover:text-accentPrimary/80 transition-colors"
          >
            {isSignUp ? 'Sign in here' : 'Register platform profile'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-cardBg py-8 px-4 border border-customBorder rounded sm:px-10 shadow-xl">
          
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded text-xs font-semibold">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-accentSuccess/10 border border-accentSuccess/20 text-accentSuccess rounded text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleAuthSubmit}>
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-mono tracking-wider text-mutedText uppercase mb-2">Select Your Role Context</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('founder')}
                      className={`p-3 rounded border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                        role === 'founder'
                          ? 'bg-accentPrimary/10 border-accentPrimary text-white'
                          : 'bg-[#13121a] border-customBorder text-mutedText hover:text-white'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Startup Founder
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('investor')}
                      className={`p-3 rounded border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                        role === 'investor'
                          ? 'bg-accentSuccess/10 border-accentSuccess text-white'
                          : 'bg-[#13121a] border-customBorder text-mutedText hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Venture Capitalist
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-xs font-mono tracking-wider text-mutedText uppercase">Your Legal Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g., Sarah Jenkins"
                    className="w-full bg-[#13121a] border border-customBorder rounded p-2.5 text-xs focus:outline-none focus:border-accentPrimary transition-colors text-white mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-xs font-mono tracking-wider text-mutedText uppercase">
                    {role === 'founder' ? 'Legal Startup / Entity Name' : 'Venture Fund Name'}
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={role === 'founder' ? 'NovaSynth AI' : 'Index Growth Partners'}
                    className="w-full bg-[#13121a] border border-customBorder rounded p-2.5 text-xs focus:outline-none focus:border-accentPrimary transition-colors text-white mt-1"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-mono tracking-wider text-mutedText uppercase">Corporate Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@firm.com"
                className="w-full bg-[#13121a] border border-customBorder rounded p-2.5 text-xs focus:outline-none focus:border-accentPrimary transition-colors text-white mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono tracking-wider text-mutedText uppercase">Secure Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#13121a] border border-customBorder rounded p-2.5 text-xs focus:outline-none focus:border-accentPrimary transition-colors text-white mt-1"
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-mono tracking-wider text-mutedText uppercase">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#13121a] border border-customBorder rounded p-2.5 text-xs focus:outline-none focus:border-accentPrimary transition-colors text-white mt-1"
                />
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-9 px-4 bg-accentPrimary hover:bg-accentPrimary/90 text-white rounded font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider"
              >
                {loading ? 'Processing Transaction...' : isSignUp ? 'Submit Verification' : 'Open Workspace Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}