import React from 'react';
import { AppView } from '../types';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Scale, 
  Building2, 
  Rocket, 
  Activity,
  Award
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: AppView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-screen bg-neutral-100/70 dark:bg-[#070918] text-neutral-900 dark:text-neutral-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Navigation & Headline */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
              Institutional Framework
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mt-2">
            About ProcureX
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed max-w-2xl">
            Prototyping a more transparent, pilot-first way to connect public problems, startup solutions, evidence, and procurement decisions.
          </p>
        </div>

        {/* The Procurement Trilemma */}
        <div className="bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            The Public Procurement Paradox
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            The prototype explores how public procurement workflows can capture problem context, startup capability, evidence, and pilot results without assuming that any particular eligibility rule, tender clause, or procurement route applies to every department.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-indigo-950/60">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] space-y-1.5">
              <span className="text-xs font-bold text-neutral-900 dark:text-white block font-mono">18–24 Months</span>
              <span className="text-xs text-neutral-500">Average conventional civic RFP lifecycle</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] space-y-1.5">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block font-mono">14 Days</span>
              <span className="text-xs text-neutral-500">ProcureX structured challenge response window</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101432] space-y-1.5">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block font-mono">100% KPI-Tied</span>
              <span className="text-xs text-neutral-500">Milestone disbursements with zero upfront risk</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of ProcureX */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
            Core Architectural Principles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Building2 className="w-4 h-4" />
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Public Problem Discovery</h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Rather than writing restrictive 200-page tender specifications, departments articulate concise, verifiable civic bottlenecks with clear ground metrics.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Rocket className="w-4 h-4" />
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">DPIIT Matching Registry</h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                AI-assisted matching can help align startup capabilities with public challenges using structured evidence supplied by the connected data/API layer. Any resulting recommendation remains advisory and subject to human review.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Scale className="w-4 h-4" />
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Explainable AI Audit</h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Structured technical scoring, commercial inputs, and risk breakdowns are designed to support transparent human decision-making. The prototype does not make the decision itself.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Activity className="w-4 h-4" />
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Milestone Pilot Escrow</h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The workflow models milestone-linked evidence and a later scale decision. Actual disbursement and procurement routes depend on the authorised department process and applicable rules.
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Footer Banner */}
        <div className="p-6 rounded-2xl bg-neutral-900 text-white flex items-center justify-between gap-6 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-300">
                Regulatory Alignment
              </span>
            </div>
            <p className="text-xs text-neutral-300 max-w-xl">
              Designed as a prototype workflow that can be mapped to applicable procurement, financial, privacy, and departmental rules during backend/legal implementation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('innovation_hub')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shrink-0 transition"
          >
            Explore Public Hub
          </button>
        </div>

      </div>
    </div>
  );
};
