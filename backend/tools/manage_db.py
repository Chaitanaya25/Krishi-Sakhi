import os, sys
from app.models import Base
from app.db import engine

DB_FILE = "krishisakhi.db"


def reset():
    # remove old sqlite file if present
    try:
        os.remove(DB_FILE)
        print(f"[manage_db] Removed {DB_FILE}")
    except FileNotFoundError:
        print(f"[manage_db] {DB_FILE} not found — creating fresh DB")
    # create tables
    Base.metadata.create_all(bind=engine)
    print(f"[manage_db] Created tables in {DB_FILE}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "reset":
        reset()
    else:
        print("Usage: python tools/manage_db.py reset")
        sys.exit(1)
