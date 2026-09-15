"""
AI Engine for SIH Municipal Innovation & Startup Pilot Platform.

Provides:
1. parse_unstructured_challenge: Transforms unstructured operational problem
   descriptions into structured Challenge objects with quantitative KPIs.
2. rank_startups_explainable: Evaluates startups against a challenge using an
   8-factor scoring methodology adhering strictly to Master Doc weights.
"""

import os
import re
import logging
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field, model_validator
from dotenv import load_dotenv
import instructor
from google import genai

# Configure logging
logger = logging.getLogger("ai_engine")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] [ai_engine]: %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

# Load environment variables
load_dotenv()

# Master Doc 8-Factor Weights (Sum: 100% / 1.00)
FACTOR_WEIGHTS = {
    "problem_fit": 0.25,
    "impact": 0.20,
    "feasibility": 0.15,
    "cost": 0.10,
    "evidence": 0.10,
    "timeline": 0.10,
    "scalability": 0.05,
    "readiness": 0.05,
}

MODEL_NAME = "gemini-2.5-flash"


# ==========================================
# Pydantic Schemas
# ==========================================

class SuggestedKPI(BaseModel):
    """Quantitative KPI with baseline, target, and unit."""
    metric_name: str = Field(..., description="Name of the measurable KPI metric")
    baseline: float = Field(..., description="Baseline or current quantitative value")
    target: float = Field(..., description="Target quantitative metric value")
    unit: str = Field(default="", description="Unit of measurement (e.g., %, hours, liters/day)")

    @model_validator(mode="before")
    @classmethod
    def handle_string_or_dict(cls, data: Any) -> Any:
        if isinstance(data, str):
            # Parse simple string descriptions if provided
            return {
                "metric_name": data,
                "baseline": 0.0,
                "target": 100.0,
                "unit": "",
            }
        return data

    def __getitem__(self, item: str) -> Any:
        return getattr(self, item)

    def __str__(self) -> str:
        unit_str = f" {self.unit}" if self.unit else ""
        return f"{self.metric_name}: baseline={self.baseline}{unit_str}, target={self.target}{unit_str}"


class ChallengeParsed(BaseModel):
    """
    Pydantic schema matching models.Challenge fields:
    title, description, department, domain, expected_outcome, status,
    plus quantitative suggested_kpis.
    """
    title: str = Field(..., description="Clear and descriptive title of the municipal challenge")
    description: str = Field(..., description="Detailed narrative of the operational problem and context")
    department: str = Field(..., description="Governmental or municipal department responsible")
    domain: str = Field(..., description="Operating domain (e.g. Smart Water Management, Urban Mobility)")
    expected_outcome: str = Field(..., description="Measurable operational outcomes expected from the pilot")
    status: str = Field(default="open", description="Challenge operational status")
    suggested_kpis: List[SuggestedKPI] = Field(
        default_factory=list,
        description="List of quantitative suggested KPIs with measurable baselines and targets"
    )

    def __getitem__(self, item: str) -> Any:
        return getattr(self, item)


class StartupFactorScores(BaseModel):
    """Individual scores (0-100) across the 8 Master Doc evaluation factors."""
    problem_fit: float = Field(..., ge=0, le=100, description="Problem fit score (Weight: 25%)")
    impact: float = Field(..., ge=0, le=100, description="Impact score (Weight: 20%)")
    feasibility: float = Field(..., ge=0, le=100, description="Feasibility score (Weight: 15%)")
    cost: float = Field(..., ge=0, le=100, description="Cost efficiency score (Weight: 10%)")
    evidence: float = Field(..., ge=0, le=100, description="Evidence / prior track record score (Weight: 10%)")
    timeline: float = Field(..., ge=0, le=100, description="Timeline & deployment speed score (Weight: 10%)")
    scalability: float = Field(..., ge=0, le=100, description="Scalability score (Weight: 5%)")
    readiness: float = Field(..., ge=0, le=100, description="Technology readiness score (Weight: 5%)")

    def __getitem__(self, item: str) -> Any:
        return getattr(self, item)


class StartupRankResult(BaseModel):
    """Result of startup evaluation and ranking."""
    startup_id: Optional[int] = Field(None, description="Startup database ID if known")
    startup_name: str = Field(..., description="Startup name")
    scores: StartupFactorScores = Field(..., description="The 8-factor scores (0-100)")
    total_score: float = Field(..., description="Weighted total score calculated strictly using Master Doc weights")
    rationale: str = Field(..., description="Exactly two-sentence explanatory rationale for the evaluation")

    def __getitem__(self, item: str) -> Any:
        return getattr(self, item)


# Schemas for Instructor Batch Evaluation
class _StartupEvalItem(BaseModel):
    startup_name: str
    problem_fit: float = Field(..., ge=0, le=100)
    impact: float = Field(..., ge=0, le=100)
    feasibility: float = Field(..., ge=0, le=100)
    cost: float = Field(..., ge=0, le=100)
    evidence: float = Field(..., ge=0, le=100)
    timeline: float = Field(..., ge=0, le=100)
    scalability: float = Field(..., ge=0, le=100)
    readiness: float = Field(..., ge=0, le=100)
    rationale: str = Field(..., description="Strictly 2 sentences explaining the startup's scores and pilot fit.")


class _BatchStartupEvaluation(BaseModel):
    evaluations: List[_StartupEvalItem]


# ==========================================
# Hardcoded Municipal Water Leakage Fallback
# ==========================================

MOCK_WATER_LEAKAGE_CHALLENGE = ChallengeParsed(
    title="Municipal Water Distribution Leakage Detection & Non-Revenue Water Reduction Pilot",
    description=(
        "Municipal water distribution networks experience substantial non-revenue water loss exceeding 40% "
        "owing to aging distribution mains, undetected subsurface ruptures, and delayed physical inspection. "
        "This pilot deploys real-time IoT acoustic sensing, hydraulic pressure transient monitoring, and "
        "automated anomaly localization to pinpoint pipe leaks within hours, notifying field maintenance "
        "units immediately to prevent subterranean washouts and unbilled volume loss."
    ),
    department="Department of Water Supply & Municipal Sewerage Infrastructure",
    domain="Smart Water Management & Urban Utilities",
    expected_outcome=(
        "Curtail municipal non-revenue water losses from 42% down to 18% across pilot distribution zones, "
        "achieve mean leak detection response times under 2 hours, and conserve an estimated 500,000 liters "
        "of potable water per day."
    ),
    status="open",
    suggested_kpis=[
        SuggestedKPI(
            metric_name="Non-Revenue Water (NRW) Loss Percentage",
            baseline=42.0,
            target=18.0,
            unit="%",
        ),
        SuggestedKPI(
            metric_name="Mean Time to Detect (MTTD) Pipe Leaks",
            baseline=48.0,
            target=2.0,
            unit="hours",
        ),
        SuggestedKPI(
            metric_name="Acoustic Sensor Anomaly Localization Precision",
            baseline=35.0,
            target=92.0,
            unit="%",
        ),
        SuggestedKPI(
            metric_name="Daily Treated Water Volume Conserved",
            baseline=0.0,
            target=500000.0,
            unit="liters/day",
        ),
    ],
)


# ==========================================
# Helper Utilities
# ==========================================

def is_mock_ai_enabled() -> bool:
    """Checks if USE_MOCK_AI environment variable is set to true."""
    val = os.getenv("USE_MOCK_AI", "").strip().lower()
    return val in ("true", "1", "yes", "t")


def calculate_total_score(scores: Union[StartupFactorScores, Dict[str, float]]) -> float:
    """
    Calculates total score strictly following the Master Doc weights:
    - Problem fit: 25% (0.25)
    - Impact: 20% (0.20)
    - Feasibility: 15% (0.15)
    - Cost: 10% (0.10)
    - Evidence: 10% (0.10)
    - Timeline: 10% (0.10)
    - Scalability: 5% (0.05)
    - Readiness: 5% (0.05)
    """
    total = (
        float(scores["problem_fit"]) * FACTOR_WEIGHTS["problem_fit"]
        + float(scores["impact"]) * FACTOR_WEIGHTS["impact"]
        + float(scores["feasibility"]) * FACTOR_WEIGHTS["feasibility"]
        + float(scores["cost"]) * FACTOR_WEIGHTS["cost"]
        + float(scores["evidence"]) * FACTOR_WEIGHTS["evidence"]
        + float(scores["timeline"]) * FACTOR_WEIGHTS["timeline"]
        + float(scores["scalability"]) * FACTOR_WEIGHTS["scalability"]
        + float(scores["readiness"]) * FACTOR_WEIGHTS["readiness"]
    )
    return round(total, 2)


def ensure_two_sentence_rationale(text: str, startup_name: str, domain: str) -> str:
    """Ensures the rationale consists strictly of two concise sentences."""
    cleaned = text.replace("\n", " ").strip()
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", cleaned) if s.strip()]

    if len(sentences) >= 2:
        s1 = sentences[0]
        s2 = sentences[1]
        if not s1.endswith((".", "!", "?")):
            s1 += "."
        if not s2.endswith((".", "!", "?")):
            s2 += "."
        return f"{s1} {s2}"
    elif len(sentences) == 1:
        s1 = sentences[0]
        if not s1.endswith((".", "!", "?")):
            s1 += "."
        s2 = f"{startup_name} provides practical operational readiness for rapid municipal deployment."
        return f"{s1} {s2}"
    else:
        return (
            f"{startup_name} exhibits strong alignment with operational requirements in {domain}. "
            f"Its technical approach demonstrates proven feasibility and high pilot impact potential."
        )


def _extract_startup_dict(s: Any) -> Dict[str, Any]:
    """Extracts startup dictionary whether input is dict, Pydantic model, or ORM object."""
    if isinstance(s, dict):
        return s
    elif hasattr(s, "model_dump"):
        return s.model_dump()
    elif hasattr(s, "dict"):
        return s.dict()
    else:
        return {
            "id": getattr(s, "id", None),
            "name": getattr(s, "name", "Unnamed Startup"),
            "description": getattr(s, "description", ""),
            "domain": getattr(s, "domain", ""),
            "technologies": getattr(s, "technologies", ""),
            "experience": getattr(s, "experience", ""),
        }


def _extract_challenge_dict(c: Any) -> Dict[str, Any]:
    """Extracts challenge dictionary whether input is dict, Pydantic model, or ORM object."""
    if isinstance(c, dict):
        return c
    elif hasattr(c, "model_dump"):
        return c.model_dump()
    elif hasattr(c, "dict"):
        return c.dict()
    else:
        return {
            "id": getattr(c, "id", None),
            "title": getattr(c, "title", ""),
            "description": getattr(c, "description", ""),
            "department": getattr(c, "department", ""),
            "domain": getattr(c, "domain", ""),
            "expected_outcome": getattr(c, "expected_outcome", ""),
        }


def _get_instructor_client():
    """Initializes instructor client with google.genai."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")
    genai_client = genai.Client(api_key=api_key)
    return instructor.from_genai(genai_client, mode=instructor.Mode.JSON)


# ==========================================
# Main Feature 1: parse_unstructured_challenge
# ==========================================

def parse_unstructured_challenge(raw_text: str) -> ChallengeParsed:
    """
    Takes raw operational text and returns a Pydantic object matching models.Challenge:
    title, description, department, domain, expected_outcome, status,
    plus a list of quantitative suggested_kpis.

    Offline check:
    If os.getenv('USE_MOCK_AI') is 'true' or if the Gemini API raises an exception,
    returns hardcoded valid challenge data for a municipal water leakage pilot.
    """
    if is_mock_ai_enabled():
        logger.info("USE_MOCK_AI is enabled. Returning hardcoded municipal water leakage challenge.")
        return MOCK_WATER_LEAKAGE_CHALLENGE.model_copy(deep=True)

    if not raw_text or not raw_text.strip():
        logger.warning("Empty raw_text provided to parse_unstructured_challenge; using fallback challenge.")
        return MOCK_WATER_LEAKAGE_CHALLENGE.model_copy(deep=True)

    try:
        client = _get_instructor_client()
        system_prompt = (
            "You are an expert civic technology and municipal operational challenge analyst. "
            "Analyze the unstructured raw problem description provided by municipal authorities. "
            "Extract and structure it into a formal Challenge containing: "
            "1. title: Concise and authoritative municipal challenge title. "
            "2. description: Comprehensive operational problem statement. "
            "3. department: Relevant civic or government department. "
            "4. domain: Civic/technical domain (e.g. Smart Water, Waste Management, Mobility). "
            "5. expected_outcome: Tangible, measurable operational outcome. "
            "6. suggested_kpis: A list of quantitative KPIs with specific numerical baselines, "
            "target values, and units (e.g. %, hours, km, liters/day)."
        )

        response: ChallengeParsed = client.chat.completions.create(
            model=MODEL_NAME,
            response_model=ChallengeParsed,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Operational Problem Text:\n{raw_text}"},
            ],
            temperature=0.2,
        )

        # Ensure status is populated
        if not response.status:
            response.status = "open"

        logger.info("Successfully parsed unstructured challenge using %s", MODEL_NAME)
        return response

    except Exception as exc:
        logger.warning(
            "Gemini API or Instructor call failed with error: %s. "
            "Falling back to hardcoded municipal water leakage challenge data.",
            exc,
        )
        return MOCK_WATER_LEAKAGE_CHALLENGE.model_copy(deep=True)


# ==========================================
# Main Feature 2: rank_startups_explainable
# ==========================================

def _offline_rank_startups(challenge_data: Any, startups_list: List[Any]) -> List[StartupRankResult]:
    """
    Deterministic offline fallback scoring engine adhering strictly to Master Doc weights:
    Problem fit (25%), Impact (20%), Feasibility (15%), Cost (10%),
    Evidence (10%), Timeline (10%), Scalability (5%), Readiness (5%).
    """
    ch_dict = _extract_challenge_dict(challenge_data)
    ch_text = f"{ch_dict.get('title', '')} {ch_dict.get('domain', '')} {ch_dict.get('description', '')}".lower()

    results: List[StartupRankResult] = []

    for s in startups_list:
        s_dict = _extract_startup_dict(s)
        s_name = s_dict.get("name", "Unnamed Startup")
        s_domain = s_dict.get("domain", "")
        s_tech = s_dict.get("technologies", "")
        s_desc = s_dict.get("description", "")
        s_exp = s_dict.get("experience", "")

        text_corpus = f"{s_domain} {s_tech} {s_desc} {s_exp}".lower()

        # Heuristic scoring based on domain and tech overlap
        # Check domain match
        domain_match = bool(s_domain and s_domain.lower() in ch_text)
        keyword_overlap = sum(1 for w in ["iot", "water", "leak", "sensor", "ai", "acoustic", "pipeline", "smart", "monitor"] if w in ch_text and w in text_corpus)

        base = 75.0 if domain_match else 65.0
        bonus = min(20.0, keyword_overlap * 4.0)

        p_fit = min(98.0, max(50.0, base + bonus))
        impact = min(96.0, max(50.0, base + bonus - 2.0))
        feasibility = min(95.0, max(50.0, base + (5.0 if "iot" in text_corpus or "sensor" in text_corpus else -3.0)))
        cost = min(92.0, max(55.0, 78.0 + (5.0 if "open source" in text_corpus or "low cost" in text_corpus else 0.0)))
        evidence = min(95.0, max(45.0, 70.0 + (15.0 if "deployment" in text_corpus or "pilot" in text_corpus or "year" in text_corpus else 0.0)))
        timeline = min(94.0, max(50.0, 80.0 + (5.0 if "ready" in text_corpus or "turnkey" in text_corpus else 0.0)))
        scalability = min(95.0, max(50.0, base + 2.0))
        readiness = min(96.0, max(50.0, 75.0 + (10.0 if "production" in text_corpus or "commercial" in text_corpus else 0.0)))

        scores = StartupFactorScores(
            problem_fit=round(p_fit, 1),
            impact=round(impact, 1),
            feasibility=round(feasibility, 1),
            cost=round(cost, 1),
            evidence=round(evidence, 1),
            timeline=round(timeline, 1),
            scalability=round(scalability, 1),
            readiness=round(readiness, 1),
        )

        total = calculate_total_score(scores)

        sentence1 = f"{s_name} demonstrates strong alignment with {ch_dict.get('domain', 'municipal requirements')} utilizing {s_tech or 'relevant core technologies'}."
        sentence2 = f"Its operational track record offers proven deployment feasibility with an estimated pilot readiness timeline of under 60 days."
        rationale = f"{sentence1} {sentence2}"

        results.append(
            StartupRankResult(
                startup_id=s_dict.get("id"),
                startup_name=s_name,
                scores=scores,
                total_score=total,
                rationale=rationale,
            )
        )

    # Sort descending by total_score
    results.sort(key=lambda x: x.total_score, reverse=True)
    return results


def rank_startups_explainable(challenge_data: Any, startups_list: List[Any]) -> List[StartupRankResult]:
    """
    Takes challenge data and a list of startup objects.
    Calculates an 8-factor score strictly following the Master Doc weights:
    - Problem fit: 25%
    - Impact: 20%
    - Feasibility: 15%
    - Cost: 10%
    - Evidence: 10%
    - Timeline: 10%
    - Scalability: 5%
    - Readiness: 5%

    Returns each startup's scores, total calculated score, and a 2-sentence rationale,
    sorted by rank (total calculated score descending).
    """
    if not startups_list:
        return []

    # If mock mode is explicitly requested, use deterministic offline evaluation
    if is_mock_ai_enabled():
        logger.info("USE_MOCK_AI is enabled. Performing offline explainable ranking.")
        return _offline_rank_startups(challenge_data, startups_list)

    try:
        client = _get_instructor_client()
        ch_dict = _extract_challenge_dict(challenge_data)

        # Format startups summary for the prompt
        startups_formatted = []
        for idx, s in enumerate(startups_list):
            s_dict = _extract_startup_dict(s)
            startups_formatted.append(
                f"Startup #{idx + 1}:\n"
                f"  Name: {s_dict.get('name', 'Startup')}\n"
                f"  Domain: {s_dict.get('domain', 'N/A')}\n"
                f"  Technologies: {s_dict.get('technologies', 'N/A')}\n"
                f"  Description: {s_dict.get('description', 'N/A')}\n"
                f"  Experience: {s_dict.get('experience', 'N/A')}\n"
            )

        challenge_summary = (
            f"Title: {ch_dict.get('title', 'N/A')}\n"
            f"Department: {ch_dict.get('department', 'N/A')}\n"
            f"Domain: {ch_dict.get('domain', 'N/A')}\n"
            f"Description: {ch_dict.get('description', 'N/A')}\n"
            f"Expected Outcome: {ch_dict.get('expected_outcome', 'N/A')}\n"
        )

        system_prompt = (
            "You are an expert procurement and startup pilot evaluation evaluator for municipal government challenges.\n"
            "Score each startup strictly from 0 to 100 on the following 8 factors:\n"
            "1. problem_fit: Direct suitability of startup technology to the operational problem.\n"
            "2. impact: Magnitude of expected outcome improvements and savings.\n"
            "3. feasibility: Technical robustness and pilot operational viable within municipal constraints.\n"
            "4. cost: Budget viability, pricing reasonableness, and operational cost efficiency.\n"
            "5. evidence: Past case studies, verified track record, and technical validation.\n"
            "6. timeline: Deployment readiness and speed to deliver pilot within 30-90 days.\n"
            "7. scalability: Ease of scaling city-wide after pilot success.\n"
            "8. readiness: Current technology maturity and hardware/software readiness level.\n\n"
            "CRITICAL REQUIREMENT: For each startup, you must write a rationale of EXACTLY TWO SENTENCES explaining the rating and pilot fit."
        )

        user_content = (
            f"=== MUNICIPAL CHALLENGE ===\n{challenge_summary}\n\n"
            f"=== CANDIDATE STARTUPS ===\n{''.join(startups_formatted)}"
        )

        response: _BatchStartupEvaluation = client.chat.completions.create(
            model=MODEL_NAME,
            response_model=_BatchStartupEvaluation,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            temperature=0.2,
        )

        # Map LLM evaluations back to original startup objects
        eval_map = {item.startup_name.strip().lower(): item for item in response.evaluations}
        ranked_results: List[StartupRankResult] = []

        for s in startups_list:
            s_dict = _extract_startup_dict(s)
            s_name = s_dict.get("name", "Unnamed Startup")
            eval_item = eval_map.get(s_name.strip().lower())

            if eval_item:
                scores = StartupFactorScores(
                    problem_fit=eval_item.problem_fit,
                    impact=eval_item.impact,
                    feasibility=eval_item.feasibility,
                    cost=eval_item.cost,
                    evidence=eval_item.evidence,
                    timeline=eval_item.timeline,
                    scalability=eval_item.scalability,
                    readiness=eval_item.readiness,
                )
                rationale = ensure_two_sentence_rationale(
                    eval_item.rationale,
                    s_name,
                    ch_dict.get("domain", "civic innovation")
                )
            else:
                # Fallback scores if specific startup was omitted in LLM response
                scores = StartupFactorScores(
                    problem_fit=75.0,
                    impact=75.0,
                    feasibility=70.0,
                    cost=70.0,
                    evidence=65.0,
                    timeline=75.0,
                    scalability=70.0,
                    readiness=70.0,
                )
                rationale = (
                    f"{s_name} shows viable alignment with the municipal challenge requirements. "
                    f"Additional pilot benchmarking is recommended to validate operational performance."
                )

            # Strictly calculate total score using Master Doc weights in Python
            total = calculate_total_score(scores)

            ranked_results.append(
                StartupRankResult(
                    startup_id=s_dict.get("id"),
                    startup_name=s_name,
                    scores=scores,
                    total_score=total,
                    rationale=rationale,
                )
            )

        # Sort descending by total score
        ranked_results.sort(key=lambda x: x.total_score, reverse=True)
        logger.info("Successfully ranked %d startups using %s", len(ranked_results), MODEL_NAME)
        return ranked_results

    except Exception as exc:
        logger.warning(
            "Gemini API or Instructor ranking failed with error: %s. "
            "Falling back to offline explainable ranking.",
            exc,
        )
        return _offline_rank_startups(challenge_data, startups_list)
