import React, { useState } from 'react';
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
  TrendingDown
} from 'lucide-react';

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

  // Handle milestone verification and disbursement simulation
  const handleVerifyAndDisburse = (milestoneId: string) => {
    setVerifyingMilestoneId(milestoneId);
    setTimeout(() => {
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

      setVerifyingMilestoneId(null);
      setSuccessNote(`Milestone verified by Technical Committee. Funds tranche released.`);
      setTimeout(() => setSuccessNote(null), 3500);
    }, 1000);
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
                            <span>Auditing Evidence...</span>
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

        {/* Transition to Full Procurement Framework */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 max-w-2xl">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-indigo-200">
              ProcureX Procurement Pipeline
            </span>
            <h4 className="text-lg font-bold">
              Successful Pilots Transition to Citywide Scale-Up
            </h4>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Upon final milestone verification, the authorised department can evaluate an appropriate scale or procurement path. Any real expansion remains subject to applicable rules and approvals.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('gov_portal')}
            className="px-5 py-2.5 bg-white text-indigo-950 font-bold text-xs rounded-xl hover:bg-neutral-100 transition shrink-0 flex items-center gap-1.5"
          >
            <span>Return to Portfolio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
