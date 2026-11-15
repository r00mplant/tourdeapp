from pydantic import BaseModel

class StopResponse(BaseModel):
    id: int
    name: str
    image_url: str
    wheelchair_accessible: bool
    has_shelter: bool
    has_ticket_machine: bool

    model_config = {"from_attributes": True}

class StopListResponse(BaseModel):
    stops: list[StopResponse]

    model_config = {"from_attributes": True}


