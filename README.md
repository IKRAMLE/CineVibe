# CineVibe 🎬

A full-stack web application for managing and displaying movies, built with React frontend and Express/MongoDB backend. Features movie uploads with images, favorites system, and a modern responsive UI.

## 🚀 Features

- **Movie Management**: Add, view, and manage movies with detailed information
- **Image Upload**: Upload movie poster images with automatic file handling
- **Favorites System**: Mark and filter movies as favorites
- **Responsive Design**: Modern UI built with TailwindCSS
- **RESTful API**: Complete backend API for movie operations
- **Real-time Updates**: Dynamic content updates without page refresh

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database (MongoDB Atlas)
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Icons** - Additional icon sets

## 📁 Project Structure

```
CineVibe/
├── Back-end/
│   ├── server.js              # Express server & API routes
│   ├── package.json           # Backend dependencies
│   ├── uploads/               # Movie image storage
│   └── node_modules/
├── Front-end/
│   ├── src/
│   │   ├── Components/        # Reusable UI components
│   │   │   ├── AddingForm.jsx
│   │   │   ├── Filteringbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Trending.jsx
│   │   ├── pages/            # Main application pages
│   │   │   ├── Contact.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Homepage.jsx
│   │   │   ├── MovieAdd.jsx
│   │   │   └── MovieDetails.jsx
│   │   ├── assets/           # Additional assets
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # App entry point
│   ├── public/               # Static assets
│   │   ├── logo.png
│   │   ├── Hero.png
│   │   ├── movie1.png - movie8.png
│   │   └── Profile.png
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # TailwindCSS configuration
│   └── vercel.json           # Deployment configuration
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for database)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Back-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure MongoDB connection:
   - Update the MongoDB connection string in `server.js`
   - Replace `ikramlechqer:ikramlechqer@cluster0.owgf0.mongodb.net/Movie` with your own credentials

4. Start the server:
   ```bash
   node server.js
   ```
   Or for development with auto-restart:
   ```bash
   npx nodemon server.js
   ```

   The backend will run on `http://localhost:3000` (or the port specified in your environment)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## 📡 API Endpoints

### Movies
- `GET /movies` - Get all movies (supports `?favorite=true/false` filter)
- `GET /movies/:id` - Get movie by ID
- `POST /movies` - Add new movie (with image upload)
- `PATCH /movies/:id` - Update movie (including favorite toggle)

### File Upload
- Images are automatically stored in `/uploads` directory
- Supported formats: JPG, PNG, GIF, etc.
- File size limit: 5MB
- Unique filenames generated with timestamps

## 🎨 Components Overview

### Pages
- **Homepage** - Main landing page with movie listings
- **MovieDetails** - Detailed view of individual movies
- **Favorites** - User's favorite movies collection
- **MovieAdd** - Form to add new movies
- **Contact** - Contact information page

### Components
- **Navbar** - Navigation header
- **HeroSection** - Landing page hero
- **MovieCard** - Individual movie display card
- **Trending** - Trending movies section
- **AddingForm** - Movie addition form
- **Filteringbar** - Movie filtering interface
- **Footer** - Page footer

## 🗄️ Database Schema

### Movie Model
```javascript
{
  title: String (required),
  overview: String (required),
  imagePath: String (required),
  rating: Number (1-10, required),
  published_year: Number (1900-current year, required),
  trailerUrl: String (required),
  release_date: Date (default: now),
  favorite: Boolean (default: false),
  timestamps: true
}
```

## 🚀 Deployment

### Frontend (Vercel)
The project includes `vercel.json` for easy deployment to Vercel:
```bash
npm run build
vercel --prod
```

### Backend
Deploy to platforms like:
- Heroku
- Railway
- Render
- DigitalOcean App Platform

Remember to:
- Set environment variables for MongoDB connection
- Configure CORS for your frontend domain
- Set up proper file storage for uploads (consider cloud storage for production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**CineVibe Team**

---

**Note**: Make sure to update the MongoDB connection string in `Back-end/server.js` with your own credentials before running the application. 