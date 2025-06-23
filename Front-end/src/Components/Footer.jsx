import React from "react";
import { Link } from "react-router-dom";
import logo from "/logo.png";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

const socialLinks = [
  {
    href: "https://twitter.com/",
    label: "Twitter",
    icon: <FaTwitter className="w-6 h-6" />,
  },
  {
    href: "https://facebook.com/",
    label: "Facebook",
    icon: <FaFacebook className="w-6 h-6" />,
  },
  {
    href: "https://instagram.com/",
    label: "Instagram",
    icon: <FaInstagram className="w-6 h-6" />,
  },
];

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-t from-gray-900 to-gray-800 text-white font-poppins pt-12 pb-6 px-4 border-t border-gray-700 overflow-hidden ">
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-3xl z-0 " />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4 relative z-10">
        {/* Logo and tagline */}
        <div className="flex flex-col items-center md:items-start gap-3 col-span-1">
        <div className="w-32 md:w-40 h-12 flex items-center justify-center -ml-10 ">
            <img src={logo} alt="CineVibe" className="h-15 -mt-7 " />
            <p className='text-white text-3xl font-kaushan -mt-5 '>PopCorn</p>
          </div>
          <span className="text-gray-300 text-base italic -mt-2">Feel the magic of movies</span>
          <div className="flex space-x-4 mt-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="hover:text-blue-400 transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        {/* Features */}
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-blue-300 mb-2">Features</span>
          <Link to="/streaming" className="hover:text-blue-400 transition-colors text-white">Streaming</Link>
          <Link to="/tv-shows" className="hover:text-blue-400 transition-colors text-white">TV Shows</Link>
          <Link to="/recently-added" className="hover:text-blue-400 transition-colors text-white">Recently Added</Link>
        </div>
        {/* Company */}
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-blue-300 mb-2">Company</span>
          <Link to="/about" className="hover:text-blue-400 transition-colors text-white">About Us</Link>
          <Link to="/team" className="hover:text-blue-400 transition-colors text-white">Our Team</Link>
        </div>
        {/* Legal */}
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-blue-300 mb-2">Legal</span>
          <Link to="/terms" className="hover:text-blue-400 transition-colors text-white">Terms of Use</Link>
          <Link to="/privacy" className="hover:text-blue-400 transition-colors text-white">Privacy Policy</Link>
          <Link to="/legal-notices" className="hover:text-blue-400 transition-colors text-white">Legal Notices</Link>
        </div>
        {/* Navigation */}
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-blue-300 mb-2">Navigation</span>
          <Link to="/" className="hover:text-blue-400 transition-colors text-white">Home</Link>
          <Link to="/my-list" className="hover:text-blue-400 transition-colors text-white">My List</Link>
          <Link to="/favorites" className="hover:text-blue-400 transition-colors text-white">Favorites</Link>
          <Link to="/contact" className="hover:text-blue-400 transition-colors text-white">Contact</Link>
        </div>
      </div>
      {/* Decorative divider */}
      <div className="mt-8 border-t border-gray-700 opacity-60" />
      <div className="text-center text-xs text-gray-500 mt-4 z-10 relative">
        &copy; {new Date().getFullYear()} CineVibe. All rights reserved. | Made with <span className="text-blue-400">&#10084;</span> by Ikram
      </div>
    </footer>
  );
};

export default Footer;
