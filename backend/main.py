from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import routes_challenges_startups
import routes_pilots_kpis
import routes_ai

# Creates all tables in Postgres if they don't exist yet
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database connection warning on startup: {e}")

app = FastAPI(title="SIH 26136 - Backend + Database")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_challenges_startups.router, tags=["Challenges & Startups"])
app.include_router(routes_pilots_kpis.router, tags=["Pilots & KPIs"])
app.include_router(routes_ai.router, tags=["AI & Audit"])

@app.get("/")
def root():
    return {"status": "running"}
