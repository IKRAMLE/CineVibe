import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Loader2 } from 'lucide-react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const API_KEY = '16a1fa9b85ad539f358ff65639a945e9';
const TMDB_API_URL = 'https://api.themoviedb.org/3';

// Separate MovieImage component
const MovieImage = ({ movie, isLocalMovie }) => {
  const baseUrl = 'http://localhost:5000';
  const tmdbBaseUrl = 'https://image.tmdb.org/t/p/w500';
  
  const handleImageError = (e) => {
    e.target.src = `${baseUrl}/uploads/default-poster.jpg`;
    e.target.onerror = null;
  };

  const getImageSrc = () => {
    if (isLocalMovie) {
      // For local movies, use the imagePath from the backend uploads directory
      return `${baseUrl}/uploads/${movie.imagePath}`;
    }
    return `${tmdbBaseUrl}${movie.poster_path}`;
  };

  return (
    <img
      src={getImageSrc()}
      alt={movie.title}
      onError={handleImageError}
      className="w-full h-auto rounded-lg shadow-lg"
    />
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocalMovie, setIsLocalMovie] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First try to fetch from local database
        try {
          const localResponse = await fetch(`http://localhost:5000/movies/${id}`);
          if (localResponse.ok) {
            const localData = await localResponse.json();
            setMovie(localData);
            setIsLocalMovie(true);
            // Extract YouTube video ID from trailer URL
            const videoId = getYouTubeVideoId(localData.trailerUrl);
            if (videoId) {
              setTrailerKey(videoId);
            }
            return;
          }
        } catch (localError) {
          console.log('Not a local movie, trying TMDB...');
        }

        // If local fetch fails, try TMDB
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
        setIsLocalMovie(false);
        if (trailerVideo) {
          setTrailerKey(trailerVideo.key);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to fetch movie details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <>
      <Navbar searchQuery={""} setSearchQuery={() => {}} />
      {isLoading ? (
        <div className="p-6 mt-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-6 mt-20">
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-center">
            {error}
          </div>
          <button
            onClick={() => navigate('/')}
            className="mx-auto block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      ) : !movie ? null : (
        <div className="p-6 mt-14 sm:mt-17 bg-gray-900 min-h-screen">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <MovieImage movie={movie} isLocalMovie={isLocalMovie} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{movie.title}</h1>

              <div className="flex items-center space-x-2 mb-4">
                <Star className="text-yellow-400" size={20} />
                <span className="text-lg text-white">
                  {isLocalMovie ? movie.rating : movie.vote_average.toFixed(1)}
                </span>
                {!isLocalMovie && (
                  <span className="text-gray-400">({movie.vote_count} votes)</span>
                )}
              </div>

              <p className="text-gray-300 mb-6">{movie.overview}</p>

              <div className="mb-6 text-white">
                <h2 className="text-xl text-white font-semibold mb-2">
                  {isLocalMovie ? 'Published Year' : 'Release Date'}
                </h2>
                <p>
                  {isLocalMovie ? movie.published_year : movie.release_date}
                </p>
              </div>

              {trailerKey && (
                <div className="mb-6">
                  <h2 className="text-xl text-white font-semibold mb-4">Trailer</h2>
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
      )}
      <Footer />
    </>
  );
};

export default MovieDetails;