from pydantic import BaseModel
from typing import Optional


class ActivityCreate(BaseModel):
    farmer_id: int
    type: str
    notes: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None


class ActivityOut(ActivityCreate):
    id: int
    class Config:
        from_attributes = True
