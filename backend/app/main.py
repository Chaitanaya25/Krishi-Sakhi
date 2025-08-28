from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import engine
from .models import Base
from .routers import farmers, activities, advisories, webhook_whatsapp
from .routers import farmers, activities, advisories, webhook_whatsapp, geolocation
# ...
from .routers import farmers, activities, advisories, webhook_whatsapp, geolocation

# ...
app.include_router(geolocation.router)


# CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables (demo; use Alembic in prod)
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(farmers.router)
app.include_router(activities.router)
app.include_router(advisories.router)
app.include_router(webhook_whatsapp.router)

@app.get("/")
def root():
    return {"ok": True, "service": "Krishi Sakhi API"}
