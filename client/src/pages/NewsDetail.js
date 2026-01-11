import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShareAlt, FaEye, FaFire, FaStar, FaYoutube, FaFacebook } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getBestThumbnailUrl } from '../utils/imageExtractor';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareFeedback, setShareFeedback] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    fetchArticle();
    fetchRelatedNews();
  }, [id]);

  // Handle Escape key to close share feedback and reset sharing state
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShareFeedback(null);
        setIsSharing(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/news/${id}`);
      setArticle(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Article not found');
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/news/${id}/related`);
      setRelatedNews(response.data);
    } catch (error) {
      console.error('Error fetching related news:', error);
    }
  };

  const handleShare = async () => {
    if (!article || isSharing) return; // Safety guard and prevent multiple clicks
    
    setIsSharing(true);
    const url = window.location.href;
    const title = article.title || 'Check out this article';
    const text = article.excerpt || article.content?.substring(0, 150) || '';

    // Safety timeout - automatically reset after 15 seconds if something goes wrong
    const safetyTimeout = setTimeout(() => {
      setIsSharing(false);
      setShareFeedback(null);
    }, 15000);

    // Method 1: Try Web Share API (mobile browsers, modern desktop)
    if (navigator.share) {
      try {
        // Add timeout to prevent hanging
        const sharePromise = navigator.share({
          title: title,
          text: text,
          url: url,
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Share timeout')), 10000)
        );
        
        await Promise.race([sharePromise, timeoutPromise]);
        
        // Share was successful
        setIsSharing(false);
        setShareFeedback({ type: 'success', message: 'Shared successfully!' });
        setTimeout(() => {
          setShareFeedback(null);
          setIsSharing(false);
        }, 3000);
        return;
      } catch (error) {
        clearTimeout(safetyTimeout);
        setIsSharing(false);
        // User cancelled or error occurred
        if (error.name === 'AbortError' || error.name === 'NotAllowedError' || error.message === 'Share timeout') {
          // User cancelled or timeout - silently return
          return;
        }
        console.error('Error sharing:', error);
        // Fall through to clipboard method
      }
    }

    // Method 2: Try Clipboard API (modern browsers)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        clearTimeout(safetyTimeout);
        setIsSharing(false);
        setShareFeedback({ type: 'success', message: 'Link copied to clipboard!' });
        setTimeout(() => {
          setShareFeedback(null);
          setIsSharing(false);
        }, 3000);
        return;
      } catch (error) {
        console.error('Clipboard API failed:', error);
        // Fall through to next method
      }
    }

    // Method 3: Fallback - use execCommand (older browsers)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        clearTimeout(safetyTimeout);
        setIsSharing(false);
        setShareFeedback({ type: 'success', message: 'Link copied to clipboard!' });
        setTimeout(() => {
          setShareFeedback(null);
          setIsSharing(false);
        }, 3000);
        return;
      }
    } catch (error) {
      console.error('execCommand copy failed:', error);
    }

    // Method 4: Final fallback - show URL in prompt
    try {
      const urlInput = document.createElement('input');
      urlInput.value = url;
      document.body.appendChild(urlInput);
      urlInput.select();
      urlInput.setSelectionRange(0, 99999); // For mobile devices
      
      // Try to copy one more time
      if (document.execCommand('copy')) {
        document.body.removeChild(urlInput);
        clearTimeout(safetyTimeout);
        setIsSharing(false);
        setShareFeedback({ type: 'success', message: 'Link copied to clipboard!' });
        setTimeout(() => {
          setShareFeedback(null);
          setIsSharing(false);
        }, 3000);
        return;
      }
      
      document.body.removeChild(urlInput);
    } catch (error) {
      console.error('Final copy attempt failed:', error);
    }

    // Ultimate fallback - show toast with URL
    clearTimeout(safetyTimeout);
    setIsSharing(false);
    setShareFeedback({ 
      type: 'info', 
      message: `Share this link:`,
      url: url
    });
    setTimeout(() => {
      setShareFeedback(null);
      setIsSharing(false);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <FaArrowLeft />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <article className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          {article.imageUrl && (
            <div className="mb-6 sm:mb-8 rounded-lg overflow-hidden shadow-xl">
              <img
                src={getBestThumbnailUrl(article.imageUrl)}
                alt={article.title}
                className="w-full h-48 sm:h-64 md:h-96 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=News+Image';
                }}
              />
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              {article.flashNews && (
                <span className="inline-flex items-center space-x-1 bg-red-600 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                  <FaFire className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Flash News</span>
                </span>
              )}
              {article.featured && (
                <span className="inline-flex items-center space-x-1 bg-yellow-500 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                  <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Featured</span>
                </span>
              )}
              {article.trending && (
                <span className="inline-flex items-center space-x-1 bg-orange-500 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                  <FaFire className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Trending</span>
                </span>
              )}
              {article.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                  {article.category}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">{article.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="w-4 h-4" />
                <span>{format(new Date(article.createdAt), 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUser className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              {article.views !== undefined && (
                <div className="flex items-center space-x-2">
                  <FaEye className="w-4 h-4" />
                  <span>{article.views} views</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto sm:ml-auto">
                {(article.youtubeUrl || article.facebookUrl) && (
                  <div className="flex items-center space-x-2 sm:space-x-3 border-r pr-3 sm:pr-4 mr-2 sm:mr-2">
                    {article.youtubeUrl && (
                      <a
                        href={article.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 sm:space-x-2 text-red-600 hover:text-red-700 transition-colors text-sm sm:text-base"
                        title="View on YouTube"
                      >
                        <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">YouTube</span>
                      </a>
                    )}
                    {article.facebookUrl && (
                      <a
                        href={article.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 sm:space-x-2 text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base"
                        title="View on Facebook"
                      >
                        <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Facebook</span>
                      </a>
                    )}
                  </div>
                )}
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className={`flex items-center space-x-1 sm:space-x-2 text-blue-600 hover:text-blue-700 transition-opacity text-sm sm:text-base ${
                    isSharing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={isSharing ? 'Sharing...' : 'Share this article'}
                >
                  <FaShareAlt className="w-4 h-4" />
                  <span className="hidden sm:inline">{isSharing ? 'Sharing...' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Share Feedback Toast */}
          {shareFeedback && (
            <div 
              className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[9999] px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
                shareFeedback.type === 'success' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <span className="font-semibold text-sm sm:text-base">{shareFeedback.message}</span>
                {shareFeedback.url && (
                  <>
                    <div className="flex-1 w-full sm:max-w-xs truncate text-xs sm:text-sm opacity-90">{shareFeedback.url}</div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          try {
                            const textArea = document.createElement('textarea');
                            textArea.value = shareFeedback.url;
                            textArea.style.position = 'fixed';
                            textArea.style.opacity = '0';
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            setShareFeedback({ type: 'success', message: 'Link copied!' });
                            setTimeout(() => setShareFeedback(null), 2000);
                          } catch (err) {
                            console.error('Copy failed:', err);
                          }
                        }}
                        className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs sm:text-sm font-semibold transition-colors"
                      >
                        Copy
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareFeedback(null);
                          setIsSharing(false);
                        }}
                        className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs sm:text-sm font-semibold transition-colors sm:hidden"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareFeedback(null);
                    setIsSharing(false);
                  }}
                  className="hidden sm:block ml-2 text-white hover:text-gray-200 font-bold text-xl leading-none transition-colors"
                  aria-label="Close"
                  title="Close (or press Escape)"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Related News</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {relatedNews.map((related) => (
                  <Link
                    key={related.id}
                    to={`/news/${related.id}`}
                    className="card group hover:shadow-xl transition-shadow"
                  >
                    {related.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={getBestThumbnailUrl(related.imageUrl, 'https://via.placeholder.com/400x200?text=News+Image')}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x200?text=News+Image';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {related.excerpt || related.content.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{format(new Date(related.createdAt), 'MMM dd, yyyy')}</span>
                        {related.category && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {related.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Stay Updated</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Follow us on Facebook and YouTube for the latest news and updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61577465543293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors text-center text-sm sm:text-base"
                >
                  Facebook
                </a>
                <a
                  href="https://www.youtube.com/@newvisionmayyanadan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors text-center text-sm sm:text-base"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;

