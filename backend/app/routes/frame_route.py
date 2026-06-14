from fastapi import APIRouter
from app.schemas.frame_schema import FrameRequest
from app.detection.detect_frame import detect_from_frame

router = APIRouter()

@router.post("/frame")
async def frame_detection(req: FrameRequest):
    return detect_from_frame(req.frame)
