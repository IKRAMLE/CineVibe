import React, { useState, useEffect } from 'react';
import MovieCard from "../MovieCard"; 
import { Heart } from "lucide-react";

const Favorites = ({ onFavoriteToggle }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "16a1fa9b85ad539f358ff65639a945e9"; // Direct API key
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmExZmE5Yjg1YWQ1MzlmMzU4ZmY2NTYzOWE5NDVlOSIsIm5iZiI6MTczOTc0MjQ5OS4wLCJzdWIiOiI2N2IyNWQyMmFhYWMzYjE2NzRlMGNkOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.c9RrKf_7LTqYDxaYIAV-EDdeBlPp_4pkvv_hMomClOE`,
    },
  };

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');

        if (favoriteIds.length === 0) {
          setFavoriteMovies([]);
          setLoading(false);
          return;
        }

        const moviesData = await Promise.all(
          favoriteIds.map(async (id) => {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
              API_OPTIONS
            );

            if (!response.ok) {
              throw new Error(`Failed to fetch movie ${id}`);
            }

            const movieData = await response.json();

            try {
              const trailerResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`,
                API_OPTIONS
              );

              if (trailerResponse.ok) {
                const trailerData = await trailerResponse.json();
                const trailer = trailerData.results?.find(
                  video => video.type === "Trailer" && video.site === "YouTube"
                );

                return {
                  ...movieData,
                  trailer_key: trailer?.key || '',
                  isFavorite: true
                };
              }
            } catch (err) {
              console.warn(`Failed to fetch trailer for movie ${id}:`, err);
            }

            return { ...movieData, trailer_key: '', isFavorite: true };
          })
        );

        setFavoriteMovies(moviesData);
      } catch (err) {
        console.error("Error fetching favorite movies:", err);
        setError("Failed to load favorite movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, []);

  const handleFavoriteToggle = (movieId) => {
    setFavoriteMovies(prev => prev.filter(movie => movie.id !== movieId));

    const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    const updatedFavorites = favoriteIds.filter(id => id !== movieId);
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));

    if (onFavoriteToggle) {
      onFavoriteToggle(updatedFavorites);
    }
  };

  const MovieCardWithFavorite = ({ movie }) => {
    return (
      <div className="relative">
        <MovieCard movie={movie} />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteToggle(movie.id);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all"
        >
          <Heart className="w-6 h-6 text-red-500 fill-current" />
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>
      
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : favoriteMovies.length === 0 ? (
        <div className="text-center text-gray-400">
          No favorite movies yet. Add some movies to your favorites!
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {favoriteMovies.map((movie) => (
            <MovieCardWithFavorite key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
