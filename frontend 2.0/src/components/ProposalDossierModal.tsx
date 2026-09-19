import React, { useState } from 'react';
import { Proposal, Challenge, AuthUser } from '../types';
import { 
  X, 
  Building2, 
  Rocket, 
  ShieldCheck, 
  Cpu, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Download, 
  Printer, 
  Scale, 
  Sparkles,
  ExternalLink,
  Award,
  Layers,
  Check,
  RefreshCw
} from 'lucide-react';
import { ProcureXLogo } from './ProcureXLogo';
import { analyzeDocument, AnalyzeDocumentResponse, runDevilAdvocate, DevilAdvocateResponse } from '../utils/api';

interface ProposalDossierModalProps {
  proposal: Proposal | null;
  challenge?: Challenge | null;
  currentUser: AuthUser | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSanctionOrder: (proposal: Proposal) => void;
  onOpenCompare: (proposal: Proposal) => void;
}

export const ProposalDossierModal: React.FC<ProposalDossierModalProps> = ({
  proposal,
  challenge,
  currentUser,
  isOpen,
  onClose,
  onOpenSanctionOrder,
  onOpenCompare
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'commercial' | 'compliance' | 'decision' | 'devil_advocate'>('architecture');
  const [officerNotes, setOfficerNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // AI Forensics Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDocumentResponse | null>(null);

  // Devil's Advocate State (Phase 3 AI)
  const [isRunningDevilAdvocate, setIsRunningDevilAdvocate] = useState(false);
  const [devilAdvocateResult, setDevilAdvocateResult] = useState<DevilAdvocateResponse | null>(null);
  const [devilAdvocateError, setDevilAdvocateError] = useState<string | null>(null);

  const handleRunDevilAdvocate = async () => {
    if (!proposal) return;
    setIsRunningDevilAdvocate(true);
    setDevilAdvocateError(null);
    try {
      const res = await runDevilAdvocate({
        summary: `${proposal.startupName} proposing ${proposal.solutionName || 'Solution'}: ${proposal.proposedBudget} over ${proposal.timelineMonths}. ${proposal.solutionSummary || ''}`,
        startup: proposal.startupName,
        budget: proposal.proposedBudget,
        timeline: proposal.timelineMonths,
        technicalFit: proposal.technicalFitScore,
        commercialScore: proposal.commercialScore
      });
      setDevilAdvocateResult(res);
    } catch (err: any) {
      console.warn("Devil's advocate analysis failed:", err);
      setDevilAdvocateError(err.message || 'Adversarial analysis failed.');
    } finally {
      setIsRunningDevilAdvocate(false);
    }
  };

  const handleRunForensics = async () => {
    if (!proposal) return;
    setIsAnalyzing(true);
    try {
      const text = `${proposal.solutionName || ''}\n${proposal.solutionSummary || ''}\n${proposal.solutionArchitecture || ''}`;
      const res = await analyzeDocument(text);
      setAnalysisResult(res);
    } catch (err) {
      console.warn("Dossier forensics failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen || !proposal) return null;

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const isAwarded = proposal.status === 'Awarded' || proposal.status === 'Sanctioned' || proposal.status === 'Pilot Active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl bg-white dark:bg-[#0a0d22] border border-neutral-200 dark:border-indigo-950 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Official Governance Dossier Banner */}
        <div className="bg-neutral-900 dark:bg-[#060814] text-white p-5 sm:p-6 border-b border-neutral-800 dark:border-indigo-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <ProcureXLogo size="sm" inverted={true} showSubtitle={false} />
            <div className="border-l border-neutral-700 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-black">
                  GOVT EVALUATION DOSSIER · EYES OF GOVERNMENT
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-900/80 border border-indigo-700/60 text-indigo-200 text-[9px] font-mono">
                  REF: {proposal.id}
                </span>
                {isAwarded && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-[9px] font-bold uppercase flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Pilot Contract Awarded
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
                {proposal.startupName} — Full Technical & Commercial Submission
              </h2>
              <p className="text-xs text-neutral-400 truncate max-w-xl">
                Challenge: <span className="text-neutral-200">{proposal.challengeTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              title="Print / Save Official Evaluation Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Decision Bar & Scores */}
        <div className="bg-neutral-50 dark:bg-[#0e1230] border-b border-neutral-200 dark:border-indigo-950/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
                Composite AI Fit
              </span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {proposal.overallScore}%
                </span>
                <span className="text-[10px] text-neutral-400">/ 100</span>
              </div>
            </div>

            <div className="h-7 w-px bg-neutral-200 dark:bg-indigo-950" />

            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
                Commercial Total
              </span>
              <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                {proposal.proposedBudget}
              </span>
            </div>

            <div className="h-7 w-px bg-neutral-200 dark:bg-indigo-950" />

            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
                Pilot Envelope
              </span>
              <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {proposal.pilotCost}
              </span>
            </div>

            <div className="h-7 w-px bg-neutral-200 dark:bg-indigo-950" />

            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
                Delivery Window
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {proposal.timelineMonths}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenCompare(proposal)}
              className="px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-indigo-900 text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-[#141838] font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-500" />
              <span>Compare with Rivals</span>
            </button>

            {!isAwarded ? (
              <button
                type="button"
                onClick={() => onOpenSanctionOrder(proposal)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition btn-exotic"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Accept & Award Pilot Contract</span>
              </button>
            ) : (
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold rounded-xl text-xs border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Sanctioned: {proposal.sanctionOrderNumber || 'PILOT-SANCTIONED'}
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-neutral-200 dark:border-indigo-950/80 flex items-center gap-1 bg-white dark:bg-[#0b0e24] overflow-x-auto">
          {[
            { id: 'architecture', label: '1. Architecture & Specs', icon: Cpu },
            { id: 'commercial', label: '2. BOM & Commercials', icon: DollarSign },
            { id: 'compliance', label: '3. Compliance & Risks', icon: ShieldCheck },
            { id: 'decision', label: '4. Evaluator Audit & Notes', icon: Sparkles },
            { id: 'devil_advocate', label: "5. Adversarial Audit (Devil's Advocate)", icon: Scale },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-neutral-800 dark:text-neutral-200">
          
          {/* TAB 1: ARCHITECTURE & TECHNICAL SPECIFICATIONS */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Startup Credential Block */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200/80 dark:border-indigo-950/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
                    Startup Legal Entity
                  </span>
                  <div className="font-bold text-neutral-900 dark:text-white text-sm">
                    {proposal.startupName}
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">
                    ID: {proposal.startupId}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
                    DPIIT Registration
                  </span>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xs font-mono">
                    {proposal.dpiitNumber || "DPIIT-IN-2023-88219"}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> Prototype procurement rule check
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
                    Official Contact
                  </span>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {proposal.contactEmail || "procurement@startup.in"}
                  </div>
                  <span className="text-xs text-neutral-500">
                    Submission Date: {proposal.submittedAt}
                  </span>
                </div>
              </div>

              {/* Solution Overview */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                  Solution Specification & Methodology
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {proposal.solutionName || "Autonomous Municipal Adaptive Control Architecture"}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed p-4 rounded-xl bg-neutral-50 dark:bg-[#0c0f28] border border-neutral-200/70 dark:border-indigo-950/60">
                  {proposal.solutionSummary || proposal.solutionArchitecture}
                </p>
              </div>

              {/* Deep Technical Architecture */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono block">
                  Technical Architecture & Sensor Processing Blueprint
                </span>
                <div className="p-5 rounded-2xl bg-neutral-900 text-neutral-100 font-mono text-xs leading-relaxed space-y-3 border border-neutral-800">
                  <div className="flex items-center justify-between text-[11px] text-indigo-400 border-b border-neutral-800 pb-2">
                    <span>SYSTEM COMPONENT SPECIFICATION</span>
                    <span>EDGE INFERENCE + NTCIP COMPLIANT</span>
                  </div>
                  <p>
                    {proposal.solutionArchitecture}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-neutral-300">
                    <div className="p-2 rounded bg-neutral-800/80">
                      <span className="text-neutral-500 block text-[9px]">COMPUTE TOPOLOGY:</span>
                      16 TOPS Neural NPU at edge
                    </div>
                    <div className="p-2 rounded bg-neutral-800/80">
                      <span className="text-neutral-500 block text-[9px]">PRIVACY COMPLIANCE:</span>
                      Zero raw video uploaded; only telemetry
                    </div>
                    <div className="p-2 rounded bg-neutral-800/80">
                      <span className="text-neutral-500 block text-[9px]">RESPONSE LATENCY:</span>
                      &lt; 350ms adaptive cycle split
                    </div>
                  </div>
                </div>
              </div>

              {/* Field Deployment Testbed & Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-indigo-950 bg-white dark:bg-[#0b0e24] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Proposed Field Testbed Corridor
                  </span>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {proposal.pilotLocations || "Designated Municipal Ward, Outer Ring Road & Central Junctions"}
                  </p>
                  <span className="text-[11px] text-neutral-500 block">
                    Deliverable: {proposal.pilotDeliverables}
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-indigo-950 bg-white dark:bg-[#0b0e24] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Projected Civic Impact Target
                  </span>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {proposal.projectedImpact || "≥15% reduction in mean corridor delay & queue congestion"}
                  </p>
                  <span className="text-[11px] text-neutral-500 block">
                    Verified through automated sensor telemetry before milestone payout.
                  </span>
                </div>
              </div>

              {/* AI Architecture & Document Forensics */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200/80 dark:border-indigo-950/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                      Automated AI Technical Forensics (POST /api/ai/analyze-document)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRunForensics}
                    disabled={isAnalyzing}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzing ? 'Auditing Blueprint...' : 'Run Forensics'}</span>
                  </button>
                </div>

                {analysisResult && analysisResult.analysis && (
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-neutral-500">Document Classification:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{analysisResult.analysis.document_type}</span>
                    </div>

                    {analysisResult.analysis.technology_stack && analysisResult.analysis.technology_stack.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Extracted Technologies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.analysis.technology_stack.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-[#161a3c] border border-neutral-200 dark:border-indigo-900/60 font-mono text-[10px] text-neutral-800 dark:text-neutral-200">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisResult.analysis.claimed_metrics && analysisResult.analysis.claimed_metrics.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Self-Claimed Performance Metrics:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-neutral-700 dark:text-neutral-300">
                          {analysisResult.analysis.claimed_metrics.map((m, idx) => (
                            <li key={idx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.analysis.potential_gaps && analysisResult.analysis.potential_gaps.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 space-y-1">
                        <span className="font-bold font-mono text-[10px] uppercase block">Dossier Information Gaps for Committee:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {analysisResult.analysis.potential_gaps.map((gap, idx) => (
                            <li key={idx}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.analysis.verification_note && (
                      <p className="text-[11px] text-neutral-500 italic pt-1 border-t border-neutral-200 dark:border-indigo-950">
                        Evaluator Note: {analysisResult.analysis.verification_note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BOM & COMMERCIALS */}
          {activeTab === 'commercial' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200/80 dark:border-indigo-950/80 space-y-4">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center justify-between">
                  <span>Financial Envelope Breakdown (General Financial Rules Audit)</span>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    Cap Verified under ₹50 Lakhs
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121638] border border-neutral-200/60 dark:border-indigo-950/60">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
                      Total Commercial Value
                    </span>
                    <span className="text-base font-black text-neutral-900 dark:text-white font-mono">
                      {proposal.proposedBudget}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Scale production</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#121638] border border-emerald-500/30">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block font-mono">
                      Pilot Phase Budget
                    </span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {proposal.pilotCost}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Tranche disbursed</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#121638] border border-neutral-200/60 dark:border-indigo-950/60">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
                      Sensor Hardware BOM
                    </span>
                    <span className="text-base font-black text-neutral-900 dark:text-white font-mono">
                      {proposal.hardwareCost || "₹9,20,000"}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Physical equipment</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#121638] border border-neutral-200/60 dark:border-indigo-950/60">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
                      Support & Field Engineering
                    </span>
                    <span className="text-base font-black text-neutral-900 dark:text-white font-mono">
                      {proposal.maintenanceCost || "₹6,50,000"}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Operations</span>
                  </div>
                </div>
              </div>

              {/* Milestone Payout Schedule */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                  Milestone Disbursement Schedule (Performance Linked)
                </h4>

                <div className="border border-neutral-200 dark:border-indigo-950 rounded-2xl overflow-hidden bg-white dark:bg-[#0b0e24]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 dark:bg-[#0e1230] text-neutral-500 font-semibold border-b border-neutral-200 dark:border-indigo-950">
                      <tr>
                        <th className="py-3 px-4">Milestone</th>
                        <th className="py-3 px-4">Deliverable & Acceptance Criteria</th>
                        <th className="py-3 px-4">Window</th>
                        <th className="py-3 px-4 text-right">Tranche Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-indigo-950/60">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                          Stage 1: Field Installation
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">
                          Gantry sensor nodes deployed and power/controller integration verified.
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-500">Day 0 - 30</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-right text-indigo-600 dark:text-indigo-400">
                          ₹4,50,000
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                          Stage 2: Telemetry Verification
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">
                          Continuous sensor heartbeat ≥98.5% uptime with queue reduction data streaming.
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-500">Day 31 - 60</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-right text-indigo-600 dark:text-indigo-400">
                          ₹5,00,000
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                          Stage 3: Final Outcome Sign-off
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">
                          Independent audit of corridor transit delay reduction and final handover dossier.
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-500">Day 61 - 90</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                          ₹3,30,000
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPLIANCE & RISKS */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              {/* Statutory Compliance Checklist */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200/80 dark:border-indigo-950/80 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                  Statutory Tender Compliance Verification
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#121638] border border-neutral-200/60 dark:border-indigo-950/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block">
                        GFR Rule 149(v) Exemption
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        Recognized DPIIT startup eligible for direct pilot procurement without turnover pre-conditions.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#121638] border border-neutral-200/60 dark:border-indigo-950/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block">
                        DPDP Act 2023 Sovereign Privacy
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        No facial recognition or citizen license plate numbers retained on servers.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#121638] border border-neutral-200/60 dark:border-indigo-950/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block">
                        Open API & Telemetry Handshake
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        Streams real-time metrics to State Integrated Command & Control Center (ICCC).
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#121638] border border-neutral-200/60 dark:border-indigo-950/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block">
                        Make in India Class-I Supplier
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        Local value addition exceeds 65% across firmware and assembly.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Government Pre-Requisites & Dependencies */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Government Pre-Requisites & Dependencies Required from Department</span>
                </span>
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-neutral-700 dark:text-neutral-300 space-y-2">
                  {proposal.governmentDependencies.map((dep, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{dep}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Startup Identified Risks & Mitigation */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                  Identified Operational Risks & Mitigation Plan
                </span>
                <div className="space-y-2">
                  {proposal.keyRisks.map((risk, i) => (
                    <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200/60 dark:border-indigo-950 text-xs flex items-center justify-between">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{risk}</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        Mitigation Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVALUATOR AUDIT & ACTIONS */}
          {activeTab === 'decision' && (
            <div className="space-y-6">
              {/* Detailed Scorecard Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200 dark:border-indigo-950">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                    Technical Architecture
                  </span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                    {proposal.technicalFitScore}%
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Weight: 40%</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200 dark:border-indigo-950">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                    Pilot Feasibility
                  </span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                    {proposal.pilotFeasibilityScore}%
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Weight: 30%</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200 dark:border-indigo-950">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                    Commercial Efficiency
                  </span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                    {proposal.commercialScore}%
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Weight: 20%</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200 dark:border-indigo-950">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                    Track Record
                  </span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                    {proposal.experienceScore}%
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Weight: 10%</span>
                </div>
              </div>

              {/* Officer Evaluation Notes */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-mono">
                    Evaluation Committee Notes & Endorsement
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Reviewing as: <strong className="text-neutral-900 dark:text-white">{currentUser?.name || "Er. Rajesh Kulkarni"}</strong>
                  </span>
                </div>

                <textarea
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Record formal committee observations, site clearance conditions, or notes regarding pilot gantry mounting..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-neutral-300 dark:border-indigo-950 bg-neutral-50 dark:bg-[#0f1335] text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-3.5 py-1.5 bg-neutral-900 dark:bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-neutral-800 transition"
                  >
                    Save Notes to Audit Trail
                  </button>
                  {notesSaved && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Notes logged in verification dossier
                    </span>
                  )}
                </div>
              </div>

              {/* Award Action Section */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-[#0b0e24] text-white border border-indigo-800/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase">
                      Official Action
                    </span>
                    <span className="text-xs text-indigo-300 font-mono">
                      Sanction Order Generation
                    </span>
                  </div>
                  <h4 className="text-lg font-black tracking-tight text-white">
                    Final Acceptance & Work Order Award
                  </h4>
                  <p className="text-xs text-neutral-300 max-w-lg">
                    Simulate pilot decision. This records a prototype decision for {proposal.startupName} and activates telemetry tracking.
                  </p>
                </div>

                {!isAwarded ? (
                  <button
                    type="button"
                    onClick={() => onOpenSanctionOrder(proposal)}
                    className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition flex items-center gap-2 whitespace-nowrap btn-exotic"
                  >
                    <Award className="w-4 h-4" />
                    <span>Issue Pilot Sanction Order</span>
                  </button>
                ) : (
                  <div className="px-4 py-3 bg-emerald-900/80 border border-emerald-600 text-emerald-200 rounded-xl text-xs font-mono font-bold">
                    Contract Awarded: {proposal.sanctionOrderNumber}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ADVERSARIAL AUDIT (DEVIL'S ADVOCATE - PHASE 3 AI) */}
          {activeTab === 'devil_advocate' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-rose-500/10 border border-amber-500/30 dark:border-amber-400/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-[9px] font-bold uppercase tracking-wider">
                      Phase 3 AI · Adversarial Reasoning
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Optimist vs. Skeptic Multi-Agent Audit
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                    Devil's Advocate Proposal Stress-Test
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl">
                    Dual-agent adversarial analysis that pits an advocate finding maximum public value against a rigorous skeptic exposing hidden implementation risks before final procurement sanction.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunDevilAdvocate}
                  disabled={isRunningDevilAdvocate}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition disabled:opacity-50 self-start md:self-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${isRunningDevilAdvocate ? 'animate-spin' : ''}`} />
                  <span>{isRunningDevilAdvocate ? 'Simulating Debate...' : devilAdvocateResult ? 'Re-Run Adversarial Audit' : 'Run Live Adversarial Audit'}</span>
                </button>
              </div>

              {devilAdvocateError && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{devilAdvocateError}</span>
                </div>
              )}

              {!devilAdvocateResult && !isRunningDevilAdvocate && (
                <div className="p-12 text-center border-2 border-dashed border-neutral-300 dark:border-indigo-950 rounded-2xl bg-neutral-50/50 dark:bg-[#07091b]/50">
                  <Scale className="w-12 h-12 mx-auto text-amber-500/60 mb-3" />
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    No Adversarial Simulation Generated Yet
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-5">
                    Click the button above to pit the Optimist Advocate against the Skeptic Auditor to test whether {proposal.startupName}'s proposal holds up to intense GFR scrutiny.
                  </p>
                  <button
                    type="button"
                    onClick={handleRunDevilAdvocate}
                    className="px-4 py-2 bg-neutral-900 dark:bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition"
                  >
                    Run Live Stress-Test Now
                  </button>
                </div>
              )}

              {isRunningDevilAdvocate && (
                <div className="p-12 text-center border border-indigo-200 dark:border-indigo-900 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20">
                  <RefreshCw className="w-10 h-10 mx-auto text-indigo-500 animate-spin mb-4" />
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Synthesizing Adversarial Perspectives...
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                    AI Optimist is evaluating technical upside while AI Skeptic reviews vendor capacity, cost escalation, and regulatory risks.
                  </p>
                </div>
              )}

              {devilAdvocateResult && (
                <div className="space-y-6">
                  {/* Two Column Grid: Optimist vs Skeptic */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* OPTIMIST VIEW */}
                    <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-mono flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            The Optimist Case (Advocate)
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-mono font-bold">
                          Confidence: {Math.round(devilAdvocateResult.optimist_view?.confidence_score * 100 || 88)}%
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#0b0e24]/70 border border-emerald-100 dark:border-emerald-950 text-xs text-neutral-800 dark:text-neutral-200 font-medium">
                        "{devilAdvocateResult.optimist_view?.approval_recommendation}"
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block font-mono">
                          Key Strengths & Merits Identified
                        </span>
                        <ul className="space-y-1.5">
                          {devilAdvocateResult.optimist_view?.strengths?.map((str, idx) => (
                            <li key={idx} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* SKEPTIC VIEW */}
                    <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                          <h4 className="text-sm font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 font-mono flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            The Skeptic Case (Devil's Advocate)
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-200/70 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-mono font-bold">
                          {devilAdvocateResult.skeptic_view?.risk_flags?.length || 0} Vulnerabilities
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#0b0e24]/70 border border-rose-100 dark:border-rose-950 text-xs text-neutral-800 dark:text-neutral-200 font-medium">
                        "{devilAdvocateResult.skeptic_view?.rejection_recommendation}"
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 block font-mono">
                          Crucial Risks & Reservations
                        </span>
                        <ul className="space-y-1.5">
                          {devilAdvocateResult.skeptic_view?.concerns?.map((concern, idx) => (
                            <li key={idx} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {devilAdvocateResult.skeptic_view?.risk_flags?.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {devilAdvocateResult.skeptic_view.risk_flags.map((flag, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                              🚩 {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* FINAL ARBITRATED JUDGMENT */}
                  <div className="p-6 rounded-2xl bg-neutral-900 dark:bg-[#0d112b] text-white border border-neutral-800 dark:border-indigo-900/80 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 dark:border-indigo-950 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                          AI Judicial Synthesis · Final Decision
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">
                          Arbitrated Procurement Recommendation
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono ${
                          devilAdvocateResult.final_judgment?.verdict === 'Approve'
                            ? 'bg-emerald-500 text-neutral-950'
                            : devilAdvocateResult.final_judgment?.verdict === 'Reject'
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-500 text-neutral-950'
                        }`}>
                          Verdict: {devilAdvocateResult.final_judgment?.verdict || 'Request_Revision'}
                        </span>
                        <span className="text-xs font-mono text-neutral-300">
                          Confidence: {devilAdvocateResult.final_judgment?.confidence_percentage || 85}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-2 p-3.5 rounded-xl bg-neutral-800/60 dark:bg-[#070918]/60 border border-neutral-700/60 dark:border-indigo-950">
                        <span className="text-[10px] font-mono font-bold uppercase text-indigo-300 block">
                          Key Decision Factors
                        </span>
                        <ul className="space-y-1 text-neutral-300">
                          {devilAdvocateResult.final_judgment?.key_decision_factors?.map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-indigo-400 font-mono">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 p-3.5 rounded-xl bg-neutral-800/60 dark:bg-[#070918]/60 border border-neutral-700/60 dark:border-indigo-950">
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-300 block">
                          Conditions for Approval
                        </span>
                        <ul className="space-y-1 text-neutral-300">
                          {devilAdvocateResult.final_judgment?.conditions_for_approval?.map((c, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-mono">✓</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 p-3.5 rounded-xl bg-neutral-800/60 dark:bg-[#070918]/60 border border-neutral-700/60 dark:border-indigo-950">
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-300 block">
                          Mandatory Mitigations
                        </span>
                        <ul className="space-y-1 text-neutral-300">
                          {devilAdvocateResult.final_judgment?.mitigation_requirements?.map((m, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-400 font-mono">!</span>
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-100 dark:bg-[#060814] border-t border-neutral-200 dark:border-indigo-950/80 flex items-center justify-between text-xs text-neutral-500">
          <span className="font-mono text-[11px]">
            ProcureX Government Workspace · Prototype / illustrative data
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-neutral-300 dark:border-indigo-900 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-white dark:hover:bg-[#101435] transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
