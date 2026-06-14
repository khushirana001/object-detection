import base64
import cv2
import numpy as np
from collections import Counter
from app.detection.yolo_loader import model


def detect_from_frame(b64_frame: str):
    decoded = base64.b64decode(b64_frame)
    np_img = np.frombuffer(decoded, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Invalid image data")

    results = model(frame)[0]
    detection_list = []
    labels = []

    for box in results.boxes:
        xyxy = box.xyxy[0]
        if hasattr(xyxy, "cpu"):
            xyxy = xyxy.cpu().numpy()
        x1, y1, x2, y2 = map(int, xyxy)
        label = model.names[int(box.cls[0])]
        conf = float(box.conf[0])
        labels.append(label)

        detection_list.append(
            {
                "label": label,
                "confidence": round(conf, 3),
                "bbox": [x1, y1, x2, y2],
            }
        )

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(
            frame,
            f"{label} {conf:.2f}",
            (x1, max(y1 - 10, 0)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (255, 0, 0),
            2,
        )

    label_counts = Counter(labels)
    _, buffer = cv2.imencode(".jpg", frame)
    b64_out = base64.b64encode(buffer).decode("utf-8")

    return {
        "frame": b64_out,
        "objects": detection_list,
        "object_count": len(detection_list),
        "counts": dict(label_counts),
    }
