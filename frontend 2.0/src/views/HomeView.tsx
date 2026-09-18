import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Challenge, AppView } from '../types';
import { DEFAULT_CHALLENGE_IMAGES } from '../data/procurexData';
import { 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Activity, 
  MapPin,
  ShieldCheck,
  Sparkles,
  Zap,
  Droplets,
  AlertCircle,
  FileText
} from 'lucide-react';

interface HomeViewProps {
  challenges: Challenge[];
  onNavigate: (view: AppView) => void;
  onSelectChallenge: (challenge: Challenge) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  challenges, 
  onNavigate, 
  onSelectChallenge 
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [activePilotIndex, setActivePilotIndex] = useState(0);
  const [activeJourneyStep, setActiveJourneyStep] = useState<number | null>(null);

  const scrollRail = (direction: 'left' | 'right') => {
    if (railRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const journeySteps = [
    {
      num: '01',
      title: 'DISCOVER',
      subtitle: 'Problem Formulation',
      desc: 'Government departments post verified civic challenges with defined baseline metrics and clear operational constraints.'
    },
    {
      num: '02',
      title: 'EVALUATE',
      subtitle: 'Explainable AI Scoring',
      desc: 'Startups submit structured 9-step proposals evaluated by transparent multi-criteria algorithmic scoring.'
    },
    {
      num: '03',
      title: 'PILOT',
      subtitle: 'Contained Testbed',
      desc: 'Sanctioned pilot orders under GFR Rule 149(v) establish 3–6 month bounded field trials with live field sensors.'
    },
    {
      num: '04',
      title: 'MEASURE',
      subtitle: 'Continuous Telemetry',
      desc: 'Sensor streams and third-party academic audits track key performance indicators against predefined targets.'
    },
    {
      num: '05',
      title: 'PROCURE',
      subtitle: 'Evidence-Based Scale',
      desc: 'Departments make data-backed procurement decisions based on real-world test results rather than paper tenders.'
    },
    {
      num: '06',
      title: 'SCALE',
      subtitle: 'Pan-India Rollout',
      desc: 'Proven solutions receive multi-city deployment pathways and streamlined public infrastructure integration.'
    }
  ];

  const pilotHighlights = [
    {
      id: 'pilot-1',
      sector: 'Urban Mobility & Transit',
      title: 'Bengaluru Outer Ring Road Adaptive Signal Network',
      location: 'Bengaluru, Karnataka',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=85',
      stat: '-18.2%',
      statLabel: 'Dwell Time Reduction',
      status: 'Day 142 of 180 • Active Sensor Telemetry',
      startup: 'UrbanAI Technologies',
      desc: 'Synchronizing 8 gantry nodes with optical edge processing across Whitefield-Marathahalli corridor without roadside cloud latency.'
    },
    {
      id: 'pilot-2',
      sector: 'Water Infrastructure & IoT',
      title: 'Subterranean Acoustic Trunk-Line Leak Detection',
      location: 'Pune, Maharashtra',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=85',
      stat: '4.2 ML/day',
      statLabel: 'Water Loss Prevented',
      status: 'Day 89 of 180 • Active Acoustic Field Sensors',
      startup: 'AquaSense Systems',
      desc: 'Deploying non-invasive acoustic localization clamps to eliminate non-revenue water loss before road cave-ins occur.'
    },
    {
      id: 'pilot-3',
      sector: 'Clean Energy & Microgrids',
      title: 'Decentralized Sub-Second Grid Storage Balancing',
      location: 'Tumakuru Smart City, Karnataka',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=85',
      stat: '99.7%',
      statLabel: 'Voltage Feeder Stability',
      status: 'Day 110 of 180 • Sub-Second Telemetry',
      startup: 'Kavach Energy Systems',
      desc: 'Stabilizing 11kV commercial distribution lines against heavy solar rooftop variance using edge battery dispatch.'
    }
  ];

  return (
    <div className="w-full text-[#111416] dark:text-[#F4F2EC]">
      {/* ============================================================ */}
      {/* 1. ARCHITECTURAL ASYMMETRIC HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative pt-6 pb-16 lg:py-20 border-b border-[#E2DFD7] dark:border-[#232B34] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Subtle Top Metadata Line */}
          <div className="flex items-center justify-between pb-6 border-b border-[#E2DFD7] dark:border-[#232B34] text-[10px] font-mono tracking-widest text-[#596166] dark:text-[#949DA3] uppercase">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#087C78] dark:bg-[#0AA39F]" />
              <span>NATIONAL PUBLIC INNOVATION PROCUREMENT PLATFORM</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span>LAT 12.9716° N</span>
              <span>LON 77.5946° E</span>
              <span className="px-1.5 py-0.5 rounded bg-[#E2DFD7] dark:bg-[#1E2630] font-bold text-[#111416] dark:text-white">PROTOTYPE</span>
            </div>
          </div>

          {/* Asymmetric 2-Column Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 lg:pt-14">
            {/* LEFT COLUMN: Confident Editorial Typography */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow */}
              <div className="inline-block">
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase text-[#087C78] dark:text-[#0AA39F]">
                  PUBLIC INNOVATION PROCUREMENT
                </span>
              </div>

              {/* Large Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] uppercase font-sans text-[#111416] dark:text-white">
                WHERE PUBLIC PROBLEMS<br />
                MEET PRACTICAL<br />
                <span className="text-[#087C78] dark:text-[#0AA39F]">INNOVATION.</span>
              </h1>

              {/* Supporting Text with breathing room */}
              <p className="text-base sm:text-lg text-[#596166] dark:text-[#A7AFB5] font-normal leading-relaxed max-w-xl">
                ProcureX connects government departments facing critical infrastructure challenges with qualified deep-tech startups. 
                Replacing speculative tendering with milestone-gated field pilots, verified sensor telemetry, and accountable civic outcomes.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('innovation_hub')}
                  className="px-6 py-3.5 btn-arch-primary text-xs tracking-wider uppercase font-mono rounded-lg flex items-center gap-2 group"
                >
                  <span>Explore Innovation Hub</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('public_problem_submit')}
                  className="px-6 py-3.5 btn-arch-secondary text-xs tracking-wider uppercase font-mono rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-[#087C78] dark:text-[#0AA39F]" />
                  <span>Submit a Public Problem</span>
                </button>
              </div>

              {/* Institutional Reference Strip */}
              <div className="pt-6 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center gap-6 text-xs text-[#596166] dark:text-[#949DA3] font-mono">
                <div>
                  <span className="text-[#111416] dark:text-white font-bold block text-sm">GFR 149(v)</span>
                  <span className="text-[10px] uppercase">Pilot Sanction Rule</span>
                </div>
                <div className="h-6 w-px bg-[#E2DFD7] dark:border-[#232B34]" />
                <div>
                  <span className="text-[#111416] dark:text-white font-bold block text-sm">TRL 7–8</span>
                  <span className="text-[10px] uppercase">Deployment Readiness</span>
                </div>
                <div className="h-6 w-px bg-[#E2DFD7] dark:border-[#232B34]" />
                <div>
                  <span className="text-[#111416] dark:text-white font-bold block text-sm">100%</span>
                  <span className="text-[10px] uppercase">Sensor Verified</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Architectural Framed Image with Precision Markers */}
            <div className="lg:col-span-5 relative">
              <div className="relative border border-[#111416] dark:border-[#37424F] p-2 bg-[#ECEAE4] dark:bg-[#1E2630] rounded-lg">
                {/* Visual Image with sharp rectangular mask */}
                <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden rounded bg-[#111416]">
                  <img
                    src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=85"
                    alt="Bengaluru Modern Public Transportation and Civic Infrastructure"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                  />
                  {/* Subtle architectural vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                  {/* Top-Right Framing Coordinates */}
                  <div className="absolute top-3 right-3 text-[9px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                    CORRIDOR // BLR-ORR-08
                  </div>

                  {/* Bottom Architectural Metadata Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono">
                    <span className="bg-[#087C78] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      URBAN MOBILITY
                    </span>
                    <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                      INFRASTRUCTURE // PROTOTYPE DATA
                    </span>
                  </div>
                </div>

                {/* Construction measurement marks */}
                <div className="flex items-center justify-between px-2 pt-2 text-[9px] font-mono text-[#596166] dark:text-[#949DA3] uppercase">
                  <span>SCALE // 1:1 FIELD TRIAL</span>
                  <span>STATUS // ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 1B. DEDICATED PORTAL ENTRY DOORS (GOVERNMENT VS STARTUP) */}
      {/* ============================================================ */}
      <section className="py-12 border-b border-[#E2DFD7] dark:border-[#232B34] bg-[#ECEAE4]/50 dark:bg-[#16191D]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#087C78] dark:text-[#0AA39F]">
              PORTAL PARTITIONING // SEPARATE ACCESS FLOWS
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111416] dark:text-white mt-1">
              Select Your Designated Portal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Government Portal Door */}
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 sm:p-8 rounded-xl space-y-4 hover:border-[#087C78] transition shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#ECEAE4] dark:bg-[#1E2630] flex items-center justify-center text-[#087C78] dark:text-[#0AA39F]">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                      Option A
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#596166] dark:text-[#949DA3] uppercase">
                    GFR Rule 149(v)
                  </span>
                </div>

                <h3 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                  Government Portal
                </h3>

                <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                  For Municipal Commissioners, Department Heads, Smart City CEOs, and Nodal Engineers. Formulate civic problems, inspect double-blind technical dossiers, sanction contained pilots, and stream live sensor telemetry.
                </p>

                <div className="pt-2 text-[11px] font-mono text-[#596166] dark:text-[#949DA3] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#087C78] rounded-full" />
                    <span>Double-blind algorithm scoring matrix</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#087C78] rounded-full" />
                    <span>Statutory pilot work order issuance</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2DFD7] dark:border-[#232B34] flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('gov_login')}
                  className="flex-1 py-2.5 px-4 bg-[#111416] dark:bg-[#087C78] hover:bg-[#23465A] dark:hover:bg-[#0AA39F] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition text-center"
                >
                  Sign In to Gov Workspace
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('gov_signup')}
                  className="py-2.5 px-4 border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition text-center"
                >
                  Register Department
                </button>
              </div>
            </div>

            {/* Startup Portal Door */}
            <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-6 sm:p-8 rounded-xl space-y-4 hover:border-[#087C78] transition shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#ECEAE4] dark:bg-[#1E2630] flex items-center justify-center text-[#087C78] dark:text-[#0AA39F]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                      Option B
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#596166] dark:text-[#949DA3] uppercase">
                    DPIIT Fast-Track
                  </span>
                </div>

                <h3 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
                  Startup Portal
                </h3>

                <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
                  For DPIIT-recognized deep-tech innovators, research laboratories, and civic tech ventures. Discover municipal challenges, register non-revocable interest, submit modular 9-step dossiers, and qualify for guaranteed pilots.
                </p>

                <div className="pt-2 text-[11px] font-mono text-[#596166] dark:text-[#949DA3] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#087C78] rounded-full" />
                    <span>Prior turnover & past experience waivers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#087C78] rounded-full" />
                    <span>Direct transition to scale procurement</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2DFD7] dark:border-[#232B34] flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('startup_login')}
                  className="flex-1 py-2.5 px-4 bg-[#111416] dark:bg-[#087C78] hover:bg-[#23465A] dark:hover:bg-[#0AA39F] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition text-center"
                >
                  Sign In to Startup Workspace
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('startup_signup')}
                  className="py-2.5 px-4 border border-[#E2DFD7] dark:border-[#2E3844] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition text-center"
                >
                  Register Startup
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE PROCUREMENT JOURNEY — ARCHITECTURAL HORIZONTAL TIMELINE */}
      {/* ============================================================ */}
      <section className="py-16 lg:py-24 border-b border-[#E2DFD7] dark:border-[#232B34] bg-white/60 dark:bg-[#14181D]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Section Header with generous negative space */}
          <div className="mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#087C78] dark:text-[#0AA39F]">
              OPERATIONAL LIFECYCLE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111416] dark:text-white">
              The Procurement Journey
            </h2>
            <p className="text-sm text-[#596166] dark:text-[#949DA3] max-w-xl font-normal">
              A structured, evidence-backed pathway taking public challenges from problem statement to field-verified national procurement.
            </p>
          </div>

          {/* Horizontal Architectural Timeline (Desktop) / Vertical (Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {journeySteps.map((step, idx) => {
              const isActive = activeJourneyStep === idx;
              return (
                <div
                  key={step.num}
                  onMouseEnter={() => setActiveJourneyStep(idx)}
                  onMouseLeave={() => setActiveJourneyStep(null)}
                  className={`p-4 rounded-lg border transition-all duration-200 flex flex-col justify-between ${
                    isActive
                      ? 'border-[#087C78] bg-[#F4F2EC] dark:bg-[#1E2630] -translate-y-1 shadow-sm'
                      : 'border-[#E2DFD7] dark:border-[#232B34] bg-white dark:bg-[#16191D]'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Large Architectural Number */}
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-mono font-black ${
                        isActive ? 'text-[#087C78] dark:text-[#0AA39F]' : 'text-[#B7B4AB] dark:text-[#3B4552]'
                      }`}>
                        {step.num}
                      </span>
                      {idx < journeySteps.length - 1 && (
                        <span className="hidden lg:inline text-xs text-[#B7B4AB] dark:text-[#3B4552]">→</span>
                      )}
                    </div>

                    <div className="text-xs font-bold font-mono uppercase tracking-wider text-[#111416] dark:text-white">
                      {step.title}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-[#087C78] dark:text-[#0AA39F]">
                      {step.subtitle}
                    </div>

                    <p className="text-xs text-[#596166] dark:text-[#A7AFB5] leading-relaxed pt-1">
                      {step.desc}
                    </p>
                  </div>

                  <div className={`h-1 w-full mt-4 rounded-full transition-colors ${
                    isActive ? 'bg-[#087C78]' : 'bg-[#ECEAE4] dark:bg-[#232B34]'
                  }`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURED PUBLIC CHALLENGES (ALL PHOTOS 100% SHOWING) */}
      {/* ============================================================ */}
      <section className="py-16 lg:py-24 border-b border-[#E2DFD7] dark:border-[#232B34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#087C78] dark:text-[#0AA39F]">
                OPEN CIVIC REGISTRY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111416] dark:text-white mt-1">
                Featured Public Challenges
              </h2>
              <p className="text-xs sm:text-sm text-[#596166] dark:text-[#949DA3] mt-1 max-w-xl">
                Open department problems requiring field-tested technology solutions from DPIIT-registered startups.
              </p>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRail('left')}
                className="p-2 rounded-md border border-[#E2DFD7] dark:border-[#232B34] bg-white dark:bg-[#16191D] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white transition"
                aria-label="Previous challenges"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail('right')}
                className="p-2 rounded-md border border-[#E2DFD7] dark:border-[#232B34] bg-white dark:bg-[#16191D] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#111416] dark:text-white transition"
                aria-label="Next challenges"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('innovation_hub')}
                className="text-xs font-mono font-bold text-[#087C78] dark:text-[#0AA39F] hover:underline ml-2"
              >
                View all ({challenges.length})
              </button>
            </div>
          </div>

          {/* Challenges Rail Container */}
          <div 
            ref={railRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {challenges.map((c, idx) => (
              <div
                key={c.id}
                className="w-[320px] sm:w-[360px] shrink-0 snap-start arch-card rounded-lg overflow-hidden flex flex-col justify-between group"
              >
                {/* Visual Photography Crop with Error Fallback */}
                <div className="relative h-44 w-full overflow-hidden bg-[#111416]">
                  <img
                    src={c.imageUrl}
                    alt={c.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback to guaranteed working architectural image if URL ever fails
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = DEFAULT_CHALLENGE_IMAGES[idx % DEFAULT_CHALLENGE_IMAGES.length];
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Sector Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-white/95 text-[#111416] dark:bg-[#111416]/95 dark:text-white">
                      {c.sector.split('&')[0]}
                    </span>
                  </div>

                  {/* Budget & Location */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#0AA39F]" />
                      {c.city}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#087C78] font-bold">
                      {c.estimatedBudget}
                    </span>
                  </div>
                </div>

                {/* Card Content with generous breathing room */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[9px] font-mono text-[#596166] dark:text-[#949DA3] uppercase block mb-1">
                      {c.id} // {c.state}
                    </span>
                    <h3 className="text-sm font-bold text-[#111416] dark:text-white line-clamp-2 leading-snug group-hover:text-[#087C78] dark:group-hover:text-[#0AA39F] transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-[#596166] dark:text-[#A7AFB5] mt-2 line-clamp-2 leading-relaxed">
                      {c.publicSafeSummary}
                    </p>
                  </div>

                  {/* Details Strip */}
                  <div className="pt-3 border-t border-[#E2DFD7] dark:border-[#232B34] space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div>
                        <span className="text-[#596166] dark:text-[#949DA3] block uppercase">Department</span>
                        <span className="font-bold text-[#111416] dark:text-white truncate block">
                          {c.department.split('&')[0]}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#596166] dark:text-[#949DA3] block uppercase">Stage</span>
                        <span className="font-bold text-[#087C78] dark:text-[#0AA39F] block">
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectChallenge(c);
                        onNavigate('innovation_hub');
                      }}
                      className="w-full py-2 px-3 text-xs font-mono font-bold uppercase rounded border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC] dark:bg-[#1E2630] text-[#111416] dark:text-white hover:bg-[#087C78] hover:text-white hover:border-[#087C78] dark:hover:bg-[#087C78] transition flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Challenge Journey</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. ACTIVE CIVIC ENGINEERING SPOTLIGHT (WHAT'S MOVING) */}
      {/* ============================================================ */}
      <section className="py-16 lg:py-24 border-b border-[#E2DFD7] dark:border-[#232B34] bg-white/40 dark:bg-[#14181D]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#087C78] dark:text-[#0AA39F]">
                CORRIDOR TELEMETRY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111416] dark:text-white mt-1">
                What's Moving Across Indian Cities
              </h2>
              <p className="text-xs sm:text-sm text-[#596166] dark:text-[#949DA3] mt-1 max-w-xl">
                Verified pilot records demonstrating how ProcureX tracks field evidence, milestones, and sensor metrics before long-term scale.
              </p>
            </div>

            {/* Quick Sector Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {pilotHighlights.map((pilot, idx) => (
                <button
                  key={pilot.id}
                  type="button"
                  onClick={() => setActivePilotIndex(idx)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition whitespace-nowrap ${
                    activePilotIndex === idx
                      ? 'bg-[#111416] text-white dark:bg-[#087C78]'
                      : 'bg-[#ECEAE4] dark:bg-[#1E2630] text-[#596166] dark:text-[#949DA3] hover:bg-[#E2DFD7]'
                  }`}
                >
                  {pilot.sector.split('&')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Dominant visual narrative */}
            <div className="lg:col-span-7 arch-card rounded-lg overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pilotHighlights[activePilotIndex].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative h-[360px] sm:h-[420px] w-full"
                >
                  <img
                    src={pilotHighlights[activePilotIndex].image}
                    alt={pilotHighlights[activePilotIndex].title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=85';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-5 left-5 right-5 space-y-3 text-white">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#087C78]">
                        {pilotHighlights[activePilotIndex].sector}
                      </span>
                      <span className="text-xs font-mono flex items-center gap-1 text-white/90">
                        <MapPin className="w-3 h-3 text-[#0AA39F]" />
                        {pilotHighlights[activePilotIndex].location}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
                      {pilotHighlights[activePilotIndex].title}
                    </h3>

                    <p className="text-xs text-neutral-200 line-clamp-2 max-w-xl font-sans">
                      {pilotHighlights[activePilotIndex].desc}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <div className="px-3 py-1.5 rounded bg-black/60 backdrop-blur-md border border-white/20">
                        <span className="text-xl font-bold text-[#0AA39F] font-mono block">
                          {pilotHighlights[activePilotIndex].stat}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-300">
                          {pilotHighlights[activePilotIndex].statLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onNavigate('pilot_dashboard')}
                        className="px-4 py-2.5 bg-white text-[#111416] font-mono font-bold text-xs uppercase rounded hover:bg-neutral-200 transition flex items-center gap-1.5"
                      >
                        <Activity className="w-3.5 h-3.5 text-[#087C78]" />
                        <span>Inspect Pilot Evidence</span>
                      </button>
                      
                      <span className="text-[11px] font-mono text-neutral-300">
                        {pilotHighlights[activePilotIndex].status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Col: Interactive supporting project cards */}
            <div className="lg:col-span-5 space-y-3">
              {pilotHighlights.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setActivePilotIndex(idx)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    activePilotIndex === idx
                      ? 'border-[#087C78] bg-white dark:bg-[#1E2630] shadow-xs'
                      : 'border-[#E2DFD7] dark:border-[#232B34] bg-white/60 dark:bg-[#16191D]/60 hover:border-[#087C78]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#596166] dark:text-[#949DA3] mb-1">
                    <span className="font-mono font-bold text-[#087C78] dark:text-[#0AA39F] uppercase tracking-wider text-[10px]">
                      {p.sector}
                    </span>
                    <span className="text-[10px] font-mono">{p.location}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#111416] dark:text-white">
                    {p.title}
                  </h4>
                  <p className="text-xs text-[#596166] dark:text-[#A7AFB5] mt-1 line-clamp-2 leading-relaxed">
                    {p.desc}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#596166] dark:text-[#949DA3] text-[10px]">Startup: <strong className="text-[#111416] dark:text-white">{p.startup}</strong></span>
                    <span className="font-bold text-[#087C78] dark:text-[#0AA39F] text-[11px]">{p.stat} {p.statLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. CIVIC CALLOUT BANNER — SUBMIT A PUBLIC PROBLEM */}
      {/* ============================================================ */}
      <section className="py-14 lg:py-20 border-b border-[#E2DFD7] dark:border-[#232B34] bg-[#ECEAE4] dark:bg-[#181D23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#087C78] dark:text-[#0AA39F]">
              CIVIC CITIZEN & OFFICER REGISTRATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111416] dark:text-white">
              Notice an Unresolved Public Infrastructure Bottleneck?
            </h2>
            <p className="text-xs sm:text-sm text-[#596166] dark:text-[#A7AFB5] leading-relaxed">
              Report local civic challenges — from water loss and traffic congestion to hospital imaging delays. ProcureX formats civic reports into structured department problem statements ready for startup piloting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('public_problem_submit')}
              className="w-full sm:w-auto px-6 py-3.5 btn-arch-primary text-xs font-mono uppercase tracking-wider rounded-lg"
            >
              Report a Civic Challenge
            </button>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="w-full sm:w-auto px-6 py-3.5 btn-arch-secondary text-xs font-mono uppercase tracking-wider rounded-lg"
            >
              Learn Methodology
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
