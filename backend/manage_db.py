#!/usr/bin/env python3
"""
Database Management Script for Krishi Sakhi
Provides utilities for database operations and management.
"""

import os
import sys
import sqlite3
import argparse
from pathlib import Path

# Add the current directory to the Python path so we can import our models
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def get_db_path():
    """Get the database file path"""
    return Path(__file__).parent / "krishisakhi.db"


def reset_database():
    """Reset the database by removing the file and recreating tables"""
    db_path = get_db_path()

    if db_path.exists():
        print(f"🗑️  Removing existing database: {db_path}")
        db_path.unlink()
        print("✅ Database removed")
    else:
        print("ℹ️  No existing database found")

    print("🔄 Creating fresh database with tables...")
    try:
        from app.models import Base
        from app.db import engine

        Base.metadata.create_all(bind=engine)
        print("✅ Database reset complete - tables created")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        print("💡 Make sure the backend is properly configured")


def inspect_database():
    """Inspect the current database schema and data"""
    db_path = get_db_path()

    if not db_path.exists():
        print("❌ Database does not exist. Run reset first.")
        return

    print(f"🔍 Inspecting database: {db_path}")
    print("=" * 50)

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Get table list
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        print(f"📋 Found {len(tables)} tables:")
        for table in tables:
            table_name = table[0]
            print(f"\n📊 Table: {table_name}")

            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            print("  Columns:")
            for col in columns:
                col_id, name, type_, not_null, default, pk = col
                pk_mark = " 🔑" if pk else ""
                null_mark = " NOT NULL" if not_null else ""
                print(f"    {name} ({type_}){null_mark}{pk_mark}")

            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            count = cursor.fetchone()[0]
            print(f"  Rows: {count}")

            # Show sample data (first 3 rows)
            if count > 0:
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 3;")
                rows = cursor.fetchall()
                print("  Sample data:")
                for row in rows:
                    print(f"    {row}")

        conn.close()

    except Exception as e:
        print(f"❌ Error inspecting database: {e}")


def show_help():
    """Show help information"""
    print("🚀 Krishi Sakhi Database Management")
    print("=" * 40)
    print("Available commands:")
    print("  reset     - Remove database and recreate tables")
    print("  inspect   - Show database schema and data")
    print("  help      - Show this help message")
    print("\nUsage examples:")
    print("  python manage_db.py reset")
    print("  python manage_db.py inspect")
    print("\nQuick reset (Windows):")
    print("  manage_db.bat reset")


def main():
    parser = argparse.ArgumentParser(description="Database management for Krishi Sakhi")
    parser.add_argument(
        "command", choices=["reset", "inspect", "help"], help="Command to execute"
    )

    args = parser.parse_args()

    if args.command == "reset":
        reset_database()
    elif args.command == "inspect":
        inspect_database()
    elif args.command == "help":
        show_help()


if __name__ == "__main__":
    if len(sys.argv) == 1:
        show_help()
    else:
        main()
