from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.farmer import Farmer
from ..models.advisory import Advisory
from ..schemas.advisory import AdvisoryOut
from ..services.weather import get_forecast
from ..services.advisory_engine import build_advisories
import math


router = APIRouter(prefix="/advisories", tags=["advisories"])


@router.get("/for/{farmer_id}", response_model=list[AdvisoryOut])
async def generate_for_farmer(farmer_id: int, db: Session = Depends(get_db)):
    farmer = db.get(Farmer, farmer_id)
    if not farmer:
        raise HTTPException(404, "Farmer not found")
    if farmer.latitude is None or farmer.longitude is None:
        raise HTTPException(status_code=422, detail="Invalid farmer coordinates")

    # Validate and convert coordinates
    try:
        lat = float(farmer.latitude)
        lon = float(farmer.longitude)
        if not (math.isfinite(lat) and math.isfinite(lon)):
            raise ValueError("Non-finite coordinates")
    except Exception:
        raise HTTPException(status_code=422, detail="Invalid farmer coordinates")

    try:
        weather = await get_forecast(lat, lon)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Advisory temporarily unavailable: {type(e).__name__}",
        )
    advs = build_advisories(
        {
            "crops": farmer.crops or "",
        },
        weather,
    )

    out = []
    for a in advs:
        adv = Advisory(
            farmer_id=farmer.id,
            text=a["text"],
            severity=a["severity"],
            source=a["source"],
        )
        db.add(adv)
        db.commit()
        db.refresh(adv)
        out.append(adv)
    return out
