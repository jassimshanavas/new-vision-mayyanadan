import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaYoutube, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-soft sticky top-0 z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 relative">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 sm:p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                New Vision
              </h1>
              <p className="text-xs text-gray-500 font-medium hidden sm:block">Mayyanadan News</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <a 
              href="#news" 
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 relative group"
            >
              News
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
            <a 
              href="#videos" 
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 relative group"
            >
              Videos
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
            <a 
              href="#facebook" 
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 relative group"
            >
              Facebook
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4 ml-2">
              <a
                href="https://www.facebook.com/profile.php?id=61577465543293"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@newvisionmayyanadan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <FaYoutube className="w-6 h-6" />
              </a>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t border-gray-200 pt-3 sm:pt-4">
            <div className="flex flex-col space-y-3 sm:space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <a href="#news" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                News
              </a>
              <a href="#videos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                Videos
              </a>
              <a href="#facebook" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                Facebook
              </a>
              <div className="flex items-center space-x-4 pt-3 border-t border-gray-200">
                <a
                  href="https://www.facebook.com/profile.php?id=61577465543293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/@newvisionmayyanadan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  <FaYoutube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

