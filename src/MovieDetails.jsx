import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';

const MovieDetails = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) {
    return (
      <div className="p-6 mt-20 text-center">
        <p>Movie not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 mt-20">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          
          <div className="flex items-center space-x-2 mb-4">
            <Star className="text-yellow-400" size={20} />
            <span className="text-lg">{movie.vote_average.toFixed(1)}</span>
            <span className="text-gray-400">({movie.vote_count} votes)</span>
          </div>

          <p className="text-gray-300 mb-6">{movie.overview}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Release Date</h2>
            <p>{movie.release_date}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Trailer</h2>
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${movie.trailer_key}`}
                title={`${movie.title} Trailer`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;