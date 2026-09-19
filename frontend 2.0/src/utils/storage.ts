import { AuthUser, Challenge, Proposal, ExpressedInterest, PilotData, CivicChatMessage, CivicFieldUpdate, PublicProblem } from '../types';
import { 
  PROCUREX_CHALLENGES, 
  PROCUREX_PROPOSALS, 
  INITIAL_PILOT_DATA,
  DEFAULT_CHALLENGE_IMAGES
} from '../data/procurexData';

export const STORAGE_KEYS = {
  USER: 'procurex_user',
  CHALLENGES: 'procurex_challenges',
  PROPOSALS: 'procurex_proposals',
  INTERESTS: 'procurex_expressed_interests',
  PILOT: 'procurex_pilot_data',
  PROPOSAL_DRAFT: 'procurex_proposal_draft',
  CHALLENGE_DRAFT: 'procurex_challenge_draft',
  THEME: 'procurex_theme',
  CHAT_MESSAGES: 'procurex_chat_messages',
  FIELD_UPDATES: 'procurex_field_updates',
  PUBLIC_PROBLEMS: 'procurex_public_problems',
  ACCOUNTS: 'procurex_accounts'
};

const memoryStore = new Map<string, string>();

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // restricted or blocked iframe storage
    }
    return memoryStore.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // restricted or blocked iframe storage
    }
    memoryStore.set(key, value);
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // restricted or blocked iframe storage
    }
    memoryStore.delete(key);
  }
};

const INITIAL_CHAT_MESSAGES: CivicChatMessage[] = [
  {
    id: 'msg_01',
    contractId: 'PILOT-BLR-2026-08',
    senderRole: 'government',
    senderName: 'Dr. Ramesh Sharma, IAS',
    senderTitle: 'Principal Secretary & Commissioner, Urban Development',
    timestamp: 'Yesterday at 10:15 AM',
    text: 'Formal Pilot Sanction Order PX-SO-2026-BLR-0089 has been sanctioned under GFR Rule 149(v). Welcome to the municipal deployment corridor, UrbanAI Technologies. Real-time civic channel is live.',
    tag: 'Notice'
  },
  {
    id: 'msg_02',
    contractId: 'PILOT-BLR-2026-08',
    senderRole: 'startup',
    senderName: 'Priya Narang',
    senderTitle: 'CTO & Co-Founder, UrbanAI Technologies',
    timestamp: 'Yesterday at 11:42 AM',
    text: 'Thank you Sir! Our deployment engineering team is at the Outer Ring Road corridor (Silk Board to Bellandur). 8 AI edge gantry units are mounted and calibrated.',
    tag: 'Field Update'
  },
  {
    id: 'msg_03',
    contractId: 'PILOT-BLR-2026-08',
    senderRole: 'government',
    senderName: 'Dr. Ramesh Sharma, IAS',
    senderTitle: 'Principal Secretary & Commissioner, Urban Development',
    timestamp: 'Today at 09:10 AM',
    text: 'BESCOM uninterrupted power line permits and Bengaluru Traffic Police escort clearances have been logged into the city portal. Ready to audit Milestone 1 telemetry.',
    tag: 'Clearance'
  },
  {
    id: 'msg_04',
    contractId: 'PILOT-BLR-2026-08',
    senderRole: 'startup',
    senderName: 'Priya Narang',
    senderTitle: 'CTO & Co-Founder, UrbanAI Technologies',
    timestamp: 'Today at 10:30 AM',
    text: 'Telemetry socket is streaming at 99.4% optical uptime with zero-PII edge extraction. Delay reduction is tracking at 21.4% (above the 18.0% SLA).',
    tag: 'Telemetry'
  }
];

const INITIAL_FIELD_UPDATES: CivicFieldUpdate[] = [
  {
    id: 'fup_01',
    contractId: 'PILOT-BLR-2026-08',
    startupName: 'UrbanAI Technologies',
    title: 'Gantry Edge Nodes 1 through 8 Live on Outer Ring Road',
    description: 'All 8 dual-lens computer vision units mounted with optical thermal weatherproofing. Optical inference active with local queue density calculation.',
    timestamp: '2 hours ago',
    status: 'Operational',
    category: 'Hardware',
    author: 'Field Ops Lead (UrbanAI)'
  },
  {
    id: 'fup_02',
    contractId: 'PILOT-BLR-2026-08',
    startupName: 'UrbanAI Technologies',
    title: 'NTCIP 1202 Signal Controller Integration Synced',
    description: 'Direct RS-485 / Ethernet handshake completed with municipal traffic signal controllers. Dynamic green wave actuation tested successfully on bus corridor.',
    timestamp: '5 hours ago',
    status: 'Verified',
    category: 'Software',
    author: 'Systems Architect'
  },
  {
    id: 'fup_03',
    contractId: 'PILOT-BLR-2026-08',
    startupName: 'UrbanAI Technologies',
    title: 'BMTC Bus Transit Priority Beacon Calibrated',
    description: 'Public transit prioritization tested across 24 BMTC Volvo buses. Average intersection clearance latency dropped by 3.8 minutes.',
    timestamp: '1 day ago',
    status: 'Operational',
    category: 'Site Inspection',
    author: 'Transit Algorithm Specialist'
  }
];

// Initial mock expressed interests to make the Interested Portal immediately rich & interactive
const INITIAL_EXPRESSED_INTERESTS: ExpressedInterest[] = [
  {
    id: 'int_01',
    challengeId: 'PX-KA-2026-00124',
    challengeTitle: 'Adaptive Urban Traffic Signal Optimization using Computer Vision',
    department: 'Department of Urban Development & Bengaluru Traffic Police',
    startupId: 's1',
    startupName: 'UrbanAI Technologies',
    dpiitNumber: 'DPIIT-KA-2022-8419',
    domain: 'Urban Mobility & Traffic Optimization',
    readinessLevel: 'TRL-8 (System complete and field qualified)',
    preliminaryNote: 'Edge AI gantry camera hardware ready for 8-node testbed. Zero-PII video streaming with NTCIP traffic controller integration.',
    contactEmail: 'contact@urbanai.in',
    expressedAt: '2026-03-12'
  },
  {
    id: 'int_02',
    challengeId: 'PX-MH-2026-00301',
    challengeTitle: 'Subterranean Pipeline Acoustic Leak Localization & Pressure Balancing',
    department: 'Pune Municipal Corporation (Water Supply Division)',
    startupId: 's2',
    startupName: 'AquaSense Dynamics',
    dpiitNumber: 'DPIIT-MH-2023-1104',
    domain: 'Water Resources, Leak Detection & Sewage',
    readinessLevel: 'TRL-7 (System prototype demonstration in operational environment)',
    preliminaryNote: 'Acoustic clamp-on hydrophone units tested across 12km trunk mains. Pin-points hairline fractures within ±2m.',
    contactEmail: 'partnerships@aquasense.io',
    expressedAt: '2026-03-14'
  },
  {
    id: 'int_03',
    challengeId: 'PX-KA-2026-00124',
    challengeTitle: 'Adaptive Urban Traffic Signal Optimization using Computer Vision',
    department: 'Department of Urban Development & Bengaluru Traffic Police',
    startupId: 's5',
    startupName: 'TrafficPulse Systems',
    dpiitNumber: 'DPIIT-DL-2021-9921',
    domain: 'Urban Mobility & Traffic Optimization',
    readinessLevel: 'TRL-7 (Operational testing completed)',
    preliminaryNote: 'Radar-optical fused sensor solution for all-weather vehicle tracking with automated emergency vehicle green wave routing.',
    contactEmail: 'founders@trafficpulse.org',
    expressedAt: '2026-03-15'
  }
];

export const storage = {
  // Current logged in user
  getUser(): AuthUser | null {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.USER);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return null;
  },

  setUser(user: AuthUser | null): void {
    try {
      if (user) {
        safeStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        // Keep persistent account directory in sync
        this.saveAccount(user);
      } else {
        safeStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // ignore
    }
  },

  // Registered accounts directory (supports multiple members & organizations)
  getAccounts(): AuthUser[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  },

  saveAccount(user: AuthUser): void {
    if (!user || !user.email) return;
    try {
      const accounts = this.getAccounts();
      const cleanEmail = user.email.trim().toLowerCase();
      const existingIdx = accounts.findIndex(a => 
        a.email.trim().toLowerCase() === cleanEmail && a.role === user.role
      );
      if (existingIdx >= 0) {
        accounts[existingIdx] = { ...accounts[existingIdx], ...user };
      } else {
        accounts.push(user);
      }
      safeStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch {
      // ignore
    }
  },

  findAccountByEmail(email: string, role?: 'government' | 'startup'): AuthUser | null {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAccounts();
    return accounts.find(a => 
      a.email.trim().toLowerCase() === cleanEmail && (!role || a.role === role)
    ) || null;
  },

  findAccountsByStartupId(startupId: string): AuthUser[] {
    if (!startupId) return [];
    const accounts = this.getAccounts();
    return accounts.filter(a => a.role === 'startup' && a.startupId === startupId);
  },

  // Challenges
  getChallenges(): Challenge[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.CHALLENGES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Heal any legacy entries with missing or broken Unsplash IDs
          const healed = parsed.map((ch: Challenge, idx: number) => {
            let img = ch.imageUrl;
            if (!img || img.includes('1611273426858') || img.includes('1473968512647') || img.includes('1541888946425')) {
              img = DEFAULT_CHALLENGE_IMAGES[idx % DEFAULT_CHALLENGE_IMAGES.length];
            }
            return {
              ...ch,
              imageUrl: img,
              heroImage: ch.heroImage || DEFAULT_CHALLENGE_IMAGES[(idx + 1) % DEFAULT_CHALLENGE_IMAGES.length]
            };
          });
          return healed;
        }
      }
    } catch {
      // ignore
    }
    // Seed with department defined flags
    const seeded = PROCUREX_CHALLENGES.map(c => ({
      ...c,
      isDepartmentDefined: true
    }));
    this.saveChallenges(seeded);
    return seeded;
  },

  saveChallenges(challenges: Challenge[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    } catch {
      // ignore
    }
  },

  addChallenge(challenge: Challenge): Challenge[] {
    const existing = this.getChallenges();
    const updated = [challenge, ...existing];
    this.saveChallenges(updated);
    return updated;
  },

  // Proposals
  getProposals(): Proposal[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.PROPOSALS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    this.saveProposals(PROCUREX_PROPOSALS);
    return PROCUREX_PROPOSALS;
  },

  saveProposals(proposals: Proposal[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
    } catch {
      // ignore
    }
  },

  addProposal(proposal: Proposal): Proposal[] {
    const existing = this.getProposals();
    const updated = [proposal, ...existing];
    this.saveProposals(updated);
    return updated;
  },

  updateProposal(proposal: Proposal): Proposal[] {
    const existing = this.getProposals();
    const updated = existing.map(p => p.id === proposal.id ? proposal : p);
    this.saveProposals(updated);
    return updated;
  },

  updateChallengeStatus(challengeId: string, status: 'Active' | 'Under Review' | 'Pilot Prototype' | 'Procured'): Challenge[] {
    const existing = this.getChallenges();
    const updated = existing.map(c => c.id === challengeId ? { ...c, status } : c);
    this.saveChallenges(updated);
    return updated;
  },

  // Expressed Interests
  getExpressedInterests(): ExpressedInterest[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.INTERESTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    this.saveExpressedInterests(INITIAL_EXPRESSED_INTERESTS);
    return INITIAL_EXPRESSED_INTERESTS;
  },

  saveExpressedInterests(interests: ExpressedInterest[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(interests));
    } catch {
      // ignore
    }
  },

  addExpressedInterest(interest: ExpressedInterest): ExpressedInterest[] {
    const existing = this.getExpressedInterests();
    // avoid duplicates for same startup + challenge
    const filtered = existing.filter(i => !(i.challengeId === interest.challengeId && i.startupName === interest.startupName));
    const updated = [interest, ...filtered];
    this.saveExpressedInterests(updated);
    return updated;
  },

  removeExpressedInterest(idOrChallengeId: string): ExpressedInterest[] {
    const existing = this.getExpressedInterests();
    const updated = existing.filter(i => i.id !== idOrChallengeId && i.challengeId !== idOrChallengeId);
    this.saveExpressedInterests(updated);
    return updated;
  },

  // Pilot Data
  getPilotData(): PilotData {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.PILOT);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return INITIAL_PILOT_DATA;
  },

  savePilotData(pilotData: PilotData): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.PILOT, JSON.stringify(pilotData));
    } catch {
      // ignore
    }
  },

  setPilotData(pilotData: PilotData): void {
    this.savePilotData(pilotData);
  },


  // Public civic problem submissions (prototype-local persistence)
  getPublicProblems(): PublicProblem[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.PUBLIC_PROBLEMS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  },

  savePublicProblems(problems: PublicProblem[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.PUBLIC_PROBLEMS, JSON.stringify(problems));
    } catch {
      // ignore
    }
  },

  addPublicProblem(problem: PublicProblem): PublicProblem[] {
    const existing = this.getPublicProblems();
    const updated = [problem, ...existing];
    this.savePublicProblems(updated);
    return updated;
  },

  // Bilateral Civic Chat Messages
  getChatMessages(contractId?: string): CivicChatMessage[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return contractId ? parsed.filter((m: CivicChatMessage) => m.contractId === contractId) : parsed;
        }
      }
    } catch {
      // ignore
    }
    this.saveChatMessages(INITIAL_CHAT_MESSAGES);
    return contractId ? INITIAL_CHAT_MESSAGES.filter(m => m.contractId === contractId) : INITIAL_CHAT_MESSAGES;
  },

  saveChatMessages(messages: CivicChatMessage[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch {
      // ignore
    }
  },

  addChatMessage(message: CivicChatMessage): CivicChatMessage[] {
    const existing = this.getChatMessages();
    const updated = [...existing, message];
    this.saveChatMessages(updated);
    return updated;
  },

  // Real-time Field Updates from Startup
  getFieldUpdates(contractId?: string): CivicFieldUpdate[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.FIELD_UPDATES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return contractId ? parsed.filter((f: CivicFieldUpdate) => f.contractId === contractId) : parsed;
        }
      }
    } catch {
      // ignore
    }
    this.saveFieldUpdates(INITIAL_FIELD_UPDATES);
    return contractId ? INITIAL_FIELD_UPDATES.filter(f => f.contractId === contractId) : INITIAL_FIELD_UPDATES;
  },

  saveFieldUpdates(updates: CivicFieldUpdate[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.FIELD_UPDATES, JSON.stringify(updates));
    } catch {
      // ignore
    }
  },

  addFieldUpdate(update: CivicFieldUpdate): CivicFieldUpdate[] {
    const existing = this.getFieldUpdates();
    const updated = [update, ...existing];
    this.saveFieldUpdates(updated);
    return updated;
  }
};
