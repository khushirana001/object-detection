const backendUrl = "http://127.0.0.1:8000";
const liveVideo = document.getElementById("liveVideo");
const captureCanvas = document.getElementById("captureCanvas");
const resultImage = document.getElementById("resultImage");
const status = document.getElementById("status");
const startButton = document.getElementById("startButton");
const captureButton = document.getElementById("captureButton");
const videoFile = document.getElementById("videoFile");
const processedVideo = document.getElementById("processedVideo");

function setStatus(message) {
  status.textContent = message;
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    liveVideo.srcObject = stream;
    setStatus("Camera started.");
  } catch (error) {
    setStatus("Unable to access camera: " + error.message);
  }
}

async function captureFrame() {
  if (!liveVideo.videoWidth || !liveVideo.videoHeight) {
    setStatus("Waiting for camera video...");
    return;
  }

  captureCanvas.width = liveVideo.videoWidth;
  captureCanvas.height = liveVideo.videoHeight;
  const ctx = captureCanvas.getContext("2d");
  ctx.drawImage(liveVideo, 0, 0, captureCanvas.width, captureCanvas.height);
  const base64 = captureCanvas.toDataURL("image/jpeg").split(",")[1];

  setStatus("Sending frame to backend...");
  try {
    const response = await fetch(`${backendUrl}/detect/frame`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frame: base64 }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText);
    }

    const data = await response.json();
    resultImage.src = `data:image/jpeg;base64,${data.frame}`;
    setStatus("Frame processed successfully.");
  } catch (error) {
    setStatus("Error processing frame: " + error.message);
  }
}

async function uploadVideo(file) {
  if (!file) return;
  const form = new FormData();
  form.append("file", file);
  setStatus("Uploading video...");

  try {
    const response = await fetch(`${backendUrl}/detect/video`, {
      method: "POST",
      body: form,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText);
    }
    const data = await response.json();
    processedVideo.src = `${backendUrl}${data.processed_video}`;
    processedVideo.load();
    setStatus("Video processed successfully.");
  } catch (error) {
    setStatus("Error uploading video: " + error.message);
  }
}

startButton.addEventListener("click", startCamera);
captureButton.addEventListener("click", captureFrame);
videoFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  uploadVideo(file);
});
