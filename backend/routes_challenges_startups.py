from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

# ---- Challenges ----

@router.post("/challenges", response_model=schemas.ChallengeOut)
def create_challenge(challenge: schemas.ChallengeCreate, db: Session = Depends(get_db)):
    db_challenge = models.Challenge(**challenge.dict())
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge

@router.get("/challenges", response_model=list[schemas.ChallengeOut])
def list_challenges(db: Session = Depends(get_db)):
    return db.query(models.Challenge).all()

@router.get("/challenges/{challenge_id}", response_model=schemas.ChallengeOut)
def get_challenge(challenge_id: int, db: Session = Depends(get_db)):
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge


# ---- Startups ----

@router.post("/startups", response_model=schemas.StartupOut)
def create_startup(startup: schemas.StartupCreate, db: Session = Depends(get_db)):
    db_startup = models.Startup(**startup.dict())
    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup

@router.get("/startups", response_model=list[schemas.StartupOut])
def list_startups(db: Session = Depends(get_db)):
    return db.query(models.Startup).all()

@router.get("/startups/{startup_id}", response_model=schemas.StartupOut)
def get_startup(startup_id: int, db: Session = Depends(get_db)):
    startup = db.query(models.Startup).filter(models.Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    return startup
