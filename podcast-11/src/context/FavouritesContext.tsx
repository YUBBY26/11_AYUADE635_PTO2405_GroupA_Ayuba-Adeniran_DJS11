import { createContext, useContext, useEffect, useState } from "react";
import { FavouriteEpisode } from "../types/types.ts";

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
    setFavourites((prev) => {
      const exists = prev.find((f) => f.episode.id === fav.episode.id);
      if (exists) {
        return prev.filter((f) => f.episode.id !== fav.episode.id);
      }
      return [...prev, fav];
    });
  };

  const removeFavourite = (id: number) => {
    setFavourites((prev) => prev.filter((f) => f.episode.id !== id));
  };

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, removeFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};