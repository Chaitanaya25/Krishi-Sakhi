#!/usr/bin/env python3
"""
Simple test script to verify database setup
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def test_database_setup():
    """Test if database can be created and tables exist"""
    print("🧪 Testing Database Setup")
    print("=" * 30)

    try:
        # Test imports
        print("🔍 Testing imports...")
        from app.models import Base
        from app.db import engine

        print("✅ Imports successful")

        # Test table creation
        print("🔍 Testing table creation...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully")

        # Test database connection
        print("🔍 Testing database connection...")
        with engine.connect() as conn:
            result = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [row[0] for row in result]
            print(f"✅ Database connected, found {len(tables)} tables: {tables}")

        print("\n🎉 Database setup test passed!")
        return True

    except Exception as e:
        print(f"❌ Database setup test failed: {e}")
        return False


if __name__ == "__main__":
    success = test_database_setup()
    sys.exit(0 if success else 1)
