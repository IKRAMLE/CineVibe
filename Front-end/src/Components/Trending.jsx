import React, { useEffect, useState, useRef } from "react";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmExZmE5Yjg1YWQ1MzlmMzU4ZmY2NTYzOWE5NDVlOSIsIm5iZiI6MTczOTc0MjQ5OS4wLCJzdWIiOiI2N2IyNWQyMmFhYWMzYjE2NzRlMGNkOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.c9RrKf_7LTqYDxaYIAV-EDdeBlPp_4pkvv_hMomClOE`,
  },
};

const MovieCard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL, API_OPTIONS);
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
    // Load favorites from localStorage
    const stored = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    setFavoriteIds(stored);
  }, []);

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

  // Auto-scroll every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        const isMobile = window.innerWidth < 640;
        containerRef.current.scrollBy({ left: isMobile ? 180 : 400, behavior: "smooth" });
      }
    }, 10); 
    return () => clearInterval(interval);
  }, []);

  const scrollContainer = (direction) => {
    const container = containerRef.current;
    if (container) {
      const isMobile = window.innerWidth < 640;
      const scrollAmount = direction === "left" ? (isMobile ? -180 : -400) : (isMobile ? 180 : 400);
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="py-4 sm:py-6 px-1 sm:px-6 relative bg-gray-900 ">
      <div className="flex justify-between items-center -mt-50 sm:-mt-10 md:-mt-45">
        <h3 className="text-lg sm:text-2xl font-semibold text-white mb-3 sm:mb-5">Trending Movies</h3>
      </div>

      <div className="relative group">
        <button
          onClick={() => scrollContainer("left")}
          className="hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 sm:p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={28} />
        </button>

        <div
          ref={containerRef}
          id="movies-container"
          className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide pb-2 px-2 sm:px-0"
        >
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 relative group cursor-pointer w-28 xs:w-32 sm:w-48"
                onClick={() => navigate(`/movie/${movie.id}`)}
                onMouseEnter={() => setSelectedMovie(movie)}
                onMouseLeave={() => setSelectedMovie(null)}
              >
                <button
                  className={`absolute top-1.5 right-1.5 z-20 bg-black/60 rounded-full p-2 sm:p-2.5 transition-colors ${favoriteIds.includes(movie.id) ? 'text-red-500' : 'text-white hover:text-red-500 hover:bg-black/80'}`}
                  onClick={e => {
                    e.stopPropagation();
                    handleToggleFavorite(movie);
                  }}
                  aria-label={favoriteIds.includes(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FaHeart size={18} />
                </button>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-28 h-40 xs:w-32 xs:h-48 sm:w-48 sm:h-72 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                />
                {selectedMovie?.id === movie.id && (
                  <div className="hidden sm:flex absolute inset-0 bg-black/80 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity flex-col justify-between pointer-events-none">
                    <div>
                      <h4 className="text-white font-semibold text-base mb-2">{movie.title}</h4>
                      <p className="text-white text-xs line-clamp-4">{movie.overview}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400" size={16} />
                        <span className="text-white">{movie.vote_average.toFixed(1)}</span>
                      </div>
                      <span className="text-white text-xs">{movie.release_date?.split("-")[0]}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => scrollContainer("right")}
          className="hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 sm:p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  ); 
};

export default MovieCard;
