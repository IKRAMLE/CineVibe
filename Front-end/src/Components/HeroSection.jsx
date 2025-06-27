import React from 'react';
import { Play, ChevronRight } from 'lucide-react';

const HeroSection = () => (
  <div className="relative min-h-[70vh] h-[90vh] lg:h-screen w-full overflow-hidden">
    {/* Background image */}
    <img
      src="/Hero.png"
      className="h-full w-full object-cover absolute inset-0 -z-40"
      alt="Banner"
    />

    {/* Gradient overlays */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 lg:via-black/40 via-black/60 lg:to-transparent to-black/20 -z-40" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] lg:via-black/10 via-black/30 lg:to-transparent to-black/10 -z-40" />

    {/* Hero content */}
    <div className="absolute top-1/4 left-2 xs:left-4 sm:left-8 md:left-16 lg:left-20 w-[96vw] xs:w-11/12 sm:w-9/12 md:w-7/12 lg:w-4/12 max-w-full text-white z-10 pr-2 xs:pr-0">
      <div className="flex items-end gap-2 sm:gap-3.5 -mt-8 xs:-mt-10">
        <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight break-words max-w-full">
          Lilo & Stitch
        </h1>
      </div>
      <p className="mt-2 xs:mt-3 sm:mt-5 font-normal text-xs xs:text-sm sm:text-base md:text-lg max-w-full break-words">
        A tale of a young girl's close encounter with the galaxy's most wanted extraterrestrial. Lilo is a lonely Hawaiian girl who adopts a small ugly "dog," whom she names Stitch. Stitch would be the perfect pet if he weren't in reality a genetic experiment who has escaped from an alien planet and crash-landed on Earth. 
      </p>
      <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4 mt-4 sm:mt-8 w-full sm:w-auto">
        <a
          href="https://www.youtube.com/watch?v=9OAC55UWAQs&ab_channel=RottenTomatoesClassicTrailers"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 bg-white text-black px-3 xs:px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-200 transition-colors text-xs xs:text-sm sm:text-base w-full sm:w-auto"
        >
          <Play size={16} className="fill-current" />
          <span className="font-medium">Watch Now</span>
        </a>
        <button className="flex items-center justify-center bg-white/10 text-white px-3 xs:px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/20 transition-all backdrop-blur-md border border-white/10 text-xs xs:text-sm sm:text-base mt-2 sm:mt-0 w-full sm:w-auto">
          <span className="font-medium">Details</span>
          <ChevronRight size={16} className="pt-1" />
        </button>
      </div>
    </div>
  </div>
);

export default HeroSection; 