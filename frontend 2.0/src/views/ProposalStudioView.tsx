import React, { useState, useEffect } from 'react';
import { Proposal, Challenge, AppView, AuthUser } from '../types';
import { storage, safeStorage } from '../utils/storage';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Eye, 
  Check, 
  ShieldCheck, 
  Lock, 
  FileCheck2, 
  Sparkles, 
  ChevronDown 
} from 'lucide-react';
import { 
  analyzeDocument, 
  AnalyzeDocumentResponse, 
  optimizeBudget, 
  OptimizeBudgetResponse 
} from '../utils/api';

interface ProposalStudioViewProps {
  selectedChallenge?: Challenge | null;
  challenges?: Challenge[];
  currentUser?: AuthUser | null;
  onNavigate: (view: AppView) => void;
  onSubmitProposal: (proposal: Proposal) => void;
}

export const ProposalStudioView: React.FC<ProposalStudioViewProps> = ({
  selectedChallenge: propChallenge,
  challenges: propChallenges,
  currentUser,
  onNavigate,
  onSubmitProposal
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);

  // Available challenges
  const allChallenges = propChallenges || storage.getChallenges();
  
  // Selected challenge state
  const [targetChallengeId, setTargetChallengeId] = useState<string>(() => {
    return propChallenge?.id || allChallenges[0]?.id || "PX-KA-2026-00124";
  });

  const activeChallenge = allChallenges.find(c => c.id === targetChallengeId) || propChallenge || allChallenges[0];

  // Active user data for "Ask Once. Reuse Everywhere"
  const activeUser = currentUser || storage.getUser();

  // Restore saved draft if user previously entered content
  const savedDraft = (() => {
    try {
      const item = safeStorage.getItem('procurex_proposal_draft');
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  })();

  // Proposal Form State
  const [solutionName, setSolutionName] = useState(savedDraft?.solutionName || "");
  const [solutionSummary, setSolutionSummary] = useState(savedDraft?.solutionSummary || "");
  const [technicalArchitecture, setTechnicalArchitecture] = useState(savedDraft?.technicalArchitecture || "");
  const [commercialTotal, setCommercialTotal] = useState(savedDraft?.commercialTotal || "");
  const [pilotCost, setPilotCost] = useState(savedDraft?.pilotCost || "");
  const [hardwareCost, setHardwareCost] = useState(savedDraft?.hardwareCost || "");
  const [maintenanceCost, setMaintenanceCost] = useState(savedDraft?.maintenanceCost || "");
  const [timelineMonths, setTimelineMonths] = useState(savedDraft?.timelineMonths || "");
  const [teamSize, setTeamSize] = useState<number>(savedDraft?.teamSize || 0);
  const [keyPersonnel, setKeyPersonnel] = useState(savedDraft?.keyPersonnel || activeUser?.responsiblePerson || "");
  const [priorExperience, setPriorExperience] = useState(savedDraft?.priorExperience || activeUser?.trackRecord || "");
  const [pilotLocations, setPilotLocations] = useState(savedDraft?.pilotLocations || "");
  const [projectedImpact, setProjectedImpact] = useState(savedDraft?.projectedImpact || "");
  const [evidenceAttachments] = useState([
    "DPIIT Recognition Certificate",
    "Technical Feasibility & Field Audit Report",
    "ISO 27001 Data Privacy & Zero-PII Video Architecture Affidavit"
  ]);
  const [dependencies, setDependencies] = useState(savedDraft?.dependencies || "");

  // AI Pre-Audit State
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  const [docAnalysis, setDocAnalysis] = useState<AnalyzeDocumentResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyzeProposal = async () => {
    const textToAnalyze = `${solutionName ? 'Solution: ' + solutionName + '\n' : ''}${solutionSummary ? 'Summary: ' + solutionSummary + '\n' : ''}${technicalArchitecture ? 'Architecture: ' + technicalArchitecture : ''}`;
    if (!textToAnalyze.trim()) {
      alert('Please enter a solution summary or technical architecture before running the pre-audit.');
      return;
    }
    setIsAnalyzingDoc(true);
    setAnalysisError(null);
    try {
      const res = await analyzeDocument(textToAnalyze);
      setDocAnalysis(res);
    } catch (err: any) {
      console.warn('AI document analysis failed:', err);
      setAnalysisError(err.message || 'AI document analysis offline.');
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  // AI Spend Optimization State
  const [isOptimizingBudget, setIsOptimizingBudget] = useState(false);
  const [budgetAdvice, setBudgetAdvice] = useState<OptimizeBudgetResponse | null>(null);

  const handleOptimizeSpend = async () => {
    setIsOptimizingBudget(true);
    try {
      const res = await optimizeBudget({
        budget: commercialTotal || activeChallenge.pilotBudget || '₹30,00,000',
        pilotCost: pilotCost || '₹10,00,000',
        hardwareCost: hardwareCost || '₹12,00,000',
        domain: activeChallenge.sector || 'Civic Infrastructure'
      });
      setBudgetAdvice(res);
    } catch (err: any) {
      console.warn('Budget optimization failed:', err);
    } finally {
      setIsOptimizingBudget(false);
    }
  };

  // Autosave to browser storage on change
  useEffect(() => {
    const draft = {
      targetChallengeId,
      solutionName, solutionSummary, technicalArchitecture, commercialTotal,
      pilotCost, hardwareCost, maintenanceCost, timelineMonths, teamSize,
      keyPersonnel, priorExperience, pilotLocations, projectedImpact, dependencies,
      savedAt: new Date().toISOString()
    };
    try {
      safeStorage.setItem('procurex_proposal_draft', JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [targetChallengeId, solutionName, solutionSummary, technicalArchitecture, commercialTotal, pilotCost, hardwareCost, maintenanceCost, timelineMonths, teamSize, keyPersonnel, priorExperience, pilotLocations, projectedImpact, dependencies]);

  const steps = [
    "Solution",
    "Approach",
    "Commercial",
    "Timeline",
    "Experience",
    "Pilot",
    "Impact",
    "Evidence",
    "Review"
  ];

  const handleSaveDraft = () => {
    setDraftSavedMessage("Dossier draft autosaved securely.");
    setTimeout(() => setDraftSavedMessage(null), 3000);
  };

  const handleFillSample = () => {
    setSolutionName("AdaptiveFlow Edge Junction Engine (v3.2)");
    setSolutionSummary("On-edge computer vision sensor nodes interfacing with RS-232 / Ethernet traffic signal controllers. Computes queue length and real-time vehicle dwell times with sub-second latency to dynamically adjust green signal splits.");
    setTechnicalArchitecture("NVIDIA Jetson Orin Nano edge inference units deployed inside waterproof IP67 gantry enclosures. Dual-redundant 5G/4G failover modems streaming encrypted aggregated telemetry to municipal dashboard. Zero PII stored or transmitted.");
    setCommercialTotal("₹28,50,000");
    setPilotCost("₹12,80,000");
    setHardwareCost("₹9,20,000");
    setMaintenanceCost("₹6,50,000");
    setTimelineMonths("5 Months");
    setTeamSize(6);
    setKeyPersonnel(activeUser?.responsiblePerson || "Dr. Vikram Sethi (Lead Edge AI Architect), Priya Sharma (Traffic Systems Engineer), 3 Field Technicians");
    setPriorExperience("14 field deployments across Karnataka and Maharashtra. Whitefield ITPL corridor pilot achieved 14% congestion dwell reduction over 90 consecutive days.");
    setPilotLocations("Outer Ring Road Corridor: Marathahalli Junction, Bellandur Intersection, and Kadubeesanahalli Signal (8 Nodes total)");
    setProjectedImpact("Targeting ≥15% decrease in mean queue dwell time during rush hours; prioritized transit lane green clearance for city buses.");
    setDependencies("Access to existing traffic controller signal cabinets for RS-232 communication; permission for nighttime gantry mounting window.");
    setDraftSavedMessage("Sample technical parameters populated.");
    setTimeout(() => setDraftSavedMessage(null), 2500);
  };

  const handleFinalSubmit = () => {
    const startupName = activeUser?.startupName || (solutionName ? `${solutionName.split(' ')[0]} Labs` : "Innovator Tech");
    const startupId = activeUser?.startupId || activeUser?.id || "s1";
    
    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      challengeId: activeChallenge.id,
      challengeTitle: activeChallenge.title,
      startupId: startupId,
      startupName: startupName,
      proposedBudget: commercialTotal || "₹28,50,000",
      pilotCost: pilotCost || "₹12,80,000",
      timelineMonths: timelineMonths || "5 Months",
      technicalFitScore: 96,
      pilotFeasibilityScore: 94,
      experienceScore: 92,
      commercialScore: 88,
      overallScore: 92.5,
      rank: 1,
      status: "Submitted",
      solutionName: solutionName || "AI-Adaptive Public Infrastructure Engine",
      solutionSummary: solutionSummary || "High-performance edge compute sensor nodes deployed at designated public nodes.",
      hardwareCost: hardwareCost || "₹9,20,000",
      maintenanceCost: maintenanceCost || "₹6,50,000",
      teamSize: teamSize || 5,
      keyPersonnel: keyPersonnel || "Lead Architect, Firmware Engineer, Field Instrumentation Specialist",
      priorExperience: priorExperience || "Multiple deployments across state municipal testbeds.",
      pilotLocations: pilotLocations || "Designated Municipal Ward & Corridor Junctions",
      projectedImpact: projectedImpact || "≥15% metric improvement verified over 90 days",
      dpiitNumber: activeUser?.dpiitNumber || "DPIIT-KA-2022-8419",
      contactEmail: activeUser?.email || "founder@startup.gov.in",
      solutionArchitecture: technicalArchitecture || "On-edge neural inference architecture with zero PII retention",
      pilotDeliverables: `Sensor nodes across ${pilotLocations || 'designated corridor'}. Real-time signal split interfacing and telemetry audits.`,
      governmentDependencies: [dependencies || 'Access to traffic controller junction boxes'],
      keyRisks: ["Monsoon optical splash (mitigated by hydrophobic nano-coating)", "Unplanned grid outages (mitigated by battery backup)"],
      evidencePointers: evidenceAttachments,
      submittedAt: new Date().toISOString().split('T')[0]
    };

    storage.addProposal(newProposal);
    onSubmitProposal(newProposal);
    try {
      safeStorage.removeItem('procurex_proposal_draft');
    } catch {
      // ignore
    }
    onNavigate('startup_portal');
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC] transition-colors py-8 px-4 sm:px-6 lg:px-10 selection:bg-[#087C78] selection:text-white arch-grid-bg">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('startup_portal')}
              className="inline-flex items-center gap-1.5 text-xs text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white mb-2 transition font-mono uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Startup Workspace</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-[#111416] dark:text-white uppercase font-sans">
                Proposal Studio (9-Step Dossier)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#087C78]/15 text-[#087C78] dark:text-[#0AA39F]">
                GFR 149(v)
              </span>
            </div>
            
            {/* Target Challenge Selector */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-[#596166] dark:text-[#949DA3] font-mono uppercase">Target Challenge:</span>
              <select
                value={targetChallengeId}
                onChange={(e) => setTargetChallengeId(e.target.value)}
                className="py-1 px-2.5 bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-lg text-xs font-semibold text-[#111416] dark:text-white max-w-md truncate"
              >
                {allChallenges.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleFillSample}
              className="px-3 py-1.5 border border-dashed border-[#087C78] text-[#087C78] dark:text-[#0AA39F] rounded-lg text-xs font-mono uppercase font-bold hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Sample Data</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="px-3 py-1.5 border border-[#E2DFD7] dark:border-[#2E3844] rounded-lg text-xs font-mono uppercase font-bold hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition flex items-center gap-1.5 text-[#111416] dark:text-white"
            >
              <Eye className="w-3.5 h-3.5 text-[#596166]" />
              <span>{isPreviewMode ? 'Exit Preview' : 'Document Preview'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-1.5 border border-[#E2DFD7] dark:border-[#2E3844] rounded-lg text-xs font-mono uppercase font-bold hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition flex items-center gap-1.5 text-[#111416] dark:text-white"
            >
              <Save className="w-3.5 h-3.5 text-[#596166]" />
              <span>Save Draft</span>
            </button>

            {draftSavedMessage && (
              <span className="text-xs text-emerald-600 font-mono">{draftSavedMessage}</span>
            )}
          </div>
        </div>

        {/* Persistent 9-Step Navigation Rail */}
        <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl p-3 shadow-xs overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[700px] gap-1 text-xs">
            {steps.map((st, idx) => {
              const isCurrent = currentStepIdx === idx;
              const isPast = currentStepIdx > idx;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-center transition font-mono uppercase text-xs ${
                    isCurrent
                      ? 'bg-[#111416] dark:bg-[#087C78] text-white'
                      : isPast
                      ? 'bg-[#ECEAE4] text-[#111416] dark:bg-[#1E2630] dark:text-[#E5E3DD]'
                      : 'text-[#596166] dark:text-[#949DA3] hover:text-[#111416]'
                  }`}
                >
                  <span className="text-[10px] opacity-70">0{idx + 1}.</span>
                  <span>{st}</span>
                  {isPast && <Check className="w-3 h-3 text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Document Builder vs Preview Mode */}
        {!isPreviewMode ? (
          <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Step 0: Solution */}
            {currentStepIdx === 0 && (
              <div className="space-y-4">
                <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                  <h3 className="text-base font-bold text-[#111416] dark:text-white uppercase font-mono">
                    01 · Solution Overview
                  </h3>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Specific product capability that directly addresses the problem statement.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111416] dark:text-white">
                    Proprietary Solution Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AdaptiveFlow Junction Engine (v3.2)"
                    value={solutionName}
                    onChange={(e) => setSolutionName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111416] dark:text-white">
                    Executive Solution Summary *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe how your solution resolves the department challenge (e.g. Optical edge-processing gantry units computing real-time queue density...)"
                    value={solutionSummary}
                    onChange={(e) => setSolutionSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127]"
                  />
                </div>
              </div>
            )}

            {/* Step 1: Approach */}
            {currentStepIdx === 1 && (
              <div className="space-y-4">
                <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                  <h3 className="text-base font-bold text-[#111416] dark:text-white uppercase font-mono">
                    02 · Technical Approach & Architecture
                  </h3>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Explain the edge hardware, signal integration protocols, and privacy standards.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111416] dark:text-white">
                    Architecture & Protocol Implementation *
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Describe hardware sensors, computing units, telemetry, and encrypted municipal integration protocols..."
                    value={technicalArchitecture}
                    onChange={(e) => setTechnicalArchitecture(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] leading-relaxed"
                  />
                </div>

                <div className="p-4 rounded-lg bg-[#F4F2EC]/80 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] text-xs text-[#596166] dark:text-[#949DA3]">
                  <strong className="block text-[#111416] dark:text-white mb-1">
                    Privacy Guarantee:
                  </strong>
                  All optical streams remain strictly processed on the edge gantry with zero facial or license plate PII storage.
                </div>

                {/* AI Document Pre-Audit Action */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#E2DFD7] dark:border-[#232B34]">
                  <span className="text-[10px] text-[#596166] dark:text-[#949DA3] font-mono">
                    AI Pre-Audit ensures technical specs meet GFR Gantry & Telemetry standards.
                  </span>
                  <button
                    type="button"
                    onClick={handleAnalyzeProposal}
                    disabled={isAnalyzingDoc || (!technicalArchitecture && !solutionSummary)}
                    className="px-3 py-1.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:border-[#087C78] text-xs font-mono font-bold uppercase text-[#087C78] dark:text-[#0AA39F] flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingDoc ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzingDoc ? 'Running Audit...' : 'Run AI Pre-Audit'}</span>
                  </button>
                </div>

                {analysisError && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                    {analysisError}
                  </div>
                )}

                {/* AI Document Analysis Results */}
                {docAnalysis && docAnalysis.analysis && (
                  <div className="p-4 rounded-xl bg-white dark:bg-[#16191D] border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                          AI Document Extraction ({docAnalysis.mode === 'live' ? 'Live AI Model' : 'Deterministic Engine'})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                        {docAnalysis.analysis.document_type || 'Audited'}
                      </span>
                    </div>

                    {docAnalysis.analysis.technology_stack && docAnalysis.analysis.technology_stack.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#596166] dark:text-[#949DA3] block mb-1">
                          Detected Tech Stack:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {docAnalysis.analysis.technology_stack.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[11px] font-mono text-[#111416] dark:text-white">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {docAnalysis.analysis.potential_gaps && docAnalysis.analysis.potential_gaps.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                        <span className="font-bold font-mono text-[10px] uppercase block">Areas for Elaboration Before Submission:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {docAnalysis.analysis.potential_gaps.map((gap, idx) => (
                            <li key={idx}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {docAnalysis.analysis.verification_note && (
                      <p className="text-[11px] text-[#596166] dark:text-[#949DA3] italic">
                        {docAnalysis.analysis.verification_note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Commercial */}
            {currentStepIdx === 2 && (
              <div className="space-y-4">
                <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                  <h3 className="text-base font-bold text-[#111416] dark:text-white uppercase font-mono">
                    03 · Commercial Proposal Breakdown
                  </h3>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Provide pricing within the challenge budget envelope ({activeChallenge.pilotBudget || activeChallenge.estimatedBudget}).
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#111416] dark:text-white">
                      Total Quotation *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹28,50,000"
                      value={commercialTotal}
                      onChange={(e) => setCommercialTotal(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] font-mono font-bold text-[#087C78] dark:text-[#0AA39F]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#111416] dark:text-white">
                      Pilot Phase Cost
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹12,80,000"
                      value={pilotCost}
                      onChange={(e) => setPilotCost(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#111416] dark:text-white">
                      Hardware Instrumentation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹9,20,000"
                      value={hardwareCost}
                      onChange={(e) => setHardwareCost(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#111416] dark:text-white">
                      Operations / Warranty
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹6,50,000"
                      value={maintenanceCost}
                      onChange={(e) => setMaintenanceCost(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[10px] text-[#596166] dark:text-[#949DA3] font-mono">
                    Target Envelope: {activeChallenge.pilotBudget || activeChallenge.estimatedBudget}
                  </span>
                  <button
                    type="button"
                    onClick={handleOptimizeSpend}
                    disabled={isOptimizingBudget}
                    className="px-3 py-1.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] hover:border-[#087C78] text-xs font-mono font-bold uppercase text-[#087C78] dark:text-[#0AA39F] flex items-center gap-1.5 transition self-start sm:self-auto"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isOptimizingBudget ? 'animate-spin' : ''}`} />
                    <span>{isOptimizingBudget ? 'Benchmarking...' : 'AI Spend Benchmarking'}</span>
                  </button>
                </div>

                {budgetAdvice && (
                  <div className="p-4 rounded-xl bg-white dark:bg-[#16191D] border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 uppercase text-[10px]">
                        AI Commercial Benchmarking ({budgetAdvice.mode === 'live' ? 'Live AI' : 'Rule Engine'})
                      </span>
                      {budgetAdvice.cost_overrun_risk && (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          Overrun Risk: {budgetAdvice.cost_overrun_risk}
                        </span>
                      )}
                    </div>
                    {budgetAdvice.suggested_budget_range && (
                      <div className="text-[11px] text-[#111416] dark:text-white font-mono">
                        Optimal Market Range: {budgetAdvice.suggested_budget_range.min_inr} – {budgetAdvice.suggested_budget_range.max_inr} (Median: {budgetAdvice.suggested_budget_range.optimal_inr})
                      </div>
                    )}
                    {budgetAdvice.potential_savings_percentage > 0 && (
                      <div className="text-[11px] text-emerald-600 font-semibold">
                        Potential Efficiency Optimization: {budgetAdvice.potential_savings_percentage}%
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Your commercial submission is encrypted and confidential during double-blind evaluation.</span>
                </div>
              </div>
            )}

            {/* Step 3: Timeline */}
            {currentStepIdx === 3 && (
              <div className="space-y-4">
                <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                  <h3 className="text-base font-bold text-[#111416] dark:text-white uppercase font-mono">
                    04 · Delivery Timeline & Resource Allocation
                  </h3>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Commitment to field schedule and milestones.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#111416] dark:text-white">
                      Total Timeline Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Months"
                      value={timelineMonths}
                      onChange={(e) => setTimelineMonths(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#111416] dark:text-white">
                      Dedicated Engineering Team Size
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 6"
                      value={teamSize || ""}
                      onChange={(e) => setTeamSize(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111416] dark:text-white">
                    Key Technical Personnel
                  </label>
                  <textarea
                    rows={3}
                    placeholder="List the key leads (e.g. Edge AI Architect, Firmware Engineer, Field Deployment Specialist)..."
                    value={keyPersonnel}
                    onChange={(e) => setKeyPersonnel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127]"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Experience */}
            {currentStepIdx === 4 && (
              <div className="space-y-4">
                <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                  <h3 className="text-base font-bold text-[#111416] dark:text-white uppercase font-mono">
                    05 · Prior Field Deployments & Track Record
                  </h3>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Demonstrate readiness through previous pilot validations or academic testing.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111416] dark:text-white">
                    Field Deployments & Evidence
                  </label>
                  <textarea
                    rows={5}
                    placeholder="List previous deployments, trials, certifications, or prototype demonstrations..."
                    value={priorExperience}
                    onChange={(e) => setPriorExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Pilot Plan */}
            {currentStepIdx === 5 && (
              <div className="space-y-4">
                <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                  <h3 className="text-base font-bold text-[#111416] dark:text-white uppercase font-mono">
                    06 · Pilot Deployment Plan
                  </h3>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Location readiness and government dependencies.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111416] dark:text-white">
                    Target Deployment Locations
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Outer Ring Road Corridor (Bellandur, Marathahalli junctions)"
                    value={pilotLocations}
                    onChange={(e) => setPilotLocations(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111416] dark:text-white">
                    Required Government Dependencies & Permissions
                  </label>
                  <textarea
                    rows={4}
                    placeholder="List specific access requirements (e.g. permission to mount sensor bracket, connection to 230V street light pole power, etc.)..."
                    value={dependencies}
                    onChange={(e) => setDependencies(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127]"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Impact */}
            {currentStepIdx === 6 && (
              <div className="space-y-4">
                <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                  <h3 className="text-base font-bold text-[#111416] dark:text-white uppercase font-mono">
                    07 · Measurable Civic Impact & KPIs
                  </h3>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Quantifiable outcomes to be audited by government sensors.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111416] dark:text-white">
                    Projected KPI Improvements
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Specify target metric deltas (e.g. ≥15% reduction in signal queue dwell time, 99.5% uptime telemetry streaming)..."
                    value={projectedImpact}
                    onChange={(e) => setProjectedImpact(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Step 7: Evidence */}
            {currentStepIdx === 7 && (
              <div className="space-y-4">
                <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                  <h3 className="text-base font-bold text-[#111416] dark:text-white uppercase font-mono">
                    08 · Statutory Documents & Evidence
                  </h3>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Required filings under DPIIT public procurement relaxation.
                  </p>
                </div>

                <div className="space-y-2">
                  {evidenceAttachments.map((att, i) => (
                    <div key={i} className="p-3.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#087C78]" />
                        <span className="font-semibold text-[#111416] dark:text-white">{att}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        VERIFIED & ATTACHED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8: Review */}
            {currentStepIdx === 8 && (
              <div className="space-y-5">
                <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                  <h3 className="text-base font-bold text-[#111416] dark:text-white uppercase font-mono">
                    09 · Final Review & Statutory Submission
                  </h3>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Verify all parameters before transmitting your proposal to the government authority.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#596166]">Target Challenge:</span>
                    <span className="font-bold text-[#111416] dark:text-white">{activeChallenge.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#596166]">Solution Name:</span>
                    <span className="font-bold text-[#111416] dark:text-white">{solutionName || "AdaptiveFlow"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#596166]">Commercial Quotation:</span>
                    <span className="font-bold text-[#087C78] dark:text-[#0AA39F]">{commercialTotal || "₹28,50,000"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#596166]">Pilot Duration:</span>
                    <span className="text-[#111416] dark:text-white">{timelineMonths || "5 Months"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#596166]">DPIIT Recognition:</span>
                    <span className="text-[#111416] dark:text-white">{activeUser?.dpiitNumber || "DPIIT-2026"}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-[#087C78]/30 bg-[#087C78]/10 text-xs text-[#111416] dark:text-white">
                  <strong>Statutory Declaration:</strong> By clicking submit, you certify that all technical specs and commercial rates are valid for 180 days under GFR Rule 149(v).
                </div>
              </div>
            )}

            {/* Stepper Controls */}
            <div className="pt-4 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-between">
              <button
                type="button"
                disabled={currentStepIdx === 0}
                onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 border border-[#E2DFD7] dark:border-[#2E3844] rounded-lg text-xs font-mono uppercase font-bold text-[#596166] hover:text-[#111416] disabled:opacity-30 disabled:pointer-events-none"
              >
                ← Previous
              </button>

              {currentStepIdx < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-4 py-2 bg-[#111416] dark:bg-[#087C78] text-white rounded-lg text-xs font-mono uppercase font-bold hover:bg-[#23465A] flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-5 py-2.5 bg-[#087C78] hover:bg-[#0AA39F] text-white text-xs font-mono uppercase font-bold rounded-lg flex items-center gap-2 shadow-xs transition"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Submit Formal Proposal Dossier</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Document Preview Mode */
          <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl p-8 sm:p-12 shadow-xs space-y-8 max-w-4xl mx-auto">
            <div className="border-b border-[#E2DFD7] dark:border-[#232B34] pb-6 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  PROCUREX OFFICIAL DOSSIER · GFR 149(v) SUBMISSION
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111416] dark:text-white mt-1 uppercase font-sans">
                  {solutionName || "Proprietary Civic Innovation Solution"}
                </h2>
                <span className="text-xs text-[#596166] dark:text-[#949DA3] block font-mono">
                  Responding to: {activeChallenge.title} ({activeChallenge.id})
                </span>
              </div>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#087C78]/15 text-[#087C78] dark:text-[#0AA39F] font-mono">
                {commercialTotal || "₹28,50,000"}
              </span>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-[#111416] dark:text-[#E5E3DD] leading-relaxed">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#596166] dark:text-[#949DA3] mb-1 font-mono">
                  1. Executive Solution Summary
                </h4>
                <p>{solutionSummary || "Comprehensive edge compute solution."}</p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#596166] dark:text-[#949DA3] mb-1 font-mono">
                  2. Technical Architecture
                </h4>
                <p>{technicalArchitecture || "Edge compute inference units."}</p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#596166] dark:text-[#949DA3] mb-1 font-mono">
                  3. Commercial Breakdown
                </h4>
                <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-[#F4F2EC]/80 dark:bg-[#1C2127] font-mono text-xs">
                  <div>Pilot Phase: <strong>{pilotCost || "₹12,80,000"}</strong></div>
                  <div>Hardware: <strong>{hardwareCost || "₹9,20,000"}</strong></div>
                  <div>Operations: <strong>{maintenanceCost || "₹6,50,000"}</strong></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#596166] dark:text-[#949DA3] mb-1 font-mono">
                  4. Field Deployment & Location
                </h4>
                <p>{pilotLocations || "Designated Municipal Ward & Corridor Junctions"}</p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#596166] dark:text-[#949DA3] mb-1 font-mono">
                  5. Anticipated Impact & KPIs
                </h4>
                <p>{projectedImpact || "≥15% metric improvement verified over 90 days"}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2DFD7] dark:border-[#232B34] flex justify-end">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="px-5 py-2 text-xs font-mono uppercase font-bold rounded-lg bg-[#111416] text-white dark:bg-[#087C78]"
              >
                Back to Document Editor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
