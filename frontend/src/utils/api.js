import axios from "axios";

function getDefaultBaseURL() {
  // Priority: VITE_API_URL -> window origin with port 8000 -> localhost:8000
  const envUrl = typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_URL : undefined;
  if (envUrl && envUrl.trim()) return envUrl.trim();

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return `${window.location.protocol}//${host}:8000`;
  }

  return "http://localhost:8000";
}

const baseURL = getDefaultBaseURL();

export const api = axios.create({
  baseURL,
  timeout: 600000,
});

api.interceptors.request.use((cfg) => {
  // ensure baseURL is set for dev/hardcoded scenarios
  if (!cfg.baseURL) cfg.baseURL = baseURL;
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // normalize error
    const payload = err?.response?.data || err?.message || err;
    console.error("API error:", payload);
    return Promise.reject(err);
  }
);

export default api;

export const postFrame = (frameB64) => api.post("/detect/frame", { frame: frameB64 });
export const uploadVideo = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/detect/video", form);
};
