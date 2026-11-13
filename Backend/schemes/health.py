from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str

class DBHealthResponse(BaseModel):
    db_status: str
    teams: str