import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { FaFire, FaTimes } from 'react-icons/fa';

const FlashNews = () => {
  const [flashNews, setFlashNews] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetchFlashNews();
  }, []);

  const fetchFlashNews = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.NEWS_FLASH);
      if (response.data) {
        setFlashNews(response.data);
        // Check if user has dismissed this flash news
        const dismissedId = localStorage.getItem('dismissedFlashNews');
        if (dismissedId === response.data.id.toString()) {
          setVisible(false);
        }
      }
    } catch (error) {
      console.error('Error fetching flash news:', error);
    }
  };

  const handleDismiss = () => {
    if (flashNews) {
      localStorage.setItem('dismissedFlashNews', flashNews.id.toString());
      setVisible(false);
    }
  };

  if (!flashNews || !visible) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 sm:py-3 px-3 sm:px-4 shadow-lg relative z-50 animate-slide-down">
      <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-grow min-w-0">
          <div className="flex items-center space-x-1 sm:space-x-2 bg-red-800 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">
            <FaFire className="animate-pulse w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wide hidden sm:inline">Flash News</span>
            <span className="font-bold text-xs uppercase tracking-wide sm:hidden">Flash</span>
          </div>
          <Link
            to={`/news/${flashNews.id}`}
            className="flex-grow hover:underline font-semibold text-xs sm:text-sm md:text-base truncate min-w-0"
          >
            {flashNews.title}
          </Link>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-2 sm:ml-4 hover:bg-red-800 p-1.5 sm:p-1 rounded transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
      <style>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FlashNews;


