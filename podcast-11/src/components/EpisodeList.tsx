import { useRef } from "react";
import { Episode } from "../types/types";
import { Heart, HeartOff } from "lucide-react";
import { useFavourites } from "../context/FavouritesContext";
import { useAudioPlayer } from "../context/AudioPlayerContext";

interface Props {
  episodes: Episode[];
  showTitle: string;
  seasonTitle: string;
}

export default function EpisodeList({ episodes, showTitle, seasonTitle }: Props) {
  const { favourites, toggleFavourite } = useFavourites();
  const { playEpisode, currentEpisode, getSavedTimestamp, togglePlayPause, isPlaying, audioRef } = useAudioPlayer();
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const handlePlay = (ep: Episode, index: number) => {
    // Pause all other audios (if any) and play only in the global sticky audio player
    audioRefs.current.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Get the saved timestamp and play from there
    const savedTimestamp = getSavedTimestamp(ep.id);

    // Trigger the global sticky audio player to play
    playEpisode({
      episode: ep,
      showTitle,
      seasonTitle,
    });

    const audio = audioRefs.current[index];
    if (audio) {
      audio.currentTime = savedTimestamp;
    }

    // Start playing in the global player
    togglePlayPause();
  };

  return (
    <ul className="space-y-4">
      {episodes.map((ep, index) => {
        const episodeId = typeof ep.id === "number" ? ep.id : ep.episode ?? index;

        // Get the saved timestamp for this episode
        const savedTimestamp = getSavedTimestamp(ep.id);
        const isFav = favourites.some(
          (f) =>
            (f.episode.id === episodeId || f.episode.episode === episodeId) &&
            f.showTitle === showTitle &&
            f.seasonTitle === seasonTitle
        );

        return (
          <li
            key={`${episodeId}-${showTitle}-${seasonTitle}`}
            className={`relative p-4 border rounded-lg shadow bg-white dark:bg-gray-800 ${
              currentEpisode?.id === ep.id ? "border-blue-500 ring-1 ring-blue-300" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-base font-semibold text-gray-800 dark:text-white">{ep.title}</p>
              <button
                onClick={() =>
                  toggleFavourite({
                    episode: ep,
                    showTitle,
                    seasonTitle,
                    addedAt: new Date().toISOString(),
                  })
                }
                className="ml-2 p-1"
              >
                {isFav ? (
                  <Heart className="text-red-500 w-5 h-5" />
                ) : (
                  <HeartOff className="w-5 h-5 text-gray-500 dark:text-white" />
                )}
              </button>
            </div>

            {/* Display timestamp */}
            {savedTimestamp > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                <p>Resume from: {new Date(savedTimestamp * 1000).toISOString().substr(14, 5)}</p>
              </div>
            )}

            {/* Episode Audio Player */}
            <audio
              controls
              ref={(el) => (audioRefs.current[index] = el)}
              onPlay={() => handlePlay(ep, index)}
              className="mt-2 w-full"
              src={ep.file}
            />
          </li>
        );
      })}
    </ul>
  );
}
