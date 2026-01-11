import React from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { getBestThumbnailUrl } from '../utils/imageExtractor';

const NewsSection = ({ news }) => {
  // Ensure news is an array
  const articles = Array.isArray(news) ? news : [];
  
  if (!articles || articles.length === 0) {
    return (
      <section id="news" className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">Latest News</h2>
            <p className="section-subtitle">Stay updated with the latest happenings in your community</p>
          </div>
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">No news articles available yet.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon or add articles from the admin dashboard!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
            Latest News
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">Stay updated with the latest happenings in your community</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {articles.map((article, index) => (
            <article 
              key={article.id} 
              className={`card-hover group ${index < 6 ? '' : 'animate-on-scroll'}`}
              style={index >= 6 ? { animationDelay: `${(index - 6) * 100}ms` } : {}}
            >
              {/* Image or Placeholder */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                {article.imageUrl ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent z-10"></div>
                    <img
                      src={getBestThumbnailUrl(article.imageUrl)}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.target.src = '';
                        e.target.style.display = 'none';
                      }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs font-medium">News Article</p>
                    </div>
                  </div>
                )}
                {article.flashNews && (
                  <div className="absolute top-3 left-3 z-20">
                    <span className="badge-danger bg-red-600 text-white animate-pulse">⚡ Flash</span>
                  </div>
                )}
                {article.featured && (
                  <div className="absolute top-3 right-3 z-20">
                    <span className="badge-warning bg-yellow-500 text-white">⭐ Featured</span>
                  </div>
                )}
                {article.trending && (
                  <div className={`absolute top-3 z-20 ${article.flashNews ? 'left-20' : article.featured ? 'right-20' : 'left-3'}`}>
                    <span className="badge bg-orange-500 text-white">🔥 Trending</span>
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center space-x-1 sm:space-x-2">
                    <FaCalendarAlt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                    <span className="font-medium">{format(new Date(article.createdAt), 'MMM dd, yyyy')}</span>
                  </span>
                  <span className="flex items-center space-x-1 sm:space-x-2">
                    <FaUser className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500" />
                    <span className="font-medium hidden sm:inline">{article.author}</span>
                    <span className="font-medium sm:hidden truncate max-w-[80px]">{article.author}</span>
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold mb-2 text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 leading-tight">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{article.excerpt || article.content.substring(0, 150)}...</p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  {article.category && (
                    <span className="badge-primary bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50 text-xs">
                      {article.category}
                    </span>
                  )}
                  <Link 
                    href={`/news/${article.id}`}
                    className="flex items-center space-x-1 sm:space-x-2 text-blue-600 hover:text-purple-600 font-semibold text-xs sm:text-sm transition-colors group-hover:space-x-2 sm:group-hover:space-x-3"
                  >
                    <span>Read More</span>
                    <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

