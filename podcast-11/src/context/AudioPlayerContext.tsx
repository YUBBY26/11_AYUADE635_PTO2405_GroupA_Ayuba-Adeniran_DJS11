import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { Episode } from "../types/types";

// Define the NowPlaying interface
interface NowPlaying {
  episode: Episode;
  showTitle: string;
  seasonTitle: string;
}

interface AudioPlayerContextType {
  nowPlaying: NowPlaying | null;
  playEpisode: (info: NowPlaying) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  playNext: () => void;
  playPrev: () => void;
  isPlaying: boolean;
  getSavedTimestamp: (episodeId: number) => number;
  togglePlayPause: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// Hook to use the AudioPlayer context
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
};

// AudioPlayerProvider component
export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Function to play an episode
  const playEpisode = (info: NowPlaying) => {
    setNowPlaying(info);
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Function to get saved timestamp from localStorage
  const getSavedTimestamp = (episodeId: number) => {
    const savedTimestamps = JSON.parse(localStorage.getItem("savedTimestamps") || "{}");
    return savedTimestamps[episodeId] || 0;
  };

  // Play the next episode (implement logic as needed)
  const playNext = () => {
    // Add logic to play the next episode in the playlist
  };

  // Play the previous episode (implement logic as needed)
  const playPrev = () => {
    // Add logic to play the previous episode in the playlist
  };

  // Toggle play/pause functionality
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        nowPlaying,
        playEpisode,
        audioRef,
        playNext,
        playPrev,
        isPlaying,
        getSavedTimestamp,
        togglePlayPause,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
