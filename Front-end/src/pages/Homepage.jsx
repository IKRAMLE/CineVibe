import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { ArrowRight, ChevronRight, Play } from 'lucide-react'
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
// import Nav from './Nav'

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Transparent Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        transparent
      />
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="relative lg:h-screen h-[90vh] w-full">
        {/* Background image */}
        <img
          src="/Hero.png"
          className="h-full w-full lg:object-cover object-fill absolute inset-0 -z-40"
          alt="Banner"
        />

        {/* Gradient overlay on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 lg:via-black/40 via-black/60 lg:to-transparent to-black/20 -z-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] lg:via-black/10 via-black/30 lg:to-transparent to-black/10 -z-40" />

        {/* Hero content */}
        <div className="absolute lg:top-1/4 top-1/4 lg:left-20 left-10 lg:w-4/12 w-10/12 text-white z-10">
          <div className="flex items-end gap-3.5">
            <p className="lg:text-6xl text-5xl font-bold">Lilo & Stitch</p>
          </div>
          <p className="mt-5 font-normal">
          A tale of a young girl's close encounter with the galaxy's most wanted extraterrestrial. Lilo is a lonely Hawaiian girl who adopts a small ugly "dog," whom she names Stitch. Stitch would be the perfect pet if he weren't in reality a genetic experiment who has escaped from an alien planet and crash-landed on Earth. Through her love, faith and unwavering belief in ohana, the Hawaiian concept of family, Lilo helps unlock Stitch's heart and gives him the ability to care for someone else.      </p>
          <div className="flex gap-5 mt-6">
            <Link
              target="_blank"
              to="https://www.youtube.com/watch?v=9OAC55UWAQs&ab_channel=RottenTomatoesClassicTrailers"
              className="bg-white text-black flex items-center gap-2 rounded-full py-2 px-3 font-semibold"
            >
              Watch Now <Play size={19} fill="black" />
            </Link>
            <Link
              to={`/movie/431580`}
              className="bg-stone-700 text-white flex justify-center items-center gap-2 rounded-full py-2 px-3 font-semibold cursor-pointer">
              Details <ChevronRight size={21} />
            </Link>
          </div>
        </div>

      </div>
    </>
  )
}

export default HomePage;