from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import engine
from .models import Base
from .routers import farmers, activities, advisories, webhook_whatsapp, geolocation, ai

# Initialize FastAPI app
app = FastAPI(
    title="Krishi Sakhi API",
    description="Personal Farming Assistant API",
    version="1.0.0",
)

# CORS - use the new cors_origins_list property
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables (simple approach - use manage_db.py for reset)
# Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(farmers.router)
app.include_router(activities.router)
app.include_router(advisories.router)
app.include_router(webhook_whatsapp.router)
app.include_router(geolocation.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {"ok": True, "service": "Krishi Sakhi API"}


@app.get("/healthz")
def healthz():
    """Kubernetes-style health probe."""
    return {"ok": True}


@app.get("/health")
def health_check():
    """Quick health check for connectivity testing"""
    return {"ok": True, "status": "healthy", "service": "Krishi Sakhi API"}


@app.get("/version")
def version():
    return {"version": app.version}


@app.get("/db-status")
def database_status():
    """Check database connection and table status"""
    try:
        # Test database connection
        with engine.connect() as conn:
            # Check if tables exist
            result = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [row[0] for row in result]

            return {
                "status": "connected",
                "database": "SQLite",
                "tables": tables,
                "table_count": len(tables),
                "note": "Use manage_db.py reset to recreate tables if needed",
            }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "suggestion": "Run 'python manage_db.py reset' to create database",
        }
