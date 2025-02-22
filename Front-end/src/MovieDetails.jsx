import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import axios from 'axios';

const API_KEY = '16a1fa9b85ad539f358ff65639a945e9';
const TMDB_API_URL = 'https://api.themoviedb.org/3';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const movieResponse = await axios.get(`${TMDB_API_URL}/movie/${id}`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });

        const videosResponse = await axios.get(`${TMDB_API_URL}/movie/${id}/videos`, {
          params: {
            api_key: API_KEY
          }
        });

        const trailerVideo = videosResponse.data.results.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        );

        setMovie(movieResponse.data);
        if (trailerVideo) {
          setTrailerKey(trailerVideo.key);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError(error.response?.data?.status_message || 'Failed to fetch movie details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 mt-20 text-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mt-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
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

          {trailerKey && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Trailer</h2>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title={`${movie.title} Trailer`}
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;