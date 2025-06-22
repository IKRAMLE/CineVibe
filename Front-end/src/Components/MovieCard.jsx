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

const MovieCard = ({ searchQuery = "" }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = "";
        if (searchQuery && searchQuery.trim() !== "") {
          url = `${SEARCH_URL}&query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
        } else {
          url = `${API_URL}&page=${currentPage}`;
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
  }, [currentPage, searchQuery]);

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

  return (
    <div className="bg-gray-900 -mt-8">
      <h3 className="text-2xl font-semibold text-white px-6">{searchQuery ? `Search Results for "${searchQuery}"` : "Movies"}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6">
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
                className="absolute top-2 right-2 z-20 text-white bg-black/60 rounded-full p-2 hover:text-red-500 hover:bg-black/80 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <FaHeart size={18} />
              </button>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-72 object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/80 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">
                    {movie.title}
                  </h4>
                  <p className="text-white text-sm line-clamp-4">
                    {movie.overview}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400" size={16} />
                    <span className="text-white">
                      {movie.vote_average?.toFixed(1) ?? "-"}
                    </span>
                  </div>
                  <span className="text-white text-sm">
                    {movie.release_date?.split("-")[0]}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-center space-x-2 pb-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-full ${
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
            className={`px-3 py-2 rounded-full font-semibold transition-colors ${
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
          className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
