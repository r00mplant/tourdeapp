import fastapi
from fastapi import status
import uvicorn
from pydantic import BaseModel

app = fastapi.FastAPI()

class HealthResponse(BaseModel):
    status: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/v1/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
def read_health() -> HealthResponse:
    return HealthResponse(status="ok")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)