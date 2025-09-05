from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .base import Base


class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    language = Column(String(10), default="ml")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    land_size_ha = Column(Float, nullable=True)
    soil_type = Column(String(50), nullable=True)
    irrigation_type = Column(String(50), nullable=True)
    crops = Column(String(200), nullable=True)  # comma-separated
    created_at = Column(DateTime(timezone=True), server_default=func.now())
