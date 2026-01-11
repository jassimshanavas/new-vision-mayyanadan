import React from 'react';
import { FaFacebook, FaYoutube, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-20 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                New Vision
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted source for local news, updates, and information from Mayyanadan.
              Bringing you the latest happenings and stories that matter to our community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-lg font-display font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#news" className="group flex items-center text-sm text-gray-400 hover:text-white transition-all duration-200">
                  <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Latest News</span>
                </a>
              </li>
              <li>
                <a href="#videos" className="group flex items-center text-sm text-gray-400 hover:text-white transition-all duration-200">
                  <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Videos</span>
                </a>
              </li>
              <li>
                <a href="#facebook" className="group flex items-center text-sm text-gray-400 hover:text-white transition-all duration-200">
                  <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Facebook Updates</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h4 className="text-white text-lg font-display font-bold mb-6">Follow Us</h4>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=61577465543293"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 flex items-center justify-center"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="https://www.youtube.com/@newvisionmayyanadan"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 flex items-center justify-center"
                aria-label="YouTube"
              >
                <FaYoutube className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white text-lg font-display font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 group">
                <div className="mt-0.5 w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FaEnvelope className="w-3 h-3 text-white" />
                </div>
                <a href="mailto:sajeedebrahimkutty123@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                sajeedebrahimkutty123@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="mt-0.5 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FaPhone className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-400">+91 99953 88543</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} New Vision Mayyanadan. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Built with ❤️ for our community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

