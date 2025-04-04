import { useRef, useState, useMemo } from "react";
import { useFavourites } from "../context/FavouritesContext";
import BackButton from "../components/BackButton";

export default function Favourites() {
  const { favourites, removeFavourite } = useFavourites();
  const [sortBy, setSortBy] = useState("added-newest");
  const currentlyPlayingRef = useRef<HTMLAudioElement | null>(null);

  const sortedFavourites = useMemo(() => {
    return [...favourites].sort((a, b) => {
      if (sortBy === "title-asc") return a.episode.title.localeCompare(b.episode.title);
      if (sortBy === "title-desc") return b.episode.title.localeCompare(a.episode.title);
      if (sortBy === "added-newest")
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      if (sortBy === "added-oldest")
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      return 0;
    });
  }, [favourites, sortBy]);

  const handleReset = () => {
    if (confirm("Are you sure you want to remove all favourites?")) {
      sortedFavourites.forEach((fav) =>
        removeFavourite(fav.episode.id ?? fav.episode.episode)
      );
    }
  };

  const grouped = useMemo(() => {
    return sortedFavourites.reduce((acc, fav) => {
      const showKey = fav.showTitle;
      const seasonKey = fav.seasonTitle;
      if (!acc[showKey]) acc[showKey] = {};
      if (!acc[showKey][seasonKey]) acc[showKey][seasonKey] = [];
      acc[showKey][seasonKey].push(fav);
      return acc;
    }, {} as Record<string, Record<string, typeof favourites>>);
  }, [sortedFavourites]);

  const handleAudioPlay = (audioEl: HTMLAudioElement) => {
    if (currentlyPlayingRef.current && currentlyPlayingRef.current !== audioEl) {
      currentlyPlayingRef.current.pause();
      currentlyPlayingRef.current.currentTime = 0;
    }
    currentlyPlayingRef.current = audioEl;
  };

  // Log to ensure that the page is loading with data
  console.log("Favourites data:", favourites);
  console.log("Sorted favourites:", sortedFavourites);
  console.log("Grouped favourites:", grouped);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <BackButton />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">⭐️ Your Favourite Episodes</h1>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="title-asc">A → Z</option>
            <option value="title-desc">Z → A</option>
            <option value="added-newest">🆕 Newest First</option>
            <option value="added-oldest">📆 Oldest First</option>
          </select>

          {favourites.length > 0 && (
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {favourites.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          You haven't favourited any episodes yet.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([showTitle, seasons]) => (
            <div key={showTitle}>
              <h2 className="text-2xl font-semibold mb-2">{showTitle}</h2>
              {Object.entries(seasons).map(([seasonTitle, groupEpisodes]) => (
                <div key={`${showTitle}-${seasonTitle}`} className="mb-4">
                  <h3 className="text-xl font-medium mb-2">{seasonTitle}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {groupEpisodes.map((fav) => (
                      <div
                        key={`${fav.episode.id ?? fav.episode.episode}-${showTitle}-${seasonTitle}`}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition duration-300"
                      >
                        <div className="flex flex-col items-center">
                          <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            {fav.episode.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {fav.episode.duration}
                          </p>
                          <audio
                            controls
                            className="mt-2 w-full"
                            src={fav.episode.file}
                            onPlay={(e) => handleAudioPlay(e.currentTarget)}
                          />
                          <button
                            onClick={() => {
                              if (
                                confirm("Are you sure you want to remove this episode?")
                              ) {
                                removeFavourite(fav.episode.id ?? fav.episode.episode);
                              }
                            }}
                            className="text-red-500 mt-2 text-sm hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
