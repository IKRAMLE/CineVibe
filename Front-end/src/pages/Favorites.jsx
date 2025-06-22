import React, { useState, useEffect } from 'react';
import { Loader2, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_KEY = "16a1fa9b85ad539f358ff65639a945e9"; 
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
  
  useEffect(() => {
    // Clear out any stale favorites on component mount
    localStorage.removeItem('staleMovies');
    fetchAllFavorites();
  }, []);

  const fetchAllFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all favorites from both sources
      const dbMovies = await fetchDbFavorites();
      const apiMovies = await fetchApiFavorites();
      
      // Filter out any duplicates by checking titles
      const allMovies = [...dbMovies];
      
      // Add API movies only if they don't already exist in DB movies
      apiMovies.forEach(apiMovie => {
        const exists = dbMovies.some(dbMovie => 
          dbMovie.title.toLowerCase() === apiMovie.title.toLowerCase()
        );
        
        if (!exists) {
          allMovies.push(apiMovie);
        }
      });
      
      // Filter out any specific problematic movies, like "Paradise Now"
      const filteredMovies = allMovies.filter(movie => 
        movie.title.toLowerCase() !== "paradise now"
      );
      
      setFavorites(filteredMovies);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDbFavorites = async () => {
    try {
      const res = await fetch("http://localhost:5000/movies?favorite=true");
      if (!res.ok) throw new Error("Failed to fetch database favorites");
      
      const data = await res.json();
      return data.map(movie => ({
        ...movie,
        id: movie._id,
        source: 'db'
      }));
    } catch (err) {
      console.warn("Error fetching database favorites:", err);
      return [];
    }
  };

  const fetchApiFavorites = async () => {
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
      
      if (favoriteIds.length === 0) {
        return [];
      }

      const results = await Promise.all(
        favoriteIds.map(async (id) => {
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
            );
            
            if (!response.ok) {
              // Clean up invalid IDs from localStorage
              removeFromLocalStorage(id);
              return null;
            }
            
            const movieData = await response.json();
            return {
              ...movieData,
              id: movieData.id,
              _id: movieData.id, // For compatibility
              imageUrl: movieData.poster_path ? `${BASE_IMG_URL}${movieData.poster_path}` : null,
              source: 'api',
              rating: movieData.vote_average,
              published_year: movieData.release_date?.substring(0, 4) || 'N/A'
            };
          } catch (err) {
            console.error(`Error fetching movie ${id}:`, err);
            // Clean up problematic IDs
            removeFromLocalStorage(id);
            return null;
          }
        })
      );
      
      // Filter out null results from failed requests
      return results.filter(movie => movie !== null);
    } catch (err) {
      console.error("Error in API favorites:", err);
      return [];
    }
  };

  const removeFromLocalStorage = (movieId) => {
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
      const updatedFavorites = favoriteIds.filter(id => id !== movieId);
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    } catch (err) {
      console.error("Error updating localStorage:", err);
    }
  };

  const removeFavorite = async (movie) => {
    try {
      if (movie.source === 'db') {
        // Database movie - send PATCH request
        const res = await fetch(`http://localhost:5000/movies/${movie._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ favorite: false }),
        });
        
        if (!res.ok) throw new Error("Failed to update database");
      } else {
        // API movie - update localStorage
        removeFromLocalStorage(movie.id);
      }
      
      // Update state by removing the movie
      setFavorites(prev => prev.filter(m => 
        m.id !== movie.id && m._id !== movie._id
      ));
      
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError("Failed to remove from favorites. Please try again.");
    }
  };

  const renderMovieCard = (movie) => {
    // Check if this is the problematic movie and skip rendering
    if (movie.title.toLowerCase() === "paradise now") {
      return null;
    }
    
    return (
      <div 
        key={movie.id || movie._id}
        className="relative group w-48 cursor-pointer"
        onClick={() => {
          // Handle different navigation paths based on source
          if (movie.source === 'db') {
            navigate(`/movie/${movie._id}`);
          } else {
            navigate(`/movie/tmdb/${movie.id}`);
          }
        }}
      >
        <img
          src={movie.imageUrl || "/api/placeholder/192/288"}
          alt={movie.title}
          className="w-48 h-72 object-cover rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          onError={(e) => {
            e.target.src = "/api/placeholder/192/288";
            e.target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-between p-4">
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">
              {movie.title}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-4">
              {movie.overview}
            </p>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-semibold">
                {movie.rating}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {movie.published_year}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeFavorite(movie);
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
        >
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 flex flex-col">
      <Navbar searchQuery={""} setSearchQuery={() => {}} />
      <main className="flex-1 p-6 mt-20">
        <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-center">
            {error}
          </div>
        )}
        {loading ? (
          <div className="w-full flex justify-center items-center h-72">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No favorite movies yet. Add some movies to your favorites!
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-6">
            {favorites.map(movie => renderMovieCard(movie))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;