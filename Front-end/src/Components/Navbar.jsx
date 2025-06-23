import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import logo from "/logo.png";
import '@fontsource/kaushan-script';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`lg:px-5 px-3 pt-3 pb-2 font-semibold fixed top-0 w-full z-30 transition-all duration-300 ${
        (window.location.pathname === "/" && !scrolled)
          ? "bg-transparent"
          : "bg-gray-900 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center justify-center -ml-4 sm:-ml-10">
            <img src={logo} alt="CineVibe" className="h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain -mt-1 sm:-mt-2" />
            <p className='text-white text-xl sm:text-2xl md:text-3xl font-kaushan ml-2 sm:ml-3 mt-1 sm:mt-0'>PopCorn</p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <div className="flex space-x-4 xl:space-x-6">
            <Link to="/" className="hover:text-blue-400 transition-colors text-white font-poppins text-base xl:text-xl">Home</Link>
            <Link to="/movie-add" className="hover:text-blue-400 transition-colors text-white font-poppins text-base xl:text-xl">My List</Link>
            <Link to="/favorites" className="hover:text-blue-400 transition-colors text-white font-poppins text-base xl:text-xl">Favorites</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors text-white font-poppins text-base xl:text-xl">Contact</Link>
          </div>
          <div className="relative ml-4">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="bg-gray-100 rounded-full pl-10 pr-4 py-2 w-40 xl:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm xl:text-base"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[4.5rem] bg-gray-900 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-2 sm:px-4 pt-2 pb-3 space-y-2 sm:space-y-3">
          <Link
            to="/"
            className="block text-white hover:text-blue-400 transition-colors font-poppins text-base sm:text-lg py-2 px-2 rounded"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/movie-add"
            className="block text-white hover:text-blue-400 transition-colors font-poppins text-base sm:text-lg py-2 px-2 rounded"
            onClick={() => setIsMenuOpen(false)}
          >
            My List
          </Link>
          <Link
            to="/favorites"
            className="block text-white hover:text-blue-400 transition-colors font-poppins text-base sm:text-lg py-2 px-2 rounded"
            onClick={() => setIsMenuOpen(false)}
          >
            Favorites
          </Link>
          <Link
            to="/contact"
            className="block text-white hover:text-blue-400 transition-colors font-poppins text-base sm:text-lg py-2 px-2 rounded"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="relative py-2">
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
