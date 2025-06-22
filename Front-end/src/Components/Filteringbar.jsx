import React, { useState, useEffect } from "react";

const API_URL = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmExZmE5Yjg1YWQ1MzlmMzU4ZmY2NTYzOWE5NDVlOSIsIm5iZiI6MTczOTc0MjQ5OS4wLCJzdWIiOiI2N2IyNWQyMmFhYWMzYjE2NzRlMGNkOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.c9RrKf_7LTqYDxaYIAV-EDdeBlPp_4pkvv_hMomClOE`,
  },
};

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

const Filtringbar = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      let url = API_URL;
      if (selectedGenre) {
        url += `&with_genres=${selectedGenre}`;
      }
      try {
        const response = await fetch(url, API_OPTIONS);
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedGenre]);

  return (
    <div className="w-full p-4 bg-gray-900 shadow mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {GENRES.map((genre) => (
          <button
            key={genre.id ?? 'all'}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedGenre === genre.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-200 hover:bg-blue-600 hover:text-white'}`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filtringbar;
