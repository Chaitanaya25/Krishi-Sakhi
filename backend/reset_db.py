#!/usr/bin/env python3
"""
Simple script to reset the database
"""

import os
from pathlib import Path

def reset_database():
    # Define the database path
    db_path = Path(__file__).parent / "krishisakhi.db"
    
    # Remove the database file if it exists
    if db_path.exists():
        try:
            print(f"Removing database file: {db_path}")
            os.remove(db_path)
            print("Database file removed successfully")
        except Exception as e:
            print(f"Error removing database file: {e}")
            return False
    else:
        print("Database file does not exist, creating a new one")
    
    # Create tables using SQLAlchemy models
    try:
        print("Creating tables...")
        from app.models import Base
        from app.db import engine
        
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully")
        return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

if __name__ == "__main__":
    reset_database()