import React from 'react';
import { motion } from 'motion/react';

interface PortalLoadingProps {
  label?: string;
  sublabel?: string;
  portal?: 'government' | 'startup' | 'general';
  compact?: boolean;
}

export const PortalLoading: React.FC<PortalLoadingProps> = ({
  label = 'Loading Workspace',
  sublabel = 'Synchronizing cryptographic ledger & telemetry registers...',
  portal = 'general',
  compact = false
}) => {
  const accentColor = portal === 'government' ? '#087C78' : portal === 'startup' ? '#087C78' : '#B58A55';

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-[#ECEAE4]/60 dark:bg-[#1E2630]/60 border border-[#E2DFD7] dark:border-[#2E3844] font-mono text-xs text-[#596166] dark:text-[#949DA3]">
        {/* Subtle geometric line assembler */}
        <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, ease: 'linear', repeat: Infinity }}
            className="w-4 h-4 border border-[#087C78] dark:border-[#0AA39F] rounded-xs"
          />
          <div className="absolute w-1.5 h-1.5 bg-[#B58A55] rounded-full" />
        </div>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div 
      className="min-h-[50vh] flex flex-col items-center justify-center p-8 select-none text-center"
      role="status"
      aria-live="polite"
    >
      {/* Precision Geometric Architectural Frame */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Subtle coordinate grid lines */}
        <svg 
          viewBox="0 0 80 80" 
          className="w-full h-full"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer framing box */}
          <rect 
            x="4" 
            y="4" 
            width="72" 
            height="72" 
            rx="6" 
            className="stroke-[#E2DFD7] dark:stroke-[#2E3844]"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Precision Corner Datum Marks */}
          <path d="M4 16H16M4 4V16" stroke={accentColor} strokeWidth="2" />
          <path d="M76 16H64M76 4V16" stroke={accentColor} strokeWidth="2" />
          <path d="M4 64H16M4 76V64" stroke={accentColor} strokeWidth="2" />
          <path d="M76 64H64M76 76V64" stroke={accentColor} strokeWidth="2" />

          {/* Center expanding beam */}
          <motion.rect
            x="20"
            y="20"
            width="40"
            height="40"
            rx="4"
            className="fill-[#111416] dark:fill-[#16191D]"
            stroke="#087C78"
            strokeWidth="1.5"
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: [0.9, 1.02, 0.9], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Geometric ProcureX glyph strokes assembling */}
          <motion.path
            d="M28 28V52M28 28H42C45.3 28 48 30.7 48 34C48 37.3 45.3 40 42 40H28"
            stroke="#0AA39F"
            strokeWidth="2.5"
            strokeLinecap="square"
            initial={{ pathLength: 0.2 }}
            animate={{ pathLength: [0.2, 1, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.path
            d="M40 40L52 52"
            stroke="#F4F2EC"
            strokeWidth="2.5"
            strokeLinecap="square"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />

          <motion.path
            d="M52 28L42 38"
            stroke="#B58A55"
            strokeWidth="2"
            strokeLinecap="square"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
        </svg>
      </div>

      {/* Label and Sublabel in Crisp Architectural Typography */}
      <div className="space-y-2 max-w-sm">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#087C78] dark:bg-[#0AA39F] rounded-full animate-ping" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#111416] dark:text-white">
            {label}
          </h3>
        </div>

        <p className="text-xs font-mono text-[#596166] dark:text-[#949DA3] leading-relaxed">
          {sublabel}
        </p>

        {/* Structured Segmented Progress Indicator */}
        <div className="pt-3 flex items-center justify-center gap-1.5">
          {[0, 1, 2, 3, 4].map((step) => (
            <motion.div
              key={step}
              className="h-1 w-6 rounded-full bg-[#E2DFD7] dark:bg-[#232B34] overflow-hidden"
            >
              <motion.div
                className="h-full bg-[#087C78] dark:bg-[#0AA39F]"
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ 
                  duration: 1.6, 
                  repeat: Infinity, 
                  ease: 'easeInOut',
                  delay: step * 0.15 
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
