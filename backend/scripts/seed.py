from datetime import datetime, timedelta

from app.db import SessionLocal, engine
from app.models import Base, Farmer, Activity


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Farmer).count() > 0:
            print("Seed: farmers already present, skipping.")
            return

        f1 = Farmer(
            name="Anil",
            language="en",
            soil_type="Alluvial",
            irrigation_type="Canal",
            latitude=9.9312,
            longitude=76.2673,
            land_size_ha=0.4856,
            crops="Paddy",
        )
        f2 = Farmer(
            name="Mini",
            language="en",
            soil_type="Laterite",
            irrigation_type="Drip",
            latitude=10.0889,
            longitude=76.3883,
            land_size_ha=0.3237,
            crops="Banana",
        )
        db.add_all([f1, f2])
        db.commit()

        now = datetime.utcnow()
        acts = [
            Activity(farmer_id=f1.id, type="sowing", notes="Kharif sowing done", at=now - timedelta(days=7)),
            Activity(farmer_id=f1.id, type="irrigation", notes="Canal release", at=now - timedelta(days=2)),
            Activity(farmer_id=f2.id, type="fertilizer", notes="NPK schedule-1", at=now - timedelta(days=5)),
        ]
        db.add_all(acts)
        db.commit()
        print("Seed: inserted demo farmers + activities.")
    finally:
        db.close()


if __name__ == "__main__":
    main()

