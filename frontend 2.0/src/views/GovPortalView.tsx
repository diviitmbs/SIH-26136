import React, { useState, useEffect } from 'react';
import { Challenge, Startup, Proposal, AppView, AuthUser, ExpressedInterest } from '../types';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Scale, 
  ShieldCheck, 
  ChevronRight,
  Eye,
  Award,
  FileText,
  CheckCircle2,
  Activity,
  Building2,
  Users,
  Clock,
  Calendar,
  AlertCircle,
  TrendingUp,
  FolderKanban,
  CheckSquare
} from 'lucide-react';
import { ProposalDossierModal } from '../components/ProposalDossierModal';
import { PilotSanctionModal } from '../components/PilotSanctionModal';
import { storage } from '../utils/storage';

interface GovPortalViewProps {
  challenges: Challenge[];
  startups: Startup[];
  proposals: Proposal[];
  currentUser: AuthUser | null;
  initialTab?: string;
  onNavigate: (view: AppView) => void;
  onSelectChallenge: (c: Challenge) => void;
}

export const GovPortalView: React.FC<GovPortalViewProps> = ({
  challenges,
  startups,
  proposals,
  currentUser,
  initialTab,
  onNavigate,
  onSelectChallenge
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'proposals' | 'startups' | 'outcomes'>('overview');
  const [scopeFilter, setScopeFilter] = useState<'department' | 'all'>('department');
  const [problemTypeFilter, setProblemTypeFilter] = useState<'all' | 'defined' | 'standard'>('all');
  const [startupSearch, setStartupSearch] = useState('');

  // Proposals
  const [localProposals, setLocalProposals] = useState<Proposal[]>(() => {
    const saved = storage.getProposals();
    return saved.length > 0 ? saved : proposals;
  });
  const [expressedInterests, setExpressedInterests] = useState<ExpressedInterest[]>(() => storage.getExpressedInterests());

  const [inspectProposal, setInspectProposal] = useState<Proposal | null>(null);
  const [sanctionProposal, setSanctionProposal] = useState<Proposal | null>(null);
  const [sanctionToast, setSanctionToast] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab && ['overview', 'challenges', 'proposals', 'startups', 'outcomes'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  useEffect(() => {
    const saved = storage.getProposals();
    if (saved.length > 0) {
      setLocalProposals(saved);
    }
    setExpressedInterests(storage.getExpressedInterests());
  }, [proposals]);

  const deptName = currentUser?.department || "Department of Urban Development";
  const stateName = currentUser?.state || "Karnataka";
  const officerId = currentUser?.officerId || "GOV-KA-2026";
  const officerName = currentUser?.name || currentUser?.responsiblePerson || "Er. Rajesh Kulkarni";

  // Filter challenges posted by this department vs all
  const departmentChallenges = challenges.filter(c => 
    c.department.toLowerCase().includes(deptName.toLowerCase()) ||
    deptName.toLowerCase().includes(c.department.toLowerCase())
  );

  const displayedChallenges = scopeFilter === 'department' && departmentChallenges.length > 0
    ? departmentChallenges
    : challenges;

  const definedChallenges = displayedChallenges.filter(c => c.isDepartmentDefined);
  const [selectedDefinedId, setSelectedDefinedId] = useState<string>(
    definedChallenges[0]?.id || displayedChallenges[0]?.id || ''
  );
  const selectedDefinedProblem = challenges.find(c => c.id === selectedDefinedId) || definedChallenges[0] || displayedChallenges[0];

  const tableChallenges = displayedChallenges.filter(c => {
    if (problemTypeFilter === 'defined') return Boolean(c.isDepartmentDefined);
    if (problemTypeFilter === 'standard') return !c.isDepartmentDefined;
    return true;
  });

  const activePilotsCount = localProposals.filter(p => p.status === 'Pilot Active' || p.status === 'Sanctioned').length;

  return (
    <div className="w-full min-h-screen bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC] transition-colors py-8 px-4 sm:px-6 lg:px-10 selection:bg-[#087C78] selection:text-white arch-grid-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ============================================================ */}
        {/* INSTITUTIONAL WORKSPACE HEADER */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase">
                <span className="w-2 h-2 bg-[#087C78] dark:bg-[#0AA39F]" />
                <span className="font-bold text-[#087C78] dark:text-[#0AA39F]">
                  GOVERNMENT PROCUREMENT WORKSPACE
                </span>
                <span className="text-[#596166] dark:text-[#949DA3]">·</span>
                <span className="text-[#596166] dark:text-[#949DA3]">
                  ID: {officerId}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                {deptName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#596166] dark:text-[#949DA3] font-mono">
                <span>Nodal Authority: <strong className="text-[#111416] dark:text-white">{officerName}</strong></span>
                <span>•</span>
                <span>Jurisdiction: {stateName}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-white">
                  GFR Rule 149(v) Sandbox
                </span>
              </div>
            </div>

            {/* Quick Operational Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('gov_challenge_builder')}
                className="px-4 py-2.5 bg-[#111416] dark:bg-[#087C78] hover:bg-[#23465A] dark:hover:bg-[#0AA39F] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Challenge</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('compare_proposals')}
                className="px-4 py-2.5 border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition"
              >
                <Scale className="w-3.5 h-3.5 text-[#087C78]" />
                <span>Compare Engine</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('ai_evaluation')}
                className="px-4 py-2.5 border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#087C78]" />
                <span>AI Scoring Matrix</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC REAL KPI METRICS STRIP (NO HARDCODED FAKE NUMBERS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E2DFD7] dark:border-[#232B34]">
            <div className="p-3.5 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844]">
              <span className="text-2xl font-black font-mono text-[#111416] dark:text-white block">
                {departmentChallenges.length > 0 ? departmentChallenges.length : challenges.length}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Department Challenges
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844]">
              <span className="text-2xl font-black font-mono text-[#087C78] dark:text-[#0AA39F] block">
                {localProposals.length}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Proposals in Review Queue
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844]">
              <span className="text-2xl font-black font-mono text-[#111416] dark:text-white block">
                {expressedInterests.length}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Interested Startups Registered
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844]">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {activePilotsCount} Active
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#596166]">
                  PROTOTYPE DATA
                </span>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Milestone Telemetry Field Trials
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
            { key: 'challenges', label: `Challenges (${challenges.length})` },
            { key: 'startups', label: `Interested Startups (${expressedInterests.length})` },
            { key: 'proposals', label: `Proposals Received (${localProposals.length})` },
            { key: 'outcomes', label: 'Outcomes / Procurement' }
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
        {/* TAB 1: WORKSPACE OVERVIEW */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Mission Statement */}
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                  STATUTORY REFORM // GFR RULE 149(v)
                </span>
                <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3] uppercase">
                  PILOT SANCTION REGISTRY
                </span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                Replace Speculative Tendering with Evidence-Based Procurement
              </h2>
              <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed max-w-3xl">
                As an accredited public procurement nodal authority, you can formulate civic challenges, evaluate DPIIT-recognized deep-tech innovations with automated rubric audits, sanction contained 3–6 month prototype testbeds, and track continuous telemetry before authorizing city-wide scale.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div 
                  onClick={() => setActiveTab('challenges')}
                  className="p-3.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] cursor-pointer transition"
                >
                  <FolderKanban className="w-4 h-4 text-[#087C78] mb-1.5" />
                  <div className="text-xs font-bold font-mono uppercase">1. Formulate Challenges</div>
                  <div className="text-[10px] text-[#596166] dark:text-[#949DA3] mt-1">Specify baseline metrics, location constraints, and pilot duration.</div>
                </div>

                <div 
                  onClick={() => setActiveTab('proposals')}
                  className="p-3.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] cursor-pointer transition"
                >
                  <FileText className="w-4 h-4 text-[#087C78] mb-1.5" />
                  <div className="text-xs font-bold font-mono uppercase">2. Evaluate Dossiers</div>
                  <div className="text-[10px] text-[#596166] dark:text-[#949DA3] mt-1">Review double-blind technical submissions and algorithmic match scores.</div>
                </div>

                <div 
                  onClick={() => onNavigate('pilot_dashboard')}
                  className="p-3.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] cursor-pointer transition"
                >
                  <Activity className="w-4 h-4 text-[#087C78] mb-1.5" />
                  <div className="text-xs font-bold font-mono uppercase">3. Stream Telemetry</div>
                  <div className="text-[10px] text-[#596166] dark:text-[#949DA3] mt-1">Monitor real-time sensor streams and academic validation audits.</div>
                </div>
              </div>
            </div>

            {/* Recent Proposals Snapshot */}
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-[#111416] dark:text-white">
                  Active Proposals in Queue ({localProposals.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('proposals')}
                  className="text-xs font-mono font-bold uppercase text-[#087C78] hover:underline"
                >
                  View All Proposals →
                </button>
              </div>

              <div className="divide-y divide-[#E2DFD7] dark:divide-[#232B34]">
                {localProposals.slice(0, 3).map(prop => (
                  <div key={prop.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111416] dark:text-white">{prop.startupName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#087C78]">
                          {prop.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#596166] dark:text-[#949DA3]">
                        Target Challenge: <strong className="text-[#111416] dark:text-white">{prop.challengeTitle}</strong> ({prop.challengeId})
                      </div>
                      <div className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                        Submitted on: {prop.submittedAt} · Proposed Budget: {prop.proposedBudget} · Timeline: {prop.pilotTimeline || prop.timelineMonths}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setInspectProposal(prop)}
                        className="px-3 py-1.5 border border-[#E2DFD7] dark:border-[#2E3844] rounded-lg text-xs font-mono uppercase hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]"
                      >
                        Inspect Dossier
                      </button>
                      <button
                        type="button"
                        onClick={() => setSanctionProposal(prop)}
                        className="px-3 py-1.5 bg-[#111416] dark:bg-[#087C78] text-white rounded-lg text-xs font-mono uppercase font-bold hover:bg-[#23465A]"
                      >
                        Sanction Pilot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: REGISTERED CHALLENGES */}
        {/* ============================================================ */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Scope Filter */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScopeFilter('department')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition ${
                    scopeFilter === 'department'
                      ? 'bg-[#111416] text-white dark:bg-[#087C78] font-bold'
                      : 'bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] text-[#596166]'
                  }`}
                >
                  My Department ({departmentChallenges.length})
                </button>

                <button
                  type="button"
                  onClick={() => setScopeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition ${
                    scopeFilter === 'all'
                      ? 'bg-[#111416] text-white dark:bg-[#087C78] font-bold'
                      : 'bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] text-[#596166]'
                  }`}
                >
                  All State Challenges ({challenges.length})
                </button>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('gov_challenge_builder')}
                className="px-4 py-1.5 bg-[#111416] dark:bg-[#087C78] text-white text-xs font-mono uppercase font-bold rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Formulate New Problem</span>
              </button>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedChallenges.map((c) => (
                <div 
                  key={c.id} 
                  className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-5 rounded-xl space-y-3 shadow-xs hover:border-[#087C78] transition"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                    <span className="text-[#087C78] dark:text-[#0AA39F] font-bold">{c.id}</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECEAE4] dark:bg-[#1E2630] font-bold">{c.status}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#111416] dark:text-white leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-[#596166] dark:text-[#949DA3] line-clamp-2 leading-relaxed">
                    {c.problemDescription}
                  </p>

                  <div className="pt-2 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-between text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                    <span>{c.department}</span>
                    <span>Budget: {c.pilotBudget || c.estimatedBudget}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-[#087C78]">
                      {c.proposalsCount} Proposals Received
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectChallenge(c);
                        setActiveTab('proposals');
                      }}
                      className="text-xs font-mono font-bold uppercase text-[#111416] dark:text-white hover:text-[#087C78] transition"
                    >
                      View Queue →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: INTERESTED STARTUPS */}
        {/* ============================================================ */}
        {activeTab === 'startups' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                  STARTUP ENGAGEMENT REGISTRY
                </span>
                <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                  PERMANENT RECORD
                </span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                Startups Expressing Formal Pilot Interest
              </h2>
              <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                Startups that registered non-revocable interest under your challenges. These entities are screened for DPIIT recognition, baseline technology readiness (TRL-7+), and civic domain relevance.
              </p>
            </div>

            {/* List of Expressed Interests */}
            {expressedInterests.length > 0 ? (
              <div className="space-y-3">
                {expressedInterests.map((interest) => (
                  <div 
                    key={interest.id}
                    className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#111416] dark:text-white">
                          {interest.startupName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                          Interest Confirmed
                        </span>
                        <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                          DPIIT: {interest.dpiitNumber || 'Recognized'}
                        </span>
                      </div>

                      <div className="text-xs text-[#596166] dark:text-[#949DA3]">
                        Expressed for Challenge: <strong className="text-[#111416] dark:text-white">{interest.challengeTitle}</strong> ({interest.challengeId})
                      </div>

                      <div className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                        Readiness: {interest.readinessLevel} · Domain: {interest.domain} · Date Logged: {interest.expressedAt}
                      </div>

                      {interest.preliminaryNote && (
                        <p className="text-xs text-[#111416] dark:text-[#A7AFB5] pt-1 italic">
                          "{interest.preliminaryNote}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onNavigate('compare_proposals')}
                        className="px-3.5 py-2 border border-[#E2DFD7] dark:border-[#2E3844] rounded-lg text-xs font-mono uppercase hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]"
                      >
                        Compare Capabilities
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl space-y-2">
                <Users className="w-8 h-8 text-[#596166] mx-auto" />
                <h4 className="text-sm font-bold uppercase font-mono text-[#111416] dark:text-white">
                  No External Expressions Logged Yet
                </h4>
                <p className="text-xs text-[#596166] dark:text-[#949DA3] max-w-md mx-auto">
                  When startups browse your published challenges on the Startup Portal and click "Register Formal Interest", their official entity records and contact details will appear here immediately.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PROPOSALS RECEIVED (CHALLENGE ↔ PROPOSAL LIFECYCLE) */}
        {/* ============================================================ */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                  GFR 149(v) TECHNICAL EVALUATION QUEUE
                </span>
                <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                  {localProposals.length} DOSSIERS
                </span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                Structured Technical Solution Proposals
              </h2>
              <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                Full technical proposals received from verified innovators. Each dossier links explicitly to its sanctioned municipal challenge, detailing pilot cost breakdowns, hardware architectures, and sensor telemetry configurations.
              </p>
            </div>

            {/* Proposal Cards with Explicit Challenge Linking */}
            <div className="space-y-4">
              {localProposals.map((proposal) => (
                <div 
                  key={proposal.id}
                  className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-4 hover:border-[#087C78] transition shadow-xs"
                >
                  {/* Top Bar: Proposal Status & Challenge Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2DFD7] dark:border-[#232B34]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#087C78] dark:text-[#0AA39F]">
                        DOSSIER: {proposal.id}
                      </span>
                      <span className="text-xs text-[#596166]">·</span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-white">
                        {proposal.status}
                      </span>
                      {proposal.sanctionOrderNumber && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          Sanctioned: {proposal.sanctionOrderNumber}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                      SUBMITTED: {proposal.submittedAt}
                    </div>
                  </div>

                  {/* Challenge & Startup Linking Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8 space-y-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#596166] dark:text-[#949DA3] block">
                          TARGET CHALLENGE
                        </span>
                        <h3 className="text-base font-bold text-[#111416] dark:text-white">
                          {proposal.challengeTitle}
                        </h3>
                        <span className="text-[10px] font-mono text-[#087C78] dark:text-[#0AA39F]">
                          Challenge ID: {proposal.challengeId}
                        </span>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] font-mono uppercase text-[#596166] dark:text-[#949DA3] block">
                          BIDDING STARTUP / ENTITY
                        </span>
                        <div className="text-sm font-bold text-[#111416] dark:text-white flex items-center gap-2">
                          <span>{proposal.startupName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#596166]">
                            DPIIT Verified
                          </span>
                        </div>
                        <p className="text-xs text-[#596166] dark:text-[#949DA3] mt-1 leading-relaxed">
                          {proposal.technicalSummary || proposal.solutionSummary}
                        </p>
                      </div>
                    </div>

                    {/* Commercials & Pilot Parameters */}
                    <div className="lg:col-span-4 bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] p-4 rounded-lg space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#596166] dark:text-[#949DA3]">Proposed Budget:</span>
                        <span className="font-bold text-[#111416] dark:text-white">{proposal.proposedBudget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#596166] dark:text-[#949DA3]">Pilot Timeline:</span>
                        <span className="font-bold text-[#111416] dark:text-white">{proposal.pilotTimeline || proposal.timelineMonths}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#596166] dark:text-[#949DA3]">Hardware Cost:</span>
                        <span className="text-[#111416] dark:text-white">{proposal.breakdownCosts?.hardware || proposal.hardwareCost || '₹0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#596166] dark:text-[#949DA3]">Algorithmic Score:</span>
                        <span className="font-bold text-[#087C78] dark:text-[#0AA39F]">{proposal.matchScore ?? proposal.overallScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Action Controls */}
                  <div className="pt-3 border-t border-[#E2DFD7] dark:border-[#232B34] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#087C78]" />
                      <span>Zero IP Disclosure Protected under Public Procurement Act</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectProposal(proposal)}
                        className="px-4 py-2 border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white rounded-lg text-xs font-mono uppercase font-semibold flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#087C78]" />
                        <span>Inspect Full Dossier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSanctionProposal(proposal)}
                        className="px-4 py-2 bg-[#111416] dark:bg-[#087C78] hover:bg-[#23465A] dark:hover:bg-[#0AA39F] text-white rounded-lg text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Sanction GFR 149(v) Pilot</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: OUTCOMES / PROCUREMENT */}
        {/* ============================================================ */}
        {activeTab === 'outcomes' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                  EVIDENCE-BASED PROCUREMENT SCALE
                </span>
                <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                  TRL-8 TO FULL ADOPTION
                </span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                Pilot Outcomes & Transition Pathways
              </h2>
              <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                When a startup completes its sanctioned 3–6 month prototype pilot and satisfies statutory sensor verification benchmarks, the departmental evaluation committee can certify outcome compliance without repeating speculative tender phases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-5 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#087C78]">
                  <CheckSquare className="w-4 h-4" />
                  <span>Statutory Transition Criteria</span>
                </div>
                <ul className="text-xs text-[#596166] dark:text-[#949DA3] space-y-2 list-disc list-inside">
                  <li>Minimum 90 days active telemetry streaming without sensor dropouts</li>
                  <li>KPI improvement exceeding pre-agreed baseline target by at least 15%</li>
                  <li>Third-party independent academic audit signoff (IIT/IISc verified)</li>
                  <li>Zero security vulnerability affidavit under CERT-In guidelines</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-5 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#087C78]">
                  <TrendingUp className="w-4 h-4" />
                  <span>Direct Award Authorization</span>
                </div>
                <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                  Under GFR Rule 149(v) sub-clause (b), successful pilots proven in municipal environments can be transitioned directly into multi-year departmental service contracts through the State Innovation Procurement Desk.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('pilot_dashboard')}
                  className="px-3.5 py-1.5 border border-[#111416] dark:border-[#2E3844] rounded-lg text-xs font-mono uppercase hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630]"
                >
                  View Active Pilot Telemetry →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sanction Execution Toast */}
        {sanctionToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#111416] text-white border border-[#087C78] shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#0AA39F] shrink-0" />
            <div className="text-xs font-mono">
              <span className="font-bold block text-white">
                Official Sanction Order Executed
              </span>
              <span className="text-[#949DA3]">{sanctionToast}</span>
            </div>
          </div>
        )}

        {/* EYES OF GOV: Proposal Dossier Modal */}
        <ProposalDossierModal
          proposal={inspectProposal}
          challenge={selectedDefinedProblem}
          currentUser={currentUser}
          isOpen={Boolean(inspectProposal)}
          onClose={() => setInspectProposal(null)}
          onOpenSanctionOrder={(prop) => {
            setInspectProposal(null);
            setSanctionProposal(prop);
          }}
          onOpenCompare={() => {
            setInspectProposal(null);
            onNavigate('compare_proposals');
          }}
        />

        {/* OFFICIAL SANCTION & WORK AWARD MODAL */}
        <PilotSanctionModal
          proposal={sanctionProposal}
          challenge={selectedDefinedProblem}
          currentUser={currentUser}
          isOpen={Boolean(sanctionProposal)}
          onClose={() => setSanctionProposal(null)}
          onSanctionComplete={(awardedProposal) => {
            const updated = localProposals.map(p => p.id === awardedProposal.id ? awardedProposal : p);
            setLocalProposals(updated);
            storage.saveProposals(updated);
            setSanctionToast(`Sanction Order ${awardedProposal.sanctionOrderNumber} generated for ${awardedProposal.startupName}`);
            setTimeout(() => setSanctionToast(null), 5000);
          }}
          onNavigateToPilot={() => {
            setSanctionProposal(null);
            onNavigate('pilot_dashboard');
          }}
        />

      </div>
    </div>
  );
};
