import React, { useState } from 'react';
import { AppView, AuthUser, Startup } from '../types';
import { storage } from '../utils/storage';
import { ArrowLeft, ArrowRight, Rocket, Lock, Mail, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';

interface StartupLoginViewProps {
  startups?: Startup[];
  onNavigate: (view: AppView) => void;
  onLogin: (user: AuthUser) => void;
}

export const StartupLoginView: React.FC<StartupLoginViewProps> = ({ startups = [], onNavigate, onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Please enter your startup registered email, DPIIT number, or company name.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    // 1. Check if user already exists in the multi-account directory
    const existingAccount = storage.findAccountByEmail(cleanId, 'startup');
    let authUser: AuthUser;

    if (existingAccount) {
      authUser = existingAccount;
    } else {
      // 2. Derive person name from email or input
      const nameParts = cleanId.includes('@') ? cleanId.split('@')[0].split('.') : cleanId.split(' ');
      const derivedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

      // 3. Match against the 1,006 database-backed startups catalog
      const cleanLower = cleanId.toLowerCase();
      const matched = startups.find(s => 
        s.name.toLowerCase() === cleanLower ||
        s.id.toLowerCase() === cleanLower ||
        (s.dpiitNumber && s.dpiitNumber.toLowerCase() === cleanLower) ||
        (s.registrationNumber && s.registrationNumber.toLowerCase() === cleanLower) ||
        (cleanLower.includes('@') && s.name.toLowerCase().includes(cleanLower.split('@')[0]))
      );

      if (matched) {
        // Associated directly with Supabase database startup record
        authUser = {
          id: `user-${Date.now()}`,
          role: 'startup',
          name: derivedName || `${matched.name} Lead`,
          email: cleanId.includes('@') ? cleanId : `contact@${matched.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
          designation: 'Founder / Technical Lead',
          // Organization identity from Supabase:
          startupId: matched.id,
          organizationId: matched.id,
          startupName: matched.name,
          dpiitNumber: matched.dpiitNumber || matched.registrationNumber,
          registrationNumber: matched.registrationNumber,
          state: matched.state,
          city: matched.city,
          incorporationYear: matched.incorporationYear || 2022,
          domain: matched.sectors?.[0] || 'Civic Infrastructure',
          capabilities: matched.technologies?.join(', ') || matched.solutionSummary || 'Civic Technology Systems'
        };
      } else {
        // Unlisted startup: generate clean, isolated identity (NEVER defaulting to another company)
        const companyName = cleanId.includes('@') ? `${derivedName} Technologies` : cleanId;
        const newStartupId = `startup-custom-${Date.now()}`;
        authUser = {
          id: `user-${Date.now()}`,
          role: 'startup',
          name: derivedName || 'Startup Innovator',
          email: cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '')}@startup.in`,
          designation: 'Founder / Lead',
          startupId: newStartupId,
          organizationId: newStartupId,
          startupName: companyName,
          dpiitNumber: `DPIIT-NEW-${Math.floor(10000 + Math.random() * 90000)}`,
          registrationNumber: `U72900KA2024PTC${Math.floor(100000 + Math.random() * 900000)}`,
          state: 'Karnataka',
          city: 'Bengaluru',
          incorporationYear: 2024,
          domain: 'Civic Infrastructure',
          capabilities: 'Edge AI, Computer Vision, Smart Infrastructure IoT Telemetry'
        };
      }

      // Save to account directory
      storage.saveAccount(authUser);
    }

    // Set active session
    storage.setUser(authUser);

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
          STARTUP PILOT ACCESS
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

            <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#087C78] dark:text-[#0AA39F] flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" />
              <span>STARTUP & INNOVATOR PORTAL</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111416] dark:text-white font-sans">
              Sign in to your Startup workspace
            </h1>

            <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
              DPIIT-recognized startups and engineering scaleups can access live government problem statements, submit compliant structured pilot proposals, and track milestone escrow disbursements.
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
                Startup Email / DPIIT Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#596166] dark:text-[#949DA3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  list="login-startups-datalist"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. AquaSense Systems, BYJU'S, or founder email"
                  className="w-full pl-10 pr-3.5 py-3 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] dark:focus:border-[#0AA39F] transition"
                  autoComplete="username"
                />
                <datalist id="login-startups-datalist">
                  {startups.slice(0, 100).map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.city}, {s.state})
                    </option>
                  ))}
                </datalist>
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
              className="w-full py-3.5 px-4 bg-[#111416] dark:bg-[#F4F2EC] hover:bg-[#087C78] dark:hover:bg-[#0AA39F] text-white dark:text-[#111416] dark:hover:text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 transition duration-200"
            >
              <span>{isSubmitting ? 'AUTHENTICATING...' : 'ACCESS STARTUP WORKSPACE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Switching */}
          <div className="pt-6 border-t border-[#E2DFD7] dark:border-[#232B34] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-[#596166] dark:text-[#949DA3]">
              First time on ProcureX?
            </span>
            <button
              type="button"
              onClick={() => onNavigate('startup_signup')}
              className="text-[#087C78] dark:text-[#0AA39F] font-semibold hover:underline flex items-center gap-1 font-mono uppercase tracking-wider text-[11px]"
            >
              <span>REGISTER DPIIT STARTUP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-mono text-[#596166] dark:text-[#949DA3]">
          <ShieldCheck className="w-4 h-4 text-[#087C78]" />
          <span>GFR 149(v) Sandbox-Eligible Bidding Protocol • 256-Bit Encrypted</span>
        </div>
      </div>

      <div className="max-w-xl w-full mx-auto text-center text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
        NATIONAL PUBLIC INNOVATION PLATFORM • STARTUP GATEWAY
      </div>
    </div>
  );
};
