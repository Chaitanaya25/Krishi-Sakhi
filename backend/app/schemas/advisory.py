from pydantic import BaseModel
from typing import Optional


class AdvisoryOut(BaseModel):
    id: int
    farmer_id: int
    text: str
    severity: str
    source: str
    class Config:
        from_attributes = True
