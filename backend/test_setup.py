#!/usr/bin/env python3
"""
Test script to verify Krishi Sakhi backend setup
"""

import os
import sys
from pathlib import Path


def test_imports():
    """Test if all required modules can be imported"""
    print("🔍 Testing imports...")

    try:
        from app.config import settings

        print("✅ Config imported successfully")
    except Exception as e:
        print(f"❌ Config import failed: {e}")
        return False

    try:
        from app.db import engine

        print("✅ Database engine imported successfully")
    except Exception as e:
        print(f"❌ Database engine import failed: {e}")
        return False

    try:
        from app.models import Base, Farmer, Activity, Advisory

        print("✅ Models imported successfully")
    except Exception as e:
        print(f"❌ Models import failed: {e}")
        return False

    try:
        from app.main import app

        print("✅ FastAPI app imported successfully")
    except Exception as e:
        print(f"❌ FastAPI app import failed: {e}")
        return False

    return True


def test_database_connection():
    """Test database connection"""
    print("\n🔍 Testing database connection...")

    try:
        from app.db import engine

        with engine.connect() as conn:
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False


def test_alembic_setup():
    """Test Alembic setup"""
    print("\n🔍 Testing Alembic setup...")

    alembic_dir = Path("alembic")
    if not alembic_dir.exists():
        print("❌ Alembic directory not found")
        return False

    env_file = alembic_dir / "env.py"
    if not env_file.exists():
        print("❌ Alembic env.py not found")
        return False

    versions_dir = alembic_dir / "versions"
    if not versions_dir.exists():
        print("❌ Alembic versions directory not found")
        return False

    print("✅ Alembic setup looks good")
    return True


def test_environment():
    """Test environment variables"""
    print("\n🔍 Testing environment...")

    # Check if .env file exists
    env_file = Path(".env")
    if env_file.exists():
        print("✅ .env file found")
    else:
        print("⚠️  .env file not found (using defaults)")

    # Check virtual environment
    if hasattr(sys, "real_prefix") or (
        hasattr(sys, "base_prefix") and sys.base_prefix != sys.prefix
    ):
        print("✅ Virtual environment is active")
    else:
        print("⚠️  Virtual environment may not be active")

    return True


def main():
    """Run all tests"""
    print("🚀 Krishi Sakhi Backend Setup Test")
    print("=" * 40)

    tests = [
        test_imports,
        test_database_connection,
        test_alembic_setup,
        test_environment,
    ]

    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
            results.append(False)

    print("\n" + "=" * 40)
    print("📊 Test Results:")

    passed = sum(results)
    total = len(results)

    for i, (test, result) in enumerate(zip(tests, results), 1):
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {i}. {test.__name__}: {status}")

    print(f"\n🎯 Overall: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! Backend is ready to run.")
        print("\n💡 Next steps:")
        print("   1. Run: manage_db.bat reset")
        print("   2. Run: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")

    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
