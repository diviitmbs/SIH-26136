from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# CHANGE THIS to your actual Postgres connection string
# format: postgresql://username:password@localhost:5432/dbname
DATABASE_URL = "postgresql://postgres:password@localhost:5432/sih_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency used by every route to get a db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
