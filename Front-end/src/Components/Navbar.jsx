import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import logo from "/logo.png";


const Navbar = ({ searchQuery, setSearchQuery }) => {
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
      </div>
      <div className="flex items-center space-x-8">
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-blue-400 transition-colors text-white font-poppins text-xl">Home</Link>
          <Link to="/my-list" className="hover:text-blue-400 transition-colors text-white font-poppins text-xl">My List</Link>
          <Link to="/favorites" className="hover:text-blue-400 transition-colors text-white font-poppins text-xl">Favorites</Link>
          <Link to="/contact" className="hover:text-blue-400 transition-colors text-white font-poppins text-xl">Contact</Link>
        </div>
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
      </div>
    </nav>
  );
};

export default Navbar;