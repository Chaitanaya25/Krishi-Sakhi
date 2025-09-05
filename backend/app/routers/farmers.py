from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.farmer import Farmer
from ..schemas.farmer import FarmerCreate, FarmerOut


router = APIRouter(prefix="/farmers", tags=["farmers"])


@router.post("/", response_model=FarmerOut)
def create_farmer(payload: FarmerCreate, db: Session = Depends(get_db)):
    # Pydantic v2: use model_dump for dict conversion
    farmer = Farmer(**payload.model_dump())
    db.add(farmer)
    db.commit()
    db.refresh(farmer)
    return farmer


@router.get("/", response_model=list[FarmerOut])
def list_farmers(db: Session = Depends(get_db)):
    return db.query(Farmer).order_by(Farmer.id.desc()).all()


@router.get("/{farmer_id}", response_model=FarmerOut)
def get_farmer(farmer_id: int, db: Session = Depends(get_db)):
    farmer = db.get(Farmer, farmer_id)
    if not farmer:
        raise HTTPException(404, "Farmer not found")
    return farmer
