import React, { useState } from 'react';
import { Challenge } from '../types';
import { 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Activity, 
  BarChart3, 
  CheckCircle2, 
  Rocket, 
  TrendingUp,
  ShieldCheck,
  Lock,
  Compass
} from 'lucide-react';

interface ProjectJourneyProps {
  challenge: Challenge;
}

interface JourneyStep {
  key: string;
  label: string;
  icon: React.ElementType;
  status: 'completed' | 'active' | 'upcoming';
  headline: string;
  summary: string;
  publicMetrics?: { label: string; value: string }[];
  confidentialNotice?: string;
}

export const ProjectJourney: React.FC<ProjectJourneyProps> = ({ challenge }) => {
  const [activeStepKey, setActiveStepKey] = useState<string>('PILOT');

  const steps: JourneyStep[] = [
    {
      key: 'CHALLENGE',
      label: 'Challenge',
      icon: AlertCircle,
      status: 'completed',
      headline: 'Civic Problem Registered by Department',
      summary: challenge.problemDescription,
      publicMetrics: [
        { label: 'Registered By', value: challenge.department },
        { label: 'Jurisdiction', value: challenge.jurisdiction },
        { label: 'Priority', value: challenge.priority }
      ]
    },
    {
      key: 'INTEREST',
      label: 'Interest',
      icon: Compass,
      status: 'completed',
      headline: 'Non-Revocable Expressions of Interest Logged',
      summary: `Formal notification posted on public portal. DPIIT-registered innovators transmit binding technical readiness declarations.`,
      publicMetrics: [
        { label: 'Interest Ledger', value: 'Active expressions recorded' },
        { label: 'Technical Eligibility', value: 'DPIIT & GFR 149(v) compliance' }
      ]
    },
    {
      key: 'PROPOSALS',
      label: 'Proposals',
      icon: FileText,
      status: 'completed',
      headline: 'Structured Solution Dossiers Submitted',
      summary: `${challenge.proposalsCount} structured technical dossiers received. Commercial bids and intellectual property architectures protected under public procurement confidentiality rules.`,
      confidentialNotice: 'Detailed commercial quotations & proprietary designs remain restricted to the state technical evaluation committee.',
      publicMetrics: [
        { label: 'Dossiers Received', value: `${challenge.proposalsCount} Solutions` },
        { label: 'Evaluation Format', value: 'Double-Blind Review' }
      ]
    },
    {
      key: 'EVALUATION',
      label: 'Evaluation',
      icon: Sparkles,
      status: 'completed',
      headline: 'Multi-Factor Technical & Risk Matrix Assessment',
      summary: 'Automated requirement alignment and risk-matrix synthesis supporting departmental committee review.',
      confidentialNotice: 'Raw committee deliberation minutes and proprietary commercial score rubrics are restricted to departmental auditors.',
      publicMetrics: [
        { label: 'Evaluation Model', value: 'AI-Assisted Double-Blind Matrix' },
        { label: 'Decision Authority', value: 'Departmental Procurement Board' }
      ]
    },
    {
      key: 'PILOT',
      label: 'Pilot',
      icon: Activity,
      status: challenge.status === 'Pilot Prototype' ? 'active' : 'upcoming',
      headline: 'Controlled Field Deployment & Sensor Telemetry',
      summary: `Hardware sensor nodes and edge units deployed across designated ward junctions under live test conditions.`,
      publicMetrics: [
        { label: 'Active Day', value: `${challenge.activePilotDay || 142} of ${challenge.activePilotTotalDays || 180}` },
        { label: 'Field Boundary', value: challenge.city }
      ]
    },
    {
      key: 'EVIDENCE',
      label: 'Evidence / KPI',
      icon: BarChart3,
      status: challenge.status === 'Pilot Prototype' ? 'active' : 'upcoming',
      headline: 'Continuous Milestone Verification',
      summary: 'Real-time telemetry streams measured against statutory success thresholds (e.g. dwell time reduction, voltage stabilization).',
      publicMetrics: [
        { label: 'KPI Benchmark', value: challenge.successCriteria },
        { label: 'Telemetry Stream', value: 'Continuous Edge Telemetry' }
      ]
    },
    {
      key: 'OUTCOME',
      label: 'Outcome',
      icon: CheckCircle2,
      status: 'upcoming',
      headline: 'Independent Third-Party Verification',
      summary: 'Independent audit report validating whether defined pilot success criteria and field tolerances were achieved.',
      publicMetrics: [
        { label: 'Verification', value: 'Subject to pilot completion' },
        { label: 'Outcome Status', value: 'Field trial under active testing' }
      ]
    },
    {
      key: 'SCALE',
      label: 'Scale',
      icon: Rocket,
      status: 'upcoming',
      headline: 'State-Wide RFP & Commercial Transition',
      summary: 'Following audited pilot performance, the state may initiate GFR 149(v) commercial scale-up or public tender.',
      publicMetrics: [
        { label: 'Expansion Track', value: 'Commercial procurement transition' },
        { label: 'Next Milestone', value: 'Final telemetry signoff' }
      ]
    }
  ];

  const currentStep = steps.find(s => s.key === activeStepKey) || steps[4];

  return (
    <div className="w-full my-8 bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl p-6 sm:p-8 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2DFD7] dark:border-[#232B34]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
              GFR 149(v) Lifecycle Transparency
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#ECEAE4] dark:bg-[#1E2630] text-[#596166] dark:text-[#949DA3] font-bold">
              PROTOTYPE DATA
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#111416] dark:text-white uppercase font-sans mt-0.5">
            Public Innovation Project Journey
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#596166] dark:text-[#949DA3]">
          <ShieldCheck className="w-4 h-4 text-[#087C78] dark:text-[#0AA39F]" />
          <span>Public-Safe View · Sensitive Commercial Bids Guarded</span>
        </div>
      </div>

      {/* Steps Horizontal Rail */}
      <div className="py-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-[760px] justify-between relative px-2">
          {/* Connector bar */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-[#E2DFD7] dark:bg-[#232B34] -z-0" />

          {steps.map((step, idx) => {
            const isSelected = step.key === activeStepKey;
            const Icon = step.icon;

            let badgeStyle = "bg-[#ECEAE4] dark:bg-[#1E2630] text-[#596166] dark:text-[#949DA3] border-[#E2DFD7] dark:border-[#2E3844]";
            if (step.status === 'completed') {
              badgeStyle = "bg-[#087C78]/10 text-[#087C78] dark:text-[#0AA39F] border-[#087C78]/30 dark:border-[#0AA39F]/30";
            } else if (step.status === 'active') {
              badgeStyle = "bg-[#087C78] text-white border-[#087C78] ring-4 ring-[#087C78]/20";
            }

            if (isSelected && step.status !== 'active') {
              badgeStyle = "bg-[#111416] dark:bg-white text-white dark:text-[#111416] border-[#111416] ring-2 ring-[#B58A55]";
            }

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => setActiveStepKey(step.key)}
                className="relative z-10 flex flex-col items-center group focus:outline-none cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-md border flex items-center justify-center transition-all ${badgeStyle}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[11px] font-mono font-bold mt-2 uppercase tracking-tight transition-colors ${
                  isSelected 
                    ? 'text-[#087C78] dark:text-[#0AA39F]' 
                    : 'text-[#596166] dark:text-[#949DA3] group-hover:text-[#111416] dark:group-hover:text-white'
                }`}>
                  {step.label}
                </span>
                <span className="text-[9px] text-[#596166] dark:text-[#949DA3] tracking-tighter uppercase font-mono mt-0.5">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Information Strip */}
      <div className="mt-4 p-6 rounded-lg bg-[#F4F2EC]/60 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-white border border-[#E2DFD7] dark:border-[#2E3844]">
                Phase: {currentStep.key}
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                currentStep.status === 'completed'
                  ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60'
                  : currentStep.status === 'active'
                  ? 'text-[#087C78] dark:text-[#0AA39F] bg-[#087C78]/15'
                  : 'text-[#596166] dark:text-[#949DA3] bg-[#ECEAE4] dark:bg-[#1E2630]'
              }`}>
                {currentStep.status === 'completed' ? 'Complete in prototype' : currentStep.status === 'active' ? 'Active In Field' : 'Target Milestone'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#111416] dark:text-white">
              {currentStep.headline}
            </h3>

            <p className="text-xs sm:text-sm text-[#596166] dark:text-[#949DA3] leading-relaxed max-w-2xl">
              {currentStep.summary}
            </p>

            {currentStep.confidentialNotice && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#B58A55] bg-[#B58A55]/10 p-2.5 rounded-lg border border-[#B58A55]/30 mt-3">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>{currentStep.confidentialNotice}</span>
              </div>
            )}
          </div>

          {/* Public Metrics Strip */}
          <div className="grid grid-cols-1 gap-3 p-4 rounded-lg bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34]">
            <div className="flex items-center justify-between pb-1 border-b border-[#E2DFD7] dark:border-[#232B34]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                PROTOTYPE DATA: Registry
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#087C78]" />
            </div>
            {currentStep.publicMetrics?.map((m, i) => (
              <div key={i} className="flex items-center justify-between border-b last:border-b-0 border-[#E2DFD7] dark:border-[#232B34] pb-2 last:pb-0">
                <span className="text-xs font-mono text-[#596166] dark:text-[#949DA3]">{m.label}</span>
                <span className="text-xs font-mono font-bold text-[#111416] dark:text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
