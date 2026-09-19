export type AppView =
  | 'home'
  | 'innovation_hub'
  | 'gov_login'
  | 'gov_signup'
  | 'gov_portal'
  | 'gov_challenge_builder'
  | 'gov_challenge_success'
  | 'startup_login'
  | 'startup_signup'
  | 'startup_portal'
  | 'proposal_studio'
  | 'compare_proposals'
  | 'ai_evaluation'
  | 'pilot_dashboard'
  | 'public_problem_submit'
  | 'ai_command_center'
  | 'about';

export type ThemeMode = 'light' | 'dark' | 'midnight';

export interface AuthUser {
  id: string;
  role: 'government' | 'startup';
  name: string;
  email: string;
  contactNumber?: string;
  state?: string;
  city?: string;
  // Government specific fields:
  department?: string;
  officerId?: string;
  designation?: string;
  domain?: string;
  orgDetails?: string;
  responsiblePerson?: string;
  // Startup specific fields:
  startupId?: string;
  organizationId?: string;
  startupName?: string;
  dpiitNumber?: string;
  registrationNumber?: string;
  incorporationYear?: number;
  capabilities?: string;
  trackRecord?: string;
  additionalDomains?: string[];
}

export interface PublicProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  city: string;
  affectedGroup?: string;
  frequency?: string;
  severity: 'Low' | 'Medium' | 'High';
  expectedImprovement?: string;
  evidenceUrl?: string;
  submittedAt: string;
  status: string;
  aiSummary?: string;
  aiDomain?: string;
  aiRouting?: string;
}

export interface FilterState {
  sectors: string[];
  locations: string[];
  technologies: string[];
  stages: string[];
  budgetRange: [number, number];
  searchQuery: string;
}

export interface Challenge {
  id: string;
  title: string;
  department: string;
  state: string;
  district: string;
  city: string;
  jurisdiction: string;
  sector: string;
  technologies: string[];
  priority: 'High' | 'Medium' | 'Critical';
  estimatedBudget: string;
  pilotDuration: string;
  responseWindowDays: number;
  deadlineDate: string;
  status: 'Active' | 'Under Review' | 'Pilot Prototype' | 'Procured';
  matchScore: number;
  problemDescription: string;
  currentSituation: string;
  desiredOutcome: string;
  successCriteria: string;
  imageUrl: string;
  heroImage: string;
  proposalsCount: number;
  publicSafeSummary: string;
  isDepartmentDefined?: boolean;
  pilotBudget?: string;
  activePilotStartup?: string;
  activePilotDay?: number;
  activePilotTotalDays?: number;
}

export interface Startup {
  id: string;
  name: string;
  legalEntity: string;
  registrationNumber: string;
  dpiitNumber?: string;
  incorporationYear: number;
  city: string;
  state: string;
  tagline: string;
  sectors: string[];
  technologies: string[];
  matchScore: number;
  solutionName: string;
  solutionSummary: string;
  totalDeployments: number;
  governmentDeployments: number;
  typicalPilotMonths: string;
  teamSize: number;
  pilotReadiness: string;
  trlLevel?: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  founderName?: string;
}

export interface Proposal {
  id: string;
  challengeId: string;
  challengeTitle: string;
  startupId: string;
  startupName: string;
  solutionName?: string;
  solutionSummary?: string;
  technicalSummary?: string;
  proposedBudget: string;
  pilotCost: string;
  hardwareCost?: string;
  maintenanceCost?: string;
  timelineMonths: string;
  pilotTimeline?: string;
  breakdownCosts?: {
    hardware?: string;
    software?: string;
    deployment?: string;
    buffer?: string;
    [key: string]: any;
  };
  matchScore?: number;
  technicalFitScore: number;
  pilotFeasibilityScore: number;
  experienceScore: number;
  commercialScore: number;
  overallScore: number;
  rank: number;
  status: 'Shortlisted' | 'Under Review' | 'Sanctioned' | 'Awarded' | 'Pilot Active' | 'Submitted';
  solutionArchitecture: string;
  pilotDeliverables: string;
  governmentDependencies: string[];
  keyRisks: string[];
  evidencePointers: string[];
  submittedAt: string;
  teamSize?: number;
  keyPersonnel?: string;
  priorExperience?: string;
  pilotLocations?: string;
  projectedImpact?: string;
  dpiitNumber?: string;
  contactEmail?: string;
  sanctionOrderNumber?: string;
  awardedAt?: string;
  awardedByOfficer?: string;
}

export interface Milestone {
  id: string;
  title: string;
  criteria: string;
  payoutAmount: string;
  dueDate: string;
  status: 'Disbursed' | 'Verification Pending' | 'Upcoming';
  verifiedAt?: string;
}

export interface PilotData {
  contractId: string;
  startupName: string;
  department: string;
  corridor: string;
  totalDays: number;
  daysElapsed: number;
  actualDelayReduction: number;
  targetDelayReduction: number;
  sensorUptime: number;
  milestones: Milestone[];
  challengeTitle?: string;
  totalCommittedBudget?: string;
}

export interface CivicChatMessage {
  id: string;
  contractId: string;
  senderRole: 'government' | 'startup';
  senderName: string;
  senderTitle: string;
  timestamp: string;
  text: string;
  tag?: 'Field Update' | 'Clearance' | 'Milestone' | 'Notice' | 'Query' | 'Telemetry';
  attachments?: string[];
}

export interface CivicFieldUpdate {
  id: string;
  contractId: string;
  startupName: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'In Progress' | 'Operational' | 'Requires Review' | 'Verified';
  category: 'Hardware' | 'Software' | 'Site Inspection' | 'Data Stream';
  author: string;
}

export interface ExpressedInterest {
  id: string;
  challengeId: string;
  challengeTitle: string;
  department: string;
  startupId: string;
  startupName: string;
  dpiitNumber: string;
  domain: string;
  readinessLevel: string;
  preliminaryNote: string;
  contactEmail: string;
  expressedAt: string;
}
