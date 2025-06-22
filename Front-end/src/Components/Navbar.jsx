import React from 'react';
import { Bell, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from "/logo.png";
import Ikram from "/Profile.png";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, searchQuery, setSearchQuery, transparent }) => {
  return (
    <nav className={`flex items-center justify-between px-8 py-4 border-b border-gray-800 fixed top-0 left-0 w-full text-white p-4 shadow-md z-50 ${transparent ? 'bg-transparent' : 'bg-gray-800'}`}>
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
            className="bg-gray-900 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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