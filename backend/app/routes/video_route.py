from fastapi import APIRouter, UploadFile, File, Request
from app.detection.detect_video import process_video

router = APIRouter()

@router.post("/video")
async def detect_video(request: Request, file: UploadFile = File(...)):
    output_path = process_video(file)
    return {"processed_video": str(request.base_url).rstrip("/") + output_path}
