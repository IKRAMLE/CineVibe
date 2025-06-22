import React, { useEffect, useState } from 'react';
import { Bell, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from "/logo.png";
import Ikram from "/Profile.png";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, searchQuery, setSearchQuery }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`lg:px-5 px-3 pt-3 pb-2 font-semibold flex justify-between items-center fixed top-0 w-full z-30 transition-all duration-300 ${
        (window.location.pathname === "/" && !scrolled)
          ? "bg-transparent"
          : "bg-gray-900 shadow-md"
      }`}
    >
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <div className="w-40 h-12 flex items-center justify-center">
            <img src={logo} alt="CineVibe" className="h-22" />
          </div>
        </div>
        <button
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            className="bg-gray-100 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Bell
          size={24}
          className="text-gray-400 hover:text-white cursor-pointer"
        />
        <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden">
          <img
            src={Ikram}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;