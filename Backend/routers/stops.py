import fastapi
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemes.stops import StopListResponse, StopResponse
from models import Stop

router = APIRouter(
    prefix="/api/v1/stops",
    tags=["stops"],
)

@router.get("/", response_model=StopListResponse)
def get_stops(response: fastapi.Response, db: Session = Depends(get_db)):

    stops = db.query(Stop).all()
    response.status_code = status.HTTP_200_OK
    return StopListResponse(stops=stops)

@router.get("/:{stop_id}", response_model=StopResponse)
def get_stop_by_id(stop_id: int, response: fastapi.Response, db: Session = Depends(get_db)):
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")
    response.status_code = status.HTTP_200_OK
    return StopResponse(stop=stop)
