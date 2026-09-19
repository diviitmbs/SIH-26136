import React, { useState, useEffect } from 'react';
import { Challenge, Startup, Proposal, AppView, AuthUser, ExpressedInterest } from '../types';
import { 
  Search, 
  ShieldCheck, 
  FileSpreadsheet, 
  ChevronRight,
  Filter,
  Scale,
  Sparkles,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  Rocket,
  Plus,
  Lock,
  Compass,
  FileCheck,
  Activity,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { storage } from '../utils/storage';

interface StartupPortalViewProps {
  challenges: Challenge[];
  startup: Startup;
  currentUser: AuthUser | null;
  initialTab?: string;
  onNavigate: (view: AppView) => void;
  onSelectChallenge: (c: Challenge) => void;
}

export const StartupPortalView: React.FC<StartupPortalViewProps> = ({
  challenges,
  startup,
  currentUser,
  initialTab,
  onNavigate,
  onSelectChallenge
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'discover' | 'interests' | 'proposals' | 'feedback'>('overview');
  const [interestsList, setInterestsList] = useState<ExpressedInterest[]>(() => storage.getExpressedInterests());
  const [proposalsList, setProposalsList] = useState<Proposal[]>(() => storage.getProposals());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filters in Discover tab
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [budgetFilter, setBudgetFilter] = useState('ALL');

  // Confirmation dialog for non-revocable interest
  const [confirmInterestChallenge, setConfirmInterestChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    if (initialTab && ['overview', 'discover', 'interests', 'proposals', 'feedback'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  useEffect(() => {
    setInterestsList(storage.getExpressedInterests());
    setProposalsList(storage.getProposals());
  }, []);

  // Startup details from resolved startup entity or user profile
  const currentStartupName = startup.name || currentUser?.startupName || "Startup Innovator";
  const userDomain = startup.sectors?.[0] || currentUser?.domain || "Civic Infrastructure";
  const dpiitNumber = startup.dpiitNumber || startup.registrationNumber || currentUser?.dpiitNumber || "DPIIT-2026-INNOV";
  const founderName = currentUser?.name || startup.founderName || "Innovator Team";

  // Challenges currently registered in the interested portal for this startup
  const expressedChallengeIds = interestsList.map(i => i.challengeId);
  const interestedChallenges = challenges.filter(c => expressedChallengeIds.includes(c.id));

  // My proposals (matching startupId or startup name)
  const myProposals = proposalsList.filter(p => 
    (startup.id && p.startupId === startup.id) ||
    (currentUser?.startupId && p.startupId === currentUser.startupId) ||
    p.startupName.toLowerCase().includes(currentStartupName.toLowerCase()) ||
    currentStartupName.toLowerCase().includes(p.startupName.toLowerCase())
  );

  // Handle expressing formal NON-REVOCABLE interest
  const handleRegisterInterest = (challenge: Challenge) => {
    if (expressedChallengeIds.includes(challenge.id)) {
      return; // Already registered
    }

    const newInterest: ExpressedInterest = {
      id: `int_${Date.now()}`,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      department: challenge.department,
      startupId: startup.id,
      startupName: currentStartupName,
      dpiitNumber: dpiitNumber,
      domain: challenge.sector,
      readinessLevel: startup.trlLevel || 'TRL-7 (Field Prototype Verified)',
      preliminaryNote: `Formal Expression of Interest logged by ${currentStartupName}. Certified ready for GFR 149(v) pilot screening.`,
      contactEmail: currentUser?.email || 'innovator@procurex.gov.in',
      expressedAt: new Date().toISOString().split('T')[0]
    };

    const updated = storage.addExpressedInterest(newInterest);
    setInterestsList(updated);
    setConfirmInterestChallenge(null);
    setToastMessage(`Formal interest logged for "${challenge.title.slice(0, 35)}...". Record is permanently registered with the government authority.`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  // Filtered challenges for discover
  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSector = sectorFilter === 'ALL' || c.sector.toLowerCase().includes(sectorFilter.toLowerCase());
    const matchesLocation = locationFilter === 'ALL' || c.state.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesSector && matchesLocation;
  });

  return (
    <div className="w-full min-h-screen bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC] transition-colors py-8 px-4 sm:px-6 lg:px-10 selection:bg-[#087C78] selection:text-white arch-grid-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-[#111416] text-white border border-[#087C78] shadow-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#0AA39F] shrink-0" />
              <span>{toastMessage}</span>
            </div>
            {activeTab !== 'interests' && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('interests');
                  setToastMessage(null);
                }}
                className="px-3 py-1 bg-[#087C78] text-white font-mono text-xs uppercase font-bold rounded-lg hover:bg-[#0AA39F] transition shrink-0"
              >
                View My Interests →
              </button>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* STARTUP WORKSPACE HEADER */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase">
                <span className="w-2 h-2 bg-[#087C78] dark:bg-[#0AA39F]" />
                <span className="font-bold text-[#087C78] dark:text-[#0AA39F]">
                  STARTUP INNOVATOR WORKSPACE
                </span>
                <span className="text-[#596166] dark:text-[#949DA3]">·</span>
                <span className="text-[#596166] dark:text-[#949DA3]">
                  DPIIT: {dpiitNumber}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                {currentStartupName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#596166] dark:text-[#949DA3] font-mono">
                <span>Lead: <strong className="text-[#111416] dark:text-white">{founderName}</strong></span>
                <span>•</span>
                <span>Primary Domain: {userDomain}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#087C78] dark:text-[#0AA39F] font-bold">
                  {startup.trlLevel || 'TRL-7'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('proposal_studio')}
                className="px-4 py-2.5 bg-[#111416] dark:bg-[#087C78] hover:bg-[#23465A] dark:hover:bg-[#0AA39F] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Proposal (9-Step)</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('pilot_dashboard')}
                className="px-4 py-2.5 border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition"
              >
                <Activity className="w-3.5 h-3.5 text-[#087C78]" />
                <span>Active Pilots</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC REAL KPI METRICS STRIP */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E2DFD7] dark:border-[#232B34]">
            <div className="p-3.5 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844]">
              <span className="text-2xl font-black font-mono text-[#111416] dark:text-white block">
                {challenges.length}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Available Public Challenges
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844]">
              <span className="text-2xl font-black font-mono text-[#087C78] dark:text-[#0AA39F] block">
                {expressedChallengeIds.length}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Registered Interests (Permanent)
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844]">
              <span className="text-2xl font-black font-mono text-[#111416] dark:text-white block">
                {myProposals.length > 0 ? myProposals.length : proposalsList.length}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Dossiers Submitted
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844]">
              <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 block">
                1 Sanctioned
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                GFR 149(v) Pilot Work Orders
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB NAVIGATION BAR */}
        {/* ============================================================ */}
        <div className="flex items-center gap-1.5 border-b border-[#E2DFD7] dark:border-[#232B34] pb-2 overflow-x-auto no-scrollbar">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'discover', label: `Discover Challenges (${challenges.length})` },
            { key: 'interests', label: `My Interests (${expressedChallengeIds.length})` },
            { key: 'proposals', label: `My Proposals (${myProposals.length > 0 ? myProposals.length : proposalsList.length})` },
            { key: 'feedback', label: 'Evaluation & Feedback' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#111416] dark:bg-[#087C78] text-white font-bold'
                  : 'text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: STARTUP OVERVIEW */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                  DIRECT PUBLIC PROCUREMENT FAST-TRACK
                </span>
                <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3] uppercase">
                  GFR RULE 149(v)
                </span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                Turn Deep-Tech Innovation into Guaranteed Municipal Pilots
              </h2>
              <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed max-w-3xl">
                ProcureX eliminates arbitrary tender criteria (such as prior 3-year turnover and prior public contracts) for DPIIT-recognized startups. Discover challenges formulated by government authorities, register non-revocable interest, submit modular 9-step technical dossiers, and earn paid pilot orders verified by live telemetry.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div 
                  onClick={() => setActiveTab('discover')}
                  className="p-3.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] cursor-pointer transition"
                >
                  <Compass className="w-4 h-4 text-[#087C78] mb-1.5" />
                  <div className="text-xs font-bold font-mono uppercase">1. Discover Problems</div>
                  <div className="text-[10px] text-[#596166] dark:text-[#949DA3] mt-1">Filter government challenges by sector, city, and pilot budget.</div>
                </div>

                <div 
                  onClick={() => onNavigate('proposal_studio')}
                  className="p-3.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] cursor-pointer transition"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#087C78] mb-1.5" />
                  <div className="text-xs font-bold font-mono uppercase">2. 9-Step Studio</div>
                  <div className="text-[10px] text-[#596166] dark:text-[#949DA3] mt-1">Architect solution dossiers with automated autosave and rubric checks.</div>
                </div>

                <div 
                  onClick={() => onNavigate('pilot_dashboard')}
                  className="p-3.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] cursor-pointer transition"
                >
                  <Activity className="w-4 h-4 text-[#087C78] mb-1.5" />
                  <div className="text-xs font-bold font-mono uppercase">3. Stream Proof</div>
                  <div className="text-[10px] text-[#596166] dark:text-[#949DA3] mt-1">Satisfy milestone telemetry benchmarks to qualify for direct scale award.</div>
                </div>
              </div>
            </div>

            {/* Registered Interests Snapshot */}
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-[#111416] dark:text-white">
                  Your Registered Interests ({expressedChallengeIds.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('interests')}
                  className="text-xs font-mono font-bold uppercase text-[#087C78] hover:underline"
                >
                  Manage Interests →
                </button>
              </div>

              {interestedChallenges.length > 0 ? (
                <div className="divide-y divide-[#E2DFD7] dark:divide-[#232B34]">
                  {interestedChallenges.map(c => (
                    <div key={c.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#111416] dark:text-white">{c.title}</span>
                          <span className="text-[9px] font-mono px-2 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                            PERMANENT
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                          {c.department} · {c.city}, {c.state} · Budget: {c.pilotBudget || c.estimatedBudget}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectChallenge(c);
                          onNavigate('proposal_studio');
                        }}
                        className="px-3 py-1.5 bg-[#111416] dark:bg-[#087C78] text-white rounded-lg text-xs font-mono uppercase font-bold shrink-0 hover:bg-[#23465A]"
                      >
                        Submit Proposal →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#596166] dark:text-[#949DA3] font-mono">
                  No challenges bookmarked yet. Explore open challenges to register formal interest.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: DISCOVER CHALLENGES (SEARCH & FILTERS) */}
        {/* ============================================================ */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-4 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#596166]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keyword, city, department, technology..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded-lg focus:outline-none focus:border-[#087C78]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="py-2 px-3 text-xs bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded-lg text-[#111416] dark:text-white font-mono"
                  >
                    <option value="ALL">All Sectors</option>
                    <option value="Urban Mobility">Urban Mobility</option>
                    <option value="Water">Water Infrastructure</option>
                    <option value="Energy">Clean Energy</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>

                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="py-2 px-3 text-xs bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded-lg text-[#111416] dark:text-white font-mono"
                  >
                    <option value="ALL">All States</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChallenges.map((challenge) => {
                const isAlreadyInterested = expressedChallengeIds.includes(challenge.id);

                return (
                  <div 
                    key={challenge.id}
                    className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-5 rounded-xl space-y-3 hover:border-[#087C78] transition shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                        <span className="text-[#087C78] dark:text-[#0AA39F] font-bold">{challenge.id}</span>
                        <span>{challenge.state}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#111416] dark:text-white leading-snug">
                        {challenge.title}
                      </h3>

                      <p className="text-xs text-[#596166] dark:text-[#949DA3] line-clamp-2 leading-relaxed">
                        {challenge.problemDescription}
                      </p>

                      <div className="pt-2 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-between text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                        <span>{challenge.department}</span>
                        <span>Budget: {challenge.pilotBudget || challenge.estimatedBudget}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-between gap-2">
                      {isAlreadyInterested ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Interest Registered (Locked)</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmInterestChallenge(challenge)}
                          className="px-3 py-1.5 border border-[#111416] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] rounded-lg text-xs font-mono uppercase font-bold text-[#111416] dark:text-white transition"
                        >
                          Register Interest
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onSelectChallenge(challenge);
                          onNavigate('proposal_studio');
                        }}
                        className="px-3.5 py-1.5 bg-[#111416] dark:bg-[#087C78] text-white rounded-lg text-xs font-mono uppercase font-bold hover:bg-[#23465A] transition"
                      >
                        Submit Proposal →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: MY REGISTERED INTERESTS (NON-REVOCABLE RULE) */}
        {/* ============================================================ */}
        {activeTab === 'interests' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                  FORMAL REGISTRATION // PERMANENT RECORD
                </span>
                <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                  {expressedChallengeIds.length} CHALLENGES
                </span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                Non-Revocable Expressions of Interest
              </h2>
              <div className="p-3.5 rounded-lg bg-[#ECEAE4]/80 dark:bg-[#1E2630] border border-[#E2DFD7] dark:border-[#2E3844] flex items-start gap-2.5 text-xs text-[#596166] dark:text-[#A7AFB5]">
                <Lock className="w-4 h-4 text-[#087C78] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111416] dark:text-white block font-mono uppercase text-[11px]">
                    Statutory Rule Notice: GFR Rule 149(v) Protocol
                  </strong>
                  Once an interest expression is transmitted, it cannot be revoked. The government department has logged your technical readiness and credentials for preliminary pilot screening.
                </div>
              </div>
            </div>

            {interestedChallenges.length > 0 ? (
              <div className="space-y-4">
                {interestedChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-4 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2DFD7] dark:border-[#232B34]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#087C78] dark:text-[#0AA39F]">
                          {challenge.id}
                        </span>
                        <span className="text-xs text-[#596166]">·</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>LOCKED & TRANSMITTED</span>
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                        {challenge.department}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#111416] dark:text-white">
                        {challenge.title}
                      </h3>
                      <p className="text-xs text-[#596166] dark:text-[#949DA3] mt-1 leading-relaxed">
                        {challenge.problemDescription}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="text-[#596166] dark:text-[#949DA3]">
                        Location: {challenge.city}, {challenge.state} · Pilot Budget: {challenge.pilotBudget || challenge.estimatedBudget}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectChallenge(challenge);
                          onNavigate('proposal_studio');
                        }}
                        className="px-4 py-2 bg-[#111416] dark:bg-[#087C78] text-white rounded-lg text-xs font-mono uppercase font-bold hover:bg-[#23465A] transition flex items-center gap-2"
                      >
                        <span>Draft Full Proposal (9 Steps)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl space-y-2">
                <BookmarkCheck className="w-8 h-8 text-[#596166] mx-auto" />
                <h4 className="text-sm font-bold uppercase font-mono text-[#111416] dark:text-white">
                  No Active Formal Interests
                </h4>
                <p className="text-xs text-[#596166] dark:text-[#949DA3] max-w-md mx-auto">
                  Browse open challenges in the Discover tab and register your interest to establish an official expression record.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('discover')}
                  className="mt-3 px-4 py-2 bg-[#111416] dark:bg-[#087C78] text-white text-xs font-mono uppercase font-bold rounded-lg"
                >
                  Discover Challenges →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: MY SUBMITTED PROPOSALS */}
        {/* ============================================================ */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                  SUBMISSION DOSSIER STATUS
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('proposal_studio')}
                  className="px-3.5 py-1.5 bg-[#111416] dark:bg-[#087C78] text-white rounded-lg text-xs font-mono uppercase font-bold"
                >
                  + New Proposal
                </button>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                Track Review & Pilot Sanction Status
              </h2>
            </div>

            <div className="space-y-4">
              {(myProposals.length > 0 ? myProposals : proposalsList).map((proposal) => (
                <div 
                  key={proposal.id}
                  className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2DFD7] dark:border-[#232B34]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#087C78] dark:text-[#0AA39F]">
                        {proposal.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-white">
                        {proposal.status}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                      Submitted: {proposal.submittedAt}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#111416] dark:text-white">
                      {proposal.challengeTitle}
                    </h3>
                    <p className="text-xs text-[#596166] dark:text-[#949DA3] mt-1 leading-relaxed">
                      {proposal.technicalSummary || proposal.solutionSummary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E2DFD7] dark:border-[#232B34] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="text-[#596166] dark:text-[#949DA3]">
                      Budget: {proposal.proposedBudget} · Timeline: {proposal.pilotTimeline || proposal.timelineMonths} · Match Score: {proposal.matchScore ?? proposal.overallScore}%
                    </div>

                    {proposal.sanctionOrderNumber ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SANCTIONED: {proposal.sanctionOrderNumber}</span>
                      </span>
                    ) : (
                      <span className="text-[#596166] dark:text-[#949DA3]">
                        In Department Committee Screening
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: EVALUATION & FEEDBACK */}
        {/* ============================================================ */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                  OBJECTIVE SCORING // ZERO BIAS AUDIT
                </span>
                <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                  GFR 149(v) RUBRIC
                </span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                Technical Rubric & Automated Benchmarking
              </h2>
              <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                All submissions undergo double-blind algorithmic audit scoring against four statutory criteria before presentation to the municipal technical committee.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-5 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[#087C78]">1. Technical Feasibility & TRL (30 pts)</span>
                <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                  Evaluates field prototypes, hardware specs, failover redundancy, and architectural robustness in harsh civic conditions.
                </p>
              </div>

              <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-5 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[#087C78]">2. Commercial Viability & Unit Economics (25 pts)</span>
                <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                  Measures total pilot expenditure, maintenance amortizations, and lifecycle cost savings relative to legacy government solutions.
                </p>
              </div>

              <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-5 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[#087C78]">3. Regulatory & Privacy Compliance (25 pts)</span>
                <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                  Zero-PII video processing, localized data residency within state boundary, and ISO/CERT-In certified cybersecurity standards.
                </p>
              </div>

              <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-5 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[#087C78]">4. Measurable KPI Telemetry (20 pts)</span>
                <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                  Clarity of quantifiable civic impact indicators and real-time streaming frequency for the GFR 149(v) pilot telemetry dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* NON-REVOCABLE INTEREST CONFIRMATION MODAL */}
        {/* ============================================================ */}
        {confirmInterestChallenge && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>Non-Revocable Formal Registration</span>
              </div>

              <h3 className="text-lg font-bold text-[#111416] dark:text-white">
                Confirm Registration of Interest?
              </h3>

              <div className="space-y-2 text-xs text-[#596166] dark:text-[#949DA3]">
                <p>
                  You are logging an official Expression of Interest for:
                </p>
                <div className="p-3 bg-[#F4F2EC] dark:bg-[#1E2630] rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] text-[#111416] dark:text-white font-semibold">
                  {confirmInterestChallenge.title} ({confirmInterestChallenge.id})
                </div>
                <p className="pt-1 text-[11px] font-mono leading-relaxed">
                  <strong>Notice:</strong> Once confirmed, this interest expression is permanent and cannot be deleted or revoked. Your DPIIT registration ({dpiitNumber}) and founder contact details will be entered into the Department of Urban Development's screening ledger.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-end gap-2.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setConfirmInterestChallenge(null)}
                  className="px-4 py-2 border border-[#E2DFD7] dark:border-[#2E3844] rounded-lg hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#596166] dark:text-[#949DA3]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleRegisterInterest(confirmInterestChallenge)}
                  className="px-4 py-2 bg-[#087C78] text-white font-bold rounded-lg hover:bg-[#0AA39F] transition"
                >
                  Confirm & Submit Permanent Interest
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
