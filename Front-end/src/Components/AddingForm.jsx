import React, { useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';

const AddingForm = ({ showForm, setShowForm, onSubmit, submitting }) => {
  const [newMovie, setNewMovie] = useState({
    title: "",
    overview: "",
    rating: "",
    published_year: "",
    trailerUrl: "",
    favorite: false
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      // Allow empty value or numeric input
      if (value === "" || /^\d{0,4}$/.test(value)) {
        setNewMovie({ ...newMovie, [name]: value });
      }
      return;
    }

    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', newMovie.title);
    formData.append('overview', newMovie.overview);
    formData.append('rating', newMovie.rating);
    formData.append('published_year', newMovie.published_year);
    formData.append('trailerUrl', newMovie.trailerUrl);
    formData.append('favorite', newMovie.favorite);
    
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    
    onSubmit(formData);
    
    // Reset form
    setNewMovie({
      title: "",
      overview: "",
      rating: "",
      published_year: "",
      trailerUrl: "",
      favorite: false
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setNewMovie({
      title: "",
      overview: "",
      rating: "",
      published_year: "",
      trailerUrl: "",
      favorite: false
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-blue-950 p-5 xs:p-6 sm:p-8 rounded-2xl w-full max-w-md xs:max-w-lg sm:max-w-2xl shadow-2xl border border-gray-700 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl xs:text-2xl font-bold text-white mb-6 text-center tracking-wide">
          Add New Movie
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-xs xs:text-sm font-semibold text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter movie title"
              value={newMovie.title}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-xs xs:text-sm shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs xs:text-sm font-semibold text-gray-300 mb-1">
              Overview
            </label>
            <textarea
              name="overview"
              placeholder="Enter movie overview"
              value={newMovie.overview}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors h-20 xs:h-24 resize-none text-xs xs:text-sm shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs xs:text-sm font-semibold text-gray-300 mb-1">
              Movie Image
            </label>
            <div className="space-y-2">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-700 hover:bg-blue-900/40 transition-colors border-gray-600 hover:border-blue-500 group relative">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-blue-400 group-hover:text-blue-500 transition-colors" />
                  <p className="mb-2 text-xs text-gray-400">
                    <span className="font-semibold text-blue-300 group-hover:text-blue-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                />
              </label>
              
              {imagePreview && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl border border-blue-500 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="w-1/2 space-y-1">
              <label className="block text-xs xs:text-sm font-semibold text-gray-300 mb-1">
                Rating (1-10)
              </label>
              <input
                type="number"
                name="rating"
                placeholder="Rating"
                value={newMovie.rating}
                onChange={handleChange}
                required
                min="1"
                max="10"
                step="0.1"
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-xs xs:text-sm shadow-sm"
              />
            </div>
            <div className="w-1/2 space-y-1">
              <label className="block text-xs xs:text-sm font-semibold text-gray-300 mb-1">
                Published Year
              </label>
              <input
                type="text"
                name="published_year"
                placeholder="Year"
                value={newMovie.published_year}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-xs xs:text-sm shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs xs:text-sm font-semibold text-gray-300 mb-1">
              YouTube Trailer URL
            </label>
            <input
              type="text"
              name="trailerUrl"
              placeholder="Enter YouTube trailer URL"
              value={newMovie.trailerUrl}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-xs xs:text-sm shadow-sm"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-gray-700 mt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm font-semibold shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-xs xs:text-sm font-bold shadow-md"
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