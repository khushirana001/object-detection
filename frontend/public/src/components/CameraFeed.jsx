import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";

export default function CameraFeed() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [resultFrame, setResultFrame] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [status, setStatus] = useState("Ready to start camera.");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    return () => {
      const tracks = videoRef.current?.srcObject?.getTracks?.() ?? [];
      tracks.forEach((track) => track.stop());
      clearInterval(intervalRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsStreaming(true);
      setStatus("Camera is live. Ready for live detection.");
    } catch (error) {
      setStatus(`Unable to access camera: ${error.message}`);
    }
  };

  const stopCamera = () => {
    const tracks = videoRef.current?.srcObject?.getTracks?.() ?? [];
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setIsStreaming(false);
    stopDetection();
    setStatus("Camera stopped.");
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (videoRef.current.videoWidth === 0) {
      setStatus("Please allow camera access and wait for the stream.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
    setStatus("Detecting objects in frame...");

    try {
      const response = await api.post("/detect/frame", { frame: base64 });
      setResultFrame(response.data.frame);
      setMetadata(response.data);
      setStatus(
        `Detected ${response.data.object_count} object${response.data.object_count === 1 ? "" : "s"}.
        `
      );
    } catch (error) {
      setStatus(error.response?.data || error.message);
    }
  };

  const startDetection = () => {
    if (!isStreaming) {
      setStatus("Start the camera first before live detection.");
      return;
    }
    if (isDetecting) return;

    setIsDetecting(true);
    setStatus("Live detection started.");
    intervalRef.current = setInterval(captureFrame, 700);
  };

  const stopDetection = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsDetecting(false);
    setStatus("Live detection stopped.");
  };

  const downloadResult = () => {
    if (!resultFrame) return;
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${resultFrame}`;
    link.download = "detected-frame.jpg";
    link.click();
  };

  const detectionSummary = () => {
    if (!metadata) return null;
    const countEntries = Object.entries(metadata.counts || {});
    return (
      <div className="summary">
        <div className="summary-item">
          <strong>Total objects:</strong> {metadata.object_count}
        </div>
        {countEntries.length > 0 && (
          <div className="summary-item">
            <strong>Counts:</strong>
            <ul>
              {countEntries.map(([label, count]) => (
                <li key={label}>
                  {label}: {count}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Live Camera Detection</h2>
          <p>Stream your webcam, detect objects, and download snapshots.</p>
        </div>
      </div>

      <div className="media-grid">
        <div className="video-box video-container">
          <video ref={videoRef} muted playsInline />
        </div>
        <div className="video-box result-box">
          {resultFrame ? (
            <img
              src={`data:image/jpeg;base64,${resultFrame}`}
              alt="Processed live frame"
            />
          ) : (
            <div className="placeholder">Processed frame will appear here.</div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} hidden />

      <div className="actions">
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={stopCamera} disabled={!isStreaming}>
          Stop Camera
        </button>
        <button onClick={startDetection} disabled={!isStreaming || isDetecting}>
          Start Live Detection
        </button>
        <button onClick={stopDetection} disabled={!isDetecting}>
          Stop Live Detection
        </button>
        <button onClick={captureFrame} disabled={!isStreaming}>
          Capture Snapshot
        </button>
        <button onClick={downloadResult} disabled={!resultFrame}>
          Download Result
        </button>
      </div>

      {detectionSummary()}
      <p className="status">{status}</p>
    </section>
  );
}
