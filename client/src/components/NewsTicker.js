import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaNewspaper } from 'react-icons/fa';

const NewsTicker = () => {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const fetchHeadlines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      // Get latest 10 articles (excluding flash news which is shown separately)
      const latest = response.data.filter(article => !article.flashNews).slice(0, 10);
      setHeadlines(latest);
    } catch (error) {
      console.error('Error fetching headlines:', error);
    }
  };

  if (headlines.length === 0) return null;

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden relative">
      <div className="flex items-center absolute left-0 top-0 bottom-0 bg-blue-600 px-2 sm:px-4 z-10">
        <FaNewspaper className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
        <span className="font-bold text-xs sm:text-sm whitespace-nowrap hidden sm:inline">Latest:</span>
        <span className="font-bold text-xs whitespace-nowrap sm:hidden">News:</span>
      </div>
      <div className="ml-20 sm:ml-32 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {headlines.map((article, index) => (
            <React.Fragment key={article.id}>
              <Link
                to={`/news/${article.id}`}
                className="hover:text-blue-400 transition-colors mr-4 sm:mr-8"
              >
                <span className="font-semibold text-xs sm:text-sm">{article.title}</span>
              </Link>
              {index < headlines.length - 1 && (
                <span className="text-gray-600 mr-4 sm:mr-8">•</span>
              )}
            </React.Fragment>
          ))}
          {/* Duplicate for seamless loop */}
          {headlines.map((article, index) => (
            <React.Fragment key={`duplicate-${article.id}`}>
              <Link
                to={`/news/${article.id}`}
                className="hover:text-blue-400 transition-colors mr-4 sm:mr-8"
              >
                <span className="font-semibold text-xs sm:text-sm">{article.title}</span>
              </Link>
              {index < headlines.length - 1 && (
                <span className="text-gray-600 mr-4 sm:mr-8">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;

