from fastapi import FastAPI
from database import engine, Base
import routes_challenges_startups
import routes_pilots_kpis

# Creates all tables in Postgres if they don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIH 26136 - Backend + Database")

app.include_router(routes_challenges_startups.router, tags=["Challenges & Startups"])
app.include_router(routes_pilots_kpis.router, tags=["Pilots & KPIs"])

@app.get("/")
def root():
    return {"status": "running"}
