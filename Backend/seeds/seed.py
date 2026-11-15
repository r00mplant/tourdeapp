import csv
from pathlib import Path
from sqlalchemy.orm import Session
from database import engine
from models import Team, Stop

csv_path = Path(__file__).parent / "stops.csv"

def seed_stops(db: Session = Session(bind=engine)):
    if not db.query(Stop).first():
        with open(csv_path, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            stops = []
            for row in reader:
                stop = Stop(
                    name=row["name"],
                    image_url=row["image_url"],
                    is_transfer=row["is_transfer"].lower() == "true",
                    x=float(row["x"]),
                    y=float(row["y"]),
                    wheelchair_accessible=row["wheelchair_accessible"].lower() == "true",
                    has_shelter=row["has_shelter"].lower() == "true",
                    has_bench=row["has_bench"].lower() == "true",
                    has_ticket_machine=row["has_ticket_machine"].lower() == "true",
                    has_display=row["has_display"].lower() == "true",
                )
                stops.append(stop)
            db.add_all(stops)
            db.commit()