import asyncio
from email.mime import message
from attrs import field
import fastapi
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi import status
from contextlib import asynccontextmanager
from fastapi.logger import logger
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError
import uvicorn
from database import Base, engine
from routers import health, teams, stops
from models import Team, Stop
import csv
from fastapi.staticfiles import StaticFiles
from seeds.seed import seed_stops

@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    for attempt in range(1, 31):
        try:
            with engine.connect():
                pass
            break
        except OperationalError:
            if attempt == 30:
                logger.exception("Datenbank nach 30 Versuchen nicht erreichbar")
                raise
            logger.warning("Datenbank noch nicht erreichbar: Versuch %s/30", attempt)
            await asyncio.sleep(2)

    Base.metadata.create_all(bind=engine)
    seed_stops()
    yield

app = fastapi.FastAPI(
    title="Tour de App API",
    version="1.0.0",
    lifespan=lifespan
)

@app.exception_handler(fastapi.HTTPException)
async def http_exception_handler(request: Request, exc: fastapi.HTTPException):
    if exc.status_code == status.HTTP_401_UNAUTHORIZED:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "Unauthorized"},
        )

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):

    errors = exc.errors()
    error = errors[0] if errors else None
    field = error["loc"][-1] if error else None

    message = "Invalid request"

    if error:
        if error["type"] == "value_error.missing":
            message = f"Missing field: {field}"
        elif error["type"] == "type_error":
            message = f"Invalid type for field: {field}"
        elif error["type"] == "value_error":
            message = f"Invalid value for field: {field}"

    return JSONResponse(
        status_code=400,
        content={"error": message},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(teams.router)
app.include_router(stops.router)
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)