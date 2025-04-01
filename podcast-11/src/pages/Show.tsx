import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Show } from "../types";
import { useFavourites } from "../context/FavouritesContext";
import { Heart, HeartOff } from "lucide-react";

export default function ShowPage() {
  const { id } = useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(0);
  const { favourites, toggleFavourite } = useFavourites();

  useEffect(() => {
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((res) => res.json())
      .then((data) => setShow(data));
  }, [id]);

  if (!show) return <p>Loading show...</p>;

  const season = show.seasons[selectedSeason];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{show.title}</h1>
      <div className="flex space-x-2 mb-4">
        {show.seasons.map((season, i) => (
          <button
            key={season.id}
            className={`px-4 py-1 rounded ${i === selectedSeason ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedSeason(i)}
          >
            {season.title}
          </button>
        ))}
      </div>

      <ul className="space-y-4">
        {season.episodes.map((ep) => {
          const isFav = favourites.some((f) => f.episode.id === ep.id);
          return (
            <li key={ep.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{ep.title}</p>
                <button
                  onClick={() =>
                    toggleFavourite({
                      episode: ep,
                      seasonTitle: season.title,
                      showTitle: show.title,
                      addedAt: new Date().toISOString(),
                    })
                  }
                >
                  {isFav ? <Heart className="text-red-500" /> : <HeartOff />}
                </button>
              </div>
              <audio controls className="mt-2 w-full" src={ep.file}></audio>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
