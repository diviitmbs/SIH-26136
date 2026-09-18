import React, { useState } from 'react';
import { AppView, AuthUser } from '../types';
import { storage } from '../utils/storage';
import { ArrowLeft, ArrowRight, Rocket, Lock, Mail, ShieldCheck } from 'lucide-react';

interface StartupLoginViewProps {
  onNavigate: (view: AppView) => void;
  onLogin: (user: AuthUser) => void;
}

export const StartupLoginView: React.FC<StartupLoginViewProps> = ({ onNavigate, onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Please enter your startup registered email or DPIIT number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    const existingUser = storage.getUser();
    let authUser: AuthUser;

    if (existingUser && existingUser.role === 'startup' && existingUser.email.toLowerCase() === cleanId.toLowerCase()) {
      authUser = existingUser;
    } else {
      // Create authenticated startup session
      const nameParts = cleanId.split('@')[0].split('.');
      const derivedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      authUser = {
        id: `startup-${Date.now()}`,
        role: 'startup',
        name: derivedName || 'UrbanTech Founder',
        email: cleanId,
        startupName: existingUser?.startupName || 'UrbanAI Technologies Pvt Ltd',
        dpiitNumber: existingUser?.dpiitNumber || `DPIIT-${Math.floor(10000 + Math.random() * 90000)}`,
        registrationNumber: existingUser?.registrationNumber || `U72900KA2022PTC${Math.floor(100000 + Math.random() * 900000)}`,
        state: existingUser?.state || 'Karnataka',
        city: existingUser?.city || 'Bengaluru',
        incorporationYear: existingUser?.incorporationYear || 2022,
        capabilities: existingUser?.capabilities || 'Edge AI, Computer Vision, Smart Infrastructure IoT Telemetry'
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
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. founder@urbanai.in or DPIIT-KA-2022-8419"
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
