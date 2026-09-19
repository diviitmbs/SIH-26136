import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  AuthUser, 
  Challenge, 
  Startup, 
  Proposal, 
  PilotData, 
  FilterState 
} from './types';
import { 
  PROCUREX_CHALLENGES, 
  PROCUREX_STARTUPS, 
  PROCUREX_PROPOSALS, 
  INITIAL_PILOT_DATA 
} from './data/procurexData';

// Layout & Global Components
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { FilterDrawer } from './components/FilterDrawer';
import { RoleAccessGate } from './components/RoleAccessGate';
import { storage, safeStorage } from './utils/storage';
import { getStartups } from './utils/api';

// Views
import { HomeView } from './views/HomeView';
import { InnovationHubView } from './views/InnovationHubView';
import { GovPortalView } from './views/GovPortalView';
import { GovLoginView } from './views/GovLoginView';
import { GovSignupView } from './views/GovSignupView';
import { ChallengeBuilderView } from './views/ChallengeBuilderView';
import { ChallengeSuccessView } from './views/ChallengeSuccessView';
import { StartupPortalView } from './views/StartupPortalView';
import { StartupLoginView } from './views/StartupLoginView';
import { StartupSignupView } from './views/StartupSignupView';
import { ProposalStudioView } from './views/ProposalStudioView';
import { AIEvaluationView } from './views/AIEvaluationView';
import { CompareView } from './views/CompareView';
import { PilotTrackerView } from './views/PilotTrackerView';
import { PublicProblemSubmitView } from './views/PublicProblemSubmitView';
import { AICommandCenterView } from './views/AICommandCenterView';
import { AboutView } from './views/AboutView';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<AppView>('home');
  
  // Persisted User Profile State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => storage.getUser());

  // Data Collections backed by persistent storage
  const [challenges, setChallenges] = useState<Challenge[]>(() => storage.getChallenges());
  const [startups, setStartups] = useState<Startup[]>(PROCUREX_STARTUPS);
  const [proposals, setProposals] = useState<Proposal[]>(() => storage.getProposals());
  const [pilotData, setPilotData] = useState<PilotData>(() => storage.getPilotData());
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(challenges[0] || PROCUREX_CHALLENGES[0]);
  const [lastCreatedChallenge, setLastCreatedChallenge] = useState<Challenge | null>(null);

  // Fetch dynamic startups from backend Supabase table with fallback to PROCUREX_STARTUPS
  useEffect(() => {
    let isMounted = true;
    getStartups()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setStartups(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load startups from backend:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Modals & Drawers
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    sectors: [],
    locations: [],
    technologies: [],
    stages: [],
    budgetRange: [0, 100],
    searchQuery: ""
  });

  // Calculate active filter count
  const activeFilterCount = 
    filters.sectors.length + 
    filters.locations.length + 
    filters.technologies.length + 
    filters.stages.length + 
    (filters.searchQuery ? 1 : 0);

  const isAuthScreen = ['gov_login', 'gov_signup', 'startup_login', 'startup_signup'].includes(currentView);

  // Navigation with smooth scroll
  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (role?: 'government' | 'startup') => {
    if (role === 'startup') {
      handleNavigate('startup_login');
    } else {
      handleNavigate('gov_login');
    }
  };

  const handleLogin = (user: AuthUser) => {
    storage.setUser(user);
    setCurrentUser(user);
    if (user.role === 'government') {
      handleNavigate('gov_portal');
    } else {
      handleNavigate('startup_portal');
    }
  };

  const handleLogout = () => {
    storage.setUser(null);
    setCurrentUser(null);
    handleNavigate('home');
  };

  const handleChallengeCreated = (newChallenge: Challenge) => {
    storage.addChallenge(newChallenge);
    setChallenges(prev => [newChallenge, ...prev]);
    setLastCreatedChallenge(newChallenge);
    setSelectedChallenge(newChallenge);
    handleNavigate('gov_challenge_success');
  };

  const handleProposalSubmitted = (newProposal: Proposal) => {
    storage.addProposal(newProposal);
    setProposals(prev => [newProposal, ...prev]);
    // update challenge proposal counter
    setChallenges(prev => {
      const updated = prev.map(c => {
        if (c.id === newProposal.challengeId) {
          return { ...c, proposalsCount: c.proposalsCount + 1 };
        }
        return c;
      });
      storage.saveChallenges(updated);
      return updated;
    });
  };

  const handleSelectPilotProposal = (proposal: Proposal) => {
    setPilotData(prev => ({
      ...prev,
      challengeTitle: proposal.challengeTitle,
      startupName: proposal.startupName,
      totalCommittedBudget: proposal.proposedBudget
    }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      sectors: [],
      locations: [],
      technologies: [],
      stages: [],
      budgetRange: [0, 100],
      searchQuery: ""
    });
  };

  // Ensure theme sync on initial load
  useEffect(() => {
    try {
      const savedTheme = safeStorage.getItem('procurex_theme');
      const isDark = savedTheme === 'dark' || (!savedTheme && typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC] flex flex-col font-sans antialiased selection:bg-[#087C78] selection:text-white transition-colors arch-grid-bg">
      {/* Navigation: Floating Left Rail on Desktop, Compact Header on Mobile */}
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />

      {/* Main Content Area beside Left Rail on Desktop */}
      <div className={`flex flex-col flex-1 w-full min-h-screen ${isAuthScreen ? 'pl-0' : 'lg:pl-64 xl:pl-68'}`}>
        <main className={`flex-1 w-full ${isAuthScreen ? 'pt-0' : 'pt-14 lg:pt-0'}`}>
        {currentView === 'home' && (
          <HomeView
            challenges={challenges}
            onNavigate={handleNavigate}
            onSelectChallenge={(ch) => {
              setSelectedChallenge(ch);
              handleNavigate('innovation_hub');
            }}
          />
        )}

        {currentView === 'innovation_hub' && (
          <InnovationHubView
            challenges={challenges}
            selectedChallenge={selectedChallenge}
            onSelectChallenge={setSelectedChallenge}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'gov_login' && (
          <GovLoginView
            onNavigate={handleNavigate}
            onLogin={handleLogin}
          />
        )}

        {currentView === 'gov_signup' && (
          <GovSignupView
            onNavigate={handleNavigate}
            onLogin={handleLogin}
          />
        )}

        {currentView === 'startup_login' && (
          <StartupLoginView
            onNavigate={handleNavigate}
            onLogin={handleLogin}
          />
        )}

        {currentView === 'startup_signup' && (
          <StartupSignupView
            onNavigate={handleNavigate}
            onLogin={handleLogin}
          />
        )}

        {currentView === 'gov_portal' && (
          currentUser?.role !== 'government' ? (
            <RoleAccessGate
              requiredRole="government"
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigate}
              onLogin={handleLogin}
            />
          ) : (
            <GovPortalView
              challenges={challenges}
              startups={startups}
              proposals={proposals}
              currentUser={currentUser}
              onNavigate={handleNavigate}
              onSelectChallenge={setSelectedChallenge}
            />
          )
        )}

        {currentView === 'gov_challenge_builder' && (
          currentUser?.role !== 'government' ? (
            <RoleAccessGate
              requiredRole="government"
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigate}
              onLogin={handleLogin}
            />
          ) : (
            <ChallengeBuilderView
              onChallengeCreated={handleChallengeCreated}
              onNavigate={handleNavigate}
            />
          )
        )}

        {currentView === 'gov_challenge_success' && (
          currentUser?.role !== 'government' ? (
            <RoleAccessGate
              requiredRole="government"
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigate}
              onLogin={handleLogin}
            />
          ) : (
            <ChallengeSuccessView
              lastChallenge={lastCreatedChallenge}
              onNavigate={handleNavigate}
              onSelectChallenge={setSelectedChallenge}
            />
          )
        )}

        {currentView === 'startup_portal' && (
          currentUser?.role !== 'startup' ? (
            <RoleAccessGate
              requiredRole="startup"
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigate}
              onLogin={handleLogin}
            />
          ) : (
            <StartupPortalView
              challenges={challenges}
              startup={
                startups.find(s => 
                  s.name.toLowerCase() === (currentUser?.startupName || '').toLowerCase() ||
                  s.id === currentUser?.id
                ) || startups[0]
              }
              currentUser={currentUser}
              onNavigate={handleNavigate}
              onSelectChallenge={(ch) => {
                setSelectedChallenge(ch);
              }}
            />
          )
        )}

        {currentView === 'proposal_studio' && (
          currentUser?.role !== 'startup' ? (
            <RoleAccessGate
              requiredRole="startup"
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigate}
              onLogin={handleLogin}
            />
          ) : (
            <ProposalStudioView
              onNavigate={handleNavigate}
              onSubmitProposal={handleProposalSubmitted}
            />
          )
        )}

        {currentView === 'compare_proposals' && (
          <CompareView
            challenges={challenges}
            startups={startups}
            proposals={proposals}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'ai_evaluation' && (
          <AIEvaluationView
            proposals={proposals}
            selectedChallenge={selectedChallenge}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onSelectPilot={handleSelectPilotProposal}
          />
        )}

        {currentView === 'pilot_dashboard' && (
          <PilotTrackerView
            pilotData={pilotData}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'public_problem_submit' && (
          <PublicProblemSubmitView
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'ai_command_center' && (
          <AICommandCenterView
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      {!isAuthScreen && <Footer onNavigate={handleNavigate} />}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onClearAll={handleClearAllFilters}
        activeCount={activeFilterCount}
      />
    </div>
  );
}
