# backend/app/schemas/advisory.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AdvisoryBase(BaseModel):
    farmer_id: int
    text: str
    source: Optional[str] = "ai"
    severity: Optional[str] = None


class AdvisoryCreate(AdvisoryBase):
    pass


class Advisory(AdvisoryBase):
    id: int
    created_at: Optional[datetime] = None

    # IMPORTANT: allow returning SQLAlchemy objects directly
    model_config = ConfigDict(from_attributes=True)


class AdvisoryOut(BaseModel):
    id: int
    farmer_id: int
    text: str
    severity: str
    source: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
