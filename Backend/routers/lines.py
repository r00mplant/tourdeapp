from fastapi import APIRouter, Depends, HTTPException, status
import fastapi
from schemes.lines import LineResponse, LineListResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Line

router = APIRouter(
    prefix="/api/v1/lines",
    tags=["lines"]
)

@router.get("", response_model=list[LineResponse])
def get_lines(response = fastapi.Response, db: Session = Depends(get_db)):

    
    query = db.query(Line)

    if query.count() == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No lines found")

    response.status_code = status.HTTP_200_OK
    return query.all()