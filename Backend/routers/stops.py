import fastapi
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
from schemes.stops import StopListResponse, StopResponse, StopCreateRequest
from models import Stop

router = APIRouter(
    prefix="/api/v1",
    tags=["stops"],
)

@router.get("/stops")
def get_stops(response: fastapi.Response, db: Session = Depends(get_db)):

    response.status_code = status.HTTP_200_OK
    return db.query(Stop).all()

@router.get("/stops/{stop_id}", response_model=StopResponse)
def get_stop_by_id(stop_id: int, response: fastapi.Response, db: Session = Depends(get_db)):
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")
    response.status_code = status.HTTP_200_OK
    return stop


@router.post("/stops", response_model=StopResponse)
def create_stop(stop: StopCreateRequest, response: fastapi.Response, db: Session = Depends(get_db)):
   
    stop_data = stop.model_dump()
    new_stop = Stop(**stop_data)
    try:
        db.add(new_stop)
        db.commit()
        db.refresh(new_stop)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(exc)}")
    response.status_code = status.HTTP_201_CREATED
    return new_stop