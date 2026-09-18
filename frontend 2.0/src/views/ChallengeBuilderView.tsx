import React, { useState, useEffect } from 'react';
import { Challenge, AppView } from '../types';
import { storage, safeStorage } from '../utils/storage';
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
  CheckCircle2
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

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PX-GOV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const created: Challenge = {
      id: newId,
      title: title.trim() || 'Civic Infrastructure Optimization Challenge',
      department: department.trim() || 'Department of Public Works',
      state: state.trim() || 'National',
      district: district.trim() || 'General District',
      city: city.trim() || 'Municipal Area',
      jurisdiction: jurisdiction.trim() || 'Urban Jurisdiction',
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

    // Save to persistent localStorage storage
    storage.addChallenge(created);
    onChallengeCreated(created);

    try {
      safeStorage.removeItem('procurex_challenge_draft');
    } catch {
      // ignore
    }

    onNavigate('gov_challenge_success');
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Problem Description (Scale & Nature) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-neutral-50/50 dark:bg-[#121636] leading-relaxed"
                    placeholder="Describe the current bottleneck, scale of civic friction, and why traditional methods fail..."
                  />
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

                  <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono pt-1">
                    Calculated Envelope: <strong className="text-indigo-600 dark:text-indigo-400">{computedBudget}</strong>
                  </div>
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
