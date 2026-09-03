from sqlalchemy import Column, Integer, String, ForeignKey, Text
from database import Base

# ---------- PERSON A owns these ----------

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String)  # e.g. "government", "startup", "admin"


class Challenge(Base):
    __tablename__ = "challenges"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    department = Column(String)
    domain = Column(String)
    expected_outcome = Column(Text)
    status = Column(String, default="open")


class Startup(Base):
    __tablename__ = "startups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    domain = Column(String)
    technologies = Column(String)
    experience = Column(Text)


# ---------- PERSON B owns these ----------

class Pilot(Base):
    __tablename__ = "pilots"
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"))
    startup_id = Column(Integer, ForeignKey("startups.id"))
    location = Column(String)
    duration = Column(String)  # e.g. "60 days"
    status = Column(String, default="active")


class KPI(Base):
    __tablename__ = "kpis"
    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"))
    metric_name = Column(String)
    baseline = Column(Integer)
    target = Column(Integer)
    actual = Column(Integer)
    status = Column(String)  # e.g. "PASS" / "FAIL"
