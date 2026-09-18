import React from 'react';
import { Challenge, AppView } from '../types';
import { CheckCircle2, Eye } from 'lucide-react';

interface ChallengeSuccessViewProps {
  lastChallenge: Challenge | null;
  onNavigate: (view: AppView) => void;
  onSelectChallenge: (c: Challenge) => void;
}

export const ChallengeSuccessView: React.FC<ChallengeSuccessViewProps> = ({
  lastChallenge,
  onNavigate,
  onSelectChallenge
}) => {
  const challenge = lastChallenge || {
    id: "PX-GOV-2026-00124",
    title: "Adaptive Urban Traffic Signal Optimization using Computer Vision",
    department: "Department of Urban Development",
    city: "Bengaluru",
    state: "Karnataka",
    sector: "Urban Mobility & Traffic Optimization",
    estimatedBudget: "₹28–40 Lakhs",
    pilotDuration: "6 Months",
    responseWindowDays: 14,
    status: "Active" as const
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100/70 dark:bg-[#070918] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
      <div className="max-w-2xl w-full bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-8">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60 font-mono">
            Problem Statement Registered
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Your Challenge is Officially Published
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            The problem statement has been indexed in the Public Innovation Hub. Relevant startups can discover the challenge through the startup portal.
          </p>
        </div>

        {/* Metadata Card */}
        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#101432] border border-neutral-200 dark:border-indigo-950/70 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-indigo-950/60 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Official Identifier
              </span>
              <div className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                {challenge.id}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">
              ● Active Registry
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Title</span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {challenge.title}
            </h3>
            <span className="text-xs text-neutral-500 block">
              {challenge.department} · {challenge.city}, {challenge.state}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px]">Commercial Envelope:</span>
              <strong className="text-neutral-900 dark:text-white font-mono">{challenge.estimatedBudget}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">Response Window:</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{challenge.responseWindowDays} Days</strong>
            </div>
          </div>
        </div>

        {/* What Happens Next Sequence */}
        <div className="text-left space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block font-mono">
            What Happens Next
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block mb-1">01 ✓</span>
              <strong className="block text-neutral-900 dark:text-white">Published</strong>
              <span className="text-[11px] text-neutral-500">Indexed in observatory</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#121636] border border-neutral-200 dark:border-indigo-950/60">
              <span className="font-mono font-bold text-neutral-400 block mb-1">02 ●</span>
              <strong className="block text-neutral-900 dark:text-white">Interest Window</strong>
              <span className="text-[11px] text-neutral-500">Startups express interest</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#121636] border border-neutral-200 dark:border-indigo-950/60">
              <span className="font-mono font-bold text-neutral-400 block mb-1">03</span>
              <strong className="block text-neutral-900 dark:text-white">Proposal Studio</strong>
              <span className="text-[11px] text-neutral-500">Structured dossiers</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#121636] border border-neutral-200 dark:border-indigo-950/60">
              <span className="font-mono font-bold text-neutral-400 block mb-1">04</span>
              <strong className="block text-neutral-900 dark:text-white">AI Evaluation</strong>
              <span className="text-[11px] text-neutral-500">Side-by-side comparison</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('gov_portal')}
            className="w-full sm:w-auto px-6 py-3 bg-neutral-900 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 text-xs font-semibold rounded-xl transition btn-exotic"
          >
            Go to Government Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              if ('id' in challenge && 'problemDescription' in challenge) {
                onSelectChallenge(challenge as Challenge);
              }
              onNavigate('innovation_hub');
            }}
            className="w-full sm:w-auto px-6 py-3 border border-neutral-300 dark:border-indigo-950/80 hover:bg-neutral-50 dark:hover:bg-[#121636] text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-500" />
            <span>View in Public Observatory</span>
          </button>
        </div>
      </div>
    </div>
  );
};
