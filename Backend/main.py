import fastapi
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database import Base, engine
from routers import health
from models import Team

@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)