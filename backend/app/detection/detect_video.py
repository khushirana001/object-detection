import cv2
import uuid
from pathlib import Path
from app.detection.yolo_loader import model

BASE_DIR = Path(__file__).resolve().parents[2]
INPUT_DIR = BASE_DIR / "app" / "temp" / "input"
OUTPUT_DIR = BASE_DIR / "app" / "static" / "output_videos"

for directory in (INPUT_DIR, OUTPUT_DIR):
    if directory.exists() and not directory.is_dir():
        directory.unlink()
    directory.mkdir(parents=True, exist_ok=True)

def process_video(file):
    input_path = INPUT_DIR / f"{uuid.uuid4()}.mp4"
    output_path = OUTPUT_DIR / f"{uuid.uuid4()}.mp4"

    with open(input_path, "wb") as f:
        f.write(file.file.read())

    cap = cv2.VideoCapture(str(input_path))
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        cap.release()
        raise ValueError("Could not read video FPS from the uploaded file")

    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    if w <= 0 or h <= 0:
        cap.release()
        raise ValueError("Could not read video dimensions from the uploaded file")

    codec_candidates = ["avc1", "H264", "mp4v"]
    writer = None
    for codec in codec_candidates:
        fourcc = cv2.VideoWriter_fourcc(*codec)
        writer = cv2.VideoWriter(str(output_path), fourcc, fps, (w, h))
        if writer.isOpened():
            break
    if writer is None or not writer.isOpened():
        cap.release()
        raise RuntimeError("Could not create video writer for any supported codec")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)[0]
        for box in results.boxes:
            xyxy = box.xyxy[0]
            if hasattr(xyxy, "cpu"):
                xyxy = xyxy.cpu().numpy()
            x1, y1, x2, y2 = map(int, xyxy)
            label = model.names[int(box.cls[0])]
            conf = float(box.conf[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                frame,
                f"{label} {conf:.2f}",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (255, 0, 0),
                2,
            )

        writer.write(frame)

    cap.release()
    writer.release()
    return f"/static/output_videos/{output_path.name}"

