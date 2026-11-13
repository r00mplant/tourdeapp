import fastapi
from fastapi import status, HTTPException
from sqlalchemy import inspect, text
from sqlalchemy.exc import SQLAlchemyError
from database import engine
from pydantic import BaseModel
from schemes import HealthResponse, DBHealthResponse

router = fastapi.APIRouter(
    prefix="/api/v1/health",
    tags=["Health"]
)

@router.get("/", response_model=HealthResponse, status_code=status.HTTP_200_OK)
def read_health():
    return HealthResponse(status="ok")

@router.get("/db", response_model=DBHealthResponse)
def read_health_db(response: fastapi.Response):

    inspector = inspect(engine)

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database connection error")

    teams_exists = inspector.has_table("teams")

    if not teams_exists:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Teams table missing")
    
    response.status_code = status.HTTP_200_OK
    return DBHealthResponse(db_status="ok", teams="ok")
