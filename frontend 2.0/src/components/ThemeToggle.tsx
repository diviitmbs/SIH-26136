import React, { useEffect, useState } from 'react';
import { ThemeMode } from '../types';
import { Sun, Moon } from 'lucide-react';
import { safeStorage } from '../utils/storage';

export const ThemeToggle: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = safeStorage.getItem('procurex_theme') as ThemeMode;
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const isDark = mode === 'dark';

    try {
      safeStorage.setItem('procurex_theme', mode);
    } catch {
      // ignore
    }

    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    try {
      window.dispatchEvent(new CustomEvent('procurex-theme-change', { detail: { isDark } }));
    } catch {
      // ignore
    }
  }, [mode]);

  return (
    <div 
      id="theme-control-container"
      className="inline-flex items-center p-0.5 rounded-lg bg-[#ECEAE4] dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] text-xs font-mono font-bold transition-colors"
      role="group"
      aria-label="Theme selection"
    >
      <button
        id="theme-light-btn"
        type="button"
        onClick={() => setMode('light')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
          mode === 'light'
            ? 'bg-white text-[#111416] shadow-xs font-bold border border-[#E2DFD7]'
            : 'text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white'
        }`}
        title="Light theme (Warm neutral + Charcoal)"
      >
        <Sun className="w-3.5 h-3.5 text-[#B58A55]" />
        <span>Light</span>
      </button>

      <button
        id="theme-dark-btn"
        type="button"
        onClick={() => setMode('dark')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
          mode === 'dark'
            ? 'bg-[#087C78] text-white shadow-xs font-bold'
            : 'text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white'
        }`}
        title="Midnight theme (Charcoal + Graphite + Slate)"
      >
        <Moon className="w-3.5 h-3.5 text-white" />
        <span>Midnight</span>
      </button>
    </div>
  );
};

