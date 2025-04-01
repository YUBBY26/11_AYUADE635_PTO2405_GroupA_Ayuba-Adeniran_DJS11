import { useEffect, useState } from "react";
import { Preview } from "../types/types";
import GenreFilter from "../components/GenreFilter";
import ShowCard from "../components/ShowCard";

export default function Home() {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://podcast-api.netlify.app/")
      .then((res) => res.json())
      .then((data) => {
        const broken = data.filter((item: Preview) => !Array.isArray(item.genreIds));
      if (broken.length) {
        console.warn("Some preview items are missing genreIds:", broken);
      }
        setPreviews(data.sort((a: Preview, b: Preview) => a.title.localeCompare(b.title)));
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading shows...</p>;

  const filteredPreviews = 
  selectedGenre !== null && !isNaN(selectedGenre)
  ? previews.filter((show) => Array.isArray(show.genreIds) && show.genreIds.includes(selectedGenre))
  : previews;

  


  return (
    <div className="p-4 max-w-6xl mx-auto">
      <GenreFilter selectedGenre={selectedGenre} onChange={setSelectedGenre} />

      <h1 className="text-3xl font-bold mb-6">All Podcasts</h1>
      
      {filteredPreviews.length === 0 ? (
    <p>No shows match the selected genre.</p>
  ) : (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredPreviews.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {filteredPreviews.map((show) => (
    <li key={show.id}>
      <ShowCard show={show} />
    </li>
  ))}
</ul>
    </div>
  );
}
