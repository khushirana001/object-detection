from pydantic import BaseModel

class FrameRequest(BaseModel):
    frame: str
