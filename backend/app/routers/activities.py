from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.activity import Activity
from ..models.farmer import Farmer
from ..schemas.activity import ActivityCreate, ActivityOut


router = APIRouter(prefix="/activities", tags=["activities"])


@router.post("/", response_model=ActivityOut)
def create_activity(payload: ActivityCreate, db: Session = Depends(get_db)):
    farmer = db.get(Farmer, payload.farmer_id)
    if not farmer:
        raise HTTPException(404, "Farmer not found")
    act = Activity(**payload.dict())
    db.add(act)
    db.commit()
    db.refresh(act)
    return act


@router.get("/by-farmer/{farmer_id}", response_model=list[ActivityOut])
def list_by_farmer(farmer_id: int, db: Session = Depends(get_db)):
    return db.query(Activity).filter(Activity.farmer_id == farmer_id).order_by(Activity.id.desc()).all()
