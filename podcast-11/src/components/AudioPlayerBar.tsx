import { useState, useEffect } from "react";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import {
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
  SkipForward,
  SkipBack,
} from "lucide-react";

// Ensure the time is always formatted as 00:00 (MM:SS)
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function AudioPlayerBar() {
  const { nowPlaying, playNext, playPrev, audioRef } = useAudioPlayer();
  const [collapsed, setCollapsed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0); // added duration state

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setDuration(audio.duration || 0);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      if (!nowPlaying) return;

      // Save as listened in localStorage
      const key = `listened-${nowPlaying.showTitle}-${nowPlaying.seasonTitle}-${nowPlaying.episode.title}`;
      const listened = JSON.parse(localStorage.getItem("listenedEpisodes") || "[]");

      if (!listened.includes(key)) {
        listened.push(key);
        localStorage.setItem("listenedEpisodes", JSON.stringify(listened));
      }

      playNext(); // Automatically play the next episode after the current one finishes
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [nowPlaying, playNext, audioRef]);

  if (!nowPlaying) return null;

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-md p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {collapsed ? (
          <div className="flex justify-between items-center">
            <p className="truncate font-semibold">{nowPlaying.episode.title}</p>
            <button
              onClick={() => setCollapsed(false)}
              className="text-gray-600 dark:text-gray-300"
            >
              <ChevronUp />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <p className="text-sm font-semibold truncate">{nowPlaying.episode.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{nowPlaying.showTitle} — {nowPlaying.seasonTitle}</p>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={playPrev}
                className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                title="Previous"
              >
                <SkipBack size={24} />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <button
                onClick={playNext}
                className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                title="Next"
              >
                <SkipForward size={24} />
              </button>

              <button
                onClick={() => setCollapsed(true)}
                className="text-gray-600 dark:text-gray-300"
                title="Collapse"
              >
                <ChevronDown />
              </button>
            </div>
          </>
        )}

        {/* Progress */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{formatTime(duration)}</span>
        </div>

        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mt-1 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <audio
          ref={audioRef}
          src={nowPlaying.episode.file}
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>
    </div>
  );
}
