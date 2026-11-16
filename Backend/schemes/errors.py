from pydantic import BaseModel

class ErrorResponse(BaseModel):
    error: str
    message: str

    model_config = {"from_attributes": True}