from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

# ---- Pilots ----

@router.post("/pilots", response_model=schemas.PilotOut)
def create_pilot(pilot: schemas.PilotCreate, db: Session = Depends(get_db)):
    db_pilot = models.Pilot(**pilot.dict())
    db.add(db_pilot)
    db.commit()
    db.refresh(db_pilot)
    return db_pilot

@router.get("/pilots/{pilot_id}", response_model=schemas.PilotOut)
def get_pilot(pilot_id: int, db: Session = Depends(get_db)):
    pilot = db.query(models.Pilot).filter(models.Pilot.id == pilot_id).first()
    if not pilot:
        raise HTTPException(status_code=404, detail="Pilot not found")
    return pilot


# ---- KPIs ----

@router.post("/kpis", response_model=schemas.KPIOut)
def create_kpi(kpi: schemas.KPICreate, db: Session = Depends(get_db)):
    # auto-compute PASS/FAIL if not provided
    data = kpi.dict()
    if not data.get("status"):
        data["status"] = "PASS" if data["actual"] >= data["target"] else "FAIL"
    db_kpi = models.KPI(**data)
    db.add(db_kpi)
    db.commit()
    db.refresh(db_kpi)
    return db_kpi

@router.post("/pilot-results", response_model=list[schemas.KPIOut])
def get_pilot_results(pilot_id: int, db: Session = Depends(get_db)):
    return db.query(models.KPI).filter(models.KPI.pilot_id == pilot_id).all()
