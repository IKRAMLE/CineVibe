import { useState, useEffect } from "react";
import { Plus, Loader2, X, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import AddingForm from '../Components/AddingForm';

const MoviesAdd = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const validateForm = (newMovie) => {
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

  const handleSubmit = async (newMovie) => {
    const errors = validateForm(newMovie);
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
    } catch (err) {
      setError(err.message || "Failed to add movie. Please try again.");
      console.error("Error adding movie:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 flex flex-col">
      <Navbar searchQuery={""} setSearchQuery={() => {}} />
      <main className="flex-1 p-2 xs:p-4 sm:p-6 mt-20">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-center">
            {error}
          </div>
        )}
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          {loading ? (
            <div className="w-full flex justify-center items-center h-72">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <>
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="relative group w-36 xs:w-44 sm:w-48 cursor-pointer"
                  onClick={() => navigate(`/movie/${movie._id}`)}
                >
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="w-36 xs:w-44 sm:w-48 h-56 xs:h-64 sm:h-72 object-cover rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/192/288";
                      e.target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-between p-2 xs:p-3 sm:p-4">
                    <div>
                      <h3 className="text-white font-semibold text-base xs:text-lg mb-1 xs:mb-2">
                        {movie.title}
                      </h3>
                      <p className="text-gray-300 text-xs xs:text-sm line-clamp-4">
                        {movie.overview}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-xs xs:text-sm">
                          {movie.rating}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs xs:text-sm">
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
                      className={`w-5 xs:w-6 h-5 xs:h-6 ${
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
                className="w-36 xs:w-44 sm:w-48 h-56 xs:h-64 sm:h-72 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition-colors group"
              >
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors" />
              </div>
            </>
          )}
        </div>

        <AddingForm 
          showForm={showForm}
          setShowForm={setShowForm}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </main>
      <Footer />
    </div>
  );
};
export default MoviesAdd;