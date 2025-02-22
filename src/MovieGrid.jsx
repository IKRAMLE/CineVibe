import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

const API_URL = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";
const SEARCH_API_URL = "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmExZmE5Yjg1YWQ1MzlmMzU4ZmY2NTYzOWE5NDVlOSIsIm5iZiI6MTczOTc0MjQ5OS4wLCJzdWIiOiI2N2IyNWQyMmFhYWMzYjE2NzRlMGNkOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.c9RrKf_7LTqYDxaYIAV-EDdeBlPp_4pkvv_hMomClOE`,
  },
};

const MovieGrid = ({ searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    // Reset to first page when search query changes
    setCurrentPage(1);
    fetchMovies(1);
  }, [searchQuery]);

  useEffect(() => {
    // Only fetch for page changes when not searching
    if (!searchQuery) {
      fetchMovies(currentPage);
    }
  }, [currentPage]);

  const fetchMovies = async (page) => {
    try {
      setLoading(true);
      const baseUrl = searchQuery ? SEARCH_API_URL : API_URL;
      const searchParams = searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : '';
      const response = await fetch(`${baseUrl}&page=${page}${searchParams}`, API_OPTIONS);
      
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="p-6 mt-20">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            No movies found
          </div>
        ) : (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="relative group cursor-pointer"
              onMouseEnter={() => setSelectedMovie(movie)}
              onMouseLeave={() => setSelectedMovie(null)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-72 object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              />
              {selectedMovie?.id === movie.id && (
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
                    <span className="text-white text-sm">{movie.release_date?.split("-")[0]}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-center space-x-4 mt-8">
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
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-full ${
            currentPage === totalPages
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieGrid;