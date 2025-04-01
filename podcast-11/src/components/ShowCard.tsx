import { Link } from "react-router-dom";
import { genreMap } from "../constants/genres";

type Show = {
  id: number;
  title: string;
  description: string;
  image: string;
  seasons: number;
  updated: string;
  genreIds: number[];
};

type Props = {
  show: Show;
};

const ShowCard: React.FC<Props> = ({ show }) => {
  return (
    <Link to={`/show/${show.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-md transition">
        <img src={show.image} alt={show.title} className="w-full h-40 object-cover rounded mb-2" />
        <h2 className="font-semibold text-lg">{show.title}</h2>
        <p className="text-sm text-gray-600">{show.seasons} seasons</p>
        <p className="text-xs text-gray-500">Last updated: {new Date(show.updated).toLocaleDateString()}</p>
        <div className="mt-2 flex flex-wrap gap-1">
        {show.genreIds?.map((id) => (
  <span key={id} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
    {genreMap[id]}
  </span>
))}

        </div>
      </div>
    </Link>
  );
};

export default ShowCard;
