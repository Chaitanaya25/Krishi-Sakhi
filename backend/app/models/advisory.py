from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base


class Advisory(Base):
    __tablename__ = "advisories"

    id = Column(Integer, primary_key=True)
    farmer_id = Column(
        Integer, ForeignKey("farmers.id", ondelete="CASCADE"), index=True
    )
    text = Column(String(1000), nullable=False)
    severity = Column(String(20), default="info")  # info/warn/urgent
    source = Column(String(20), default="rule")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    farmer = relationship("Farmer")
