import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsSection from '../components/NewsSection';
import VideoSection from '../components/VideoSection';
import FacebookSection from '../components/FacebookSection';
import HeroSection from '../components/HeroSection';
import { FaNewspaper, FaVideo, FaFacebook } from 'react-icons/fa';

const Home = () => {
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [newsRes, videosRes] = await Promise.all([
        axios.get('http://localhost:5000/api/news'),
        axios.get('http://localhost:5000/api/videos')
      ]);
      setNews(newsRes.data.filter(article => article.published));
      setVideos(videosRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Quick Stats */}
        <section className="bg-white py-6 sm:py-8 border-b">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-2 sm:mb-3">
                  <FaNewspaper className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{news.length}</h3>
                <p className="text-sm sm:text-base text-gray-600">News Articles</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full mb-2 sm:mb-3">
                  <FaVideo className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{videos.length}</h3>
                <p className="text-sm sm:text-base text-gray-600">Videos</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-2 sm:mb-3">
                  <FaFacebook className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Live</h3>
                <p className="text-sm sm:text-base text-gray-600">Facebook Updates</p>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <NewsSection news={news} />

        {/* Videos Section */}
        <VideoSection videos={videos} />

        {/* Facebook Section */}
        <FacebookSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

