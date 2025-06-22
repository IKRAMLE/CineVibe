import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { ArrowRight, ChevronRight, Play } from 'lucide-react'
import Navbar from '../Components/Navbar';
import Trending from '../Components/Trending';
import Filtringbar from '../Components/Filteringbar';
import MovieCard from '../Components/MovieCard';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Transparent Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="relative lg:h-screen h-[90vh] w-full">
        {/* Background image */}
        <img
          src="/Hero.png"
          className="h-full w-full lg:object-cover object-fill absolute inset-0 -z-40"
          alt="Banner"
        />

        {/* Gradient overlay on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 lg:via-black/40 via-black/60 lg:to-transparent to-black/20 -z-40 " />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] lg:via-black/10 via-black/30 lg:to-transparent to-black/10 -z-40 " />

        {/* Hero content */}
        <div className="absolute lg:top-1/4 top-1/4 lg:left-20 left-10 lg:w-4/12 w-10/12 text-white z-10  ">
          <div className="flex items-end gap-3.5 ">
            <h1 className="text-7xl font-bold text-white">Lilo & Stitch</h1>
          </div>
          <p className="mt-5 font-normal">
          A tale of a young girl's close encounter with the galaxy's most wanted extraterrestrial. Lilo is a lonely Hawaiian girl who adopts a small ugly "dog," whom she names Stitch. Stitch would be the perfect pet if he weren't in reality a genetic experiment who has escaped from an alien planet and crash-landed on Earth. Through her love, faith and unwavering belief in ohana, the Hawaiian concept of family, Lilo helps unlock Stitch's heart and gives him the ability to care for someone else.      </p>
          <div className="flex space-x-4 mt-8">
            <a
              href="https://www.youtube.com/watch?v=9OAC55UWAQs&ab_channel=RottenTomatoesClassicTrailers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Play size={20} className="fill-current" />
              <span className="font-medium">Watch Now</span>
            </a>
            <button className="flex bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all backdrop-blur-md border border-white/10">
              <span className="font-medium">Details</span>
              <ChevronRight size={22} className="pt-1" />
            </button>
          </div>
        </div>
        
      </div>
      {/* Trending Movies Section */}
      <Trending />
      {/* Filtering Bar Section */}
      <Filtringbar />
      <MovieCard />
    </>
  )
}

export default HomePage;