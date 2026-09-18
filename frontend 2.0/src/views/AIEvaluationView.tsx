import React, { useState } from 'react';
import { Proposal, Challenge, AppView, AuthUser } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  Scale, 
  Building2,
  Check,
  Eye,
  Award
} from 'lucide-react';
import { ProposalDossierModal } from '../components/ProposalDossierModal';
import { PilotSanctionModal } from '../components/PilotSanctionModal';
import { storage } from '../utils/storage';

interface AIEvaluationViewProps {
  proposals: Proposal[];
  selectedChallenge: Challenge | null;
  currentUser?: AuthUser | null;
  onNavigate: (view: AppView) => void;
  onSelectPilot?: (proposal: Proposal) => void;
}

export const AIEvaluationView: React.FC<AIEvaluationViewProps> = ({
  proposals,
  selectedChallenge,
  currentUser = null,
  onNavigate,
  onSelectPilot
}) => {
  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    proposals[0]?.id || "p1"
  );
  const [approvedProposalId, setApprovedProposalId] = useState<string | null>(null);
  const [showDossier, setShowDossier] = useState(false);
  const [showSanction, setShowSanction] = useState(false);

  const activeProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  const handleApproveForPilot = (p: Proposal) => {
    setApprovedProposalId(p.id);
    if (onSelectPilot) {
      onSelectPilot(p);
    }
    setTimeout(() => {
      onNavigate('pilot_dashboard');
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100/70 dark:bg-[#070918] text-neutral-900 dark:text-neutral-100 transition-colors py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3" />
                  Audited Evaluation Engine
                </span>
                <span className="text-xs text-neutral-400">·</span>
                <span className="text-xs text-neutral-500 font-mono">
                  Multi-Factor Technical & Feasibility Scoring
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                AI-Assisted Proposal Evaluation
              </h1>

              <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl">
                Automated technical fit verification, pilot deliverability assessment, commercial reasonableness benchmarking, and risk factor extraction.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('compare_proposals')}
                className="px-4 py-2.5 bg-neutral-900 dark:bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-indigo-500 transition flex items-center gap-1.5 shadow-xs"
              >
                <Scale className="w-4 h-4" />
                <span>Side-by-Side Comparison</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('gov_portal')}
                className="px-4 py-2.5 border border-neutral-300 dark:border-indigo-950/80 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-[#121634] transition"
              >
                <span>Gov Portal</span>
              </button>
            </div>
          </div>

          {selectedChallenge && (
            <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-indigo-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Evaluating submissions for:</span>
                <strong className="text-neutral-900 dark:text-white">{selectedChallenge.title}</strong>
              </div>
              <span className="font-mono text-neutral-500">
                Envelope: {selectedChallenge.estimatedBudget} · {selectedChallenge.pilotDuration}
              </span>
            </div>
          )}
        </div>

        {/* Proposals Selection Rail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {proposals.map((p) => {
            const isSelected = p.id === activeProposal?.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProposalId(p.id)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-[#0f1335] border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white/70 dark:bg-[#0b0e24] border-neutral-200 dark:border-indigo-950/80 hover:border-neutral-300 dark:hover:border-indigo-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                    p.rank === 1
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-neutral-100 dark:bg-[#161a3c] text-neutral-600 dark:text-neutral-400'
                  }`}>
                    Rank #{p.rank} · {p.overallScore}%
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {p.pilotCost}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white line-clamp-1">
                  {p.startupName}
                </h3>
                <span className="text-xs text-neutral-500 block mt-0.5">
                  Timeline: {p.timelineMonths}
                </span>

                <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-indigo-950/60 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">Technical Fit: {p.technicalFitScore}%</span>
                  <span className="text-emerald-600 font-semibold">{p.status}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Evaluation Card for Active Selection */}
        {activeProposal && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Deep Technical & Risk Audit */}
            <div className="lg:col-span-8 space-y-6">
              {/* Scoring Breakdown Matrix */}
              <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-indigo-950/60 pb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                      Candidate Dossier Detailed Audit
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                      {activeProposal.startupName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-neutral-400">Composite AI Score</div>
                      <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                        {activeProposal.overallScore}/100
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Scoring Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] space-y-2 border border-neutral-200/60 dark:border-indigo-950/60">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-700 dark:text-neutral-300">Technical Architecture Fit</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{activeProposal.technicalFitScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-[#1a204d] overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                        style={{ width: `${activeProposal.technicalFitScore}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-neutral-500 block">
                      Matches real-time computer vision requirements and edge processing constraints.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] space-y-2 border border-neutral-200/60 dark:border-indigo-950/60">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-700 dark:text-neutral-300">Pilot Feasibility & Timeline</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{activeProposal.pilotFeasibilityScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-[#1a204d] overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                        style={{ width: `${activeProposal.pilotFeasibilityScore}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-neutral-500 block">
                      Clear milestone schedule with pre-configured NTCIP interface integration.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] space-y-2 border border-neutral-200/60 dark:border-indigo-950/60">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-700 dark:text-neutral-300">Team Deployment Experience</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{activeProposal.experienceScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-[#1a204d] overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                        style={{ width: `${activeProposal.experienceScore}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-neutral-500 block">
                      Track-record evidence supplied in the prototype proposal dataset; production verification should come from the connected backend.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] space-y-2 border border-neutral-200/60 dark:border-indigo-950/60">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-700 dark:text-neutral-300">Commercial Reasonableness</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{activeProposal.commercialScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-[#1a204d] overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                        style={{ width: `${activeProposal.commercialScore}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-neutral-500 block">
                      Quotation of {activeProposal.proposedBudget} is within the department envelope.
                    </span>
                  </div>
                </div>

                {/* Technical Architecture Abstract */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Solution Architecture Analysis
                  </h4>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-[#101432] p-4 rounded-xl border border-neutral-200/60 dark:border-indigo-950/60">
                    {activeProposal.solutionArchitecture}
                  </p>
                </div>

                {/* Deliverables & Dependencies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200/60 dark:border-indigo-950/60 space-y-2">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      Pilot Deliverables
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {activeProposal.pilotDeliverables}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200/60 dark:border-indigo-950/60 space-y-2">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      Required Government Facilitation
                    </span>
                    <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                      {activeProposal.governmentDependencies.map((dep, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{dep}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Red Flags & Risk Mitigation Protocol */}
              <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Risk Identification & Evaluator Audit Notes
                  </h4>
                </div>

                <div className="space-y-2">
                  {activeProposal.keyRisks.map((risk, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5"
                    >
                      <span className="font-mono font-bold text-amber-600">0{idx + 1}.</span>
                      <div>{risk}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Executive Decision & Transition to Pilot Action */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 space-y-5 shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono block mb-1">
                    Evaluator Recommendation
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      RECOMMENDED FOR PILOT
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    This dossier leads the evaluation pool on technical compliance and price efficiency.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Candidate:</span>
                    <strong className="text-neutral-900 dark:text-white">{activeProposal.startupName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Proposal Value:</span>
                    <strong className="text-neutral-900 dark:text-white font-mono">{activeProposal.proposedBudget}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Pilot Stage Cost:</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{activeProposal.pilotCost}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Time to Deploy:</span>
                    <strong className="text-neutral-900 dark:text-white">{activeProposal.timelineMonths}</strong>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDossier(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>View Proposal Dossier (Eyes of Govt)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSanction(true)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm ${
                      approvedProposalId === activeProposal.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white btn-exotic'
                    }`}
                  >
                    {approvedProposalId === activeProposal.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Pilot Approved! Transitioning...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Issue Pilot Sanction Order</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('compare_proposals')}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-indigo-950/80 hover:bg-neutral-50 dark:hover:bg-[#121634] text-neutral-800 dark:text-neutral-200 transition flex items-center justify-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Compare with Other Candidates</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-indigo-950/60 text-[11px] text-neutral-500 space-y-2">
                  <div className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Evaluation Audit Signature
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#121634] font-mono text-[10px] text-neutral-400">
                    HASH: 8f9b20e1762cba39401...
                    <br />
                    TIMESTAMP: 2026-09-15T18:48:00Z
                  </div>
                </div>
              </div>

              {/* Evidence Pointers */}
              <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 space-y-3 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono block">
                  Attached Verification Pointers
                </span>
                <div className="space-y-2">
                  {activeProposal.evidencePointers.map((ev, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EYES OF GOV: Proposal Dossier Modal */}
        <ProposalDossierModal
          proposal={activeProposal}
          challenge={selectedChallenge}
          currentUser={currentUser}
          isOpen={showDossier}
          onClose={() => setShowDossier(false)}
          onOpenSanctionOrder={() => {
            setShowDossier(false);
            setShowSanction(true);
          }}
          onOpenCompare={() => {
            setShowDossier(false);
            onNavigate('compare_proposals');
          }}
        />

        {/* OFFICIAL SANCTION & WORK AWARD MODAL */}
        <PilotSanctionModal
          proposal={activeProposal}
          challenge={selectedChallenge}
          currentUser={currentUser}
          isOpen={showSanction}
          onClose={() => setShowSanction(false)}
          onSanctionComplete={(awardedProposal) => {
            setApprovedProposalId(awardedProposal.id);
            if (onSelectPilot) {
              onSelectPilot(awardedProposal);
            }
          }}
          onNavigateToPilot={() => {
            setShowSanction(false);
            onNavigate('pilot_dashboard');
          }}
        />

      </div>
    </div>
  );
};
