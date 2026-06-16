import { useState } from "react";
import Home from "./pages/Home";
import LiveCamera from "./pages/LiveCamera";
import UploadVideo from "./pages/UploadVideo";

export default function App() {
  const [view, setView] = useState("home");

  return (
    <div className="app-shell">
      <nav style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <button onClick={() => setView("home")}>Home</button>
        <button onClick={() => setView("live")}>Live Camera</button>
        <button onClick={() => setView("upload")}>Upload Video</button>
      </nav>

      {view === "home" && <Home />}
      {view === "live" && <LiveCamera />}
      {view === "upload" && <UploadVideo />}
    </div>
  );
}
