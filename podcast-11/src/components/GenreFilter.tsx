import React from "react";
import { genreMap } from "../constants/genres";

type Props = {
  selectedGenre: number | null;
  onChange: (genreId: number | null) => void;
};

const GenreFilter: React.FC<Props> = ({ selectedGenre, onChange }) => {
  return (
    <div className="mb-6">
      <label className="font-medium mr-2">Filter by Genre:</label>
      <select
       title="filter by genre"
        value={selectedGenre !== null ? selectedGenre : ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Genres</option>
        {Object.entries(genreMap).map(([id, title]) => (
          <option key={id} value={id}>
            {title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreFilter;
