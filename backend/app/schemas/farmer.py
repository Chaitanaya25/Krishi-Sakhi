from pydantic import BaseModel, Field
from typing import Optional


class FarmerCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    language: Optional[str] = Field(default="ml")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    land_size_ha: Optional[float] = None
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    crops: Optional[str] = None # comma-separated


class FarmerOut(FarmerCreate):
    id: int
    class Config:
        from_attributes = True
