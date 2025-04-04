import { createContext, useContext, useEffect, useState } from "react";
import { FavouriteEpisode } from "../types/index";

interface FavouritesContextProps {
  favourites: FavouriteEpisode[];
  toggleFavourite: (ep: FavouriteEpisode) => void;
  removeFavourite: (id: number) => void;
}

const FavouritesContext = createContext<FavouritesContextProps | undefined>(undefined);

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error("useFavourites must be used within a FavouritesProvider");
  return context;
};

export const FavouritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favourites, setFavourites] = useState<FavouriteEpisode[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favourites");
    if (stored) {
      setFavourites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (fav: FavouriteEpisode) => {
    // Check if the episode is already favourited
    const favId = typeof fav.episode.id === "number" ? fav.episode.id : fav.episode.episode;

    // Only add it to the favourites if it's not already there
    setFavourites((prev) => {
      const exists = prev.some(
        (f) =>
          (f.episode.id === favId || f.episode.episode === favId) &&
          f.showTitle === fav.showTitle &&
          f.seasonTitle === fav.seasonTitle
      );

      if (exists) {
        return prev; // Do nothing if it already exists
      }

      return [...prev, fav]; // Add to the list if it's not already favourited
    });
  };

  const removeFavourite = (id: number) => {
    setFavourites((prev) =>
      prev.filter((f) => {
        const favId = typeof f.episode.id === "number" ? f.episode.id : f.episode.episode;
        return favId !== id;
      })
    );
  };

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, removeFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};
