import React from 'react';
import { FaArrowDown } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24 md:py-32">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="badge-danger bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              ✨ Trusted Local News Source
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-4 sm:mb-6 text-shadow-lg animate-slide-up">
            New Vision
            <span className="block bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Mayyanadan
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 text-white/90 font-medium text-shadow animate-slide-up px-2" style={{ animationDelay: '0.1s' }}>
            Your Trusted Source for Local News & Updates
          </p>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 text-white/80 max-w-2xl mx-auto leading-relaxed animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
            Stay informed with the latest news, videos, and updates from your community. 
            Bringing you stories that matter, when they matter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-up px-2" style={{ animationDelay: '0.3s' }}>
            <a
              href="#news"
              className="group relative bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>Read Latest News</span>
                <FaArrowDown className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <a
              href="#videos"
              className="group relative bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Watch Videos</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </a>
          </div>
          
          <div className="mt-12 sm:mt-16 animate-bounce-slow">
            <a href="#news" className="inline-block text-white/70 hover:text-white transition-colors">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-xs sm:text-sm font-medium">Scroll to explore</span>
                <FaArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

