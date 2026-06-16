import { useState } from "react";
import { api } from "../utils/api";

export default function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("Choose a video file to upload.");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    setStatus("Uploading and processing video. This can take a few minutes for larger files...");
    setIsUploading(true);

    try {
      const response = await api.post("/detect/video", form, { timeout: 600000 });
      setVideoUrl(response.data.processed_video);
      setStatus("Video processed successfully.");
    } catch (error) {
      const errMsg = error.response?.data?.detail || error.response?.data || error.message;
      setStatus(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Upload Video Detection</h2>
          <p>Upload a video file and preview the annotated output from the backend.</p>
        </div>
      </div>

      <input type="file" accept="video/*" onChange={handleUpload} />
      {videoUrl && (
        <video className="video-box" controls src={videoUrl} />
      )}

      <p className="status">{status}</p>
    </section>
  );
}
