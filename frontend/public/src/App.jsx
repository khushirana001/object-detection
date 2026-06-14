import Home from "./pages/Home";
import CameraFeed from "./components/CameraFeed";
import VideoPlayer from "./components/VideoPlayer";

export default function App() {
  return (
    <div className="app-shell">
      <Home />
      <div className="grid">
        <CameraFeed />
        <VideoPlayer />
      </div>
    </div>
  );
}
