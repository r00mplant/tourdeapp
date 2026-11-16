from pydantic import BaseModel
from pydantic import Field
from pydantic import HttpUrl, StrictBool


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
    name: str = Field(min_length=1, max_length=255)
    image_url: HttpUrl | None = Field(default=None, max_length=255) 
    is_transfer: bool | None = Field(default=None)
    x: float | None = Field(default=None)
    y: float | None = Field(default=None)
    wheelchair_accessible: StrictBool
    has_shelter: StrictBool
    has_bench: bool | None = Field(default=None)
    has_ticket_machine: StrictBool
    has_display: bool | None = Field(default=None)

    model_config = {"from_attributes": True}
    model_config = {"ConfigDict": {"extra": "forbid"}}

