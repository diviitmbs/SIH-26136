import React from 'react';
import { AppView } from '../types';
import { Shield, Sparkles, Building2, Rocket, ArrowUpRight } from 'lucide-react';
import { ProcureXLogo } from './ProcureXLogo';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-neutral-900 dark:bg-[#04060e] text-neutral-300 border-t border-neutral-800 dark:border-indigo-950/60 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800 dark:border-indigo-950/50">
          {/* Col 1 & 2: Brand and Mission */}
          <div className="lg:col-span-2 space-y-4">
            <ProcureXLogo size="lg" inverted={true} />

            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              India's public problem discovery and evidence-led startup procurement infrastructure.
              Transforming conventional tendering bottlenecks into transparent, milestone-evidence field pilots.
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>AI-assisted evaluation · Public transparency · Pilot evidence</span>
            </div>
          </div>

          {/* Col 3: Public Observatory */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
              Public Observatory
            </span>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button 
                  onClick={() => { onNavigate('innovation_hub'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <span>Innovation Hub</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition"
                >
                  Featured Challenges
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('public_problem_submit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  Submit a Public Problem
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('pilot_dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition"
                >
                  Pilot evidence & KPIs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition"
                >
                  Methodology & Bridge
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Portals */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
              Stakeholder Portals
            </span>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button 
                  onClick={() => { onNavigate('gov_portal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Building2 className="w-3 h-3 text-indigo-400" />
                  <span>Government Portal</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('gov_challenge_builder'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition"
                >
                  Challenge Statement Builder
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('startup_portal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Rocket className="w-3 h-3 text-indigo-400" />
                  <span>Startup Portal</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('proposal_studio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition"
                >
                  Proposal Studio (9-Step)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
              Evaluation & Audit
            </span>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button 
                  onClick={() => { onNavigate('ai_evaluation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>AI Evaluation & Rankings</span>
                </button>
              </li>
              <li>
                <span className="text-neutral-500 text-[11px] block mt-2">
                  Zero black-box decisions. AI assists evaluation while authorized officers retain decision authority.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2026 PROCUREX · Public Innovation & Procurement Infrastructure.
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Public Transparency Standard</span>
            <span>•</span>
            <span>Milestone Evidence Model</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
