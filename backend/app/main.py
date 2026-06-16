from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.frame_route import router as frame_router
from app.routes.video_route import router as video_router

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
OUTPUT_DIR = STATIC_DIR / "output_videos"
INPUT_DIR = BASE_DIR / "temp" / "input"
for directory in (STATIC_DIR, OUTPUT_DIR, INPUT_DIR):
    directory.mkdir(parents=True, exist_ok=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(frame_router, prefix="/detect")
app.include_router(video_router, prefix="/detect")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/")
def home():
    return {"message": "Object Detection API Running!"}
