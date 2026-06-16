from pathlib import Path
from ultralytics import YOLO
from app.config import MODEL_PATH

model_path = Path(MODEL_PATH)
if not model_path.is_absolute():
    model_path = Path(__file__).resolve().parents[1].parent / model_path

if not model_path.exists():
    raise FileNotFoundError(f"YOLO model file not found at {model_path}")

model = YOLO(str(model_path))
