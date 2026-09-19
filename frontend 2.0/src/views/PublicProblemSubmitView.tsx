import React, { useState } from 'react';
import { AppView, PublicProblem } from '../types';
import { storage } from '../utils/storage';
import { CIVIC_SERVICE_DOMAINS } from '../data/procurexData';
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Building2, 
  Search, 
  Filter, 
  Users, 
  Clock, 
  Flame, 
  ExternalLink,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { structureChallenge, analyzeSentiment, AnalyzeSentimentResponse } from '../utils/api';

interface PublicProblemSubmitViewProps {
  onNavigate: (view: AppView) => void;
}

const SEED_PUBLIC_PROBLEMS: PublicProblem[] = [
  {
    id: 'PX-PUB-2026-081',
    title: 'Severe Stormwater Backflow and Silt Occlusion in Coastal Inlets',
    description: 'During semi-monthly spring high tides, marine seawater and tidal silt rush back through 4 major stormwater outfalls, trapping urban runoff and causing street inundation up to 40cm across arterial roads.',
    category: 'Water Resources, Leak Detection & Sewage',
    state: 'Maharashtra',
    city: 'Mumbai',
    affectedGroup: 'Approximately 18,000 daily commuters and 450 ground-floor commercial shops',
    frequency: 'Bi-weekly during full/new moon spring tides and monsoon high surges',
    severity: 'High',
    expectedImprovement: 'Prevent tidal back-inundation, automate flap-gate telemetry, and maintain free stormwater discharge even during peak rainfall.',
    evidenceUrl: 'https://mcgm.gov.in/stormwater/colaba-drain-report-2026',
    submittedAt: '2026-09-12',
    status: 'Elevated to Tender',
    aiSummary: 'High-severity tidal backflow issue requiring hydrodynamic sensor-actuated tidal backflow prevention gates and automated silt dredging.'
  },
  {
    id: 'PX-PUB-2026-074',
    title: 'Perimeter Fugitive PM10 Dust Spillage Along Metro Rail Construction Corridors',
    description: 'Continuous heavy excavation along the 12km Metro line creates dense particulate dust clouds exceeding 320 µg/m³ PM10, causing chronic respiratory complaints and zero-visibility hazards for two-wheelers.',
    category: 'Air Quality, Environmental & Emission Monitoring',
    state: 'Delhi NCR',
    city: 'New Delhi',
    affectedGroup: '55,000 daily road users and residents across 6 adjacent municipal colonies',
    frequency: 'Continuous daily during dry weather (06:00 to 22:00)',
    severity: 'High',
    expectedImprovement: 'Enforce real-time optical particle sensing with automated high-pressure mist-cannon triggers to suppress dust before crossing road boundary.',
    evidenceUrl: 'https://dpcc.delhigovt.nic.in/air-quality-bulletin-corridor-11',
    submittedAt: '2026-09-08',
    status: 'Open for Startup Ideation',
    aiSummary: 'Localized construction dust plume requiring autonomous solar-powered particulate triggers coupled with directional electrostatic mist cannons.'
  },
  {
    id: 'PX-PUB-2026-062',
    title: 'Macro-Debris and Floating Chemical Scum Accumulation at Lake Weirs',
    description: 'Surfactant foam and non-biodegradable packaging block the discharge weir, preventing aerobic surface exchange and threatening localized weir overtopping during flash storms.',
    category: 'Waste Management, Circular Economy & Robotics',
    state: 'Karnataka',
    city: 'Bengaluru',
    affectedGroup: '4,000 residential apartments adjacent to the eastern lake embankment',
    frequency: 'Surges 2 days after moderate showers; persistent scum rafts',
    severity: 'Medium',
    expectedImprovement: 'Autonomous surface trash collection craft and bio-enzymatic foam remediation at water outfalls.',
    evidenceUrl: 'https://bbmp.gov.in/lakes/bellandur-weir-status',
    submittedAt: '2026-08-30',
    status: 'Under Verification',
    aiSummary: 'Surface water obstruction requiring solar robotic waterborne skimmers with live telemetry of chemical oxygen demand.'
  },
  {
    id: 'PX-PUB-2026-051',
    title: 'Unmonitored Sub-Surface Thermal Creep in Heritage Masonry Basements',
    description: 'Micro-fractures and subterranean moisture migration in 150-year-old limestone vaults causing salt efflorescence and foundation weakening along the riverfront corridor.',
    category: 'Heritage Conservation & Smart Civic Infrastructure',
    state: 'Uttar Pradesh',
    city: 'Varanasi',
    affectedGroup: 'Heritage conservation trusts and over 120,000 annual heritage visitors',
    frequency: 'Continuous seasonal humidity cycles post-monsoon',
    severity: 'Medium',
    expectedImprovement: 'Non-invasive acoustic & fiber-optic structural health monitoring without physical drilling into heritage stone.',
    evidenceUrl: 'https://heritage.up.gov.in/varanasi-ghat-survey',
    submittedAt: '2026-08-19',
    status: 'Pilot Scoped',
    aiSummary: 'Delicate structural conservation requiring passive distributed acoustic sensors and non-destructive subsurface radar mapping.'
  }
];

export const PublicProblemSubmitView: React.FC<PublicProblemSubmitViewProps> = ({ onNavigate }) => {
  // Problems state backed by safe local storage
  const [problems, setProblems] = useState<PublicProblem[]>(() => {
    const saved = storage.getPublicProblems();
    if (saved && saved.length > 0) {
      return saved;
    }
    // Seed initial demo data if empty
    storage.savePublicProblems(SEED_PUBLIC_PROBLEMS);
    return SEED_PUBLIC_PROBLEMS;
  });

  const [activeTab, setActiveTab] = useState<'submit' | 'browse'>('submit');

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CIVIC_SERVICE_DOMAINS[0]);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('High');
  const [affectedGroup, setAffectedGroup] = useState('');
  const [frequency, setFrequency] = useState('');
  const [description, setDescription] = useState('');
  const [expectedImprovement, setExpectedImprovement] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  // AI Assistant State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [aiDraftSummary, setAiDraftSummary] = useState<string | null>(null);

  // Filter & Search for Browse Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');

  // Submission feedback
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Phase 3 AI: Public Sentiment & Urgency Analyzer State
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<AnalyzeSentimentResponse | null>(null);
  const [sentimentError, setSentimentError] = useState<string | null>(null);

  const handleAnalyzeSentiment = async (targetText?: string) => {
    const textToAnalyze = targetText || `${title ? title + ': ' : ''}${description || ''} ${category}`;
    if (!textToAnalyze.trim()) {
      setValidationError('Please enter problem details first to run the sentiment & urgency analysis.');
      return;
    }
    setValidationError(null);
    setIsAnalyzingSentiment(true);
    setSentimentError(null);
    try {
      const res = await analyzeSentiment(textToAnalyze);
      setSentimentResult(res);
    } catch (err: any) {
      console.warn("Sentiment analysis failed:", err);
      setSentimentError(err.message || 'Sentiment analysis failed.');
    } finally {
      setIsAnalyzingSentiment(false);
    }
  };

  const handleGenerateAiSummary = async () => {
    if (!title.trim() && !description.trim()) {
      setValidationError('Please enter a Problem Title or Description first so the AI can analyze it.');
      return;
    }
    setValidationError(null);
    setIsSynthesizing(true);

    try {
      const problemText = `${title ? title + ': ' : ''}${description || ''} (Located in ${city || 'ward'}, ${state || ''}; impact category: ${category})`;
      const res = await structureChallenge(problemText);
      if (res && res.challenge) {
        const generated = `[AI Root-Cause Diagnosis (${res.mode === 'live' ? 'Live AI Model' : 'Deterministic Engine'})]: ${res.challenge.objective || res.challenge.title}. ${res.challenge.problem_statement || ''} Estimated timeline: ~${res.challenge.estimated_timeline_months || 3} months.`;
        setAiDraftSummary(generated);
      } else {
        const generated = `[AI Root-Cause Diagnosis]: ${category} bottleneck identified in ${city || 'target municipal zone'}${state ? `, ${state}` : ''}. Core impact targets ${affectedGroup || 'local citizens'} with ${severity.toLowerCase()} civic operational urgency. Recommended intervention entails deploying lightweight sensor telemetry or field automation pilots under sandbox procurement guidelines.`;
        setAiDraftSummary(generated);
      }
    } catch (err: any) {
      console.warn("AI Structure Challenge error, fallback to rule-based:", err);
      const generated = `[AI Root-Cause Diagnosis]: ${category} bottleneck identified in ${city || 'target municipal zone'}${state ? `, ${state}` : ''}. Core impact targets ${affectedGroup || 'local citizens'} with ${severity.toLowerCase()} civic operational urgency. Recommended intervention entails deploying lightweight sensor telemetry or field automation pilots under sandbox procurement guidelines.`;
      setAiDraftSummary(generated);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Please specify a concise Problem Title.');
      return;
    }
    if (!description.trim()) {
      setValidationError('Please provide a detailed description of the ground situation.');
      return;
    }
    if (!state.trim() || !city.trim()) {
      setValidationError('Please provide both the State and City/Ward of the civic problem.');
      return;
    }

    const newId = `PX-PUB-2026-${Math.floor(100 + Math.random() * 900)}`;
    const finalSummary = aiDraftSummary || `Public-reported civic challenge in ${city}, ${state} concerning ${category.toLowerCase()}. Awaiting nodal verification.`;

    const newProblem: PublicProblem = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      category,
      state: state.trim(),
      city: city.trim(),
      severity,
      affectedGroup: affectedGroup.trim() || 'General public & local ward residents',
      frequency: frequency.trim() || 'Frequent/Daily',
      expectedImprovement: expectedImprovement.trim() || 'Measurable reduction in downtime and civic disruption',
      evidenceUrl: evidenceUrl.trim() || undefined,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Under Verification',
      aiSummary: finalSummary
    };

    const updated = storage.addPublicProblem(newProblem);
    setProblems(updated);
    setSubmittedId(newId);

    // Reset fields
    setTitle('');
    setDescription('');
    setAffectedGroup('');
    setFrequency('');
    setExpectedImprovement('');
    setEvidenceUrl('');
    setAiDraftSummary(null);
  };

  // Filtered browse list
  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'ALL' || p.category === selectedCategoryFilter;
    const matchesSev = selectedSeverityFilter === 'ALL' || p.severity === selectedSeverityFilter;
    return matchesSearch && matchesCat && matchesSev;
  });

  return (
    <div className="min-h-screen w-full bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC] py-8 px-4 sm:px-6 lg:px-12 selection:bg-[#087C78] selection:text-white transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Breadcrumb & Return Nav */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2DFD7] dark:border-[#232B34]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-xs font-mono font-medium text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO HOME</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#596166] dark:text-[#949DA3]">
              CIVIC DISCOVERY PROTOCOL
            </span>
            <button
              onClick={() => onNavigate('innovation_hub')}
              className="text-xs font-mono font-semibold text-[#087C78] dark:text-[#0AA39F] hover:underline flex items-center gap-1"
            >
              <span>INNOVATION CHALLENGES</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-8 sm:p-10 rounded-xl shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#087C78]/10 text-[#087C78] dark:text-[#0AA39F] text-xs font-mono font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OPEN PROBLEM REGISTRY • CITIZEN & DEPT DISCOVERY</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                Report a Ground-Level Civic Problem
              </h1>
              <p className="text-sm text-[#596166] dark:text-[#949DA3] leading-relaxed">
                Municipal field officers, ward engineers, researchers, and citizens can log real infrastructural bottlenecks. ProcureX extracts root-causes via AI, estimates impact on the population, and assists nodal authorities in translating verified issues into high-impact startup pilot procurement challenges.
              </p>
            </div>

            {/* Metrics Widget */}
            <div className="grid grid-cols-2 gap-3 min-w-[260px] p-4 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded-lg">
              <div>
                <div className="text-[10px] font-mono uppercase text-[#596166] dark:text-[#949DA3]">Logged Problems</div>
                <div className="text-2xl font-bold font-mono text-[#111416] dark:text-white">{problems.length + 140}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-[#596166] dark:text-[#949DA3]">Converted to Pilots</div>
                <div className="text-2xl font-bold font-mono text-[#087C78] dark:text-[#0AA39F]">38</div>
              </div>
              <div className="col-span-2 pt-2 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-between text-xs">
                <span className="text-[#596166] dark:text-[#949DA3]">Validation SLA</span>
                <span className="font-mono font-semibold text-[#111416] dark:text-[#F4F2EC]">Under 48 Hours</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E2DFD7] dark:border-[#232B34] pt-2">
            <button
              onClick={() => { setActiveTab('submit'); setSubmittedId(null); }}
              className={`pb-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors relative flex items-center gap-2 ${
                activeTab === 'submit'
                  ? 'text-[#087C78] dark:text-[#0AA39F]'
                  : 'text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Civic Problem</span>
              {activeTab === 'submit' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#087C78] dark:bg-[#0AA39F]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('browse')}
              className={`pb-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors relative flex items-center gap-2 ${
                activeTab === 'browse'
                  ? 'text-[#087C78] dark:text-[#0AA39F]'
                  : 'text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Browse Public Registry ({problems.length})</span>
              {activeTab === 'browse' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#087C78] dark:bg-[#0AA39F]" />
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Submit Form */}
        {activeTab === 'submit' && (
          <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-8 sm:p-10 rounded-xl shadow-xs space-y-8">
            {submittedId && (
              <div className="p-6 bg-[#087C78]/10 border border-[#087C78]/30 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-[#087C78] dark:text-[#0AA39F] font-bold text-sm font-mono uppercase">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Problem Successfully Registered • ID: {submittedId}</span>
                </div>
                <p className="text-xs text-[#111416] dark:text-[#F4F2EC] leading-relaxed">
                  Your civic problem statement has been indexed in the ProcureX Registry. Relevant municipal divisions and registered DPIIT startups in this domain will be notified for sandbox triage.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="px-4 py-2 bg-[#087C78] text-white text-xs font-mono font-bold uppercase rounded hover:bg-[#076865] transition"
                  >
                    View in Registry
                  </button>
                  <button
                    onClick={() => setSubmittedId(null)}
                    className="text-xs font-mono font-semibold text-[#596166] dark:text-[#949DA3] hover:underline"
                  >
                    Submit Another Report
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {validationError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300 font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Title & Domain */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Uncontrolled Sewer Gas Eruption & Corrosion in Trunk Outfalls"
                    className="w-full px-3.5 py-2.5 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-sm text-[#111416] dark:text-white placeholder-[#596166] focus:outline-none focus:border-[#087C78]"
                  />
                  <p className="text-[11px] text-[#596166] dark:text-[#949DA3]">
                    A clear, outcome-focused title identifying the exact civic failure point.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                    Civic Sector / Domain *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-xs text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                  >
                    {CIVIC_SERVICE_DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                    State / Union Territory *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3 py-2 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-sm text-[#111416] dark:text-white placeholder-[#596166] focus:outline-none focus:border-[#087C78]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                    City / Ward / Jurisdiction *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru (Mahadevapura Ward)"
                    className="w-full px-3 py-2 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-sm text-[#111416] dark:text-white placeholder-[#596166] focus:outline-none focus:border-[#087C78]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                    Operational Severity *
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSeverity(lvl)}
                        className={`py-2 text-xs font-mono font-bold rounded transition border ${
                          severity === lvl
                            ? lvl === 'High'
                              ? 'bg-red-600 text-white border-red-600'
                              : lvl === 'Medium'
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-[#F4F2EC] dark:bg-[#111416] text-[#596166] dark:text-[#949DA3] border-[#E2DFD7] dark:border-[#232B34] hover:text-[#111416]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                  Detailed Problem Description & Ground Reality *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the physical failure, what currently happens when the issue occurs, why existing department maintenance fails to solve it, and what technologies might be applicable..."
                  className="w-full p-3 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-sm text-[#111416] dark:text-white placeholder-[#596166] focus:outline-none focus:border-[#087C78]"
                />
              </div>

              {/* Affected Group & Frequency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                    Affected Population / Group
                  </label>
                  <input
                    type="text"
                    value={affectedGroup}
                    onChange={(e) => setAffectedGroup(e.target.value)}
                    placeholder="e.g. ~12,000 ward residents, transit bus depot, local traders"
                    className="w-full px-3 py-2 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-sm text-[#111416] dark:text-white placeholder-[#596166] focus:outline-none focus:border-[#087C78]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                    Frequency of Occurrence
                  </label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g. Daily during evening peak; every heavy rain episode"
                    className="w-full px-3 py-2 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-sm text-[#111416] dark:text-white placeholder-[#596166] focus:outline-none focus:border-[#087C78]"
                  />
                </div>
              </div>

              {/* Expected Improvement & Evidence Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                    Desired Outcome / Measurable Improvement
                  </label>
                  <input
                    type="text"
                    value={expectedImprovement}
                    onChange={(e) => setExpectedImprovement(e.target.value)}
                    placeholder="e.g. Eliminate foul gas buildup by 80%; reduce pipe replacement cycles"
                    className="w-full px-3 py-2 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-sm text-[#111416] dark:text-white placeholder-[#596166] focus:outline-none focus:border-[#087C78]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase text-[#111416] dark:text-[#F4F2EC]">
                    Evidence URL / Municipal Report / Photo Link
                  </label>
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="https://drive.google.com/or-municipal-log"
                    className="w-full px-3 py-2 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-sm text-[#111416] dark:text-white placeholder-[#596166] focus:outline-none focus:border-[#087C78]"
                  />
                </div>
              </div>

              {/* AI Assistance Section */}
              <div className="p-4 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded-lg space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#087C78] dark:text-[#0AA39F]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#111416] dark:text-white">
                      AI Problem Synthesis & Public Sentiment Analytics
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleAnalyzeSentiment()}
                      disabled={isAnalyzingSentiment}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 transition border border-rose-500/30"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{isAnalyzingSentiment ? 'Analyzing Sentiment...' : 'Analyze Public Sentiment & Urgency'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateAiSummary}
                      disabled={isSynthesizing}
                      className="px-3 py-1.5 bg-[#087C78]/10 hover:bg-[#087C78]/20 text-[#087C78] dark:text-[#0AA39F] text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isSynthesizing ? 'Synthesizing...' : 'Generate AI Root-Cause Diagnostic'}</span>
                    </button>
                  </div>
                </div>

                {sentimentError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded">
                    {sentimentError}
                  </div>
                )}

                {/* Sentiment & Urgency Analysis Result Card */}
                {sentimentResult && (
                  <div className="p-4 bg-white dark:bg-[#16191D] border border-rose-500/30 rounded-xl space-y-4 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DFD7] dark:border-[#232B34] pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                          Phase 3 AI · Citizen Impact & Sentiment Audit
                        </span>
                        <h5 className="text-sm font-bold text-[#111416] dark:text-white">
                          Public Grievance Escalation Profile
                        </h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          sentimentResult.citizen_impact_level === 'Critical'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          Impact: {sentimentResult.citizen_impact_level}
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                          Priority: {sentimentResult.recommended_priority_level}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-[#F4F2EC] dark:bg-[#111416] rounded-lg">
                        <span className="text-[10px] font-mono uppercase text-[#596166] block">Urgency Index</span>
                        <span className="text-base font-black font-mono text-rose-600 dark:text-rose-400">
                          {sentimentResult.urgency_index} <span className="text-[10px] text-[#596166] font-normal">/ 10</span>
                        </span>
                      </div>
                      <div className="p-3 bg-[#F4F2EC] dark:bg-[#111416] rounded-lg">
                        <span className="text-[10px] font-mono uppercase text-[#596166] block">Social Mentions</span>
                        <span className="text-base font-black font-mono text-[#111416] dark:text-white">
                          ~{sentimentResult.social_media_indicators.twitter_mentions_estimate.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-3 bg-[#F4F2EC] dark:bg-[#111416] rounded-lg">
                        <span className="text-[10px] font-mono uppercase text-[#596166] block">News Articles</span>
                        <span className="text-base font-black font-mono text-[#111416] dark:text-white">
                          {sentimentResult.news_coverage_estimate} Reports
                        </span>
                      </div>
                      <div className="p-3 bg-[#F4F2EC] dark:bg-[#111416] rounded-lg">
                        <span className="text-[10px] font-mono uppercase text-[#596166] block">Negative Sentiment</span>
                        <span className="text-base font-black font-mono text-rose-600 dark:text-rose-400">
                          {sentimentResult.social_media_indicators.sentiment_breakdown.negative_percentage}%
                        </span>
                      </div>
                    </div>

                    {sentimentResult.social_media_indicators.trending_hashtags?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#596166]">Trending:</span>
                        {sentimentResult.social_media_indicators.trending_hashtags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {sentimentResult.stakeholder_concerns?.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-[#E2DFD7] dark:border-[#232B34]">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#596166] block">
                          Verified Stakeholder Grievances:
                        </span>
                        <ul className="space-y-1 text-xs text-[#111416] dark:text-[#F4F2EC]">
                          {sentimentResult.stakeholder_concerns.map((concern, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-rose-500 font-mono mt-0.5">•</span>
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {aiDraftSummary && (
                  <div className="p-3 bg-white dark:bg-[#16191D] border border-[#087C78]/30 rounded text-xs text-[#111416] dark:text-[#F4F2EC] font-sans leading-relaxed">
                    {aiDraftSummary}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E2DFD7] dark:border-[#232B34]">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-5 py-2.5 border border-[#E2DFD7] dark:border-[#232B34] text-xs font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#087C78] hover:bg-[#076865] text-white text-xs font-mono font-bold uppercase tracking-wider rounded shadow-xs transition flex items-center gap-2"
                >
                  <span>Submit to Civic Registry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Browse Problems Registry */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search & Filter Controls */}
            <div className="p-4 bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#596166]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keywords, city, or state..."
                  className="w-full pl-9 pr-3 py-2 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-xs text-[#111416] dark:text-white placeholder-[#596166] focus:outline-none focus:border-[#087C78]"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#596166] dark:text-[#949DA3]">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Sector:</span>
                </div>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-xs text-[#111416] dark:text-white focus:outline-none"
                >
                  <option value="ALL">All Domains</option>
                  {CIVIC_SERVICE_DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5 text-xs font-mono text-[#596166] dark:text-[#949DA3]">
                  <span>Severity:</span>
                </div>
                <select
                  value={selectedSeverityFilter}
                  onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#F4F2EC] dark:bg-[#111416] border border-[#E2DFD7] dark:border-[#232B34] rounded text-xs text-[#111416] dark:text-white focus:outline-none"
                >
                  <option value="ALL">All Severities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Problems List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 rounded-xl space-y-4 hover:border-[#087C78] dark:hover:border-[#0AA39F] transition group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#596166] dark:text-[#949DA3]">
                        {prob.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            prob.severity === 'High'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                              : prob.severity === 'Medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {prob.severity} Severity
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#F4F2EC] dark:bg-[#1E2630] text-[#596166] dark:text-[#949DA3]">
                          {prob.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#111416] dark:text-white leading-snug group-hover:text-[#087C78] dark:group-hover:text-[#0AA39F] transition">
                      {prob.title}
                    </h3>

                    <p className="text-xs text-[#596166] dark:text-[#949DA3] line-clamp-3 leading-relaxed">
                      {prob.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-[#596166] dark:text-[#949DA3] pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-[#087C78]" />
                        {prob.city}, {prob.state}
                      </span>
                      {prob.affectedGroup && (
                        <span className="flex items-center gap-1 font-mono truncate max-w-[200px]" title={prob.affectedGroup}>
                          <Users className="w-3.5 h-3.5" />
                          {prob.affectedGroup}
                        </span>
                      )}
                    </div>

                    {prob.aiSummary && (
                      <div className="p-2.5 bg-[#F4F2EC] dark:bg-[#111416] rounded border border-[#E2DFD7] dark:border-[#232B34] text-[11px] text-[#111416] dark:text-[#F4F2EC] flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#087C78] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{prob.aiSummary}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#596166]">
                      Reported: {prob.submittedAt}
                    </span>
                    <button
                      onClick={() => onNavigate('gov_challenge_builder')}
                      className="px-3 py-1.5 bg-[#111416] dark:bg-[#F4F2EC] text-white dark:text-[#111416] text-[11px] font-mono font-bold uppercase rounded hover:bg-[#087C78] dark:hover:bg-[#0AA39F] dark:hover:text-white transition flex items-center gap-1"
                    >
                      <span>Elevate to Tender</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredProblems.length === 0 && (
                <div className="col-span-2 p-12 text-center bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl space-y-3">
                  <FileText className="w-8 h-8 mx-auto text-[#596166]" />
                  <div className="text-sm font-bold text-[#111416] dark:text-white">No Matching Civic Problems</div>
                  <p className="text-xs text-[#596166] dark:text-[#949DA3]">
                    Try adjusting your search query or domain filter to see reported issues.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
