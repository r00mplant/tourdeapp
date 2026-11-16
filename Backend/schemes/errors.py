from pydantic import BaseModel

class ErrorResponse(BaseModel):
    message: str

    model_config = {"from_attributes": True}