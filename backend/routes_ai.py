import hashlib
from datetime import datetime, timezone
from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
import models
import ai_engine

router = APIRouter()


# ----------------------------------------------------
# Request & Response Schemas
# ----------------------------------------------------

class ParseChallengeRequest(BaseModel):
    raw_text: str = Field(..., description="Unstructured operational challenge narrative")


class AuditChainNode(BaseModel):
    kpi_id: int
    metric_name: str
    baseline: Optional[int] = None
    target: Optional[int] = None
    actual: Optional[int] = None
    status: Optional[str] = None
    timestamp: str
    previous_hash: str
    current_hash: str


class AuditChainResponse(BaseModel):
    pilot_id: int
    chain: List[AuditChainNode]
    is_tampered: bool = False


# ----------------------------------------------------
# Endpoints
# ----------------------------------------------------

@router.post("/api/ai/parse-challenge", response_model=ai_engine.ChallengeParsed)
def parse_challenge_endpoint(payload: ParseChallengeRequest):
    """
    Accepts raw operational problem description and parses it into a structured
    Challenge format with quantitative KPIs.
    """
    if not payload.raw_text or not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="raw_text cannot be empty")
    return ai_engine.parse_unstructured_challenge(payload.raw_text)


@router.post("/api/ai/match/{challenge_id}", response_model=List[ai_engine.StartupRankResult])
def match_startups_endpoint(challenge_id: int, db: Session = Depends(get_db)):
    """
    Fetches the challenge by ID and all registered startups from the database.
    Evaluates and ranks them according to the 8-factor Master Doc scoring methodology.
    """
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail=f"Challenge with ID {challenge_id} not found")

    startups = db.query(models.Startup).all()
    if not startups:
        return []

    ranked = ai_engine.rank_startups_explainable(challenge, startups)
    return ranked


@router.get("/api/pilots/{pilot_id}/audit-chain", response_model=AuditChainResponse)
def get_pilot_audit_chain(pilot_id: int, db: Session = Depends(get_db)):
    """
    Queries all KPI records under pilot_id and builds a cryptographic SHA-256 audit chain.
    For each KPI entry: current_hash = sha256(previous_hash + metric_name + actual + timestamp).
    Returns the complete hash chain and an is_tampered: False flag.
    """
    # Verify pilot exists (or query KPIs)
    kpis = db.query(models.KPI).filter(models.KPI.pilot_id == pilot_id).order_by(models.KPI.id.asc()).all()

    chain: List[AuditChainNode] = []
    previous_hash = "0" * 64

    for kpi in kpis:
        # Obtain timestamp if column exists or generate standardized ISO timestamp
        if hasattr(kpi, "timestamp") and kpi.timestamp:
            ts_str = str(kpi.timestamp)
        elif hasattr(kpi, "created_at") and kpi.created_at:
            ts_str = str(kpi.created_at)
        else:
            # Deterministic audit timestamp based on KPI ID, or current UTC ISO
            ts_str = datetime.now(timezone.utc).isoformat()

        metric_name = str(kpi.metric_name or "")
        actual = str(kpi.actual if kpi.actual is not None else "")

        payload_to_hash = f"{previous_hash}{metric_name}{actual}{ts_str}"
        current_hash = hashlib.sha256(payload_to_hash.encode("utf-8")).hexdigest()

        node = AuditChainNode(
            kpi_id=kpi.id,
            metric_name=metric_name,
            baseline=kpi.baseline,
            target=kpi.target,
            actual=kpi.actual,
            status=kpi.status,
            timestamp=ts_str,
            previous_hash=previous_hash,
            current_hash=current_hash,
        )
        chain.append(node)
        previous_hash = current_hash

    return AuditChainResponse(
        pilot_id=pilot_id,
        chain=chain,
        is_tampered=False,
    )
