import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Show } from "../types/index";
import EpisodeList from "../components/EpisodeList";
import BackButton from "../components/BackButton";

export default function ShowPage() {
  const { id } = useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setShow(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch show:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedSeason]);

  if (loading) return <p className="p-4">Loading show...</p>;
  if (!show) return <p className="p-4 text-red-500">Show not found.</p>;

  const season = show.seasons[selectedSeason];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <BackButton />
      <h1 className="text-3xl font-bold mb-4">{show.title}</h1>

      {/* Season Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {show.seasons.map((season, i) => (
          <button
            key={season.id || i}
            className={`px-4 py-1 rounded border ${
              i === selectedSeason
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
            onClick={() => setSelectedSeason(i)}
          >
            {season.title} ({season.episodes.length} episodes)
          </button>
        ))}
      </div>

      {/* Season Preview Image */}
      <img
        src={season.image || "/fallback.jpg"}
        alt={season.title}
        className="w-full h-64 object-cover rounded mb-4"
      />

      {/* Episodes */}
      <EpisodeList
        episodes={season.episodes}
        showTitle={show.title}
        seasonTitle={season.title}
      />
    </div>
  );
}
