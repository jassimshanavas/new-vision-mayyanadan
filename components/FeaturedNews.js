import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_ENDPOINTS } from '../lib/config'';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { getBestThumbnailUrl } from '../utils/imageExtractor';

const FeaturedNews = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.NEWS_FEATURED);
      setFeatured(response.data.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching featured news:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (featured.length === 0) return null;

  const mainFeatured = featured[0];
  const otherFeatured = featured.slice(1);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <FaStar className="text-yellow-500 text-2xl sm:text-3xl mr-2 sm:mr-3" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Featured News</h2>
        </div>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">Handpicked stories that matter</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Featured Article */}
          <div className="lg:col-span-2">
            <Link href={`/news/${mainFeatured.id}`} className="card group block h-full">
              <div className="h-64 sm:h-80 md:h-96 overflow-hidden relative">
                <img
                  src={getBestThumbnailUrl(mainFeatured.imageUrl, 'https://via.placeholder.com/800x400?text=Featured+News')}
                  alt={mainFeatured.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Featured+News';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-1">
                    <FaStar />
                    <span>Featured</span>
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  {mainFeatured.category && (
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full mb-2 sm:mb-3">
                      {mainFeatured.category}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2 sm:line-clamp-none">
                    {mainFeatured.title}
                  </h3>
                  <p className="text-gray-200 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                    {mainFeatured.excerpt || mainFeatured.content.substring(0, 150)}...
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-300 gap-2 sm:gap-0">
                    <span>{format(new Date(mainFeatured.createdAt), 'MMMM dd, yyyy')}</span>
                    <span className="flex items-center space-x-2 group-hover:text-yellow-400 transition-colors">
                      <span>Read More</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Other Featured Articles */}
          <div className="space-y-4 sm:space-y-6">
            {otherFeatured.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.id}`}
                className="card group flex space-x-3 sm:space-x-4 hover:shadow-xl transition-shadow"
              >
                <div className="flex-shrink-0 w-24 h-20 sm:w-32 sm:h-24 overflow-hidden rounded">
                  <img
                    src={getBestThumbnailUrl(article.imageUrl, 'https://via.placeholder.com/200x150?text=News')}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x150?text=News';
                    }}
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <FaStar className="text-yellow-500 text-xs" />
                    <span className="text-xs text-gray-500">
                      {format(new Date(article.createdAt), 'MMM dd')}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1 text-sm sm:text-base">
                    {article.title}
                  </h4>
                  {article.category && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;


