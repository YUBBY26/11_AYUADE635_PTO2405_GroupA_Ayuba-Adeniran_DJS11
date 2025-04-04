import { Link } from "react-router-dom";
import { useGenreLookup } from "../utils/useGenreLookup";
import { Preview } from "../types/types"; // ✅ Use Preview type for Home page

type Props = {
  show: Preview;
};

const ShowCard: React.FC<Props> = ({ show }) => {
  const genreMapByShowId = useGenreLookup();

  const genres = genreMapByShowId[show.id];

  return (
    <Link to={`/show/${show.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-md transition bg-white">
        <img
          src={show.image}
          alt={show.title}
          className="w-full h-40 object-cover rounded mb-2"
        />
        <h2 className="font-semibold text-lg">{show.title}</h2>
        <p className="text-sm text-gray-600">{show.seasons} seasons</p>
        <p className="text-xs text-gray-500">
          Last updated: {new Date(show.updated).toLocaleDateString()}
        </p>

        {genres?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {genres.map((genre) => (
              <span
                key={genre}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ShowCard;
