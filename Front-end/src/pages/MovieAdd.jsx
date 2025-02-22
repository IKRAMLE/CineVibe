import { useState, useEffect } from "react";
import { Plus, Loader2, X, Star } from "lucide-react";

const MoviesAdd = () => {
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

  const handleChange = (e) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch("http://localhost:5000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });

      if (!res.ok) throw new Error("Failed to add movie");

      const data = await res.json();
      setMovies([data, ...movies]);
      setShowForm(false);
      setNewMovie({
        title: "",
        overview: "",
        imageUrl: "",
        rating: "",
        published_year: "",
      });
    } catch (err) {
      setError("Failed to add movie. Please try again.");
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
            {/* Movie Cards */}
            {movies.map((movie) => (
              <div key={movie._id} className="relative group w-48">
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
                  <div className="flex gap-23 mt-auto">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-semibold">
                        {movie.rating}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {movie.published_year || new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Movie Card */}
            <div
              onClick={() => setShowForm(true)}
              className="w-48 h-72 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition-colors group"
            >
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors" />
            </div>
          </>
        )}
      </div>

      {/* Modal Form */}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
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

              {/* Overview */}
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

              {/* Image URL */}
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

              {/* Rating */}
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

              {/* Published Year */}
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

              {/* Buttons */}
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