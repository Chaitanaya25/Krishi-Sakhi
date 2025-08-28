from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id", ondelete="CASCADE"), index=True)
    type = Column(String(50), nullable=False)  # sowing, irrigation, spray, pest, harvest
    notes = Column(String(500), nullable=True)
    quantity = Column(Float, nullable=True)
    unit = Column(String(20), nullable=True)
    at = Column(DateTime(timezone=True), server_default=func.now())

    farmer = relationship("Farmer")
