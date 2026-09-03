from pydantic import BaseModel
from typing import Optional

# ---------- PERSON A ----------

class ChallengeCreate(BaseModel):
    title: str
    description: str
    department: str
    domain: str
    expected_outcome: str

class ChallengeOut(ChallengeCreate):
    id: int
    status: str
    class Config:
        from_attributes = True


class StartupCreate(BaseModel):
    name: str
    description: str
    domain: str
    technologies: str
    experience: str

class StartupOut(StartupCreate):
    id: int
    class Config:
        from_attributes = True


# ---------- PERSON B ----------

class PilotCreate(BaseModel):
    challenge_id: int
    startup_id: int
    location: str
    duration: str

class PilotOut(PilotCreate):
    id: int
    status: str
    class Config:
        from_attributes = True


class KPICreate(BaseModel):
    pilot_id: int
    metric_name: str
    baseline: int
    target: int
    actual: int
    status: Optional[str] = None

class KPIOut(KPICreate):
    id: int
    class Config:
        from_attributes = True
