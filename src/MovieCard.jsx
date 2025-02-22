import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-72 object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
      />
      <div className="absolute inset-0 bg-black/80 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
        <div>
          <h4 className="text-white font-semibold text-lg mb-2">{movie.title}</h4>
          <p className="text-white text-sm line-clamp-4">{movie.overview}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400" size={16} />
            <span className="text-white">{movie.vote_average.toFixed(1)}</span>
          </div>
          <span className="text-white text-sm">
            {movie.release_date?.split("-")[0]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;