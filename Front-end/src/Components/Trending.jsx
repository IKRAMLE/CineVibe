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
        containerRef.current.scrollBy({ left: 400, behavior: "smooth" });
      }
    }, 10); 
    return () => clearInterval(interval);
  }, []);

  const scrollContainer = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="p-6 relative bg-gray-900">
      <div className="flex justify-between items-center -mt-37">
        <h3 className="text-2xl font-semibold text-white mb-5 ">Trending Movies</h3>
      </div>

      <div className="relative group">
        <button
          onClick={() => scrollContainer("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </button>

        <div ref={containerRef} id="movies-container" className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 relative group cursor-pointer"
                onClick={() => navigate(`/movie/${movie.id}`)}
                onMouseEnter={() => setSelectedMovie(movie)}
                onMouseLeave={() => setSelectedMovie(null)}
              >
                <button
                  className={`absolute top-2 right-2 z-20 bg-black/60 rounded-full p-2 transition-colors ${favoriteIds.includes(movie.id) ? 'text-red-500' : 'text-white hover:text-red-500 hover:bg-black/80'}`}
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
                  className="w-48 h-72 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
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

        <button
          onClick={() => scrollContainer("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} />
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
