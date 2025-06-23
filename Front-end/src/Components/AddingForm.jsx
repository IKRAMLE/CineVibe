import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const AddingForm = ({ showForm, setShowForm, onSubmit, submitting }) => {
  const [newMovie, setNewMovie] = useState({
    title: "",
    overview: "",
    imageUrl: "",
    rating: "",
    published_year: "",
    trailerUrl: "",
    favorite: false
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newMovie);
    setNewMovie({
      title: "",
      overview: "",
      imageUrl: "",
      rating: "",
      published_year: "",
      trailerUrl: "",
      favorite: false
    });
  };

  const handleClose = () => {
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
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-3 xs:p-4 sm:p-6 rounded-lg w-full max-w-xs xs:max-w-sm sm:max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg xs:text-xl font-semibold text-white mb-4">
          Add New Movie
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter movie title"
              value={newMovie.title}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-xs xs:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Overview
            </label>
            <textarea
              name="overview"
              placeholder="Enter movie overview"
              value={newMovie.overview}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-20 xs:h-24 resize-none text-xs xs:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              placeholder="Enter image URL"
              value={newMovie.imageUrl}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-xs xs:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
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
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-xs xs:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
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
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-xs xs:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              YouTube Trailer URL
            </label>
            <input
              type="text"
              name="trailerUrl"
              placeholder="Enter YouTube trailer URL"
              value={newMovie.trailerUrl}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-xs xs:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-3 xs:px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3 xs:px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-xs xs:text-sm"
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
  );
};

export default AddingForm; 