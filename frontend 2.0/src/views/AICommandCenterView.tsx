import React, { useState } from 'react';
import { AppView } from '../types';
import { 
  Sparkles, 
  Cpu, 
  Bot, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Scale, 
  Sliders, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Users, 
  Search, 
  Check 
} from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

interface AICommandCenterViewProps {
  onNavigate: (view: AppView) => void;
}

interface AICardConfig {
  id: string;
  name: string;
  endpoint: string;
  icon: any;
  defaultInput: string;
  inputType: 'text' | 'textarea' | 'select';
  selectOptions?: Array<{ label: string; value: string }>;
  payloadBuilder: (val: string) => any;
  description: string;
  phase: 1 | 2 | 3;
}

export const AICommandCenterView: React.FC<AICommandCenterViewProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'phase1' | 'phase2' | 'phase3'>('all');
  const [inputs, setInputs] = useState<Record<string, string>>({
    'structure-challenge': 'Potholes causing accidents on ring road during monsoon',
    'match-startups': 'CHAL-2026-001',
    'evaluate-proposal': 'PROP-2026-001',
    'analyze-pilot': 'PILOT-2026-042',
    'verify-evidence': 'https://drive.google.com/audit-telemetry-oct2026.pdf',
    'decision-copilot': 'Urban AI Signal Pilot Evaluation Committee Review',
    'verify-citizen': 'Pothole cluster causing traffic jam at Silk Board junction',
    'optimize-budget': 'Adaptive Traffic Signal Optimization Pilot',
    'predict-risks': 'Smart City Infrastructure',
    'generate-contract': 'AI-Based Road Surface Inspection',
    'negotiate': 'UrbanAI Technologies',
    'forecast-impact': 'Smart Water Pipeline SCADA Sensing',
    'predict-timeline': 'Medium complexity 5-ward pilot',
    'assess-scalability': 'Smart Traffic Video Analytics Engine',
    'predict-vendor': 'UrbanAI Technologies',
    'scan-market': 'Smart City Infrastructure',
    'detect-bias': 'Selected UrbanAI over MobilityX Labs despite lower score',
    'generate-rfp': 'AI-Based Traffic Management & Dynamic Signal Control',
    'match-schemes': 'Smart City Infrastructure',
    'simulate-scenario': 'budget_cut',
    'calculate-sla': '5000000',
    'analyze-sentiment': 'Potholes and waterlogging causing accidents in Yelahanka',
    'devil-advocate': 'UrbanAI Technologies - ₹28L budget, 5 months timeline'
  });

  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cards: AICardConfig[] = [
    // PHASE 1
    {
      id: 'structure-challenge',
      name: 'Challenge Structurer',
      endpoint: 'structure-challenge',
      icon: Sparkles,
      phase: 1,
      defaultInput: 'Potholes causing accidents on ring road during monsoon',
      inputType: 'textarea',
      description: 'Converts raw civic problem statements into Section 194 parameters.',
      payloadBuilder: (val) => ({ problem: val })
    },
    {
      id: 'match-startups',
      name: 'Startup Matcher',
      endpoint: 'match-startups',
      icon: Users,
      phase: 1,
      defaultInput: 'CHAL-2026-001',
      inputType: 'text',
      description: 'Matches DPIIT-recognized startups to challenge parameters.',
      payloadBuilder: (val) => ({ challengeId: val, challenge: { title: val, domain: 'infrastructure' } })
    },
    {
      id: 'evaluate-proposal',
      name: 'Proposal Evaluator',
      endpoint: 'evaluate-proposal',
      icon: CheckCircle2,
      phase: 1,
      defaultInput: 'PROP-2026-001',
      inputType: 'text',
      description: 'Scores technical fit, commercial reasonableness, and deliverability.',
      payloadBuilder: (val) => ({ proposalId: val })
    },
    {
      id: 'analyze-pilot',
      name: 'Pilot Telemetry Analyzer',
      endpoint: 'analyze-pilot',
      icon: TrendingUp,
      phase: 1,
      defaultInput: 'PILOT-2026-042',
      inputType: 'text',
      description: 'Evaluates KPI anomalies and verifies sensor telemetry.',
      payloadBuilder: () => ({
        kpis: [
          { name: 'Delay Reduction', target: 20, actual: 24.2, status: 'achieved' },
          { name: 'Sensor Uptime', target: 98, actual: 99.4, status: 'achieved' }
        ]
      })
    },
    {
      id: 'verify-evidence',
      name: 'Evidence Verifier',
      endpoint: 'verify-evidence',
      icon: ShieldCheck,
      phase: 1,
      defaultInput: 'https://drive.google.com/audit-telemetry-oct2026.pdf',
      inputType: 'text',
      description: 'Scans milestone deliverables for tampering and generates audit trail.',
      payloadBuilder: (val) => ({ documentUrl: val })
    },
    {
      id: 'decision-copilot',
      name: 'Decision Copilot',
      endpoint: 'decision-copilot',
      icon: Bot,
      phase: 1,
      defaultInput: 'Urban AI Signal Pilot Evaluation Committee Review',
      inputType: 'text',
      description: 'Drafts statutory approval briefs for the Procurement Committee.',
      payloadBuilder: (val) => ({ context: val })
    },
    {
      id: 'verify-citizen',
      name: 'Citizen Report Verifier',
      endpoint: 'verify-citizen',
      icon: Users,
      phase: 1,
      defaultInput: 'Pothole cluster causing traffic jam at Silk Board junction',
      inputType: 'textarea',
      description: 'Verifies citizen reports and screens duplicates before dispatch.',
      payloadBuilder: (val) => ({ report: val })
    },

    // PHASE 2
    {
      id: 'optimize-budget',
      name: 'Budget Optimizer',
      endpoint: 'optimize-budget',
      icon: DollarSign,
      phase: 2,
      defaultInput: 'Adaptive Traffic Signal Optimization Pilot',
      inputType: 'text',
      description: 'Benchmarks spending against historical public tenders.',
      payloadBuilder: (val) => ({ projectData: { name: val, budget: 4500000, domain: 'infrastructure' } })
    },
    {
      id: 'predict-risks',
      name: 'Risk Predictor',
      endpoint: 'predict-risks',
      icon: AlertTriangle,
      phase: 2,
      defaultInput: 'Smart City Infrastructure',
      inputType: 'text',
      description: 'Extracts critical technical, operational, and regulatory risks.',
      payloadBuilder: (val) => ({ projectData: { domain: val, name: 'Smart City Pilot' } })
    },
    {
      id: 'generate-contract',
      name: 'Contract Generator',
      endpoint: 'generate-contract',
      icon: FileText,
      phase: 2,
      defaultInput: 'AI-Based Road Surface Inspection',
      inputType: 'text',
      description: 'Generates standard GFR 149(v) pilot milestone contract schedules.',
      payloadBuilder: (val) => ({ challengeData: { title: val }, startupData: { name: 'UrbanAI Technologies' } })
    },
    {
      id: 'negotiate',
      name: 'Autonomous Negotiator',
      endpoint: 'negotiate',
      icon: Scale,
      phase: 2,
      defaultInput: 'UrbanAI Technologies',
      inputType: 'text',
      description: 'Provides fair commercial counter-offers and milestone structures.',
      payloadBuilder: (val) => ({ challengeData: {}, startupData: { name: val } })
    },
    {
      id: 'forecast-impact',
      name: 'Impact Forecaster',
      endpoint: 'forecast-impact',
      icon: TrendingUp,
      phase: 2,
      defaultInput: 'Smart Water Pipeline SCADA Sensing',
      inputType: 'text',
      description: 'Models 5-year public value, citizen hours saved, and societal ROI.',
      payloadBuilder: (val) => ({ projectData: { name: val, beneficiaries: 50000 } })
    },
    {
      id: 'predict-timeline',
      name: 'Timeline Predictor',
      endpoint: 'predict-timeline',
      icon: Clock,
      phase: 2,
      defaultInput: 'Medium complexity 5-ward pilot',
      inputType: 'text',
      description: 'Estimates critical path milestones and probability of delay.',
      payloadBuilder: (val) => ({ projectData: { complexity: val, name: 'Pilot Project' } })
    },
    {
      id: 'assess-scalability',
      name: 'Scalability Assessor',
      endpoint: 'assess-scalability',
      icon: Cpu,
      phase: 2,
      defaultInput: 'Smart Traffic Video Analytics Engine',
      inputType: 'text',
      description: 'Measures readiness for state-wide or pan-India scaling.',
      payloadBuilder: (val) => ({ solutionData: { name: val } })
    },
    {
      id: 'predict-vendor',
      name: 'Vendor Predictor',
      endpoint: 'predict-vendor',
      icon: Building2,
      phase: 2,
      defaultInput: 'UrbanAI Technologies',
      inputType: 'text',
      description: 'Analyzes vendor track record and operational delivery index.',
      payloadBuilder: (val) => ({ startupData: { name: val } })
    },
    {
      id: 'scan-market',
      name: 'Market Scanner',
      endpoint: 'scan-market',
      icon: Search,
      phase: 2,
      defaultInput: 'Smart City Infrastructure',
      inputType: 'text',
      description: 'Surveys current landscape and emerging GovTech alternatives.',
      payloadBuilder: (val) => ({ domain: val })
    },
    {
      id: 'detect-bias',
      name: 'Bias Detector',
      endpoint: 'detect-bias',
      icon: Scale,
      phase: 2,
      defaultInput: 'Selected UrbanAI over MobilityX Labs despite lower score',
      inputType: 'textarea',
      description: 'Audits selection processes for procedural fairness and neutrality.',
      payloadBuilder: (val) => ({ decisionData: { summary: val } })
    },

    // PHASE 3: UNFAIR ADVANTAGE
    {
      id: 'generate-rfp',
      name: 'RFP Generator',
      endpoint: 'generate-rfp',
      icon: FileText,
      phase: 3,
      defaultInput: 'AI-Based Traffic Management & Dynamic Signal Control',
      inputType: 'text',
      description: 'Drafts comprehensive GFR 2017 compliant tender specifications with technical weightages.',
      payloadBuilder: (val) => ({ challengeData: { title: val } })
    },
    {
      id: 'match-schemes',
      name: 'Scheme Matcher',
      endpoint: 'match-schemes',
      icon: Building2,
      phase: 3,
      defaultInput: 'Smart City Infrastructure',
      inputType: 'text',
      description: 'Matches challenges with Central & State grants (Smart Cities, Digital India, AMRUT 2.0).',
      payloadBuilder: (val) => ({ challengeData: { domain: val } })
    },
    {
      id: 'simulate-scenario',
      name: 'Scenario Simulator',
      endpoint: 'simulate-scenario',
      icon: Sliders,
      phase: 3,
      defaultInput: 'budget_cut',
      inputType: 'select',
      selectOptions: [
        { label: '20% Budget Cut', value: 'budget_cut' },
        { label: '20% Budget Expansion', value: 'budget_increase' },
        { label: '3 Month Timeline Delay', value: 'timeline_delay' },
        { label: 'De-Scope Non-Core Features', value: 'scope_reduction' }
      ],
      description: 'Simulates what-if budget cuts, schedule slippages, and scope changes on KPI deliveries.',
      payloadBuilder: (val) => ({
        projectData: { name: 'Smart Infrastructure Pilot' },
        changeType: val,
        changeValue: 20
      })
    },
    {
      id: 'calculate-sla',
      name: 'SLA Calculator',
      endpoint: 'calculate-sla',
      icon: Scale,
      phase: 3,
      defaultInput: '5000000',
      inputType: 'text',
      description: 'Calculates GFR Rule 175 liquidated damages, uptime breach fines, and dispute tiers.',
      payloadBuilder: (val) => ({ contractData: { value: parseFloat(val) || 5000000, domain: 'infrastructure' } })
    },
    {
      id: 'analyze-sentiment',
      name: 'Sentiment Analyzer',
      endpoint: 'analyze-sentiment',
      icon: TrendingUp,
      phase: 3,
      defaultInput: 'Potholes and waterlogging causing accidents in Yelahanka',
      inputType: 'textarea',
      description: 'Analyzes public grievance urgency, Twitter sentiment breakdown, and trending hashtags.',
      payloadBuilder: (val) => ({ problemStatement: val })
    },
    {
      id: 'devil-advocate',
      name: "Devil's Advocate",
      endpoint: 'devil-advocate',
      icon: Scale,
      phase: 3,
      defaultInput: 'UrbanAI Technologies - ₹28L budget, 5 months timeline',
      inputType: 'textarea',
      description: 'Adversarial multi-agent audit pitting optimist against skeptic before final award.',
      payloadBuilder: (val) => ({ proposalData: { summary: val } })
    }
  ];

  const handleInputChange = (id: string, val: string) => {
    setInputs(prev => ({ ...prev, [id]: val }));
  };

  const runAICall = async (card: AICardConfig) => {
    const val = inputs[card.id] || card.defaultInput;
    setLoading(prev => ({ ...prev, [card.id]: true }));
    setErrors(prev => ({ ...prev, [card.id]: '' }));

    try {
      const payload = card.payloadBuilder(val);
      const res = await fetch(`${API_BASE_URL}/api/ai/${card.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResults(prev => ({ ...prev, [card.id]: data }));
    } catch (err: any) {
      console.warn(`Error running ${card.endpoint}:`, err);
      setErrors(prev => ({ ...prev, [card.id]: err.message || 'Execution failed. Ensure backend is running.' }));
    } finally {
      setLoading(prev => ({ ...prev, [card.id]: false }));
    }
  };

  const filteredCards = cards.filter(c => {
    if (activeFilter === 'phase1') return c.phase === 1;
    if (activeFilter === 'phase2') return c.phase === 2;
    if (activeFilter === 'phase3') return c.phase === 3;
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-neutral-100/70 dark:bg-[#070918] text-neutral-900 dark:text-neutral-100 transition-colors py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('gov_portal')}
                  className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#121634] text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
                  title="Back to Government Portal"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 dark:text-indigo-300 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  ProcureX AI Suite · All 23 Engines
                </span>
                <span className="text-xs text-neutral-400">·</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Backend: 5000 Active
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                Autonomous AI Command Center
              </h1>

              <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl">
                Unified testing and orchestration cockpit for all Phase 1 Core Pipelines, Phase 2 Autonomous Engines, and Phase 3 Unfair Advantage Superpowers.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-[#121634] p-1.5 rounded-xl border border-neutral-200 dark:border-indigo-900/50 self-start md:self-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeFilter === 'all'
                    ? 'bg-white dark:bg-[#0b0e24] text-neutral-900 dark:text-white shadow-xs font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                All Engines ({cards.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('phase1')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeFilter === 'phase1'
                    ? 'bg-white dark:bg-[#0b0e24] text-neutral-900 dark:text-white shadow-xs font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Phase 1 Core (7)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('phase2')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeFilter === 'phase2'
                    ? 'bg-white dark:bg-[#0b0e24] text-neutral-900 dark:text-white shadow-xs font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Phase 2 Engines (10)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('phase3')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeFilter === 'phase3'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700'
                }`}
              >
                ⚡ Phase 3 Superpowers (6)
              </button>
            </div>
          </div>
        </div>

        {/* AI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => {
            const Icon = card.icon;
            const isCardLoading = !!loading[card.id];
            const cardResult = results[card.id];
            const cardError = errors[card.id];
            const currentVal = inputs[card.id] !== undefined ? inputs[card.id] : card.defaultInput;

            return (
              <div 
                key={card.id}
                className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-5 shadow-xs hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        card.phase === 3 
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' 
                          : card.phase === 2 
                          ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' 
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          {card.name}
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-400">
                          POST /api/ai/{card.endpoint}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      card.phase === 3 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                        : card.phase === 2 
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' 
                        : 'bg-neutral-100 text-neutral-700 dark:bg-[#121634] dark:text-neutral-300'
                    }`}>
                      Phase {card.phase}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 line-clamp-2">
                    {card.description}
                  </p>

                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block">
                      Input Payload
                    </label>
                    {card.inputType === 'textarea' ? (
                      <textarea
                        rows={2}
                        value={currentVal}
                        onChange={(e) => handleInputChange(card.id, e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    ) : card.inputType === 'select' ? (
                      <select
                        value={currentVal}
                        onChange={(e) => handleInputChange(card.id, e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      >
                        {card.selectOptions?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleInputChange(card.id, e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => runAICall(card)}
                    disabled={isCardLoading}
                    className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCardLoading ? 'animate-spin' : ''}`} />
                    <span>{isCardLoading ? 'AI Computing...' : `Execute ${card.name}`}</span>
                  </button>

                  {cardError && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] rounded-lg">
                      {cardError}
                    </div>
                  )}

                  {cardResult && (
                    <div className="p-3 bg-neutral-900 dark:bg-[#060814] text-emerald-400 rounded-xl font-mono text-[11px] max-h-48 overflow-y-auto border border-neutral-800 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-neutral-800 pb-1 mb-1">
                        <span>HTTP 200 OK</span>
                        <span>{Object.keys(cardResult).length} response keys</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-[10px] text-emerald-300 font-mono">
                        {JSON.stringify(cardResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
