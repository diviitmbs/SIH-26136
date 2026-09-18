import React, { useState } from 'react';
import { Challenge, Startup, Proposal, AuthUser, AppView } from '../types';
import { 
  Scale, 
  RotateCcw, 
  ArrowRight,
  ArrowLeft,
  Printer,
  Lock
} from 'lucide-react';
import { CIVIC_SERVICE_DOMAINS } from '../data/procurexData';

interface CompareViewProps {
  challenges: Challenge[];
  startups: Startup[];
  proposals: Proposal[];
  currentUser: AuthUser | null;
  onNavigate: (view: AppView) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  startups,
  proposals,
  currentUser,
  onNavigate
}) => {
  const [selectedStartupIdA, setSelectedStartupIdA] = useState<string>(startups[0]?.id || 's1');
  const [selectedStartupIdB, setSelectedStartupIdB] = useState<string>(startups[1]?.id || 's2');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState<boolean>(true);

  const eligibleStartups = startups;

  const startupA = startups.find(s => s.id === selectedStartupIdA) || null;
  const startupB = startups.find(s => s.id === selectedStartupIdB) || null;
  const proposalA = proposals.find(p => p.startupId === selectedStartupIdA) || null;
  const proposalB = proposals.find(p => p.startupId === selectedStartupIdB) || null;

  const handleGenerate = () => {
    if (!selectedStartupIdA || !selectedStartupIdB) {
      alert('Please select both Startup 1 and Startup 2 to generate the comparison.');
      return;
    }
    if (selectedStartupIdA === selectedStartupIdB) {
      alert('Please select two different startups to generate a valid comparison.');
      return;
    }
    setIsGenerated(true);
  };

  const handleReset = () => {
    setSelectedStartupIdA('');
    setSelectedStartupIdB('');
    setSelectedTopic('');
    setIsGenerated(false);
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100 dark:bg-[#060813] text-neutral-900 dark:text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-300 dark:border-indigo-950/80">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('gov_portal')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Return to Government Evaluation Portal</span>
            </button>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                GOVERNMENT EVALUATION DOSSIER
              </span>
              <span className="text-neutral-300 dark:text-indigo-950">/</span>
              <span className="text-xs text-neutral-500">
                Bilateral Startup Assessment
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
              Comparative Evaluation
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Select two proposal records to generate a prototype comparative evaluation view for authorised human review.
            </p>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950 shadow-xs space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-mono">
            <span>Select Comparison Targets</span>
            {isGenerated && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Selections</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Startup A Dropdown */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Startup Entity A
              </label>
              <select
                value={selectedStartupIdA}
                onChange={(e) => {
                  setSelectedStartupIdA(e.target.value);
                  setIsGenerated(false);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950 bg-neutral-50 dark:bg-[#121634] text-neutral-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose Startup A --</option>
                {eligibleStartups.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Startup B Dropdown */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Startup Entity B
              </label>
              <select
                value={selectedStartupIdB}
                onChange={(e) => {
                  setSelectedStartupIdB(e.target.value);
                  setIsGenerated(false);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950 bg-neutral-50 dark:bg-[#121634] text-neutral-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose Startup B --</option>
                {eligibleStartups.map(s => (
                  <option key={s.id} value={s.id} disabled={s.id === selectedStartupIdA}>
                    {s.name} ({s.state}) {s.id === selectedStartupIdA ? '(Already Selected)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Evaluation Topic / Domain Dropdown */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Evaluation Topic / Sector (Optional)
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setIsGenerated(false);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950 bg-neutral-50 dark:bg-[#121634] text-neutral-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- All Matching Domains --</option>
                {CIVIC_SERVICE_DOMAINS.map(dom => (
                  <option key={dom} value={dom}>{dom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!selectedStartupIdA || !selectedStartupIdB}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-sm ${
                selectedStartupIdA && selectedStartupIdB
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white btn-exotic cursor-pointer'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Generate Comparison Postcard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. THE OFFICIAL "COMPARING" POSTCARD */}
        <div className="relative rounded-3xl p-6 sm:p-10 border-2 border-neutral-300 dark:border-indigo-950 bg-[#faf8f5] dark:bg-[#0c0f26] text-neutral-900 dark:text-neutral-100 shadow-xl overflow-hidden">
          
          {/* Postcard Airmail Edge Styling */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-white via-indigo-600 to-red-600 opacity-60" />

          {/* Large Editorial POSTCARD STAMP */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-dashed border-neutral-300 dark:border-indigo-950 pb-6 mb-6">
            <div>
              {/* Stamp Box */}
              <div className="inline-block border-2 border-indigo-700 dark:border-indigo-400 px-4 py-1.5 rounded-lg text-indigo-800 dark:text-indigo-300 font-sans font-black tracking-widest text-lg sm:text-xl uppercase shadow-xs mb-2 transform -rotate-1">
                COMPARING
              </div>
              <div className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
                Official Institutional Bilateral Evaluation Postcard
              </div>
              {selectedTopic && (
                <div className="text-xs font-sans font-bold text-neutral-800 dark:text-neutral-200 mt-1">
                  Topic: {selectedTopic}
                </div>
              )}
            </div>

            {/* Franking Mark */}
            <div className="flex items-center gap-3 self-end sm:self-auto font-sans">
              <div className="border border-neutral-400 dark:border-indigo-800 p-2 rounded-xl text-center text-[9px] text-neutral-500 dark:text-neutral-400 uppercase font-mono">
                <div>PROCUREX AUDIT</div>
                <div className="font-bold text-neutral-800 dark:text-neutral-200">2026 BENCHMARK</div>
                <div>EXPLAINABLE EVALUATION</div>
              </div>

              {isGenerated && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2.5 rounded-xl border border-neutral-300 dark:border-indigo-900 bg-white dark:bg-[#121634] text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 transition shadow-xs"
                  title="Print / Save Postcard"
                >
                  <Printer className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Postcard Body Content */}
          {!isGenerated ? (
            <div className="py-16 text-center space-y-4 font-sans">
              <div className="w-16 h-16 rounded-2xl bg-neutral-200/70 dark:bg-indigo-950/50 text-neutral-400 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Scale className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                  Postcard Unpopulated
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Details, topic data, and architectural specs remain blank until requested. Please select Startup A and Startup B above and press <strong>&quot;Generate Comparison Postcard&quot;</strong>.
                </p>
              </div>
            </div>
          ) : startupA && startupB ? (
            /* Populated Side-by-Side Postcard Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x-2 md:divide-dashed divide-neutral-300 dark:divide-indigo-950 font-sans">
              
              {/* LEFT CARD: STARTUP A */}
              <div className="space-y-5 pt-4 md:pt-0 md:pr-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
                    Entity [A] Candidate
                  </span>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                    {startupA.name}
                  </h3>
                  <div className="text-xs text-neutral-500">
                    {startupA.legalEntity} · {startupA.city}, {startupA.state}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                    {startupA.registrationNumber}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#121636] border border-neutral-200 dark:border-indigo-950 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Solution & Technical Engine
                  </span>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {startupA.solutionName}
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {startupA.solutionSummary}
                  </p>
                </div>

                {/* Metrics Table */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                    <span className="text-[10px] text-neutral-500 block font-mono">Deployments</span>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
                      {startupA.totalDeployments} Total ({startupA.governmentDeployments} Gov)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                    <span className="text-[10px] text-neutral-500 block font-mono">Pilot Duration</span>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
                      {startupA.typicalPilotMonths}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                    <span className="text-[10px] text-neutral-500 block font-mono">Team Size</span>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
                      {startupA.teamSize} Engineers
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                    <span className="text-[10px] text-neutral-500 block font-mono">Pilot Readiness</span>
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {startupA.pilotReadiness}
                    </span>
                  </div>
                </div>

                {proposalA && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-300 font-mono">
                      Proposed Pilot Envelope
                    </span>
                    <div className="font-bold text-neutral-900 dark:text-white font-mono">
                      {proposalA.proposedBudget} (Pilot: {proposalA.pilotCost})
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT CARD: STARTUP B */}
              <div className="space-y-5 pt-6 md:pt-0 md:pl-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
                    Entity [B] Candidate
                  </span>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                    {startupB.name}
                  </h3>
                  <div className="text-xs text-neutral-500">
                    {startupB.legalEntity} · {startupB.city}, {startupB.state}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                    {startupB.registrationNumber}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#121636] border border-neutral-200 dark:border-indigo-950 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Solution & Technical Engine
                  </span>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {startupB.solutionName}
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {startupB.solutionSummary}
                  </p>
                </div>

                {/* Metrics Table */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                    <span className="text-[10px] text-neutral-500 block font-mono">Deployments</span>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
                      {startupB.totalDeployments} Total ({startupB.governmentDeployments} Gov)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                    <span className="text-[10px] text-neutral-500 block font-mono">Pilot Duration</span>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
                      {startupB.typicalPilotMonths}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                    <span className="text-[10px] text-neutral-500 block font-mono">Team Size</span>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
                      {startupB.teamSize} Engineers
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950">
                    <span className="text-[10px] text-neutral-500 block font-mono">Pilot Readiness</span>
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {startupB.pilotReadiness}
                    </span>
                  </div>
                </div>

                {proposalB && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-300 font-mono">
                      Proposed Pilot Envelope
                    </span>
                    <div className="font-bold text-neutral-900 dark:text-white font-mono">
                      {proposalB.proposedBudget} (Pilot: {proposalB.pilotCost})
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Postcard Footer Note */}
          <div className="mt-8 pt-4 border-t border-dashed border-neutral-300 dark:border-indigo-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-sans text-neutral-500">
            <div>
              Confidentiality: Technical comparisons intended strictly for Department Procurement Committees.
            </div>
            <div className="font-mono">
              PROCUREX · COMPARATIVE EVALUATION
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
