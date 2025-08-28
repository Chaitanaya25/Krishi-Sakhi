from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.farmer import Farmer
from ..models.advisory import Advisory
from ..schemas.advisory import AdvisoryOut
from ..services.weather import get_forecast
from ..services.advisory_engine import build_advisories
import asyncio


router = APIRouter(prefix="/advisories", tags=["advisories"])


@router.get("/for/{farmer_id}", response_model=list[AdvisoryOut])
async def generate_for_farmer(farmer_id: int, db: Session = Depends(get_db)):
    farmer = db.get(Farmer, farmer_id)
    if not farmer:
        raise HTTPException(404, "Farmer not found")
    if not (farmer.latitude and farmer.longitude):
        raise HTTPException(400, "Farmer must have latitude & longitude")

    weather = await get_forecast(farmer.latitude, farmer.longitude)
    advs = build_advisories(
        {
            "crops": farmer.crops or "",
        },
        weather,
    )

    out = []
    for a in advs:
        adv = Advisory(farmer_id=farmer.id, text=a["text"], severity=a["severity"], source=a["source"])
        db.add(adv)
        db.commit()
        db.refresh(adv)
        out.append(adv)
    return out
