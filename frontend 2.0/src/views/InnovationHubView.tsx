import React, { useState, useMemo } from 'react';
import { Challenge, AppView } from '../types';
import { DEFAULT_CHALLENGE_IMAGES, CIVIC_SERVICE_DOMAINS } from '../data/procurexData';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  SlidersHorizontal, 
  X, 
  Lock, 
  Database,
  LayoutGrid,
  List,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';
import { ProjectJourney } from '../components/ProjectJourney';

interface InnovationHubViewProps {
  challenges: Challenge[];
  selectedChallenge?: Challenge | null;
  onSelectChallenge: (challenge: Challenge) => void;
  onNavigate: (view: AppView) => void;
}

export const InnovationHubView: React.FC<InnovationHubViewProps> = ({
  challenges,
  selectedChallenge,
  onSelectChallenge,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Selected challenge for deep-dive journey exploration & modal brief
  const [activeProject, setActiveProject] = useState<Challenge | null>(
    selectedChallenge || challenges[0] || null
  );
  const [briefModalOpen, setBriefModalOpen] = useState(false);

  // Collect unique states & statuses
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(challenges.map(c => c.state))).filter(Boolean).sort();
  }, [challenges]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(challenges.map(c => c.status))).filter(Boolean).sort();
  }, [challenges]);

  // Filtered Challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchId = c.id.toLowerCase().includes(q);
        const matchDesc = c.problemDescription.toLowerCase().includes(q);
        const matchCity = c.city.toLowerCase().includes(q);
        const matchDept = c.department.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchDesc && !matchCity && !matchDept) return false;
      }

      // 2. Sector / Domain Filter
      if (selectedSector !== 'All') {
        const sectorMatch = c.sector.toLowerCase().includes(selectedSector.toLowerCase());
        if (!sectorMatch) return false;
      }

      // 3. State Filter
      if (selectedState !== 'All' && c.state !== selectedState) {
        return false;
      }

      // 4. Status Filter
      if (selectedStatus !== 'All' && c.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [challenges, searchQuery, selectedSector, selectedState, selectedStatus]);

  const hasActiveFilters = searchQuery !== '' || selectedSector !== 'All' || selectedState !== 'All' || selectedStatus !== 'All';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSector('All');
    setSelectedState('All');
    setSelectedStatus('All');
  };

  const handleInspect = (challenge: Challenge) => {
    setActiveProject(challenge);
    onSelectChallenge(challenge);
    setBriefModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC] transition-colors py-8 px-4 sm:px-6 lg:px-10 arch-grid-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Public Intelligence Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2DFD7] dark:border-[#232B34]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#087C78] dark:text-[#0AA39F]">
              <span>Public Innovation Hub</span>
              <span className="text-[#596166]">/</span>
              <span>Civic Problem Statements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111416] dark:text-white uppercase font-sans">
              Civic Challenge Registry
            </h1>
            <p className="text-xs sm:text-sm text-[#596166] dark:text-[#949DA3] mt-1 max-w-3xl leading-relaxed">
              Public-facing challenge registry. Confidential vendor IP and commercial envelopes remain redacted to protect public procurement integrity.
            </p>
          </div>

          {/* Database connection status notice */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] text-xs shadow-xs">
            <Database className="w-4 h-4 text-[#087C78] dark:text-[#0AA39F]" />
            <div className="flex flex-col text-[11px] font-mono">
              <span className="font-bold text-[#111416] dark:text-white">Structured Transparency Data</span>
              <span className="text-[#596166] dark:text-[#949DA3] text-[10px]">Registry ready for state API integration</span>
            </div>
          </div>
        </div>

        {/* 1. TOP FILTERS ROW */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#087C78] dark:text-[#0AA39F]" />
              Filter Innovation Registry
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-[#087C78] dark:text-[#0AA39F] font-mono font-bold hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#596166] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem, city, or code..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
              />
            </div>

            {/* Sector / Domain Filter */}
            <div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] font-mono"
              >
                <option value="All">All Civic Domains ({challenges.length})</option>
                {CIVIC_SERVICE_DOMAINS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* State / Region Filter */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] font-mono"
              >
                <option value="All">All Indian States / Regions</option>
                {uniqueStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] font-mono"
              >
                <option value="All">All Procurement Stages</option>
                {uniqueStatuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. REGISTRY EXPLORER (GRID OR TABLE VIEW) */}
        <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-[#F4F2EC]/60 dark:bg-[#1C2127] border-b border-[#E2DFD7] dark:border-[#232B34] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#111416] dark:text-white uppercase tracking-wider font-mono">
                Registry Explorer
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#087C78]/15 text-[#087C78] dark:text-[#0AA39F] font-bold">
                {filteredChallenges.length} Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-[#ECEAE4] dark:bg-[#111416] p-0.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-[#1E2630] text-[#111416] dark:text-white shadow-xs'
                      : 'text-[#596166] dark:text-[#949DA3] hover:text-[#111416]'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-[#1E2630] text-[#111416] dark:text-white shadow-xs'
                      : 'text-[#596166] dark:text-[#949DA3] hover:text-[#111416]'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-xs text-[#596166] dark:text-[#949DA3] font-mono">
                <Lock className="w-3 h-3 text-[#B58A55]" />
                <span className="text-[11px]">Sanitized Public View</span>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="p-6">
              {filteredChallenges.length === 0 ? (
                <div className="py-16 text-center text-[#596166] text-xs font-mono">
                  No challenges match the active filter criteria. Click 'Reset Filters' to view all initiatives.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredChallenges.map((ch, idx) => (
                    <div
                      key={ch.id}
                      className={`arch-card rounded-lg overflow-hidden flex flex-col justify-between border transition group ${
                        activeProject?.id === ch.id
                          ? 'border-[#087C78] ring-2 ring-[#087C78]/20'
                          : 'border-[#E2DFD7] dark:border-[#232B34]'
                      }`}
                    >
                      {/* Image Header with Robust Error Fallback */}
                      <div className="relative h-44 w-full overflow-hidden bg-[#111416]">
                        <img
                          src={ch.imageUrl || ch.heroImage}
                          alt={ch.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = DEFAULT_CHALLENGE_IMAGES[idx % DEFAULT_CHALLENGE_IMAGES.length];
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/95 text-[#111416] dark:bg-[#111416]/95 dark:text-white">
                            {ch.sector.split('&')[0]}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            ch.status === 'Pilot Prototype'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#111416] text-white border border-white/20'
                          }`}>
                            {ch.status}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#0AA39F]" />
                            {ch.city}, {ch.state}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#087C78] font-bold">
                            {ch.estimatedBudget}
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#596166] dark:text-[#949DA3] uppercase mb-1">
                            <span>{ch.id}</span>
                            <span>{ch.pilotDuration}</span>
                          </div>
                          <h3 className="text-sm font-bold text-[#111416] dark:text-white leading-snug line-clamp-2 group-hover:text-[#087C78] dark:group-hover:text-[#0AA39F] transition-colors">
                            {ch.title}
                          </h3>
                          <p className="text-xs text-[#596166] dark:text-[#949DA3] mt-2 line-clamp-2 leading-relaxed">
                            {ch.publicSafeSummary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#E2DFD7] dark:border-[#232B34] space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-[#596166] dark:text-[#949DA3]">Department</span>
                            <span className="font-semibold text-[#111416] dark:text-white truncate max-w-[180px]">
                              {ch.department}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleInspect(ch)}
                              className="w-full py-2 px-3 text-xs font-mono font-bold rounded-lg bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-white hover:bg-[#E2DFD7] dark:hover:bg-[#2E3844] transition text-center"
                            >
                              Brief Specs
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveProject(ch);
                                onSelectChallenge(ch);
                              }}
                              className={`w-full py-2 px-3 text-xs font-mono font-bold rounded-lg transition text-center flex items-center justify-center gap-1 ${
                                activeProject?.id === ch.id
                                  ? 'bg-[#087C78] text-white shadow-xs'
                                  : 'bg-[#087C78]/15 text-[#087C78] dark:text-[#0AA39F] hover:bg-[#087C78] hover:text-white'
                              }`}
                            >
                              <span>Journey</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#F4F2EC]/80 dark:bg-[#1C2127] border-b border-[#E2DFD7] dark:border-[#232B34] text-[#596166] dark:text-[#949DA3] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-mono">Challenge ID</th>
                    <th className="py-3.5 px-4">Problem Statement & Objective</th>
                    <th className="py-3.5 px-4">Civic Domain</th>
                    <th className="py-3.5 px-4">Authority & State</th>
                    <th className="py-3.5 px-4">Pilot Window</th>
                    <th className="py-3.5 px-4">Procurement Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DFD7] dark:divide-[#232B34] font-medium">
                  {filteredChallenges.map((ch) => (
                    <tr 
                      key={ch.id}
                      className="hover:bg-[#F4F2EC]/40 dark:hover:bg-[#1E2630] transition-colors group cursor-pointer"
                      onClick={() => handleInspect(ch)}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-[#087C78] dark:text-[#0AA39F] text-[11px] whitespace-nowrap">
                        {ch.id}
                      </td>

                      <td className="py-4 px-4 max-w-sm">
                        <div className="font-bold text-[#111416] dark:text-white leading-snug group-hover:text-[#087C78] dark:group-hover:text-[#0AA39F] transition font-sans">
                          {ch.title}
                        </div>
                        <div className="text-[11px] text-[#596166] dark:text-[#949DA3] line-clamp-1 mt-0.5">
                          {ch.publicSafeSummary}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-white text-[11px]">
                          {ch.sector.split('&')[0].trim()}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#111416] dark:text-white">
                          {ch.department.split(' ')[0]}... ({ch.state})
                        </div>
                        <div className="text-[10px] text-[#596166] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#596166]" />
                          <span>{ch.city}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px]">
                        {ch.pilotDuration}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ch.status === 'Pilot Prototype'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-white'
                        }`}>
                          {ch.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspect(ch);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#111416] text-white dark:bg-[#087C78] hover:bg-[#23465A] text-[11px] font-bold transition shadow-xs inline-flex items-center gap-1 uppercase"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredChallenges.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#596166]">
                        No challenges match the active filter criteria. Click 'Reset Filters' to view all initiatives.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 3. ACTIVE PROJECT LIFECYCLE OBSERVATORY */}
        {activeProject && (
          <div className="mt-8">
            <ProjectJourney challenge={activeProject} />
          </div>
        )}

        {/* 4. PUBLIC CONFIDENTIALITY NOTICE */}
        <div className="p-4 rounded-xl bg-[#F4F2EC] dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] flex items-start gap-3 text-xs text-[#596166] dark:text-[#949DA3]">
          <Lock className="w-4 h-4 text-[#B58A55] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-[#111416] dark:text-white font-mono uppercase text-[11px]">Public Transparency & IP Protection Guarantee</div>
            <p className="text-[11px] leading-relaxed">
              Citizens can inspect prototype problem statements, milestone timelines, and published evidence fields. Proprietary algorithms, technical source code, and confidential commercial envelopes remain outside this public view.
            </p>
          </div>
        </div>

        {/* 5. BRIEF MODAL */}
        {briefModalOpen && activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div 
              className="w-full max-w-2xl bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              role="dialog"
            >
              <div className="relative h-48 bg-[#111416]">
                <img
                  src={activeProject.imageUrl || activeProject.heroImage}
                  alt={activeProject.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = DEFAULT_CHALLENGE_IMAGES[1];
                  }}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <button
                  type="button"
                  onClick={() => setBriefModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-md bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#087C78] font-mono">
                    {activeProject.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2">
                    {activeProject.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#596166] dark:text-[#949DA3]">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3] font-mono">
                    Sponsoring Department & Jurisdiction
                  </span>
                  <div className="font-bold text-sm text-[#111416] dark:text-white">
                    {activeProject.department}
                  </div>
                  <div className="text-[#596166] flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#087C78]" />
                    <span>{activeProject.jurisdiction}, {activeProject.city}, {activeProject.state}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3] font-mono">
                    Civic Problem & Bottleneck
                  </span>
                  <p className="leading-relaxed bg-[#F4F2EC]/60 dark:bg-[#1C2127] p-3 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] text-[#111416] dark:text-white">
                    {activeProject.problemDescription}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#596166] dark:text-[#949DA3] font-mono">
                    Target Outcome & Success Criteria
                  </span>
                  <p className="leading-relaxed bg-[#F4F2EC]/60 dark:bg-[#1C2127] p-3 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] text-[#111416] dark:text-white">
                    {activeProject.desiredOutcome}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#B58A55]/10 border border-[#B58A55]/30 flex items-center gap-2 text-xs font-mono text-[#B58A55]">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>
                    Proprietary vendor proposals and financial bids remain confidential under public procurement rules.
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#F4F2EC]/80 dark:bg-[#1C2127] border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setBriefModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase text-[#596166] hover:text-[#111416] dark:hover:text-white"
                >
                  Close Brief
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBriefModalOpen(false);
                      onNavigate('startup_login');
                    }}
                    className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-[#087C78] hover:bg-[#0AA39F] text-white transition shadow-xs flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Startup Portal Access</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
