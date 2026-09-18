import React, { useState } from 'react';
import { AppView, AuthUser } from '../types';
import { storage } from '../utils/storage';
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, Mail, Building2 } from 'lucide-react';

interface GovLoginViewProps {
  onNavigate: (view: AppView) => void;
  onLogin: (user: AuthUser) => void;
}

export const GovLoginView: React.FC<GovLoginViewProps> = ({ onNavigate, onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Please enter your official government email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    // Retrieve existing stored government profile if present, or generate an authenticated official session
    const existingUser = storage.getUser();
    let authUser: AuthUser;

    if (existingUser && existingUser.role === 'government' && existingUser.email.toLowerCase() === cleanId.toLowerCase()) {
      authUser = existingUser;
    } else {
      // Create authenticated government official session
      const nameParts = cleanId.split('@')[0].split('.');
      const derivedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      authUser = {
        id: `gov-${Date.now()}`,
        role: 'government',
        name: derivedName || 'Government Procurement Official',
        email: cleanId,
        department: existingUser?.department || 'Department of Urban Development',
        officerId: existingUser?.officerId || `OFF-${Math.floor(1000 + Math.random() * 9000)}`,
        state: existingUser?.state || 'Karnataka',
        city: existingUser?.city || 'Bengaluru',
        designation: existingUser?.designation || 'Nodal Procurement Officer',
        domain: existingUser?.domain || 'Urban Mobility & Traffic Optimization'
      };
      storage.setUser(authUser);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(authUser);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-12 selection:bg-[#087C78] selection:text-white arch-grid-bg transition-colors">
      {/* Top Bar / Back to Public */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#E2DFD7] dark:border-[#232B34]">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-xs font-mono font-medium text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO PUBLIC PORTAL</span>
        </button>

        <div className="text-[10px] font-mono tracking-widest uppercase text-[#596166] dark:text-[#949DA3]">
          INSTITUTIONAL GATEWAY
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="max-w-xl w-full mx-auto my-auto py-10">
        <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-8 sm:p-12 rounded-xl shadow-xs space-y-8">
          
          {/* Header Block */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#087C78] dark:bg-[#0AA39F]" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#596166] dark:text-[#949DA3]">
                PROCUREX
              </span>
            </div>

            <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#087C78] dark:text-[#0AA39F]">
              GOVERNMENT PORTAL
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111416] dark:text-white font-sans">
              Sign in to your Government workspace
            </h1>

            <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
              Dedicated institutional portal for municipal commissioners, departmental engineers, and public procurement directors to formulate challenges, review proposals, and sanction pilots under GFR 149(v).
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Username / Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#596166] dark:text-[#949DA3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. officer@urban.karnataka.gov.in"
                  className="w-full pl-10 pr-3.5 py-3 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] dark:focus:border-[#0AA39F] transition"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#596166] dark:text-[#949DA3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] dark:focus:border-[#0AA39F] transition"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#111416] dark:bg-[#087C78] hover:bg-[#23465A] dark:hover:bg-[#0AA39F] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{isSubmitting ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration Trigger */}
          <div className="pt-6 border-t border-[#E2DFD7] dark:border-[#232B34] text-center space-y-3">
            <p className="text-xs text-[#596166] dark:text-[#949DA3]">
              New to ProcureX?
            </p>
            <button
              type="button"
              onClick={() => onNavigate('gov_signup')}
              className="w-full py-3 px-4 border border-[#111416] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition"
            >
              CREATE GOVERNMENT ACCOUNT
            </button>
          </div>

          {/* Institutional Compliance Notice */}
          <div className="pt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-[#596166] dark:text-[#949DA3] text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#087C78]" />
            <span>AUTHORISED GOVERNMENT WORKSPACE // STRICT AUDIT LOGGING</span>
          </div>

        </div>
      </div>

      {/* Bottom Footer Details */}
      <div className="max-w-xl w-full mx-auto pt-6 border-t border-[#E2DFD7] dark:border-[#232B34] flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#596166] dark:text-[#949DA3] gap-2">
        <span>PROCUREX PUBLIC SECTOR EDITION</span>
        <span>GFR RULE 149(v) COMPLIANT</span>
      </div>
    </div>
  );
};
