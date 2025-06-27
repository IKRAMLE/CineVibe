import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US";
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmExZmE5Yjg1YWQ1MzlmMzU4ZmY2NTYzOWE5NDVlOSIsIm5iZiI6MTczOTc0MjQ5OS4wLCJzdWIiOiI2N2IyNWQyMmFhYWMzYjE2NzRlMGNkOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.c9RrKf_7LTqYDxaYIAV-EDdeBlPp_4pkvv_hMomClOE`,
  },
};

const MovieCard = ({ searchQuery = "", selectedGenre = null }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = "";
        if (searchQuery && searchQuery.trim() !== "") {
          url = `${SEARCH_URL}&query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
          if (selectedGenre) {
            url += `&with_genres=${selectedGenre}`;
          }
        } else {
          url = `${API_URL}&page=${currentPage}`;
          if (selectedGenre) {
            url += `&with_genres=${selectedGenre}`;
          }
        }
        const response = await fetch(url, API_OPTIONS);
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setMovies([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
    // Load favorites from localStorage
    const stored = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    setFavoriteIds(stored);
  }, [currentPage, searchQuery, selectedGenre]);

  const handleToggleFavorite = (movie) => {
    let updatedFavorites = [...favoriteIds];
    if (favoriteIds.includes(movie.id)) {
      updatedFavorites = updatedFavorites.filter(id => id !== movie.id);
    } else {
      updatedFavorites.push(movie.id);
    }
    setFavoriteIds(updatedFavorites);
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Only show up to 5 page numbers for usability
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);
    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  let title = "Movies";
  if (searchQuery) {
    title = `Search Results for "${searchQuery}"`;
  } else if (selectedGenre) {
    const genreName = {
      28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
    }[selectedGenre];
    title = genreName ? `${genreName} Movies` : title;
  }

  return (
    <div className="bg-gray-900 -mt-8">
      <h3 className="text-lg sm:text-2xl font-semibold text-white px-3 sm:px-6">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6 p-2 sm:p-4 md:p-6">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No movies found.</div>
        ) : (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="relative group cursor-pointer"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              {/* Heart icon for favorites */}
              <button
                className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 z-20 bg-black/60 rounded-full p-1 sm:p-2 transition-colors ${favoriteIds.includes(movie.id) ? 'text-red-500' : 'text-white hover:text-red-500 hover:bg-black/80'}`}
                onClick={e => {
                  e.stopPropagation();
                  handleToggleFavorite(movie);
                }}
                aria-label={favoriteIds.includes(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FaHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-72 sm:h-48 md:h-56 lg:h-64 xl:h-72 object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              />
              <div className="hidden sm:flex absolute inset-0 bg-black/80 rounded-lg p-2 sm:p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity flex-col justify-between pointer-events-none">
                <div>
                  <h4 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-1 sm:mb-2">{movie.title}</h4>
                  <p className="text-white text-xs line-clamp-3 sm:line-clamp-4">{movie.overview}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-white text-xs sm:text-sm">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                  <span className="text-white text-xs">{movie.release_date?.split("-")[0]}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 pb-4 sm:pb-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm md:text-base ${
            currentPage === 1
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-1 sm:px-2 md:px-3 py-1 sm:py-2 rounded-full font-semibold transition-colors text-xs sm:text-sm md:text-base ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm md:text-base"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
