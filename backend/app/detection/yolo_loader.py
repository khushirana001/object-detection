from ultralytics import YOLO
from app.config import MODEL_PATH

try:
    model = YOLO(MODEL_PATH)
except FileNotFoundError:
    model = YOLO("yolov8n")
