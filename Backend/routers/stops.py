from urllib import response
from fastapi import Path
from typing import Annotated
import fastapi
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
from schemes.stops import StopListResponse, StopResponse, StopCreateRequest
from schemes.errors import ErrorResponse
from models import Stop
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

ADMIN_KEY = "Kyqc49jIM+5+D0Sed8ZQ671gxkd7W/bBTWjDtZ0Zrgk="

security = HTTPBearer(auto_error=False)

def require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(security)):
    if not credentials or credentials.credentials != ADMIN_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin key")

router = APIRouter(
    prefix="/api/v1",
    tags=["stops"],
)

@router.get("/stops", response_model=list[StopResponse])
def get_stops(response: fastapi.Response, db: Session = Depends(get_db)):

    response.status_code = status.HTTP_200_OK
    return db.query(Stop).all()

@router.get("/stops/{stop_id}", response_model=StopResponse | ErrorResponse)
def get_stop_by_id(stop_id: Annotated[int, Path(gt=0)], response: fastapi.Response, db: Session = Depends(get_db)):
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not stop:
        response.status_code = status.HTTP_404_NOT_FOUND
        return ErrorResponse(error="Not Found", message="Stop not found")
    response.status_code = status.HTTP_200_OK
    return stop

@router.put("/stops/{stop_id}", response_model=StopResponse | ErrorResponse)
def update_stop(stop_id: Annotated[int, Path(gt=0)], stop: StopCreateRequest, response: fastapi.Response, db: Session = Depends(get_db), admin: None = Depends(require_admin)):
    existing_stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not existing_stop:
        response.status_code = status.HTTP_404_NOT_FOUND
        return ErrorResponse(error="Not Found", message="Stop not found")
    stop_data = stop.model_dump()
    for key, value in stop_data.items():
        setattr(existing_stop, key, value)
    try:
        db.commit()
        db.refresh(existing_stop)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(exc)}")
    response.status_code = status.HTTP_200_OK
    return existing_stop

@router.delete("/stops/{stop_id}", response_model=ErrorResponse | None)
def delete_stop(stop_id: Annotated[int, Path(gt=0)], response: fastapi.Response, db: Session = Depends(get_db), admin: None = Depends(require_admin)):
    existing_stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not existing_stop:
        response.status_code = status.HTTP_404_NOT_FOUND
        return ErrorResponse(error="Not Found", message="Stop not found")
    try:
        db.delete(existing_stop)
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(exc)}")
    response.status_code = status.HTTP_204_NO_CONTENT
    return None

@router.post("/stops", response_model=StopResponse | ErrorResponse)
def create_stop(stop: StopCreateRequest, response: fastapi.Response, db: Session = Depends(get_db), admin: None = Depends(require_admin)):
   
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