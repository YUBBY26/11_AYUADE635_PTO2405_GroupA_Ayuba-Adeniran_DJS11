import { useFavourites } from "../context/FavouritesContext";
import { useState } from "react";

export default function Favourites() {
  const { favourites, removeFavourite } = useFavourites();

  const [sortBy, setSortBy] = useState("newest"); // default

const sortedFavourites = [...favourites].sort((a, b) => {
  switch (sortBy) {
    case "title-asc":
      return a.episode.title.localeCompare(b.episode.title);
    case "title-desc":
      return b.episode.title.localeCompare(a.episode.title);
    case "oldest":
      return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
    case "newest":
    default:
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  }
});

  

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">⭐️ Your Favourite Episodes</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="newest">🆕 Newest First</option>
          <option value="oldest">📆 Oldest First</option>
          <option value="title-asc">A → Z</option>
          <option value="title-desc">Z → A</option>
        </select>
      </div>

      <button
  onClick={() => {
    if (confirm("Are you sure you want to clear all favourites?")) {
      localStorage.removeItem("favourites");
      window.location.reload(); // or update state manually
    }
  }}
  className="text-sm text-red-600 underline ml-4"
>
  Reset All Favourites
</button>

      {favourites.length === 0 ? (
        <p>You haven’t added any favourites yet.</p>
      ) : (
        <ul className="space-y-4">
          {sortedFavourites.map((fav) => (
            <li key={fav.episode.id} className="bg-white shadow rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{fav.episode.title}</p>
                  <p className="text-sm text-gray-500">
                    {fav.showTitle} • {fav.seasonTitle}
                  </p>
                  <p className="text-xs text-gray-400">
                    Added: {new Date(fav.addedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  className="text-red-500 text-sm"
                  onClick={() => removeFavourite(fav.episode.id)}
                >
                  Remove
                </button>
              </div>
              <audio controls className="mt-2 w-full" src={fav.episode.file}></audio>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}