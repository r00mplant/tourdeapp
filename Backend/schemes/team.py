from pydantic import BaseModel

class TeamCreate(BaseModel):
    name: str
    member1: str
    member2: str

class TeamResponse(BaseModel):
    id: int
    name: str
    member1: str
    member2: str

    model_config = {
        "from_attributes": True
    }
