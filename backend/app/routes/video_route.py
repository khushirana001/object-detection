from fastapi import APIRouter, UploadFile, File
from app.detection.detect_video import process_video

router = APIRouter()

@router.post("/video")
async def detect_video(file: UploadFile = File(...)):
    output_path = process_video(file)
    return {"processed_video": output_path}
