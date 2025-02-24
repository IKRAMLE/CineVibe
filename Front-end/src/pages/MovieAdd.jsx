import { useState, useEffect } from "react";
import { Plus, Loader2, X, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MoviesAdd = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: "",
    overview: "",
    imageUrl: "",
    rating: "",
    published_year: "",
    trailerUrl: "",
    favorite: false
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/movies");
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      setError("Failed to load movies. Please try again later.");
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (movie) => {
    try {
      const updatedMovie = { ...movie, favorite: !movie.favorite };
      
      const res = await fetch(`http://localhost:5000/movies/${movie._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: !movie.favorite }),
      });
      
      if (!res.ok) throw new Error("Failed to update favorite status");
      
      // Update local state
      setMovies(prevMovies => 
        prevMovies.map(m => 
          m._id === movie._id ? { ...m, favorite: !m.favorite } : m
        )
      );
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      setError("Failed to update favorite status. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rating") {
      const ratingValue = parseFloat(value);
      if (
        value === "" ||
        (!isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 10)
      ) {
        setNewMovie({ ...newMovie, [name]: value });
      }
      return;
    }

    if (name === "published_year") {
      const yearValue = parseInt(value);
      if (
        value === "" ||
        (!isNaN(yearValue) &&
          yearValue >= 1900 &&
          yearValue <= new Date().getFullYear())
      ) {
        setNewMovie({ ...newMovie, [name]: value });
      }
      return;
    }

    setNewMovie({ ...newMovie, [name]: value });
  };

  const validateForm = () => {
    const errors = [];

    if (!newMovie.title.trim()) errors.push("Title is required");
    if (!newMovie.overview.trim()) errors.push("Overview is required");
    if (!newMovie.imageUrl.trim()) errors.push("Image URL is required");
    if (!newMovie.trailerUrl.trim()) errors.push("Trailer URL is required");

    const rating = parseFloat(newMovie.rating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      errors.push("Rating must be between 1 and 10");
    }

    const year = parseInt(newMovie.published_year);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      errors.push(
        `Published year must be between 1900 and ${new Date().getFullYear()}`
      );
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("http://localhost:5000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add movie");
      }

      const data = await res.json();
      setMovies([data, ...movies]);
      setShowForm(false);
      setNewMovie({
        title: "",
        overview: "",
        imageUrl: "",
        rating: "",
        published_year: "",
        trailerUrl: "",
        favorite: false
      });
    } catch (err) {
      setError(err.message || "Failed to add movie. Please try again.");
      console.error("Error adding movie:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 mt-20">
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-center">
          {error}
        </div>
      )}

      <div className="flex flex-row flex-wrap gap-6">
        {loading ? (
          <div className="w-full flex justify-center items-center h-72">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="relative group w-48 cursor-pointer"
                onClick={() => navigate(`/movie/${movie._id}`)}
              >
                <img
                  src={movie.imageUrl}
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
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
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
                    toggleFavorite(movie);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      movie.favorite
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            ))}

            <div
              onClick={() => setShowForm(true)}
              className="w-48 h-72 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition-colors group"
            >
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors" />
            </div>
          </>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">
              Add New Movie
            </h2>

            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter movie title"
                  value={newMovie.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Overview
                </label>
                <textarea
                  name="overview"
                  placeholder="Enter movie overview"
                  value={newMovie.overview}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Enter image URL"
                  value={newMovie.imageUrl}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Rating (1-10)
                </label>
                <input
                  type="number"
                  name="rating"
                  placeholder="Enter movie rating"
                  value={newMovie.rating}
                  onChange={handleChange}
                  required
                  min="1"
                  max="10"
                  step="0.1"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Published Year
                </label>
                <input
                  type="number"
                  name="published_year"
                  placeholder="Enter published year"
                  value={newMovie.published_year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  YouTube Trailer URL
                </label>
                <input
                  type="text"
                  name="trailerUrl"
                  placeholder="Enter YouTube trailer URL"
                  value={newMovie.trailerUrl}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add Movie"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MoviesAdd;