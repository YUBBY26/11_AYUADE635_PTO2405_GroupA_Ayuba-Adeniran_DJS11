import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Show from "./pages/Show";
import Favourites from "./pages/Favourites";
import AudioPlayerBar from "./components/AudioPlayerBar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
          🎧 Yubcast
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/favourites" className="hover:underline">
              Favourites
            </Link>
          </nav>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<Show />} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
      </main>
      <AudioPlayerBar />
    </div>
  );
}
