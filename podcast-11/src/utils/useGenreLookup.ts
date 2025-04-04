import { useEffect, useState } from "react";

type Genre = {
  id: number;
  title: string;
  description: string;
  shows: number[]; // ✅ It's an array of show IDs
};

export function useGenreLookup() {
  const [genreMap, setGenreMap] = useState<Record<number, string[]>>({});

  useEffect(() => {
    const fetchGenres = async () => {
      const map: Record<number, string[]> = {};
      const genreIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      await Promise.all(
        genreIds.map(async (id) => {
          try {
            const res = await fetch(`https://podcast-api.netlify.app/genre/${id}`);
            const data: Genre = await res.json();

            if (Array.isArray(data.shows)) {
              data.shows.forEach((showId) => {
                if (!map[showId]) map[showId] = [];
                map[showId].push(data.title);
              });
            } else {
              console.warn(`⚠️ Genre ${id} returned invalid structure`, data);
            }
          } catch (err) {
            console.error(`❌ Failed to fetch genre ${id}:`, err);
          }
        })
      );

      setGenreMap(map);
    };

    fetchGenres();
  }, []);

  return genreMap;
}
