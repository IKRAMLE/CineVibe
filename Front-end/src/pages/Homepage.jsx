import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { ArrowRight, ChevronRight, Play } from 'lucide-react'
import Navbar from '../Components/Navbar';
import Trending from '../Components/Trending';
import Filtringbar from '../Components/Filteringbar';
import MovieCard from '../Components/MovieCard';
import Footer from '../Components/Footer';
import HeroSection from '../Components/HeroSection';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);

  return (
    <>
      {/* Transparent Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <HeroSection />
      {/* Trending Movies Section */}
      <Trending />
      {/* Filtering Bar Section */}
      <Filtringbar selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
      <MovieCard searchQuery={searchQuery} selectedGenre={selectedGenre} />
      <Footer />
    </>
  )
}

export default HomePage;