const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://ikramlechqer:ikramlechqer@cluster0.owgf0.mongodb.net/Movie?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Updated movie schema with favorite field
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String, required: true },
  imageUrl: { type: String, required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  published_year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },
  trailerUrl: { type: String, required: true },
  release_date: {
    type: Date,
    default: Date.now
  },
  favorite: {
    type: Boolean,
    default: false  // Default value is false
  }
}, {
  timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);

// Get all movies or filtered by favorite status
app.get("/movies", async (req, res) => {
  try {
    const filter = {};
    
    // If favorite query parameter is provided, filter by it
    if (req.query.favorite !== undefined) {
      filter.favorite = req.query.favorite === 'true';
    }
    
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching movies",
      error: err.message
    });
  }
});

// Get movie by ID
app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching movie",
      error: err.message
    });
  }
});

// Add a new movie
app.post("/movies", async (req, res) => {
  try {
    const { title, overview, imageUrl, rating, published_year, trailerUrl, favorite } = req.body;
    
    // Validate required fields
    if (!title || !overview || !imageUrl || !rating || !published_year || !trailerUrl) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    
    // Validate rating
    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
      return res.status(400).json({
        message: "Rating must be between 1 and 10"
      });
    }
    
    // Validate published year
    const yearNum = parseInt(published_year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      return res.status(400).json({
        message: "Invalid published year"
      });
    }
    
    const newMovie = new Movie({
      title,
      overview,
      imageUrl,
      rating: ratingNum,
      published_year: yearNum,
      trailerUrl,
      favorite: favorite || false  // Use provided value or default to false
    });
    
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(500).json({
      message: "Error adding movie",
      error: err.message
    });
  }
});

// Update a movie (necessary for toggling favorite status)
app.patch("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Make sure only allowed fields are updated
    const allowedUpdates = ['favorite', 'title', 'overview', 'imageUrl', 'rating', 'published_year', 'trailerUrl'];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every(key => allowedUpdates.includes(key));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }
    
    const movie = await Movie.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Error updating movie",
      error: error.message
    });
  }
});

// Delete a movie
app.delete("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting movie",
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));