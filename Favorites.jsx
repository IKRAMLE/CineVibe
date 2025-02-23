import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch (error) {
          console.error('Error parsing favorites:', error);
          setFavorites([]);
        }
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = (movieId) => {
    try {
      const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">My Favorite Movies</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">You haven't added any movies to your favorites yet.</p>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(movie => (
            <div 
              key={movie.id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <div className="relative">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                    }}
                  />
                </Link>
                <button
                  onClick={() => removeFavorite(movie.id)}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <Heart className="text-red-500 w-6 h-6 fill-current" />
                </button>
              </div>

              <div className="p-4">
                <Link to={`/movie/${movie.id}`}>
                  <h2 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors">
                    {movie.title}
                  </h2>
                </Link>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-400">
                    ★ {movie.vote_average?.toFixed(1)}/10
                  </span>
                  <span className="text-gray-400">
                    {movie.release_date?.split('-')[0]}
                  </span>
                </div>
                <p className="text-gray-400 mt-2 text-sm line-clamp-3">
                  {movie.overview}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;