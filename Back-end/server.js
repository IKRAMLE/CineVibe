const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uri = "mongodb+srv://ikramlechqer:ikramlechqer@cluster0.owgf0.mongodb.net/Movie?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Updated movie schema with imagePath instead of imageUrl
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String, required: true },
  imagePath: { type: String, required: true }, // Changed from imageUrl to imagePath
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
    default: false
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

// Add a new movie with file upload
app.post("/movies", upload.single('image'), async (req, res) => {
  try {
    const { title, overview, rating, published_year, trailerUrl, favorite } = req.body;
    
    // Check if image file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required"
      });
    }
    
    // Validate required fields
    if (!title || !overview || !rating || !published_year || !trailerUrl) {
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
      imagePath: req.file.filename, // Store the filename
      rating: ratingNum,
      published_year: yearNum,
      trailerUrl,
      favorite: favorite || false
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
    const allowedUpdates = ['favorite', 'title', 'overview', 'rating', 'published_year', 'trailerUrl'];
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
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }
    
    // Delete the image file if it exists
    if (movie.imagePath) {
      const imagePath = path.join(__dirname, 'uploads', movie.imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Movie.findByIdAndDelete(req.params.id);
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