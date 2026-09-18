import React from 'react';
import { ShieldAlert, Building2, Rocket, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { AppView, AuthUser } from '../types';

interface RoleAccessGateProps {
  requiredRole: 'government' | 'startup';
  currentUser: AuthUser | null;
  onOpenAuth?: (role: 'government' | 'startup') => void;
  onNavigate: (view: AppView) => void;
  onLogin?: (user: AuthUser) => void;
}

export const RoleAccessGate: React.FC<RoleAccessGateProps> = ({
  requiredRole,
  currentUser,
  onNavigate
}) => {
  const isGov = requiredRole === 'government';

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-6 bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC]">
      <div className="max-w-md w-full bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl p-8 text-center space-y-6 shadow-xs">
        <div className="w-12 h-12 rounded-lg bg-[#ECEAE4] dark:bg-[#1E2630] text-[#087C78] dark:text-[#0AA39F] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#087C78] dark:text-[#0AA39F]">
            RESTRICTED WORKSPACE ACCESS
          </span>
          <h2 className="text-xl font-black uppercase tracking-tight text-[#111416] dark:text-white font-sans">
            {isGov ? 'Government Authority Access Required' : 'Startup Innovator Access Required'}
          </h2>
          <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
            {currentUser
              ? `You are presently authenticated as a ${currentUser.role === 'government' ? 'Government Official' : 'Startup Innovator'}. This workspace is partitioned exclusively for ${isGov ? 'Government Procurement Authorities' : 'Startup Founders & Innovators'}.`
              : `Authentication required. Please sign in to your dedicated ${isGov ? 'Government' : 'Startup'} workspace.`}
          </p>
        </div>

        {currentUser && (
          <div className="p-3 rounded-lg bg-[#F4F2EC] dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#232B34] text-left text-xs font-mono space-y-1">
            <div className="text-[9px] uppercase font-bold text-[#596166] dark:text-[#949DA3]">Active Session:</div>
            <div className="font-semibold text-[#111416] dark:text-white truncate">
              {currentUser.name || currentUser.startupName || currentUser.email}
            </div>
            <div className="text-[10px] text-[#087C78]">
              Role: {currentUser.role}
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate(isGov ? 'gov_login' : 'startup_login')}
            className="w-full py-3 px-4 bg-[#111416] dark:bg-[#087C78] hover:bg-[#23465A] dark:hover:bg-[#0AA39F] text-white font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGov ? <Building2 className="w-3.5 h-3.5" /> : <Rocket className="w-3.5 h-3.5" />}
            <span>Sign In to {isGov ? 'Government' : 'Startup'} Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate(isGov ? 'gov_signup' : 'startup_signup')}
            className="w-full py-2.5 px-4 border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white font-semibold text-xs font-mono uppercase tracking-wider rounded-lg transition"
          >
            Create {isGov ? 'Government' : 'Startup'} Account
          </button>

          <button
            type="button"
            onClick={() => onNavigate(currentUser?.role === 'government' ? 'gov_portal' : currentUser?.role === 'startup' ? 'startup_portal' : 'home')}
            className="w-full py-2.5 px-4 text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {currentUser ? 'My Workspace' : 'Public Experience'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
