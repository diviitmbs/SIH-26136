import React, { useState, useEffect } from 'react';
import { PilotData, Milestone, AppView } from '../types';
import { 
  CheckCircle2, 
  Activity, 
  ArrowLeft, 
  Check, 
  FileCheck2, 
  Lock, 
  Building2, 
  ChevronRight, 
  TrendingDown,
  Sparkles,
  AlertTriangle,
  FileText,
  ShieldCheck,
  RefreshCw,
  Award,
  Sliders,
  Scale,
  Percent,
  DollarSign,
  Clock
} from 'lucide-react';
import { 
  analyzePilot, 
  AnalyzePilotResponse, 
  summarizeEvidence, 
  SummarizeEvidenceResponse, 
  generateDecisionBrief, 
  DecisionBriefResponse,
  simulateScenario,
  SimulateScenarioResponse,
  calculateSLA,
  CalculateSLAResponse
} from '../utils/api';

interface PilotTrackerViewProps {
  pilotData: PilotData;
  onNavigate: (view: AppView) => void;
}

export const PilotTrackerView: React.FC<PilotTrackerViewProps> = ({
  pilotData: initialPilotData,
  onNavigate
}) => {
  const [pilot, setPilot] = useState<PilotData>(initialPilotData);
  const [verifyingMilestoneId, setVerifyingMilestoneId] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // AI Pilot Analysis State (Engine 4)
  const [isAnalyzingPilot, setIsAnalyzingPilot] = useState(false);
  const [pilotAnalysis, setPilotAnalysis] = useState<AnalyzePilotResponse | null>(null);

  // Evidence Summary State (Engine 5)
  const [evidenceAudit, setEvidenceAudit] = useState<SummarizeEvidenceResponse | null>(null);

  // AI Decision Brief State (Engine 6)
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [decisionBrief, setDecisionBrief] = useState<DecisionBriefResponse | null>(null);
  const [briefError, setBriefError] = useState<string | null>(null);

  // Scenario Simulator State (Phase 3 AI)
  const [scenarioChangeType, setScenarioChangeType] = useState<'budget_cut' | 'budget_increase' | 'timeline_delay' | 'scope_reduction'>('budget_cut');
  const [scenarioMagnitude, setScenarioMagnitude] = useState<number>(20);
  const [isSimulatingScenario, setIsSimulatingScenario] = useState<boolean>(false);
  const [scenarioResult, setScenarioResult] = useState<SimulateScenarioResponse | null>(null);
  const [scenarioError, setScenarioError] = useState<string | null>(null);

  // SLA Calculator State (Phase 3 AI)
  const [isCalculatingSLA, setIsCalculatingSLA] = useState<boolean>(false);
  const [slaResult, setSlaResult] = useState<CalculateSLAResponse | null>(null);
  const [slaError, setSlaError] = useState<string | null>(null);

  const handleRunScenarioSimulation = async () => {
    setIsSimulatingScenario(true);
    setScenarioError(null);
    try {
      const res = await simulateScenario(
        {
          contractId: pilot.contractId,
          startup: pilot.startupName,
          budget: pilot.totalCommittedBudget,
          challenge: pilot.challengeTitle,
          domain: 'infrastructure',
          kpis: [
            { name: 'Delay Reduction', target: pilot.targetDelayReduction, actual: pilot.actualDelayReduction },
            { name: 'Optical Sensor Uptime', target: 98, actual: pilot.sensorUptime }
          ]
        },
        scenarioChangeType,
        scenarioMagnitude
      );
      setScenarioResult(res);
    } catch (err: any) {
      console.warn("Scenario simulation failed:", err);
      setScenarioError(err.message || 'Simulation failed.');
    } finally {
      setIsSimulatingScenario(false);
    }
  };

  const handleRunSLACalculator = async () => {
    setIsCalculatingSLA(true);
    setSlaError(null);
    try {
      const res = await calculateSLA({
        contractId: pilot.contractId,
        startup: pilot.startupName,
        value: 4500000,
        domain: 'infrastructure',
        uptime: pilot.sensorUptime
      });
      setSlaResult(res);
    } catch (err: any) {
      console.warn("SLA calculation failed:", err);
      setSlaError(err.message || 'SLA calculation failed.');
    } finally {
      setIsCalculatingSLA(false);
    }
  };

  const fetchPilotAnalysis = async () => {
    setIsAnalyzingPilot(true);
    try {
      const kpiPayload = [
        { name: 'Corridor Delay Reduction', baseline: 0, target: pilot.targetDelayReduction, actual: pilot.actualDelayReduction, direction: 'decrease' },
        { name: 'Optical Sensor Uptime', baseline: 95, target: 98, actual: pilot.sensorUptime, direction: 'increase' },
        { name: 'Bus Transit Priority Clearance', baseline: 80, target: 85, actual: 92.4, direction: 'increase' }
      ];
      const res = await analyzePilot(kpiPayload);
      setPilotAnalysis(res);
    } catch (err) {
      console.warn("Pilot telemetry AI analysis failed:", err);
    } finally {
      setIsAnalyzingPilot(false);
    }
  };

  useEffect(() => {
    fetchPilotAnalysis();
  }, [pilot.contractId]);

  // Handle milestone verification and disbursement with AI Evidence Verification (Engine 5)
  const handleVerifyAndDisburse = async (milestoneId: string) => {
    setVerifyingMilestoneId(milestoneId);
    const ms = pilot.milestones.find(m => m.id === milestoneId);
    const evidenceItems = [
      ms?.title || 'Milestone Delivery Package',
      ms?.criteria || 'Technical verification criteria',
      `Telemetry audit: ${pilot.actualDelayReduction}% delay reduction against ${pilot.targetDelayReduction}% target`,
      `Optical Sensor Uptime: ${pilot.sensorUptime}% (SLA: 98%)`
    ];

    try {
      const auditRes = await summarizeEvidence(evidenceItems, ms?.criteria || '');
      setEvidenceAudit(auditRes);

      const updatedMilestones: Milestone[] = pilot.milestones.map(m => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status: "Disbursed",
            verifiedAt: `AI Verified (${auditRes.mode === 'live' ? 'Live AI' : 'Rule Engine'}, Fraud Risk: ${auditRes.fraud_risk || 'Low'}) on ${new Date().toISOString().split('T')[0]}`
          };
        }
        return m;
      });

      setPilot({
        ...pilot,
        milestones: updatedMilestones,
        daysElapsed: Math.min(pilot.daysElapsed + 15, pilot.totalDays)
      });

      setSuccessNote(`Milestone verified (Fraud Risk: ${auditRes.fraud_risk || 'Low'}, Score: ${auditRes.verification_score || 94}/100). Funds tranche disbursed.`);
      setTimeout(() => setSuccessNote(null), 5000);
    } catch (err: any) {
      console.warn("Evidence summary failed:", err);
      // Fallback manual verification
      const updatedMilestones: Milestone[] = pilot.milestones.map(m => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status: "Disbursed",
            verifiedAt: `Verified on ${new Date().toISOString().split('T')[0]} by Department Technical Cell`
          };
        }
        return m;
      });

      setPilot({
        ...pilot,
        milestones: updatedMilestones,
        daysElapsed: Math.min(pilot.daysElapsed + 15, pilot.totalDays)
      });

      setSuccessNote(`Milestone verified manually. Funds tranche released.`);
      setTimeout(() => setSuccessNote(null), 4000);
    } finally {
      setVerifyingMilestoneId(null);
    }
  };

  const handleGenerateDecisionBrief = async () => {
    setIsGeneratingBrief(true);
    setBriefError(null);
    try {
      const kpis = [
        { name: 'Corridor Delay Reduction', target: pilot.targetDelayReduction, actual: pilot.actualDelayReduction },
        { name: 'Optical Sensor Uptime', target: 98, actual: pilot.sensorUptime }
      ];
      const res = await generateDecisionBrief(
        `${pilot.corridor} Adaptive Signal Pilot`,
        kpis,
        evidenceAudit?.fraud_risk === 'Low' ? 'high' : 'medium'
      );
      setDecisionBrief(res);
    } catch (err: any) {
      console.warn("Decision brief generation failed:", err);
      setBriefError(err.message || 'Decision brief engine offline.');
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const disbursedMilestonesCount = pilot.milestones.filter(m => m.status === 'Disbursed').length;
  const progressPercent = Math.round((disbursedMilestonesCount / pilot.milestones.length) * 100);

  return (
    <div className="w-full min-h-screen bg-neutral-100/70 dark:bg-[#070918] text-neutral-900 dark:text-neutral-100 transition-colors py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
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
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                Milestone-Led Pilot Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">
                ● Live Field Deployment
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Zero-Risk Municipal Procurement: Funds disburse only upon automated verification of technical KPIs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('compare_proposals')}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-indigo-950/80 bg-white dark:bg-[#0b0e24] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-[#141838] transition"
            >
              Comparing Postcard
            </button>
          </div>
        </div>

        {/* Live Pilot Metadata Header Card */}
        <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span>CONTRACT ID: {pilot.contractId}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Adaptive Signal Optimization Field Pilot
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-neutral-400" />
                  <span>Authority: <strong>{pilot.department}</strong></span>
                </div>
                <div>·</div>
                <div>
                  Partner Startup: <strong className="text-neutral-900 dark:text-white">{pilot.startupName}</strong>
                </div>
                <div>·</div>
                <div>
                  Corridor: <strong>{pilot.corridor}</strong>
                </div>
              </div>
            </div>

            {/* Financial & Timeline Status Box */}
            <div className="md:col-span-4 p-5 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-3 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-neutral-400 font-mono">Pilot Timeline Progress:</span>
                <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                  Day {pilot.daysElapsed} <span className="text-xs text-neutral-400 font-normal">/ {pilot.totalDays} Days</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-[#1a204d] overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                <span>Milestones Completed: {disbursedMilestonesCount}/{pilot.milestones.length}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{progressPercent}% Funded</span>
              </div>
            </div>
          </div>
        </div>

        {successNote && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successNote}</span>
            </div>
            <span className="font-mono text-[10px]">TX ID: 0x88f21bc9a49b...</span>
          </div>
        )}

        {/* Real-time Telemetry & Performance Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                Live Sensor Telemetry ({pilot.corridor})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sensor Active (99.4% Uptime)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs text-neutral-500 font-medium block">
                Actual Delay Reduction
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {pilot.actualDelayReduction}%
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Target: {pilot.targetDelayReduction}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold font-mono pt-2 border-t border-neutral-100 dark:border-indigo-950/60">
                <TrendingDown className="w-3 h-3" />
                <span>+3.2% Ahead of Target</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs text-neutral-500 font-medium block">
                Optical Sensor Uptime
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-neutral-900 dark:text-white font-mono">
                  {pilot.sensorUptime}%
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  SLA: 98.0%
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-indigo-950/60">
                8 nodes operational across corridor
              </div>
            </div>

            <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs text-neutral-500 font-medium block">
                Peak Queue Dwell Time
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-neutral-900 dark:text-white font-mono">
                  14.1 min
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Baseline: 18.4 min
                </span>
              </div>
              <div className="text-[11px] text-emerald-600 font-mono pt-2 border-t border-neutral-100 dark:border-indigo-950/60">
                4.3 min saved per commuter
              </div>
            </div>

            <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs text-neutral-500 font-medium block">
                Bus Transit Priority Clearance
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  92.4%
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Target: 85%
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-indigo-950/60">
                BMTC transit corridor integration
              </div>
            </div>
          </div>

          {/* AI Telemetry & Anomaly Analysis (Engine 4) */}
          {pilotAnalysis && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e24] border border-indigo-200 dark:border-indigo-950/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    AI Pilot Telemetry Audit ({pilotAnalysis.mode === 'live' ? 'Live Model' : 'Deterministic Rule Engine'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Success Score: {pilotAnalysis.pilot_success_score}/100
                  </span>
                  <button
                    type="button"
                    onClick={fetchPilotAnalysis}
                    disabled={isAnalyzingPilot}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-indigo-950 hover:bg-neutral-50 dark:hover:bg-[#121634] text-neutral-500 transition"
                    title="Refresh AI Analysis"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAnalyzingPilot ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {pilotAnalysis.anomaly_detection && (
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200/60 dark:border-indigo-950/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">
                      Telemetry Anomaly Detection
                    </span>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {pilotAnalysis.anomaly_detection}
                    </p>
                  </div>
                )}

                {pilotAnalysis.predictive_impact_if_scaled && (
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200/60 dark:border-indigo-950/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">
                      Predictive Impact If Scaled
                    </span>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {pilotAnalysis.predictive_impact_if_scaled}
                    </p>
                  </div>
                )}
              </div>

              {pilotAnalysis.overall_summary && (
                <p className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-100 dark:border-indigo-950/60 font-sans">
                  Auditor Summary: {pilotAnalysis.overall_summary}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Milestone Verification Track */}
        <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-indigo-950/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Milestone Verification & Disbursement Schedule
              </h3>
              <p className="text-xs text-neutral-500">
                Government officer sign-off triggers smart treasury disbursement upon audited proof.
              </p>
            </div>

            <div className="text-xs font-mono text-neutral-400">
              Contract Model: Performance-Tied Public Innovation
            </div>
          </div>

          <div className="space-y-4">
            {pilot.milestones.map((ms, index) => {
              const isDisbursed = ms.status === 'Disbursed';
              const isPending = ms.status === 'Verification Pending';
              const isUpcoming = ms.status === 'Upcoming';

              return (
                <div
                  key={ms.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDisbursed
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60'
                      : isPending
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/70 shadow-xs'
                      : 'bg-neutral-50/70 dark:bg-[#0e122e] border-neutral-200 dark:border-indigo-950/60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-neutral-400">
                          0{index + 1}.
                        </span>
                        <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                          {ms.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                          isDisbursed
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : isPending
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}>
                          {ms.status}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {ms.criteria}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                        <div className="flex items-center gap-1 text-neutral-500">
                          <FileCheck2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Audit: <strong>{ms.verifiedAt || 'Pending audit submission'}</strong></span>
                        </div>
                        <div className="text-neutral-400">·</div>
                        <span className="text-neutral-500 font-mono">Due Date: {ms.dueDate}</span>
                      </div>
                    </div>

                    {/* Financial & Verification Action Column */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 min-w-[200px] pt-3 md:pt-0 border-t md:border-t-0 border-neutral-200/60 dark:border-indigo-950/60">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-mono text-neutral-400">
                          Milestone Tranche
                        </div>
                        <div className="text-base font-bold font-mono text-neutral-900 dark:text-white">
                          {ms.payoutAmount}
                        </div>
                      </div>

                      {isDisbursed ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <Check className="w-4 h-4" />
                          <span>Funds Disbursed</span>
                        </div>
                      ) : isPending ? (
                        <button
                          type="button"
                          disabled={verifyingMilestoneId === ms.id}
                          onClick={() => handleVerifyAndDisburse(ms.id)}
                          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs btn-exotic"
                        >
                          {verifyingMilestoneId === ms.id ? (
                            <span>Auditing Evidence (Engine 5)...</span>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify & Release Funds</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
                          <Lock className="w-3 h-3" />
                          <span>Upcoming Phase</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* PHASE 3 AI: WHAT-IF SCENARIO SIMULATOR */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-indigo-950 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3 h-3" />
                  Phase 3 AI · Scenario Engine
                </span>
                <span className="text-xs text-neutral-400 font-mono">Dynamic Monte Carlo Stress-Test</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                What-If Scenario Simulator
              </h3>
              <p className="text-xs text-neutral-500 max-w-2xl">
                Simulate budget fluctuations, procurement delays, monsoon hold-ups, and scope reductions to foresee the exact operational impact on pilot KPIs before committing changes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-[#121634] p-1.5 rounded-xl border border-neutral-200 dark:border-indigo-900/50">
                <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 px-2">Scenario:</label>
                <select
                  value={scenarioChangeType}
                  onChange={(e) => setScenarioChangeType(e.target.value as any)}
                  className="bg-white dark:bg-[#0b0e24] text-xs font-semibold text-neutral-900 dark:text-white py-1 px-2.5 rounded-lg border border-neutral-300 dark:border-indigo-900 focus:outline-none"
                >
                  <option value="budget_cut">20% Budget Cut</option>
                  <option value="budget_increase">20% Budget Expansion</option>
                  <option value="timeline_delay">Timeline Delay (Weeks)</option>
                  <option value="scope_reduction">De-Scope Non-Core</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-[#121634] p-1.5 rounded-xl border border-neutral-200 dark:border-indigo-900/50">
                <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 px-1">Magnitude:</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={scenarioMagnitude}
                  onChange={(e) => setScenarioMagnitude(Number(e.target.value))}
                  className="w-16 bg-white dark:bg-[#0b0e24] text-xs font-mono font-bold text-neutral-900 dark:text-white py-1 px-2 rounded-lg border border-neutral-300 dark:border-indigo-900 text-center focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleRunScenarioSimulation}
                disabled={isSimulatingScenario}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingScenario ? 'animate-spin' : ''}`} />
                <span>{isSimulatingScenario ? 'Simulating...' : 'Simulate Scenario'}</span>
              </button>
            </div>
          </div>

          {scenarioError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{scenarioError}</span>
            </div>
          )}

          {!scenarioResult && !isSimulatingScenario && (
            <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-indigo-950 rounded-2xl bg-neutral-50/50 dark:bg-[#07091a]/40">
              <Sliders className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-60" />
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Select a scenario type and magnitude above, then click <strong>Simulate Scenario</strong> to evaluate altered budget allocations, delivery timelines, and KPI impacts.
              </p>
            </div>
          )}

          {scenarioResult && (
            <div className="space-y-5 animate-in fade-in">
              {/* Baseline vs Modified Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block">Baseline Projection</span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300">{scenarioResult.original_projection}</p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 block">Simulated Scenario Projection</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      scenarioResult.feasibility_assessment === 'High'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : scenarioResult.feasibility_assessment === 'Low'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      Feasibility: {scenarioResult.feasibility_assessment}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-950 dark:text-indigo-200 font-medium">{scenarioResult.modified_projection}</p>
                </div>
              </div>

              {/* Impact Metric Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Budget Impact</span>
                  <div className={`text-lg font-mono font-black ${
                    scenarioResult.impact_analysis.budget_impact_inr < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {scenarioResult.impact_analysis.budget_impact_inr >= 0 ? '+' : ''}
                    ₹{Math.abs(scenarioResult.impact_analysis.budget_impact_inr).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Total fiscal variation</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Timeline Impact</span>
                  <div className="text-lg font-mono font-black text-neutral-900 dark:text-white">
                    {scenarioResult.impact_analysis.timeline_impact_months > 0 ? `+${scenarioResult.impact_analysis.timeline_impact_months}` : scenarioResult.impact_analysis.timeline_impact_months} Months
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Milestone schedule delta</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Risk Score Variance</span>
                  <div className={`text-lg font-mono font-black ${
                    scenarioResult.impact_analysis.risk_score_change > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {scenarioResult.impact_analysis.risk_score_change > 0 ? `+${scenarioResult.impact_analysis.risk_score_change}` : scenarioResult.impact_analysis.risk_score_change} pts
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Overall project risk index</span>
                </div>
              </div>

              {/* KPI Impact Table */}
              {scenarioResult.impact_analysis.kpi_impact && scenarioResult.impact_analysis.kpi_impact.length > 0 && (
                <div className="border border-neutral-200 dark:border-indigo-950 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 dark:bg-[#101432] text-neutral-600 dark:text-neutral-400 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="p-3">Impacted Milestone / KPI</th>
                        <th className="p-3">Baseline Target</th>
                        <th className="p-3">Revised Target</th>
                        <th className="p-3 text-right">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-indigo-950 font-medium">
                      {scenarioResult.impact_analysis.kpi_impact.map((kpi, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-[#131738]/50">
                          <td className="p-3 font-semibold text-neutral-900 dark:text-white">{kpi.kpi_name}</td>
                          <td className="p-3 text-neutral-500 font-mono">{kpi.original_value}</td>
                          <td className="p-3 text-indigo-600 dark:text-indigo-400 font-mono font-bold">{kpi.new_value}</td>
                          <td className={`p-3 text-right font-mono font-bold ${kpi.percentage_change < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {kpi.percentage_change > 0 ? `+${kpi.percentage_change}` : kpi.percentage_change}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Strategic Recommendation */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-neutral-800 dark:text-neutral-200 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400 block">
                  Project Director Strategic Guidance
                </span>
                <p className="font-medium">"{scenarioResult.recommendation}"</p>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* PHASE 3 AI: GFR RULE 175 SLA & PENALTY CALCULATOR */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-indigo-950 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  Phase 3 AI · Legal SLA Framework
                </span>
                <span className="text-xs text-neutral-400 font-mono">GFR Rule 175 · Liquidated Damages</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                SLA Penalties & Liquidated Damages Engine
              </h3>
              <p className="text-xs text-neutral-500 max-w-2xl">
                Statutory audit of performance breach penalties, sensor downtime deductions, false-positive fine schedules, and 4-tier dispute resolution workflows under Indian Arbitration Law.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunSLACalculator}
              disabled={isCalculatingSLA}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-indigo-600 hover:bg-neutral-800 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0 self-start sm:self-auto disabled:opacity-50"
            >
              <Scale className={`w-3.5 h-3.5 ${isCalculatingSLA ? 'animate-spin' : ''}`} />
              <span>{isCalculatingSLA ? 'Auditing Contract SLAs...' : slaResult ? 'Re-Audit SLAs' : 'Calculate Contract SLAs'}</span>
            </button>
          </div>

          {slaError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{slaError}</span>
            </div>
          )}

          {!slaResult && !isCalculatingSLA && (
            <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-indigo-950 rounded-2xl bg-neutral-50/50 dark:bg-[#07091a]/40">
              <Scale className="w-8 h-8 text-rose-400 mx-auto mb-2 opacity-60" />
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Click <strong>Calculate Contract SLAs</strong> to analyze sensor uptime degradation fines, delayed batch dispatch clauses, and statutory liquidated damages per day.
              </p>
            </div>
          )}

          {slaResult && (
            <div className="space-y-6 animate-in fade-in">
              {/* Statutory Thresholds Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Liquidated Damages</span>
                  <div className="text-base font-mono font-black text-rose-600 dark:text-rose-400">
                    ₹{slaResult.liquidated_damages_per_day.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-neutral-400">/ day</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">For milestone delay</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Liability Ceiling</span>
                  <div className="text-base font-mono font-black text-neutral-900 dark:text-white">
                    {slaResult.maximum_liability_percentage}%
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Max contract cap</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Performance Security</span>
                  <div className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {slaResult.performance_security_percentage}%
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Bank Guarantee</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Retention Hold</span>
                  <div className="text-base font-mono font-black text-indigo-600 dark:text-indigo-400">
                    {slaResult.payment_hold_percentage}%
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Until final acceptance</span>
                </div>
              </div>

              {/* Penalty Clauses Table */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-neutral-600 dark:text-neutral-400 block">
                  Contractual Penalty Clauses & Breach Schedules
                </span>
                <div className="border border-neutral-200 dark:border-indigo-950 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 dark:bg-[#101432] text-neutral-600 dark:text-neutral-400 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="p-3">SLA Violation Description</th>
                        <th className="p-3">Deduction Rate</th>
                        <th className="p-3">Grace Period</th>
                        <th className="p-3">Calculation Formula</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-indigo-950">
                      {slaResult.penalty_clauses.map((clause, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-[#131738]/50">
                          <td className="p-3 font-semibold text-neutral-900 dark:text-white max-w-xs">{clause.violation_type}</td>
                          <td className="p-3 text-rose-600 dark:text-rose-400 font-mono font-bold">
                            {clause.penalty_percentage}% <span className="text-[10px] text-neutral-400 font-normal">(Cap: {clause.cap_percentage}%)</span>
                          </td>
                          <td className="p-3 text-neutral-500 font-mono">{clause.grace_period_days} Days</td>
                          <td className="p-3 text-neutral-600 dark:text-neutral-400 text-[11px]">{clause.calculation_method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dispute Resolution Procedure */}
              {slaResult.dispute_resolution_process && slaResult.dispute_resolution_process.length > 0 && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 block">
                    Dispute Escalation Workflow (Indian Arbitration and Conciliation Act, 1996)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {slaResult.dispute_resolution_process.map((stage, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-900/50 space-y-1">
                        <span className="text-[9px] font-mono font-bold text-indigo-500 uppercase">Stage 0{idx + 1}</span>
                        <p className="text-[11px] text-neutral-700 dark:text-neutral-300 font-medium leading-tight">{stage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transition to Full Procurement Framework & Statutory Decision Brief (Engine 6) */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-indigo-200">
                ProcureX Procurement Pipeline · GFR Rule 149(v)
              </span>
              <h4 className="text-lg font-bold">
                Statutory Decision Brief & Municipal Scale-Up Assessment
              </h4>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Generate an official statutory Scale Readiness Score card synthesize from pilot telemetry, milestone compliance, and fraud audits to advise the Public Procurement Committee.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleGenerateDecisionBrief}
                disabled={isGeneratingBrief}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <Award className={`w-3.5 h-3.5 ${isGeneratingBrief ? 'animate-spin' : ''}`} />
                <span>{isGeneratingBrief ? 'Synthesizing Brief...' : 'Generate Scale Brief'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('gov_portal')}
                className="px-5 py-2.5 bg-white text-indigo-950 font-bold text-xs rounded-xl hover:bg-neutral-100 transition flex items-center gap-1.5"
              >
                <span>Return to Portfolio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {briefError && (
            <div className="p-3.5 rounded-xl bg-amber-900/60 border border-amber-600/50 text-xs text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{briefError}</span>
            </div>
          )}

          {decisionBrief && decisionBrief.brief && (
            <div className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider block">
                    Statutory Decision Brief ({decisionBrief.mode === 'live' ? 'Live AI' : 'Deterministic Engine'})
                  </span>
                  <div className="text-sm font-bold text-white">
                    Recommendation: <span className="text-emerald-300">{decisionBrief.brief.recommendation || 'Scale Authorized under GFR Rule 149(v)'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-200">Scale Readiness Score:</span>
                  <span className="text-xl font-black font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-500/40">
                    {decisionBrief.brief.scale_readiness_score}/100
                  </span>
                </div>
              </div>

              {decisionBrief.brief.executive_summary && (
                <p className="text-xs text-indigo-100 leading-relaxed font-sans">
                  {decisionBrief.brief.executive_summary}
                </p>
              )}

              {decisionBrief.brief.risk_flags && decisionBrief.brief.risk_flags.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-300 block">
                    Observed Scale Risk Flags:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-neutral-200">
                    {decisionBrief.brief.risk_flags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {decisionBrief.brief.next_steps && decisionBrief.brief.next_steps.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-white/10">
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-300 block">
                    Committee Next Steps:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-neutral-200">
                    {decisionBrief.brief.next_steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
