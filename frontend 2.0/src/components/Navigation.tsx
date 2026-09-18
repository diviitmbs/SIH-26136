import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, AuthUser } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { ProcureXLogo } from './ProcureXLogo';
import { ProfileModal } from './ProfileModal';
import { 
  Building2, 
  Rocket, 
  Sparkles, 
  Activity, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck, 
  Home,
  AlertCircle,
  Scale,
  Compass,
  FileSpreadsheet,
  Plus,
  Users,
  FolderKanban,
  FileCheck,
  CheckCircle2,
  Settings,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView, targetTab?: string) => void;
  currentUser: AuthUser | null;
  onOpenAuth?: (initialRole?: 'government' | 'startup') => void;
  onLogout: () => void;
  onLogin?: (user: AuthUser) => void;
  onUpdateUser?: (user: AuthUser) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onNavigate,
  currentUser,
  onLogout,
  onUpdateUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Dedicated full-page auth screens do NOT show the navigation rail
  const isAuthScreen = ['gov_login', 'gov_signup', 'startup_login', 'startup_signup'].includes(currentView);
  if (isAuthScreen) {
    return null;
  }

  // Determine portal mode: Government Workspace vs Startup Workspace vs Public Discovery
  const isGovPortalView = [
    'gov_portal', 
    'gov_challenge_builder', 
    'gov_challenge_success', 
    'compare_proposals', 
    'ai_evaluation'
  ].includes(currentView) || (currentUser?.role === 'government' && !['home', 'innovation_hub', 'public_problem_submit', 'about'].includes(currentView));

  const isStartupPortalView = [
    'startup_portal', 
    'proposal_studio'
  ].includes(currentView) || (currentUser?.role === 'startup' && !['home', 'innovation_hub', 'public_problem_submit', 'about'].includes(currentView));

  const portalMode: 'gov' | 'startup' | 'public' = 
    isGovPortalView ? 'gov' : 
    isStartupPortalView ? 'startup' : 
    'public';

  const handleNav = (v: AppView, targetTab?: string) => {
    onNavigate(v, targetTab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ============================================================ */}
      {/* DESKTOP FLOATING ARCHITECTURAL CONTROL RAIL (LEFT SIDE) */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex fixed left-3 top-3 bottom-3 w-64 xl:w-68 z-40 bg-white/95 dark:bg-[#16191D]/95 backdrop-blur-md border border-[#E2DFD7] dark:border-[#232B34] rounded-xl flex-col justify-between p-4 shadow-xs select-none">
        
        {/* Top Header & Contextual Portal Identity */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-[#E2DFD7] dark:border-[#232B34]">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="text-left focus:outline-none w-full group"
            >
              <ProcureXLogo size="md" />
            </button>

            {/* Portal Context Indicator */}
            <div className="mt-3 pt-2 border-t border-[#ECEAE4] dark:border-[#1E2630] flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
              {portalMode === 'gov' ? (
                <div className="flex items-center gap-1.5 text-[#087C78] dark:text-[#0AA39F] font-bold">
                  <span className="w-1.5 h-1.5 bg-[#087C78] dark:bg-[#0AA39F] rounded-full" />
                  <span>GOV WORKSPACE</span>
                </div>
              ) : portalMode === 'startup' ? (
                <div className="flex items-center gap-1.5 text-[#087C78] dark:text-[#0AA39F] font-bold">
                  <span className="w-1.5 h-1.5 bg-[#087C78] dark:bg-[#0AA39F] rounded-full" />
                  <span>STARTUP WORKSPACE</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[#596166] dark:text-[#949DA3]">
                  <span className="w-1.5 h-1.5 bg-[#596166] dark:bg-[#949DA3] rounded-full" />
                  <span>PUBLIC DISCOVERY</span>
                </div>
              )}
              <span className="text-[9px] text-[#596166] dark:text-[#949DA3]">GFR 149(v)</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* NAVIGATION SECTIONS BASED ON ACTIVE WORKSPACE PORTAL */}
          {/* ============================================================ */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            
            {/* 1. GOVERNMENT WORKSPACE RAIL */}
            {portalMode === 'gov' && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Government Workflow
                </div>

                <button
                  type="button"
                  onClick={() => handleNav('gov_portal', 'overview')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'gov_portal'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-[#087C78] dark:text-white" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('gov_portal', 'challenges')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>Challenges / Problems</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('gov_challenge_builder')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'gov_challenge_builder'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#087C78] dark:text-[#0AA39F] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Challenge</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#087C78]/15 text-[#087C78] dark:text-[#0AA39F]">
                    NEW
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('gov_portal', 'startups')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition"
                >
                  <Users className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>Interested Startups</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('gov_portal', 'proposals')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition"
                >
                  <FileText className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>Proposals</span>
                </button>

                <div className="pt-2 pb-1 px-2 text-[9px] font-mono font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Evaluation & Verification
                </div>

                <button
                  type="button"
                  onClick={() => handleNav('compare_proposals')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'compare_proposals'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>Compare Engine</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('ai_evaluation')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'ai_evaluation'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#087C78] dark:text-[#0AA39F]" />
                  <span>AI Evaluation</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('pilot_dashboard')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'pilot_dashboard'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>Pilots & Telemetry</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('gov_portal', 'outcomes')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>Outcomes / Scale</span>
                </button>
              </div>
            )}

            {/* 2. STARTUP WORKSPACE RAIL */}
            {portalMode === 'startup' && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Startup Workflow
                </div>

                <button
                  type="button"
                  onClick={() => handleNav('startup_portal', 'overview')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'startup_portal'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-[#087C78] dark:text-white" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('startup_portal', 'discover')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition"
                >
                  <Compass className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>Discover Challenges</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('startup_portal', 'interests')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#087C78] dark:text-[#0AA39F]" />
                  <span>My Interests</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('startup_portal', 'proposals')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>My Proposals</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('proposal_studio')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'proposal_studio'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#087C78] dark:text-[#0AA39F] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Proposal Studio</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#087C78]/15 text-[#087C78] dark:text-[#0AA39F]">
                    9-STEP
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('startup_portal', 'feedback')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>Evaluation & Feedback</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('pilot_dashboard')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'pilot_dashboard'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-[#596166] dark:text-[#949DA3]" />
                  <span>Pilots & Field Orders</span>
                </button>
              </div>
            )}

            {/* 3. PUBLIC DISCOVERY RAIL */}
            {portalMode === 'public' && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Public Discovery
                </div>

                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'home'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-3.5 h-3.5 text-[#087C78] dark:text-white" />
                    <span>Home</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-40">01</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('innovation_hub')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'innovation_hub'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-3.5 h-3.5 text-[#087C78] dark:text-white" />
                    <span>Innovation Hub</span>
                  </div>
                  <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#596166] dark:text-[#949DA3]">
                    Public
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('public_problem_submit')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'public_problem_submit'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#087C78] dark:text-white" />
                    <span>Submit Public Problem</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-40">03</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('about')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                    currentView === 'about'
                      ? 'bg-[#111416] text-[#F4F2EC] dark:bg-[#087C78] dark:text-white font-bold'
                      : 'text-[#111416] dark:text-[#E5E3DD] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#087C78] dark:text-white" />
                    <span>About / Framework</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-40">04</span>
                </button>

                {/* DISTINCT DEDICATED PORTAL ENTRY DOORS */}
                <div className="pt-4 space-y-2 border-t border-[#E2DFD7] dark:border-[#232B34] mt-3">
                  <div className="px-2 text-[9px] font-mono font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Dedicated Portals
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNav(currentUser?.role === 'government' ? 'gov_portal' : 'gov_login')}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#111416] dark:text-white">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#087C78] dark:text-[#0AA39F]" />
                        <span>Government Portal</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-[#596166] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[10px] text-[#596166] dark:text-[#949DA3] mt-0.5">
                      For Municipal & State Authorities
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNav(currentUser?.role === 'startup' ? 'startup_portal' : 'startup_login')}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#111416] dark:text-white">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-3.5 h-3.5 text-[#087C78] dark:text-[#0AA39F]" />
                        <span>Startup Portal</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-[#596166] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[10px] text-[#596166] dark:text-[#949DA3] mt-0.5">
                      For Deep-Tech Innovators & DPIIT
                    </div>
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM UTILITY & WORKSPACE IDENTITY PANEL */}
        {/* ============================================================ */}
        <div className="pt-3 border-t border-[#E2DFD7] dark:border-[#232B34] space-y-2">
          
          {/* Active User Card & Action Controls */}
          {currentUser ? (
            <div className="p-2.5 rounded-lg bg-[#F4F2EC] dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="truncate pr-1">
                  <div className="font-bold text-[#111416] dark:text-white truncate text-[11px]">
                    {currentUser.role === 'government' ? (currentUser.department || currentUser.name) : (currentUser.startupName || currentUser.name)}
                  </div>
                  <div className="text-[9px] font-mono text-[#596166] dark:text-[#949DA3] uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#087C78] rounded-full" />
                    <span>{currentUser.role === 'government' ? 'GOV AUTHORITY' : 'DPIIT STARTUP'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  title="Profile & Settings"
                  className="p-1 rounded hover:bg-[#E2DFD7] dark:hover:bg-[#2E3844] text-[#596166] hover:text-[#111416] dark:hover:text-white transition"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Workspace Quick Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#E2DFD7] dark:border-[#2E3844] text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className="text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white transition"
                >
                  EXIT WORKSPACE
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleNav('gov_login')}
                className="py-2 px-2 text-center rounded-lg border border-[#111416] dark:border-[#2E3844] text-[10px] font-mono font-bold uppercase hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white transition"
              >
                GOV SIGN IN
              </button>
              <button
                type="button"
                onClick={() => handleNav('startup_login')}
                className="py-2 px-2 text-center rounded-lg bg-[#111416] dark:bg-[#087C78] text-[10px] font-mono font-bold uppercase text-white hover:bg-[#23465A] dark:hover:bg-[#0AA39F] transition"
              >
                STARTUP IN
              </button>
            </div>
          )}

          {/* Theme & Platform Status Bar */}
          <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
            <span className="uppercase">THEME</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MOBILE ARCHITECTURAL TOP BAR & SLIDE-OUT DRAWER */}
      {/* ============================================================ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 dark:bg-[#16191D]/95 backdrop-blur-md border-b border-[#E2DFD7] dark:border-[#232B34] z-40 px-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="text-left focus:outline-none"
        >
          <ProcureXLogo size="sm" showSubtitle={false} />
        </button>

        <div className="flex items-center gap-2">
          {portalMode !== 'public' && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#087C78] dark:text-[#0AA39F] font-bold uppercase">
              {portalMode === 'gov' ? 'GOV' : 'STARTUP'}
            </span>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg border border-[#E2DFD7] dark:border-[#232B34] bg-[#F4F2EC] dark:bg-[#1E2630] text-[#111416] dark:text-white"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Backdrop & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="lg:hidden fixed top-0 bottom-0 left-0 w-[280px] z-50 bg-white dark:bg-[#16191D] border-r border-[#E2DFD7] dark:border-[#232B34] p-5 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2DFD7] dark:border-[#232B34]">
                  <ProcureXLogo size="sm" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg border border-[#E2DFD7] dark:border-[#232B34] text-[#596166]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="space-y-2">
                  {portalMode === 'gov' ? (
                    <>
                      <div className="text-[10px] font-mono uppercase text-[#087C78] font-bold">Government Workspace</div>
                      <button onClick={() => handleNav('gov_portal', 'overview')} className="w-full text-left py-2 text-xs font-semibold">Overview</button>
                      <button onClick={() => handleNav('gov_portal', 'challenges')} className="w-full text-left py-2 text-xs font-semibold">Challenges</button>
                      <button onClick={() => handleNav('gov_challenge_builder')} className="w-full text-left py-2 text-xs font-semibold text-[#087C78]">Create Challenge</button>
                      <button onClick={() => handleNav('gov_portal', 'startups')} className="w-full text-left py-2 text-xs font-semibold">Interested Startups</button>
                      <button onClick={() => handleNav('gov_portal', 'proposals')} className="w-full text-left py-2 text-xs font-semibold">Proposals</button>
                      <button onClick={() => handleNav('compare_proposals')} className="w-full text-left py-2 text-xs font-semibold">Compare Engine</button>
                      <button onClick={() => handleNav('ai_evaluation')} className="w-full text-left py-2 text-xs font-semibold">AI Evaluation</button>
                      <button onClick={() => handleNav('pilot_dashboard')} className="w-full text-left py-2 text-xs font-semibold">Pilots & Telemetry</button>
                    </>
                  ) : portalMode === 'startup' ? (
                    <>
                      <div className="text-[10px] font-mono uppercase text-[#087C78] font-bold">Startup Workspace</div>
                      <button onClick={() => handleNav('startup_portal', 'overview')} className="w-full text-left py-2 text-xs font-semibold">Overview</button>
                      <button onClick={() => handleNav('startup_portal', 'discover')} className="w-full text-left py-2 text-xs font-semibold">Discover Challenges</button>
                      <button onClick={() => handleNav('startup_portal', 'interests')} className="w-full text-left py-2 text-xs font-semibold">My Interests</button>
                      <button onClick={() => handleNav('startup_portal', 'proposals')} className="w-full text-left py-2 text-xs font-semibold">My Proposals</button>
                      <button onClick={() => handleNav('proposal_studio')} className="w-full text-left py-2 text-xs font-semibold text-[#087C78]">Proposal Studio</button>
                      <button onClick={() => handleNav('pilot_dashboard')} className="w-full text-left py-2 text-xs font-semibold">Pilots</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleNav('home')} className="w-full text-left py-2 text-xs font-semibold">Home</button>
                      <button onClick={() => handleNav('innovation_hub')} className="w-full text-left py-2 text-xs font-semibold">Innovation Hub</button>
                      <button onClick={() => handleNav('public_problem_submit')} className="w-full text-left py-2 text-xs font-semibold">Submit Problem</button>
                      <button onClick={() => handleNav('about')} className="w-full text-left py-2 text-xs font-semibold">About / Help</button>
                      <div className="pt-3 border-t border-[#E2DFD7] dark:border-[#232B34] space-y-2">
                        <button onClick={() => handleNav('gov_login')} className="w-full py-2 px-3 border border-[#111416] dark:border-[#2E3844] rounded text-xs font-mono uppercase">Government Portal</button>
                        <button onClick={() => handleNav('startup_login')} className="w-full py-2 px-3 bg-[#111416] text-white rounded text-xs font-mono uppercase">Startup Portal</button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="pt-4 border-t border-[#E2DFD7] dark:border-[#232B34] space-y-2">
                {currentUser && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => { setIsProfileModalOpen(true); setMobileMenuOpen(false); }}
                      className="w-full py-2 px-3 border border-[#E2DFD7] dark:border-[#2E3844] rounded text-xs font-mono uppercase flex items-center justify-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Profile / Settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                      className="w-full py-2 px-3 bg-red-600 text-white rounded text-xs font-mono uppercase flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
                <div className="text-[9px] font-mono text-center text-[#596166]">
                  PROCUREX PUBLIC INNOVATION PLATFORM
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          if (onUpdateUser) onUpdateUser(updated);
        }}
      />
    </>
  );
};
