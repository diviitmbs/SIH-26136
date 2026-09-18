import React from 'react';

interface ProcureXLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  inverted?: boolean;
  iconOnly?: boolean;
}

export const ProcureXLogo: React.FC<ProcureXLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  inverted = false,
  iconOnly = false
}) => {
  const dimensions = {
    xs: { icon: 'w-5 h-5', text: 'text-xs', sub: 'text-[7px]' },
    sm: { icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[8px]' },
    md: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    lg: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    xl: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-[11px]' }
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* High-Precision Architectural Geometric Mark */}
      <div className={`relative ${dimensions.icon} shrink-0`} aria-label="ProcureX Emblem">
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Architectural Precision Frame */}
          <rect 
            x="1.5" 
            y="1.5" 
            width="37" 
            height="37" 
            rx="4" 
            className="fill-[#111416] dark:fill-[#0F1418] stroke-[#23465A] dark:stroke-[#2E3B4A]"
            strokeWidth="1.5" 
          />

          {/* Institutional Grid Coordinate Tick Marks */}
          <line x1="1.5" y1="11" x2="3.5" y2="11" stroke="#087C78" strokeWidth="1" />
          <line x1="36.5" y1="29" x2="38.5" y2="29" stroke="#087C78" strokeWidth="1" />
          <line x1="20" y1="1.5" x2="20" y2="3.5" stroke="#B58A55" strokeWidth="1" />
          <line x1="20" y1="36.5" x2="20" y2="38.5" stroke="#B58A55" strokeWidth="1" />

          {/* Primary Monolithic Portal P Pillar & Loop (Steel/Teal) */}
          <path 
            d="M10 10V30M10 10H19.5C22.5376 10 25 12.4624 25 15.5C25 18.5376 22.5376 21 19.5 21H10" 
            stroke="#0AA39F" 
            strokeWidth="2.75" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Angular Procurement Cantilever Crossing (The Dynamic X) */}
          <path 
            d="M18.5 19.5L29 30" 
            stroke="#F4F2EC" 
            strokeWidth="2.75" 
            strokeLinecap="round" 
          />
          <path 
            d="M29 11L21.5 18.5" 
            stroke="#B58A55" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />

          {/* Central Structural Datum Point */}
          <circle cx="20.5" cy="20" r="1.5" fill="#0AA39F" />
        </svg>
      </div>

      {/* Wordmark & National Platform Credential */}
      {!iconOnly && (
        <div className="flex flex-col text-left select-none">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight ${dimensions.text} ${
              inverted ? 'text-white' : 'text-[#111416] dark:text-[#F4F2EC]'
            } font-mono uppercase`}>
              Procure<span className="text-[#087C78] dark:text-[#0AA39F]">X</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase bg-[#ECEAE4] dark:bg-[#1E2630] text-[#087C78] dark:text-[#0AA39F] border border-[#E2DFD7] dark:border-[#2E3B4A]">
              NATIONAL
            </span>
          </div>

          {showSubtitle && (
            <span className={`font-mono text-[8px] tracking-wider uppercase mt-1 ${
              inverted ? 'text-neutral-400' : 'text-[#596166] dark:text-[#949DA3]'
            }`}>
              Public Innovation Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
};
