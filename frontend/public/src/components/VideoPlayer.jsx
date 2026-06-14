import { useState } from "react";
import { api } from "../utils/api";

export default function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("Choose a video file to upload.");

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    setStatus("Uploading video...");

    try {
      const response = await api.post("/detect/video", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setVideoUrl(response.data.processed_video);
      setStatus("Video processed successfully.");
    } catch (error) {
      setStatus(error.response?.data || error.message);
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
