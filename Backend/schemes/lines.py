from pydantic import BaseModel

class LineResponse(BaseModel):
    id: int
    number: str
    name: str
    type: str
    colour: str
    model_config = {"from_attributes": True}

class LineListResponse(BaseModel):
    lines: list[LineResponse]
    model_config = {"from_attributes": True}