/**
 * Centralized API Client for ProcureX Frontend 2.0
 * Connects frontend 2.0 to the Express backend running at localhost:5000
 * Strictly no API keys or secret tokens in the frontend code.
 */

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

interface RequestOptions {
  timeoutMs?: number;
}

async function apiRequest<T>(endpoint: string, options: RequestInit & RequestOptions = {}): Promise<T> {
  const { timeoutMs = 15000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(fetchOptions.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      // response had no json body
    }

    if (!response.ok) {
      const errorMsg = data?.error || `Server returned status ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timer);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)}s. Please check backend status at ${API_BASE_URL}.`);
    }
    throw error;
  }
}

// ============================================================
// RESPONSE INTERFACES
// ============================================================

export interface StructureChallengeResponse {
  mode: 'demo' | 'live';
  detected_domain: string;
  confidence_score: number;
  challenge: {
    title: string;
    problem_statement: string;
    objective: string;
    smart_kpis: string[];
    requirements: string[];
    risks: Array<{ risk: string; mitigation: string }>;
    estimated_budget_inr: number;
    estimated_timeline_months: number;
  };
  refinement_questions: string[];
}

export interface MatchStartupsResponse {
  mode: 'demo' | 'live' | 'gemini';
  source: string;
  matches: Array<{
    startup: string;
    domain: string;
    score: number;
    reason: string;
    stats: string;
    note?: string;
  }>;
}

export interface AnalyzeDocumentResponse {
  mode: 'demo' | 'live';
  analysis: {
    document_type: string;
    domain_experience: string;
    relevant_deployments: string[];
    technology_stack: string[];
    claimed_metrics: string[];
    timeline_years: string[];
    potential_gaps: string[];
    verification_note: string;
  };
}

export interface EvaluateStartupsResponse {
  mode: 'demo' | 'live';
  comparisons: Array<{
    startup: string;
    domain: string;
    match_score: number;
    overall_score: number;
    technical_feasibility: number;
    cost_reasonableness: number;
    plagiarism_risk: string;
    sentiment_analysis?: string;
    strengths: string[];
    concerns: string[];
    weaknesses?: string[];
    verification_checklist?: string[];
    final_recommendation: string;
  }>;
  overall_notes: string;
}

export interface AnalyzePilotResponse {
  mode: 'demo' | 'live';
  kpi_results?: any[];
  pilot_success_score: number;
  achieved_kpis: Array<{ metric: string; improvement_pct: number; status: string }>;
  failed_kpis: Array<{ metric: string; improvement_pct: number; status: string }>;
  anomaly_detection: string;
  root_cause_analysis: string;
  predictive_impact_if_scaled: string;
  overall_summary: string;
}

export interface SummarizeEvidenceResponse {
  mode: 'demo' | 'live';
  verification_score: number;
  verified_claims: string[];
  unverified_claims: string[];
  fraud_risk: string;
  cross_reference_matches?: string[];
  recommendations: string[];
  items?: Array<{ type: string; strength: string; note: string }>;
  gaps?: string[];
  overall_assessment: string;
}

export interface DecisionBriefResponse {
  mode: 'demo' | 'live';
  brief: {
    scale_readiness_score: number;
    recommendation?: string;
    final_recommendation?: string;
    executive_summary?: string;
    reasoning?: string;
    risk_flags?: string[];
    risk_forecast?: Array<{ risk: string; probability: string }>;
    scenario_planning?: {
      best_case?: string;
      worst_case?: string;
      most_likely?: string;
    };
    audit_trail_summary?: string;
    key_achievements?: string[];
    procurement_pathway?: string;
    next_steps?: string[];
  };
}

export interface OptimizeBudgetResponse {
  mode?: 'demo' | 'live';
  suggested_budget_range: {
    min_inr: number;
    max_inr: number;
    optimal_inr: number;
    currency: string;
  };
  cost_breakdown: Array<{
    category: string;
    percentage: number;
    amount_inr: number;
    justification: string;
  }>;
  potential_savings_percentage: number;
  cost_overrun_risk: string;
  historical_comparison?: {
    similar_projects_analyzed: number;
    avg_historical_cost_inr: number;
    variance_explanation: string;
    benchmark_unit_cost: string;
  };
}

export interface PredictRisksResponse {
  mode?: 'demo' | 'live';
  top_risks: Array<{
    risk_name: string;
    probability_percentage: number;
    impact_level: string;
    mitigation_strategy: string;
  }>;
  overall_risk_score: number;
}

export interface ForecastImpactResponse {
  mode?: 'demo' | 'live';
  five_year_roi_percentage: number;
  societal_impact_score: number;
  estimated_jobs_created: number;
  environmental_benefit_score: number;
  taxpayer_value_generated: {
    total_value_inr: number;
    formatted_summary: string;
    annual_net_benefit_inr: number;
    key_drivers: string[];
  };
}

export interface PredictTimelineResponse {
  mode?: 'demo' | 'live';
  predicted_completion_date: string;
  confidence_interval_months: number;
  critical_path_milestones: string[];
  delay_probability_percentage: number;
}

// ============================================================
// API METHODS
// ============================================================

/**
 * Health check to verify backend connectivity
 */
export async function checkBackendHealth(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/api/health', {
    method: 'GET',
    timeoutMs: 4000,
  });
}

/**
 * AI Engine 1: Structure a raw civic problem statement into Section 194 parameters
 * Matches the existing helper signature: { problem: problemDescription }
 */
export async function structureChallenge(problem: string): Promise<StructureChallengeResponse> {
  return apiRequest<StructureChallengeResponse>('/api/ai/structure-challenge', {
    method: 'POST',
    body: JSON.stringify({ problem }),
    timeoutMs: 12000,
  });
}

/**
 * AI Feature 2: Match relevant DPIIT startups to a challenge statement
 */
export async function matchStartups(challenge: any): Promise<MatchStartupsResponse> {
  return apiRequest<MatchStartupsResponse>('/api/ai/match-startups', {
    method: 'POST',
    body: JSON.stringify({ challenge }),
    timeoutMs: 12000,
  });
}

/**
 * AI Feature 3: Extract structured facts from startup pitch decks or case studies
 */
export async function analyzeDocument(text: string): Promise<AnalyzeDocumentResponse> {
  return apiRequest<AnalyzeDocumentResponse>('/api/ai/analyze-document', {
    method: 'POST',
    body: JSON.stringify({ text }),
    timeoutMs: 12000,
  });
}

/**
 * AI Engine 3: Multi-factor evaluation of candidate startups for a challenge
 */
export async function evaluateStartups(challenge: any, candidates: any[]): Promise<EvaluateStartupsResponse> {
  return apiRequest<EvaluateStartupsResponse>('/api/ai/evaluate-startups', {
    method: 'POST',
    body: JSON.stringify({ challenge, candidates }),
    timeoutMs: 15000,
  });
}

/**
 * AI Engine 4: Evaluate live pilot telemetry KPIs and detect anomalies
 */
export async function analyzePilot(kpis: any[]): Promise<AnalyzePilotResponse> {
  return apiRequest<AnalyzePilotResponse>('/api/ai/analyze-pilot', {
    method: 'POST',
    body: JSON.stringify({ kpis }),
    timeoutMs: 12000,
  });
}

/**
 * AI Engine 5: Fraud-detection and strength scoring for pilot evidence documents
 */
export async function summarizeEvidence(items: string[], excerpt: string = ''): Promise<SummarizeEvidenceResponse> {
  return apiRequest<SummarizeEvidenceResponse>('/api/ai/summarize-evidence', {
    method: 'POST',
    body: JSON.stringify({ items, excerpt }),
    timeoutMs: 12000,
  });
}

/**
 * AI Engine 6: Generate statutory decision brief with Scale Readiness Score
 */
export async function generateDecisionBrief(
  challengeTitle: string,
  kpis: any[],
  evidenceStrength: string = 'medium'
): Promise<DecisionBriefResponse> {
  return apiRequest<DecisionBriefResponse>('/api/ai/decision-brief', {
    method: 'POST',
    body: JSON.stringify({ challengeTitle, kpis, evidenceStrength }),
    timeoutMs: 12000,
  });
}

/**
 * Phase 2 AI: Spend benchmarking, cost breakdown and savings optimization
 */
export async function optimizeBudget(projectData: any): Promise<OptimizeBudgetResponse> {
  return apiRequest<OptimizeBudgetResponse>('/api/ai/optimize-budget', {
    method: 'POST',
    body: JSON.stringify({ projectData }),
    timeoutMs: 12000,
  });
}

/**
 * Phase 2 AI: Public sector deployment risk modeling and mitigations
 */
export async function predictRisks(projectData: any): Promise<PredictRisksResponse> {
  return apiRequest<PredictRisksResponse>('/api/ai/predict-risks', {
    method: 'POST',
    body: JSON.stringify({ projectData }),
    timeoutMs: 12000,
  });
}

/**
 * Phase 2 AI: Socio-economic ROI and 5-year public value forecaster
 */
export async function forecastImpact(projectData: any): Promise<ForecastImpactResponse> {
  return apiRequest<ForecastImpactResponse>('/api/ai/forecast-impact', {
    method: 'POST',
    body: JSON.stringify({ projectData }),
    timeoutMs: 12000,
  });
}

/**
 * Phase 2 AI: Critical path analysis, schedule variance & delay forecasting
 */
export async function predictTimeline(projectData: any): Promise<PredictTimelineResponse> {
  return apiRequest<PredictTimelineResponse>('/api/ai/predict-timeline', {
    method: 'POST',
    body: JSON.stringify({ projectData }),
    timeoutMs: 12000,
  });
}