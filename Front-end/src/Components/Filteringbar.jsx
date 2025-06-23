import React from "react";

const GENRES = [
  { id: null, name: "All Popular" },
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const Filtringbar = ({ selectedGenre, setSelectedGenre }) => {
  return (
    <div className="w-full px-1 sm:px-4 py-3 sm:py-4 bg-gray-900 shadow mb-4 sm:mb-6">
      <div className="flex flex-nowrap sm:flex-wrap gap-2 mb-2 sm:mb-4 overflow-x-auto scrollbar-hide">
        {GENRES.map((genre) => (
          <button
            key={genre.id ?? 'all'}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-3 sm:px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${selectedGenre === genre.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-200 hover:bg-blue-600 hover:text-white'}`}
          >
            {genre.name}
          </button>
        ))}
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

export default Filtringbar;
