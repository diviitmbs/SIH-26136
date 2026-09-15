"""
Database Seeding Script for SIH Municipal Pilot Demo Platform.

Populates initial challenge, startups, pilot, and KPI records if not already present.
Run with:
    python seed.py
"""

import sys
from database import SessionLocal, engine, Base
from models import User, Challenge, Startup, Pilot, KPI
import models


def seed():
    # 1. Ensure all database tables are created
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 2. Check if records exist in models.Challenge; insert if empty
        challenge = db.query(models.Challenge).first()
        if not challenge:
            challenge = models.Challenge(
                title="Ward 7 Non-Revenue Water Loss Reduction",
                description=(
                    "Municipal water distribution network in Ward 7 exhibits critical "
                    "non-revenue water losses due to aged subsurface distribution lines "
                    "and undetected leakages. Deploying IoT acoustic sensing and SCADA "
                    "telemetry to rapidly detect and localize leaks."
                ),
                department="Department of Water Supply & Sewerage",
                domain="Water Management",
                expected_outcome="20% reduction in non-revenue water",
                status="open",
            )
            db.add(challenge)
            db.commit()
            db.refresh(challenge)
            print(f"Created Challenge: {challenge.title} (ID: {challenge.id})")
        else:
            print(f"Existing Challenge found: {challenge.title} (ID: {challenge.id})")

        # 3. Check models.Startup; insert 3 realistic startups if empty
        existing_startups_count = db.query(models.Startup).count()
        startup1 = None
        if existing_startups_count == 0:
            s1 = models.Startup(
                name="AquaSense IoT",
                description="Specializes in acoustic IoT leak detection sensors, pressure management, and automated municipal SCADA telemetry.",
                domain="Water Management",
                technologies="Acoustic sensors, SCADA telemetry",
                experience="Reduced leakages in 2 municipal wards",
            )
            s2 = models.Startup(
                name="HydroVision AI",
                description="Provides real-time satellite imagery analysis, multispectral hydrology monitoring, and flow rate neural network prediction.",
                domain="Water Management",
                technologies="Satellite imaging, flow rate neural nets",
                experience="State-wide water surface mapping",
            )
            s3 = models.Startup(
                name="PipeGuard Robotics",
                description="Develops in-pipe autonomous inspection crawlers with high-resolution ultrasonic thickness gauging and video inspection.",
                domain="Water Management",
                technologies="In-pipe crawler drones",
                experience="Industrial pipeline defect inspection",
            )
            db.add_all([s1, s2, s3])
            db.commit()
            db.refresh(s1)
            startup1 = s1
            print("Inserted 3 realistic startups: AquaSense IoT, HydroVision AI, PipeGuard Robotics.")
        else:
            startup1 = db.query(models.Startup).filter(models.Startup.name == "AquaSense IoT").first()
            if not startup1:
                startup1 = db.query(models.Startup).first()
            print(f"Existing startups found ({existing_startups_count} records).")

        # 4. Insert 1 pilot linking Challenge 1 and Startup 1 if not exists
        pilot = db.query(models.Pilot).filter(
            models.Pilot.challenge_id == challenge.id,
            models.Pilot.startup_id == startup1.id,
        ).first()

        if not pilot:
            pilot = models.Pilot(
                challenge_id=challenge.id,
                startup_id=startup1.id,
                location="Bengaluru Ward 7",
                duration="90 days",
                status="active",
            )
            db.add(pilot)
            db.commit()
            db.refresh(pilot)
            print(f"Created Pilot: ID {pilot.id} linking Challenge {challenge.id} and Startup {startup1.id}.")
        else:
            print(f"Existing Pilot found: ID {pilot.id}.")

        # 5. Insert 3 KPI records in models.KPI for that pilot if not exists
        existing_kpis_count = db.query(models.KPI).filter(models.KPI.pilot_id == pilot.id).count()
        if existing_kpis_count == 0:
            kpis = [
                models.KPI(
                    pilot_id=pilot.id,
                    metric_name="Leakage Reduction",
                    baseline=35,
                    target=20,
                    actual=26,
                    status="PASS",
                ),
                models.KPI(
                    pilot_id=pilot.id,
                    metric_name="Acoustic Detection Accuracy",
                    baseline=60,
                    target=85,
                    actual=91,
                    status="PASS",
                ),
                models.KPI(
                    pilot_id=pilot.id,
                    metric_name="Response Latency (Hours)",
                    baseline=48,
                    target=12,
                    actual=8,
                    status="PASS",
                ),
            ]
            db.add_all(kpis)
            db.commit()
            print(f"Inserted 3 KPI records for Pilot ID {pilot.id}.")
        else:
            print(f"Existing KPIs found ({existing_kpis_count} records) for Pilot ID {pilot.id}.")

        # 6. Commit and finish
        db.commit()
        print("Database seeded successfully with SIH demo data")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}", file=sys.stderr)
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed()
