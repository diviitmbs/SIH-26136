import React, { useState, useEffect } from 'react';
import { Challenge, AppView } from '../types';
import { storage, safeStorage } from '../utils/storage';
import { 
  structureChallenge, 
  optimizeBudget, 
  predictRisks, 
  predictTimeline, 
  forecastImpact, 
  OptimizeBudgetResponse,
  PredictRisksResponse,
  PredictTimelineResponse,
  generateRFP,
  GenerateRFPResponse,
  matchSchemes,
  MatchSchemesResponse
} from "../utils/api";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  FileCheck,
  Sparkles,
  DollarSign,
  Calendar,
  Clock,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Info,
  Layers,
  HelpCircle,
  FileText,
  Download,
  Check,
  ExternalLink,
  RefreshCw,
  X
} from 'lucide-react';

interface ChallengeBuilderViewProps {
  onChallengeCreated: (newChallenge: Challenge) => void;
  onNavigate: (view: AppView) => void;
}

export const ChallengeBuilderView: React.FC<ChallengeBuilderViewProps> = ({
  onChallengeCreated,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);

  const activeUser = storage.getUser();

  // Restore saved draft if user previously entered content
  const savedDraft = (() => {
    try {
      const item = safeStorage.getItem('procurex_challenge_draft');
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  })();

  // Form State - Clean, empty initial values by default (no hard-coded pre-fills)
  const [title, setTitle] = useState(savedDraft?.title || "");
  const [department, setDepartment] = useState(savedDraft?.department || activeUser?.department || "");
  const [priority, setPriority] = useState<"High" | "Medium" | "Critical">(savedDraft?.priority || "High");
  const [sector, setSector] = useState(savedDraft?.sector || "Urban Mobility & Traffic Optimization");
  const [state, setState] = useState(savedDraft?.state || activeUser?.state || "");
  const [city, setCity] = useState(savedDraft?.city || activeUser?.city || "");
  const [district, setDistrict] = useState(savedDraft?.district || "");
  const [jurisdiction, setJurisdiction] = useState(savedDraft?.jurisdiction || "");
  const [problemDescription, setProblemDescription] = useState(savedDraft?.problemDescription || "");
  const [currentSituation, setCurrentSituation] = useState(savedDraft?.currentSituation || "");
  const [desiredOutcome, setDesiredOutcome] = useState(savedDraft?.desiredOutcome || "");
  
  // Professional Budget Builder
  const [budgetAmount, setBudgetAmount] = useState<string>(savedDraft?.budgetAmount || "");
  const [budgetUnit, setBudgetUnit] = useState<string>(savedDraft?.budgetUnit || "Lakhs");
  const [customBudget, setCustomBudget] = useState<string>(savedDraft?.customBudget || "");

  // Flexible Pilot Duration
  const [pilotDurationMode, setPilotDurationMode] = useState<string>(savedDraft?.pilotDurationMode || "3 Months");
  const [customPilotDuration, setCustomPilotDuration] = useState<string>(savedDraft?.customPilotDuration || "");

  // Flexible Response Window (1 day, 2 days, 3 days, etc. or custom days)
  const [responseDaysPreset, setResponseDaysPreset] = useState<number | 'custom'>(savedDraft?.responseDaysPreset ?? 14);
  const [customDays, setCustomDays] = useState<string>(savedDraft?.customDays || "");

  const [technologies, setTechnologies] = useState<string[]>(savedDraft?.technologies || []);
  const [successCriteria, setSuccessCriteria] = useState(savedDraft?.successCriteria || "");

  // Real Backend AI Integration States
  const [isAiStructuring, setIsAiStructuring] = useState<boolean>(false);
  const [aiStructureMode, setAiStructureMode] = useState<'live' | 'demo' | null>(null);
  const [aiRefinementQuestions, setAiRefinementQuestions] = useState<string[]>([]);
  const [aiRisks, setAiRisks] = useState<Array<{ risk: string; mitigation: string }>>([]);
  const [aiBudgetInfo, setAiBudgetInfo] = useState<OptimizeBudgetResponse | null>(null);
  const [isAiBudgeting, setIsAiBudgeting] = useState<boolean>(false);
  const [aiErrorNotice, setAiErrorNotice] = useState<string | null>(null);

  // Phase 3 AI: RFP Generator State
  const [isGeneratingRfp, setIsGeneratingRfp] = useState<boolean>(false);
  const [rfpResult, setRfpResult] = useState<GenerateRFPResponse | null>(null);
  const [rfpError, setRfpError] = useState<string | null>(null);
  const [showRfpModal, setShowRfpModal] = useState<boolean>(false);
  const [copiedRfp, setCopiedRfp] = useState<boolean>(false);

  // Phase 3 AI: Scheme Matcher State
  const [isMatchingSchemes, setIsMatchingSchemes] = useState<boolean>(false);
  const [schemesResult, setSchemesResult] = useState<MatchSchemesResponse | null>(null);
  const [schemesError, setSchemesError] = useState<string | null>(null);
  const [showSchemesModal, setShowSchemesModal] = useState<boolean>(false);

  const handleGenerateRFP = async () => {
    setIsGeneratingRfp(true);
    setRfpError(null);
    try {
      const res = await generateRFP({
        title: title || 'Municipal AI Procurement Challenge',
        department: department || 'Urban Infrastructure Department',
        sector: sector || 'Urban Mobility & Traffic Optimization',
        problemDescription: problemDescription || 'Public procurement tender for computer vision and civic technology deployment',
        budget: computedBudget,
        timeline: computedPilotDuration
      });
      setRfpResult(res);
      setShowRfpModal(true);
    } catch (err: any) {
      console.warn("RFP generation failed:", err);
      setRfpError(err.message || 'RFP generation failed.');
    } finally {
      setIsGeneratingRfp(false);
    }
  };

  const handleMatchSchemes = async () => {
    setIsMatchingSchemes(true);
    setSchemesError(null);
    try {
      const res = await matchSchemes({
        title: title || 'Civic Infrastructure Initiative',
        domain: sector || 'infrastructure',
        state: state || 'Maharashtra',
        city: city || 'Mumbai',
        budget: computedBudget
      });
      setSchemesResult(res);
      setShowSchemesModal(true);
    } catch (err: any) {
      console.warn("Scheme matching failed:", err);
      setSchemesError(err.message || 'Scheme matching failed.');
    } finally {
      setIsMatchingSchemes(false);
    }
  };

  const handleCopyRfp = () => {
    if (!rfpResult) return;
    const text = `=====================================================
${rfpResult.rfp_title}
RFP ID: ${rfpResult.rfp_id}
Submission Deadline: ${rfpResult.submission_deadline}
=====================================================

EXECUTIVE SUMMARY:
${rfpResult.executive_summary}

TECHNICAL SPECIFICATIONS:
${rfpResult.technical_specifications.map((s, i) => `${i + 1}. ${s}`).join('\n')}

ELIGIBILITY CRITERIA:
${rfpResult.eligibility_criteria.map(c => `• [${c.mandatory ? 'MANDATORY' : 'OPTIONAL'}] ${c.criterion} (Weight: ${c.weight_percentage}%)`).join('\n')}

EVALUATION WEIGHTAGE:
• Technical: ${rfpResult.evaluation_weightage.technical}%
• Financial: ${rfpResult.evaluation_weightage.financial}%
• Experience: ${rfpResult.evaluation_weightage.experience}%

MANDATORY DOCUMENTS REQUIRED:
${rfpResult.mandatory_documents.map(d => `• ${d}`).join('\n')}

GENERAL TERMS & CONDITIONS (GFR 2017):
${rfpResult.general_terms_conditions.map((t, i) => `${i + 1}. ${t}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedRfp(true);
    setTimeout(() => setCopiedRfp(false), 3000);
  };

  // Derived Values
  const computedBudget = budgetUnit === 'Custom' 
    ? (customBudget || "₹0")
    : budgetAmount 
      ? `₹${budgetAmount} ${budgetUnit}` 
      : "To be decided";

  const computedPilotDuration = pilotDurationMode === 'Custom'
    ? (customPilotDuration || "Custom Duration")
    : pilotDurationMode;

  const computedResponseDays: number = responseDaysPreset === 'custom'
    ? Math.max(1, parseInt(customDays, 10) || 1)
    : Number(responseDaysPreset);

  // Autosave to browser storage on change
  useEffect(() => {
    const draft = {
      title, department, priority, sector, state, city, district, jurisdiction,
      problemDescription, currentSituation, desiredOutcome,
      budgetAmount, budgetUnit, customBudget,
      pilotDurationMode, customPilotDuration,
      responseDaysPreset, customDays,
      technologies, successCriteria,
      savedAt: new Date().toISOString()
    };
    try {
      safeStorage.setItem('procurex_challenge_draft', JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [
    title, department, priority, sector, state, city, district, jurisdiction,
    problemDescription, currentSituation, desiredOutcome,
    budgetAmount, budgetUnit, customBudget,
    pilotDurationMode, customPilotDuration,
    responseDaysPreset, customDays,
    technologies, successCriteria
  ]);

  const steps = [
    { num: 1, label: "Problem Statement" },
    { num: 2, label: "Location & Jurisdiction" },
    { num: 3, label: "Requirements & Tech" },
    { num: 4, label: "Pilot & Budget Envelope" },
    { num: 5, label: "Review & Publish" },
  ];

  const handleSaveDraft = () => {
    const draft = {
      title, department, priority, sector, state, city, district, jurisdiction,
      problemDescription, currentSituation, desiredOutcome,
      budgetAmount, budgetUnit, customBudget,
      pilotDurationMode, customPilotDuration,
      responseDaysPreset, customDays,
      technologies, successCriteria,
      savedAt: new Date().toISOString()
    };
    try {
      safeStorage.setItem('procurex_challenge_draft', JSON.stringify(draft));
      setDraftNotice("All fields saved securely to browser storage.");
    } catch {
      setDraftNotice("Could not save to storage.");
    }
    setTimeout(() => setDraftNotice(null), 3000);
  };

  const handleFillSample = () => {
    setTitle("Adaptive Urban Traffic Signal Optimization using Computer Vision");
    setDepartment(activeUser?.department || "Directorate of Urban Land Transport (DULT)");
    setPriority("High");
    setSector("Urban Mobility & Traffic Optimization");
    setState(activeUser?.state || "Karnataka");
    setDistrict("Bengaluru Urban");
    setCity(activeUser?.city || "Bengaluru");
    setJurisdiction("Outer Ring Road Corridor (Marathahalli to Bellandur)");
    setProblemDescription("Peak-hour bottleneck along arterial tech corridor causing average junction wait times of 18.4 minutes. Fixed-cycle timers fail to adapt to asymmetric lane surges and transit bus priorities.");
    setCurrentSituation("Pre-programmed signal cycles operated manually during congestion, resulting in spillover queue lengths.");
    setDesiredOutcome("Deploy real-time optical vehicle classification and queue density estimation to adjust green splits dynamically, reducing corridor delay by at least 15%.");
    setBudgetAmount("35");
    setBudgetUnit("Lakhs");
    setPilotDurationMode("4 Months");
    setResponseDaysPreset(14);
    setTechnologies(["Computer Vision", "Edge AI", "IoT Telemetry"]);
    setSuccessCriteria("≥15% reduction in mean intersection dwell time across test nodes; ≥90% vehicle queue classification accuracy during rain/night conditions.");
    setDraftNotice("Sample challenge parameters loaded.");
    setTimeout(() => setDraftNotice(null), 2500);
  };

  const handleAiStructure = async () => {
    if (!problemDescription.trim()) {
      setDraftNotice("Please enter a Problem Description first so the AI can analyze and structure it.");
      setTimeout(() => setDraftNotice(null), 3500);
      return;
    }
    setIsAiStructuring(true);
    setAiErrorNotice(null);
    try {
      const res = await structureChallenge(problemDescription);
      if (res?.challenge) {
        if (res.challenge.title) setTitle(res.challenge.title);
        if (res.challenge.problem_statement) setProblemDescription(res.challenge.problem_statement);
        if (res.challenge.objective) setDesiredOutcome(res.challenge.objective);
        if (res.challenge.smart_kpis?.length) setSuccessCriteria(res.challenge.smart_kpis.join('\n• '));
        if (res.challenge.estimated_budget_inr) {
          const inLakhs = Math.round(res.challenge.estimated_budget_inr / 100000);
          setBudgetAmount(inLakhs > 0 ? String(inLakhs) : "40");
          setBudgetUnit("Lakhs");
        }
        if (res.challenge.estimated_timeline_months) {
          setPilotDurationMode(`${res.challenge.estimated_timeline_months} Months`);
        }
        if (res.challenge.requirements?.length) {
          const newTechs = [...technologies];
          res.challenge.requirements.forEach(req => {
            if (/vision|camera|image/i.test(req) && !newTechs.includes('Computer Vision')) newTechs.push('Computer Vision');
            if (/iot|sensor/i.test(req) && !newTechs.includes('IoT Telemetry')) newTechs.push('IoT Telemetry');
            if (/edge|embedded/i.test(req) && !newTechs.includes('Edge AI')) newTechs.push('Edge AI');
            if (/acoustic|sound/i.test(req) && !newTechs.includes('Acoustic Sensors')) newTechs.push('Acoustic Sensors');
          });
          if (newTechs.length > 0) setTechnologies(newTechs);
        }
        if (res.challenge.risks?.length) {
          setAiRisks(res.challenge.risks);
        }
        if (res.refinement_questions?.length) {
          setAiRefinementQuestions(res.refinement_questions);
        }
        setAiStructureMode(res.mode);
        setDraftNotice(`AI Challenge Structurer (${res.mode === 'live' ? 'Live AI' : 'Deterministic Model'}): Parameters suggested and populated for manual editing.`);
        setTimeout(() => setDraftNotice(null), 5000);
      }
    } catch (err: any) {
      console.error("AI challenge structuring failed:", err);
      setAiErrorNotice(`AI service unavailable (${err.message || 'offline'}). You can continue structuring manually.`);
      setTimeout(() => setAiErrorNotice(null), 5000);
    } finally {
      setIsAiStructuring(false);
    }
  };

  const handleAiOptimizeBudget = async () => {
    setIsAiBudgeting(true);
    setAiErrorNotice(null);
    try {
      const res = await optimizeBudget({
        title: title || "Civic Challenge",
        problem_statement: problemDescription,
        sector,
        budget: computedBudget
      });
      if (res?.suggested_budget_range) {
        setAiBudgetInfo(res);
        if (res.suggested_budget_range.optimal_inr) {
          const inLakhs = Math.round(res.suggested_budget_range.optimal_inr / 100000);
          if (inLakhs > 0) {
            setBudgetAmount(String(inLakhs));
            setBudgetUnit("Lakhs");
          }
        }
        setDraftNotice(`AI Spend Optimization: Suggested optimal ₹${Math.round(res.suggested_budget_range.optimal_inr / 100000)} Lakhs (${res.potential_savings_percentage}% savings vs historical tenders).`);
        setTimeout(() => setDraftNotice(null), 5000);
      }
    } catch (err: any) {
      console.error("Budget optimization failed:", err);
      setAiErrorNotice(`Spend optimizer unavailable (${err.message || 'offline'}).`);
      setTimeout(() => setAiErrorNotice(null), 5000);
    } finally {
      setIsAiBudgeting(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = `PX-GOV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const created: Challenge = {
      id: newId,
      title: title.trim() || "Civic Infrastructure Optimization Challenge",
      department: department.trim() || activeUser?.department || "Department of Public Works",
      state: state.trim() || activeUser?.state || "National",
      district: district.trim() || "General District",
      city: city.trim() || activeUser?.city || "Municipal Area",
      jurisdiction: jurisdiction.trim() || "Urban Jurisdiction",
      sector,
      technologies: technologies.length > 0 ? technologies : ["Edge AI", "Computer Vision"],
      priority,
      estimatedBudget: computedBudget,
      pilotDuration: computedPilotDuration,
      responseWindowDays: computedResponseDays,
      deadlineDate: new Date(Date.now() + computedResponseDays * 86400000).toISOString().split('T')[0],
      status: "Active",
      matchScore: 92,
      problemDescription: problemDescription.trim() || "Defined municipal problem statement for innovation challenge.",
      currentSituation: currentSituation.trim() || "Legacy manual operational baseline.",
      desiredOutcome: desiredOutcome.trim() || "Measurable civic efficiency and throughput improvements.",
      successCriteria: successCriteria.trim() || "Auditable performance metrics and operational milestone verification.",
      imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
      heroImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=85",
      proposalsCount: 0,
      publicSafeSummary: (desiredOutcome || problemDescription).slice(0, 140) + "...",
      isDepartmentDefined: true
    };

    storage.addChallenge(created);
    onChallengeCreated(created);

    try {
      safeStorage.removeItem("procurex_challenge_draft");
    } catch {
      // Ignore storage errors
    }

    onNavigate("gov_challenge_success");
  };

  const toggleTech = (techName: string) => {
    if (technologies.includes(techName)) {
      setTechnologies(technologies.filter(t => t !== techName));
    } else {
      setTechnologies([...technologies, techName]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100/70 dark:bg-[#070918] text-neutral-900 dark:text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('gov_portal')}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Government Portal</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Public Challenge Statement Builder
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                Department Defined
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Structure a non-prescriptive, problem-centric challenge statement under Section 194 of the Public Procurement Manual.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleFillSample}
              className="px-3 py-1.5 border border-dashed border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Sample (Optional)</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 border border-neutral-300 dark:border-indigo-950/80 rounded-xl text-xs font-semibold hover:bg-white dark:hover:bg-[#141838] transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-neutral-500" />
              <span>Save Draft</span>
            </button>

            {draftNotice && (
              <span className="text-xs text-emerald-600 font-medium">{draftNotice}</span>
            )}
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div 
                key={s.num} 
                onClick={() => setCurrentStep(s.num)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                  isCurrent 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                    : isCompleted
                    ? 'bg-neutral-50 dark:bg-[#111536] border-neutral-200 dark:border-indigo-950/80 text-neutral-800 dark:text-neutral-200'
                    : 'bg-white/40 dark:bg-[#0b0e24]/40 border-neutral-200/60 dark:border-indigo-950/40 text-neutral-400'
                }`}
              >
                <div className="font-mono text-[10px] opacity-70 mb-0.5">0{s.num}</div>
                <div className="font-semibold truncate">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Step 1: Problem Statement */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-neutral-100 dark:border-indigo-950/60 pb-3">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    01 · Core Civic Problem Statement
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Define what is broken or inefficient. Focus on operational metrics, not predetermined vendor equipment.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Challenge Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636] focus:outline-none focus:border-indigo-500 font-medium"
                    placeholder="e.g. Adaptive Urban Traffic Signal Optimization using Computer Vision"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Sponsoring Ministry / Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636]"
                      placeholder="e.g. Directorate of Urban Land Transport (DULT)"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Civic Sector *
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636]"
                    >
                      <option>Urban Mobility & Traffic Optimization</option>
                      <option>Water Resources, Leak Detection & Sewage</option>
                      <option>Clean Energy, Solar Microgrids & Storage</option>
                      <option>Healthcare, Diagnostics & Telemedicine</option>
                      <option>Air Quality, Environmental & Emission Monitoring</option>
                      <option>Digital Land Governance, Municipal Tax & Records</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Priority Level *
                  </label>
                  <div className="flex gap-3">
                    {(["High", "Medium", "Critical"] as const).map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPriority(lvl)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium border transition ${
                          priority === lvl
                            ? lvl === 'Critical'
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-neutral-50 dark:bg-[#121636] border-neutral-200 dark:border-indigo-950 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {lvl} Priority
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Problem Description (Scale & Nature) *
                    </label>
                    <button
                      type="button"
                      disabled={isAiStructuring || !problemDescription.trim()}
                      onClick={handleAiStructure}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isAiStructuring ? "Structuring via Real AI Backend..." : "AI Auto-Structure Challenge"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636] leading-relaxed"
                    placeholder="Describe the current bottleneck, scale of civic friction, and why traditional methods fail..."
                  />

                  {aiErrorNotice && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{aiErrorNotice}</span>
                    </div>
                  )}

                  {aiStructureMode && (
                    <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 font-mono text-[11px] uppercase">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Backend AI Structurer ({aiStructureMode === 'live' ? 'Live AI' : 'Deterministic Mode'})
                        </span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                          Editable Suggestions Loaded
                        </span>
                      </div>
                      {aiRefinementQuestions.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-[11px]">
                            Recommended Procurement Questions:
                          </span>
                          <ul className="list-disc list-inside text-[11px] text-neutral-600 dark:text-neutral-400 space-y-0.5">
                            {aiRefinementQuestions.map((q, idx) => (
                              <li key={idx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Current Baseline Situation
                  </label>
                  <textarea
                    rows={2}
                    value={currentSituation}
                    onChange={(e) => setCurrentSituation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636]"
                    placeholder="What is currently done today? (e.g. manual cycles, visual inspection, periodic tanker dispatch)"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location & Jurisdiction */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-neutral-100 dark:border-indigo-950/60 pb-3">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    02 · Geographical Jurisdiction
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Where will the technology solution or field pilot be situated?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      State / UT *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636]"
                      placeholder="e.g. Karnataka"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      District *
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636]"
                      placeholder="e.g. Bengaluru Urban"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      City / ULB *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636]"
                      placeholder="e.g. Bengaluru"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Specific Corridor / Facility / Jurisdiction *
                  </label>
                  <input
                    type="text"
                    required
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636]"
                    placeholder="e.g. Outer Ring Road (Marathahalli to Kadubeesanahalli Corridor)"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Requirements & Tech */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-neutral-100 dark:border-indigo-950/60 pb-3">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    03 · Technical Capabilities Required
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Select the technology building blocks necessary for addressing this challenge.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Required Technologies (Click to toggle)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Computer Vision", "Edge AI", "IoT Telemetry", 
                      "Acoustic Sensors", "Smart Microgrids", "Geospatial Routing",
                      "Cloud DICOM", "Signal Processing", "LiDAR", "Thermal Imaging",
                      "Automated Metering", "Drone Surveillance"
                    ].map((tech) => {
                      const isSel = technologies.includes(tech);
                      return (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => toggleTech(tech)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            isSel
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-neutral-50 dark:bg-[#121636] border-neutral-200 dark:border-indigo-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                          }`}
                        >
                          {tech} {isSel && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Desired Outcome & Operational Improvements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={desiredOutcome}
                    onChange={(e) => setDesiredOutcome(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636]"
                    placeholder="e.g. Deploy optical edge classification to dynamically adjust green splits, reducing delay ≥15%."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Pilot & Budget Envelope (Extensive Options) */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-neutral-100 dark:border-indigo-950/60 pb-3">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    04 · Pilot Duration & Commercial Envelope
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Set precise commercial parameters, response deadlines, and field pilot milestones.
                  </p>
                </div>

                {/* Professional Budget Builder */}
                <div className="space-y-3 p-4 rounded-xl bg-neutral-50/80 dark:bg-[#101433] border border-neutral-200 dark:border-indigo-950/80">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <label className="text-xs font-bold text-neutral-900 dark:text-white">
                      Commercial Budget Envelope *
                    </label>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Specify the estimated budget allocation in Lakhs, Thousands, Crores, or a custom amount.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-6 space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                        Amount Figure
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-mono">₹</span>
                        <input
                          type="text"
                          value={budgetAmount}
                          onChange={(e) => setBudgetAmount(e.target.value)}
                          placeholder="e.g. 25–35"
                          className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-white dark:bg-[#121636] font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                        Denomination / Unit
                      </label>
                      <select
                        value={budgetUnit}
                        onChange={(e) => setBudgetUnit(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-white dark:bg-[#121636] font-medium"
                      >
                        <option value="Lakhs">Lakhs (₹ Lakhs)</option>
                        <option value="Thousands">Thousands (₹ Thousands)</option>
                        <option value="Crores">Crores (₹ Crores)</option>
                        <option value="Custom">Custom Text / Range</option>
                      </select>
                    </div>

                    {budgetUnit === 'Custom' && (
                      <div className="sm:col-span-12 space-y-1">
                        <input
                          type="text"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          placeholder="Enter custom budget string, e.g. ₹15,00,000 – ₹20,00,000 with milestone payments"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-white dark:bg-[#121636]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-neutral-200/60 dark:border-indigo-950/60">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                      Calculated Envelope: <strong className="text-indigo-600 dark:text-indigo-400">{computedBudget}</strong>
                    </div>
                    <button
                      type="button"
                      disabled={isAiBudgeting}
                      onClick={handleAiOptimizeBudget}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{isAiBudgeting ? "Analyzing Historical Spends..." : "AI Spend Optimizer"}</span>
                    </button>
                  </div>

                  {aiBudgetInfo && (
                    <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-[#0c102a] border border-indigo-200/80 dark:border-indigo-900/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-900 dark:text-indigo-200 font-mono text-[11px] uppercase">
                          AI Cost Benchmarking
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          ~{aiBudgetInfo.potential_savings_percentage}% Projected Savings
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                        <div>Min: ₹{(aiBudgetInfo.suggested_budget_range.min_inr / 100000).toFixed(1)}L</div>
                        <div>Optimal: ₹{(aiBudgetInfo.suggested_budget_range.optimal_inr / 100000).toFixed(1)}L</div>
                        <div>Overrun Risk: <span className="font-bold">{aiBudgetInfo.cost_overrun_risk}</span></div>
                      </div>
                      {aiBudgetInfo.cost_breakdown?.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-[10px] uppercase font-mono">
                            Cost Categories Breakdown:
                          </span>
                          <div className="space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                            {aiBudgetInfo.cost_breakdown.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>• {item.category} ({item.percentage}%)</span>
                                <span className="font-mono font-semibold">₹{(item.amount_inr / 100000).toFixed(1)}L</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pilot Duration with Multiple Options + Custom Option */}
                <div className="space-y-3 p-4 rounded-xl bg-neutral-50/80 dark:bg-[#101433] border border-neutral-200 dark:border-indigo-950/80">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <label className="text-xs font-bold text-neutral-900 dark:text-white">
                      Pilot Duration Options *
                    </label>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Select standard pilot testing timeline or specify a custom duration.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "1 Month", "2 Months", "3 Months", "4 Months", 
                      "5 Months", "6 Months", "9 Months", "12 Months", 
                      "18 Months", "Custom"
                    ].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setPilotDurationMode(dur)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition ${
                          pilotDurationMode === dur
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white dark:bg-[#121636] border-neutral-200 dark:border-indigo-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>

                  {pilotDurationMode === 'Custom' && (
                    <div className="pt-2">
                      <input
                        type="text"
                        value={customPilotDuration}
                        onChange={(e) => setCustomPilotDuration(e.target.value)}
                        placeholder="e.g. 45 Days, 8 Weeks, or 100 Operational Days"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-white dark:bg-[#121636]"
                      />
                    </div>
                  )}

                  <div className="text-xs text-neutral-600 dark:text-neutral-400 pt-1">
                    Selected Pilot Timeline: <strong className="text-indigo-600 dark:text-indigo-400">{computedPilotDuration}</strong>
                  </div>
                </div>

                {/* Response Window with Extensive Options (1 day, 2 days, 3 days... or custom) */}
                <div className="space-y-3 p-4 rounded-xl bg-neutral-50/80 dark:bg-[#101433] border border-neutral-200 dark:border-indigo-950/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <label className="text-xs font-bold text-neutral-900 dark:text-white">
                      Startup Response Window (Submission Days) *
                    </label>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    How many days do startups have to submit their proposals? You can give 1 day, 2 days, 3 days, or more.
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { days: 1, label: "1 Day" },
                      { days: 2, label: "2 Days" },
                      { days: 3, label: "3 Days" },
                      { days: 4, label: "4 Days" },
                      { days: 5, label: "5 Days" },
                      { days: 7, label: "7 Days" },
                      { days: 10, label: "10 Days" },
                      { days: 14, label: "14 Days" },
                      { days: 21, label: "21 Days" },
                      { days: 30, label: "30 Days" },
                      { days: 45, label: "45 Days" },
                      { days: 60, label: "60 Days" },
                      { days: 90, label: "90 Days" }
                    ].map((opt) => (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() => {
                          setResponseDaysPreset(opt.days);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          responseDaysPreset === opt.days
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white dark:bg-[#121636] border-neutral-200 dark:border-indigo-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setResponseDaysPreset('custom')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        responseDaysPreset === 'custom'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-[#121636] border-neutral-200 dark:border-indigo-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                      }`}
                    >
                      Custom Days...
                    </button>
                  </div>

                  {responseDaysPreset === 'custom' && (
                    <div className="pt-2 flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        placeholder="Enter number of days (e.g. 1, 2, 8, 120)"
                        className="w-48 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-white dark:bg-[#121636] font-mono"
                      />
                      <span className="text-xs text-neutral-500">Days from publication date</span>
                    </div>
                  )}

                  <div className="text-xs text-neutral-600 dark:text-neutral-400 pt-1">
                    Selected Window: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{computedResponseDays} Days</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Measurable Success Criteria (Audit Standard) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={successCriteria}
                    onChange={(e) => setSuccessCriteria(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636]"
                    placeholder="Evidence required for milestone review (e.g. ≥15% reduction in mean intersection dwell time across test nodes)..."
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review & Publish */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-neutral-100 dark:border-indigo-950/60 pb-3">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    05 · Final Review & Public Registration
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Verify the challenge statement before registering into the public innovation observatory.
                  </p>
                </div>

                {/* Highlighted Defined Problem Box */}
                <div className="p-5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-400/80 dark:border-amber-600/70 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-300/40 dark:border-amber-700/40">
                    <span className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Department-Defined Challenge Statement
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-mono">
                      SECTION 194 COMPLIANT
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-500">Title:</span>
                    <span className="font-bold text-neutral-900 dark:text-white text-right">{title || 'Untitled Challenge'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Department:</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{department || 'Public Authority'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Location:</span>
                    <span>{jurisdiction || 'Jurisdiction'}, {city || 'City'}, {state || 'State'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Budget Envelope:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{computedBudget} ({computedPilotDuration})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Response Window:</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">{computedResponseDays} Days from Publication</span>
                  </div>
                  <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                    <span className="text-neutral-500 block mb-1">Success Criteria:</span>
                    <p className="text-neutral-800 dark:text-neutral-200 italic">{successCriteria || 'Auditable milestone metrics'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-300">
                  <FileCheck className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Configurable evaluation workflow</strong>
                    Upon registration, this challenge is placed on the public innovation observatory. Matched startups can register interest and submit structured technical dossiers.
                  </div>
                </div>
                {/* Phase 3 AI Procurement Accelerators */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                        Phase 3 AI Procurement Tools
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase">GFR Compliant</span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Accelerate your public procurement with automated tender specification generation and matching government funding schemes before publishing.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateRFP}
                      disabled={isGeneratingRfp}
                      className="p-3 bg-white dark:bg-[#0b0e24] hover:bg-neutral-50 dark:hover:bg-[#121634] border border-neutral-200 dark:border-indigo-900/60 rounded-xl text-left transition flex items-center justify-between group shadow-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Generate GFR 2017 RFP</span>
                        </div>
                        <p className="text-[11px] text-neutral-500">Official tender doc with eligibility weightage</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                        {isGeneratingRfp ? 'Generating...' : '→'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleMatchSchemes}
                      disabled={isMatchingSchemes}
                      className="p-3 bg-white dark:bg-[#0b0e24] hover:bg-neutral-50 dark:hover:bg-[#121634] border border-neutral-200 dark:border-indigo-900/60 rounded-xl text-left transition flex items-center justify-between group shadow-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Match Govt Schemes</span>
                        </div>
                        <p className="text-[11px] text-neutral-500">Smart Cities, Digital India, AMRUT 2.0</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                        {isMatchingSchemes ? 'Matching...' : '→'}
                      </span>
                    </button>
                  </div>
                </div>

                {rfpError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
                    {rfpError}
                  </div>
                )}
                {schemesError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
                    {schemesError}
                  </div>
                )}
              </div>
            )}

            {/* RFP GENERATOR MODAL */}
            {showRfpModal && rfpResult && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
                <div className="w-full max-w-4xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950 rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
                  {/* Modal Header */}
                  <div className="p-5 bg-neutral-900 dark:bg-[#060814] text-white flex items-center justify-between border-b border-neutral-800">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-indigo-400" />
                      <div>
                        <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest block">GFR 2017 Tender Specification</span>
                        <h4 className="text-base font-bold text-white">{rfpResult.rfp_title}</h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRfpModal(false)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-neutral-800 dark:text-neutral-200">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono p-3 bg-neutral-50 dark:bg-[#101432] rounded-xl border border-neutral-200 dark:border-indigo-950">
                      <div>
                        <span className="text-neutral-400 block text-[10px]">TENDER ID:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{rfpResult.rfp_id}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">SUBMISSION DEADLINE:</span>
                        <span className="font-bold text-neutral-900 dark:text-white">{rfpResult.submission_deadline}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">EVALUATION WEIGHT:</span>
                        <span className="font-bold text-emerald-600">Tech {rfpResult.evaluation_weightage.technical}% / Fin {rfpResult.evaluation_weightage.financial}%</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">Executive Summary</span>
                      <p className="p-3 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                        {rfpResult.executive_summary}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">Technical Specifications</span>
                      <ul className="space-y-1 p-3 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                        {rfpResult.technical_specifications.map((spec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-mono text-indigo-500 font-bold">{i + 1}.</span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">Startup Eligibility Criteria</span>
                      <div className="border border-neutral-200 dark:border-indigo-950 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-neutral-100 dark:bg-[#101432] font-mono text-[10px] text-neutral-500 uppercase">
                            <tr>
                              <th className="p-2.5">Criterion</th>
                              <th className="p-2.5">Mandatory</th>
                              <th className="p-2.5 text-right">Weight</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-indigo-950">
                            {rfpResult.eligibility_criteria.map((ec, i) => (
                              <tr key={i}>
                                <td className="p-2.5 font-medium">{ec.criterion}</td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                    ec.mandatory ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-neutral-200 text-neutral-700'
                                  }`}>
                                    {ec.mandatory ? 'Mandatory' : 'Optional'}
                                  </span>
                                </td>
                                <td className="p-2.5 text-right font-mono font-bold">{ec.weight_percentage}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">Mandatory Tender Attachments</span>
                        <ul className="space-y-1 p-3 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                          {rfpResult.mandatory_documents.map((doc, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">GFR 2017 Terms & Conditions</span>
                        <ul className="space-y-1 p-3 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 text-[11px]">
                          {rfpResult.general_terms_conditions.map((term, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-neutral-400 font-mono">•</span>
                              <span>{term}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 bg-neutral-100 dark:bg-[#060814] border-t border-neutral-200 dark:border-indigo-950 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-neutral-500">Format: Standard GFR 2017 Rule 149</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyRfp}
                        className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-indigo-900 font-bold text-xs hover:bg-white dark:hover:bg-[#101435] transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{copiedRfp ? 'Copied to Clipboard!' : 'Copy RFP Text'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRfpModal(false)}
                        className="px-4 py-2 bg-neutral-900 dark:bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCHEME MATCHER MODAL */}
            {showSchemesModal && schemesResult && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
                <div className="w-full max-w-3xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                  {/* Modal Header */}
                  <div className="p-5 bg-gradient-to-r from-emerald-900 to-[#060814] text-white flex items-center justify-between border-b border-emerald-800/60">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest block">Central & State Public Grants</span>
                        <h4 className="text-base font-bold text-white">Matched Government Funding Schemes</h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSchemesModal(false)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-neutral-800 dark:text-neutral-200">
                    {/* Primary Highlight */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-300">
                          Recommended Primary Scheme
                        </span>
                        <span className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-300">
                          Total Grant Pool: ₹{(schemesResult.total_available_funding_inr / 10000000).toFixed(1)} Crore
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-neutral-900 dark:text-white">
                        {schemesResult.recommended_scheme}
                      </h5>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                        {schemesResult.justification}
                      </p>
                    </div>

                    {/* Matched National Schemes */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">
                        Eligible Central Ministry Schemes
                      </span>
                      <div className="grid grid-cols-1 gap-3">
                        {schemesResult.matched_schemes.map((scheme, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-1.5">
                            <div className="flex items-baseline justify-between gap-2">
                              <strong className="text-xs font-bold text-neutral-900 dark:text-white">{scheme.scheme_name}</strong>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                                {scheme.funding_percentage}% Grant
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-500">{scheme.ministry}</div>
                            <p className="text-[11px] text-neutral-700 dark:text-neutral-300">{scheme.eligibility}</p>
                            <div className="flex items-center justify-between pt-1 border-t border-neutral-200 dark:border-indigo-950/60 text-[10px] font-mono text-neutral-400">
                              <span>Deadline: {scheme.deadline}</span>
                              <a
                                href={scheme.application_link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline"
                              >
                                <span>Portal Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* State Specific Schemes */}
                    {schemesResult.state_specific_schemes?.length > 0 && (
                      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-2">
                        <span className="text-[11px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 block">
                          State Innovation & Hackathon Incentives
                        </span>
                        <ul className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
                          {schemesResult.state_specific_schemes.map((st, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold font-mono">✓</span>
                              <span>{st}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 bg-neutral-100 dark:bg-[#060814] border-t border-neutral-200 dark:border-indigo-950 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setShowSchemesModal(false)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
                    >
                      Close Scheme Matcher
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-neutral-100 dark:border-indigo-950/60 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  ← Previous Step
                </button>
              ) : <div />}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-md shadow-indigo-600/20"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Register & Publish Challenge</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Prototype Snapshot Card */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 space-y-4 shadow-xs sticky top-24">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              <span>Challenge Snapshot</span>
              <span className="text-indigo-600 dark:text-indigo-400">PREVIEW</span>
            </div>

            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 dark:bg-indigo-950 text-neutral-700 dark:text-indigo-300">
                {sector.split('&')[0]}
              </span>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                {title || 'Untitled Challenge Statement'}
              </h4>
              <span className="text-xs text-neutral-500 block">
                {department || 'Department'} · {city || 'City'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#121636] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Envelope:</span>
                <strong className="text-neutral-900 dark:text-white font-mono">{computedBudget}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Pilot Duration:</span>
                <strong className="text-neutral-900 dark:text-white">{computedPilotDuration}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Response Window:</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{computedResponseDays} Days</strong>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block font-mono">
                Required Tech Tags
              </span>
              <div className="flex flex-wrap gap-1">
                {technologies.length > 0 ? (
                  technologies.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-neutral-400 italic">No tags selected yet</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-200 leading-relaxed">
              Upon submission, PROCUREX AI indexes the problem statement and notifies relevant DPIIT startups with high match scores.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
