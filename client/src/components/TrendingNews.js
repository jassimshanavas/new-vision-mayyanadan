import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaFire, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';
import { getBestThumbnailUrl } from '../utils/imageExtractor';

const TrendingNews = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news/trending');
      setTrending(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trending news:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            <FaFire className="inline text-orange-500 mr-2" />
            Trending Now
          </h2>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (trending.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          <FaFire className="inline text-orange-500 mr-2 animate-pulse" />
          Trending Now
        </h2>
        <p className="text-center text-gray-600 mb-8">Most viewed articles this week</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((article, index) => (
            <Link
              key={article.id}
              to={`/news/${article.id}`}
              className="card group hover:scale-105 transition-transform duration-300 relative"
            >
              {/* Trending Badge */}
              <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                {index + 1}
              </div>

              {article.imageUrl && (
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={getBestThumbnailUrl(article.imageUrl, 'https://via.placeholder.com/400x250?text=News+Image')}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250?text=News+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              )}
              
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="flex items-center space-x-1">
                    <FaFire className="text-orange-500" />
                    <span>Trending</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaEye />
                    <span>{article.views || 0} views</span>
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.excerpt || article.content.substring(0, 100)}...
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{format(new Date(article.createdAt), 'MMM dd, yyyy')}</span>
                  {article.category && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
                      {article.category}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingNews;


