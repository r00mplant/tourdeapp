import asyncio
import fastapi
from contextlib import asynccontextmanager
from fastapi.logger import logger
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
import uvicorn
from database import Base, engine
from routers import health, teams
from models import Team

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
    yield

app = fastapi.FastAPI(
    title="Tour de App API",
    version="1.0.0",
    lifespan=lifespan
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)