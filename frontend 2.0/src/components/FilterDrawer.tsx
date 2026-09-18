import React from 'react';
import { FilterState } from '../types';
import { X, Check, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
  activeCount: number;
}

const SECTORS = [
  'Urban Mobility & Traffic Optimization',
  'Water Resources, Leak Detection & Sewage',
  'Clean Energy, Solar Microgrids & Storage',
  'Healthcare, Diagnostics & Telemedicine',
  'Smart Agriculture, Irrigation & Soil Telemetry',
  'Waste Management, Circular Economy & Robotics',
  'Public Safety, Disaster Warning & Drone GIS',
  'Air Quality, Environmental & Emission Monitoring'
];

const LOCATIONS = [
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Jaipur',
  'Kochi',
  'Ahmedabad',
  'Bhopal'
];

const TECHNOLOGIES = [
  'Computer Vision',
  'Edge AI',
  'IoT Telemetry',
  'Robotics',
  'GIS & Drone Survey',
  'Acoustic Sensors',
  'Optical Sorting',
  'LiDAR Mapping'
];

const STAGES = [
  'Active',
  'Pilot Prototype',
  'RFP Finalized'
];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
  activeCount,
}) => {
  if (!isOpen) return null;

  const toggleArrayItem = (key: keyof FilterState, item: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    onFilterChange({ ...filters, [key]: updated });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div 
        id="filter-drawer-panel"
        className="relative w-full max-w-md bg-white dark:bg-[#16191D] border-l border-[#E2DFD7] dark:border-[#232B34] h-full overflow-y-auto flex flex-col shadow-2xl z-10 text-[#111416] dark:text-[#F4F2EC]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-[#E2DFD7] dark:border-[#232B34] bg-white/95 dark:bg-[#16191D]/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-4 h-4 text-[#087C78] dark:text-[#0AA39F]" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider">Ecosystem Filters</h2>
            {activeCount > 0 && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#087C78]/15 text-[#087C78] dark:text-[#0AA39F]">
                {activeCount} active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#596166] hover:text-[#111416] dark:text-[#949DA3] dark:hover:text-white hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-7 flex-1">
          {/* Sector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#596166] dark:text-[#949DA3]">
                Sector
              </span>
              <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">Civic Focus</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SECTORS.map((sec) => {
                const selected = filters.sectors.includes(sec);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => toggleArrayItem('sectors', sec)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#087C78] text-white shadow-xs font-bold'
                        : 'bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-[#F4F2EC] hover:bg-[#E2DFD7] dark:hover:bg-[#2E3844]'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    {sec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#596166] dark:text-[#949DA3]">
                Location & Jurisdiction
              </span>
              <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">District / City</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LOCATIONS.map((loc) => {
                const selected = filters.locations.includes(loc);
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleArrayItem('locations', loc)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#087C78] text-white shadow-xs font-bold'
                        : 'bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-[#F4F2EC] hover:bg-[#E2DFD7] dark:hover:bg-[#2E3844]'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technology */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#596166] dark:text-[#949DA3]">
                Core Technology
              </span>
              <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">Hardware & Software</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TECHNOLOGIES.map((tech) => {
                const selected = filters.technologies.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleArrayItem('technologies', tech)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#087C78] text-white shadow-xs font-bold'
                        : 'bg-[#ECEAE4] dark:bg-[#1E2630] text-[#111416] dark:text-[#F4F2EC] hover:bg-[#E2DFD7] dark:hover:bg-[#2E3844]'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Stage */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#596166] dark:text-[#949DA3]">
                Deployment Stage
              </span>
              <span className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">Milestone</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STAGES.map((stg) => {
                const selected = filters.stages.includes(stg);
                return (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => toggleArrayItem('stages', stg)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono border text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-[#087C78] bg-[#087C78]/15 text-[#087C78] dark:text-[#0AA39F] font-bold'
                        : 'border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] text-[#111416] dark:text-[#F4F2EC] hover:bg-[#ECEAE4] dark:hover:bg-[#232B34]'
                    }`}
                  >
                    <span>{stg}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-[#087C78] dark:text-[#0AA39F]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Public Transparency Note */}
          <div className="p-4 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/60 dark:bg-[#1C2127] text-xs font-mono text-[#596166] dark:text-[#949DA3] leading-relaxed">
            <strong className="block text-[#111416] dark:text-white font-bold mb-1 uppercase text-[10px]">
              Data Transparency Standard
            </strong>
            Filters are designed for non-confidential public problem records, prototype milestone fields, and publishable outcome evidence.
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-5 border-t border-[#E2DFD7] dark:border-[#232B34] bg-white/95 dark:bg-[#16191D]/95 backdrop-blur-md flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClearAll}
            disabled={activeCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white disabled:opacity-40 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-[#087C78] hover:bg-[#0AA39F] text-white text-xs font-mono font-bold uppercase rounded-lg shadow-xs transition tracking-tight cursor-pointer text-center"
          >
            Apply Filters ({activeCount > 0 ? activeCount : 'All'})
          </button>
        </div>
      </div>
    </div>
  );
};
