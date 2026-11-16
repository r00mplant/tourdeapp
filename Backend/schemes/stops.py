from pydantic import BaseModel
from pydantic import Field
class StopResponse(BaseModel):
    id: int
    name: str
    image_url: str | None
    wheelchair_accessible: bool
    has_shelter: bool
    has_ticket_machine: bool

    model_config = {"from_attributes": True}

class StopListResponse(BaseModel):
    stops: list[StopResponse]

    model_config = {"from_attributes": True}

class StopCreateRequest(BaseModel):
    name: str
    image_url: str | None = Field(default=None)
    is_transfer: bool | None = Field(default=None)
    x: float | None = Field(default=None)
    y: float | None = Field(default=None)
    wheelchair_accessible: bool
    has_shelter: bool
    has_bench: bool | None = Field(default=None)
    has_ticket_machine: bool
    has_display: bool | None = Field(default=None)

    model_config = {"from_attributes": True}

