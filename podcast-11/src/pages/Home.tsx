import { useEffect, useState } from "react";
import { Preview } from "../types/types";
import ShowCard from "../components/ShowCard";
import Carousel from "../components/Carousel";


export default function Home() {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [sortedPreviews, setSortedPreviews] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("title-asc"); // Sorting state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Fetch previews initially
  useEffect(() => {
    setLoading(true);
    fetch("https://podcast-api.netlify.app")
      .then((res) => res.json())
      .then((data) => {
        setPreviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch previews:", err);
        setLoading(false);
      });
  }, []);

  // Sort whenever `sortBy` or `previews` changes
  useEffect(() => {
    if (!previews.length) return;

    const sorted = [...previews].sort((a, b) => {
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      if (sortBy === "updated-newest")
        return new Date(b.updated).getTime() - new Date(a.updated).getTime();
      if (sortBy === "updated-oldest")
        return new Date(a.updated).getTime() - new Date(b.updated).getTime();
      return 0;
    });

    setSortedPreviews(sorted);
  }, [sortBy, previews]);

  // Filter shows based on search query
  const filteredPreviews = sortedPreviews.filter((show) =>
    show.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading shows...</p>;

  if (!filteredPreviews.length)
    return (
      <div className="text-center mt-10 text-gray-500">
        No shows available. Please check your internet connection or try again later.
      </div>
    );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Podcasts</h1>
        <input
          type="text"
          placeholder="Search for a show..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />
      </div>

      {/* Sorting Dropdown */}
      <div className="flex justify-between mb-6">
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="title-asc">A → Z</option>
            <option value="title-desc">Z → A</option>
            <option value="updated-newest">🆕 Recently Updated</option>
            <option value="updated-oldest">📆 Least Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Carousel of suggested shows */}
      <h2 className="text-2xl font-semibold mb-4">Suggested Shows</h2>
      <Carousel shows={filteredPreviews.slice(0, 10)} /> {/* Display the first 10 filtered shows */}

      {/* Show list */}
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
