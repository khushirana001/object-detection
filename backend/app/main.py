from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.frame_route import router as frame_router
from app.routes.video_route import router as video_router

app = FastAPI()
app.include_router(frame_router, prefix="/detect")
app.include_router(video_router, prefix="/detect")
app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
def home():
    return {"message": "Object Detection API Running!"}
