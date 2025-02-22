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

// Updated schema to match frontend requirements

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
  release_date: { 
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);

// Get all movies - sorted by newest first
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching movies",
      error: err.message 
    });
  }
});

// Add a new movie
app.post("/movies", async (req, res) => {
  try {
    // Input validation
    const { title, overview, imageUrl, rating, published_year } = req.body;
    
    if (!title || !overview || !imageUrl || !rating || !published_year) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    if (rating < 1 || rating > 10) {
      return res.status(400).json({ 
        message: "Rating must be between 1 and 10" 
      });
    }

    if (published_year < 1900 || published_year > new Date().getFullYear()) {
      return res.status(400).json({ 
        message: "Invalid published year" 
      });
    }

    const newMovie = new Movie({
      title,
      overview,
      imageUrl,
      rating,
      published_year,
      release_date: new Date(published_year, 0) 
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});