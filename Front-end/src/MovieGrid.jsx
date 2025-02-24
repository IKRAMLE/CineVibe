import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { Heart } from "lucide-react";

const API_URL = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";
const SEARCH_API_URL = "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US";
const MOVIE_DETAILS_URL = "https://api.themoviedb.org/3/movie";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmExZmE5Yjg1YWQ1MzlmMzU4ZmY2NTYzOWE5NDVlOSIsIm5iZiI6MTczOTc0MjQ5OS4wLCJzdWIiOiI2N2IyNWQyMmFhYWMzYjE2NzRlMGNkOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.c9RrKf_7LTqYDxaYIAV-EDdeBlPp_4pkvv_hMomClOE`,
  },
};

const MovieGrid = ({ searchQuery, onFavoriteToggle }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteMovies');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchMovies = async (page) => {
    try {
      setLoading(true);
      setError(null);
      
      const baseUrl = searchQuery ? SEARCH_API_URL : API_URL;
      const searchParams = searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : '';
      const response = await fetch(`${baseUrl}&page=${page}${searchParams}`, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.results?.length) {
        setMovies([]);
        setTotalPages(0);
        return;
      }

      const moviesWithTrailers = await Promise.all(
        data.results.map(async (movie) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000);

            const trailerResponse = await fetch(
              `${MOVIE_DETAILS_URL}/${movie.id}/videos`,
              { ...API_OPTIONS, signal: controller.signal }
            );
            
            clearTimeout(timeoutId);
            
            if (!trailerResponse.ok) {
              throw new Error('Failed to fetch trailer');
            }

            const trailerData = await trailerResponse.json();
            
            const trailer = trailerData.results?.find(
              video => video.type === "Trailer" && video.site === "YouTube"
            );
            
            return {
              ...movie,
              trailer_key: trailer?.key || '',
              isFavorite: favorites.includes(movie.id)
            };
          } catch (err) {
            console.warn(`Failed to fetch trailer for movie ${movie.id}:`, err);
            return { 
              ...movie, 
              trailer_key: '',
              isFavorite: favorites.includes(movie.id)
            };
          }
        })
      );
      
      setMovies(moviesWithTrailers);
      setTotalPages(Math.min(data.total_pages, 47898));
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to fetch movies. Please try again later.");
      setMovies([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery && currentPage > 1) {
      fetchMovies(currentPage);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavoriteToggle = (movieId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId];
      
      if (onFavoriteToggle) {
        onFavoriteToggle(newFavorites);
      }
      
      return newFavorites;
    });
    
    setMovies(prev => 
      prev.map(movie => 
        movie.id === movieId 
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      )
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
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
          <Heart
            className={`w-6 h-6 transition-colors ${
              movie.isFavorite ? 'text-red-500 fill-current' : 'text-white'
            }`}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 mt-20">
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            {searchQuery ? "No movies found for your search" : "No movies available"}
          </div>
        ) : (
          movies.map((movie) => (
            <MovieCardWithFavorite key={movie.id} movie={movie} />
          ))
        )}
      </div>

      {movies.length > 0 && (
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            className={`px-4 py-2 rounded-full ${
              currentPage === 1 || loading
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className={`px-4 py-2 rounded-full ${
              currentPage === totalPages || loading
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;


