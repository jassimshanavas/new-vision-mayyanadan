import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../../lib/config';
import {
  FaNewspaper,
  FaVideo,
  FaFacebook,
  FaYoutube,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaHome,
  FaTimes,
  FaSave,
  FaExternalLinkAlt,
  FaDownload,
  FaUpload,
  FaImage
} from 'react-icons/fa';
import { uploadImageToSupabase } from '../../utils/imageUpload';

const AdminDashboard = () => {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [facebookPosts, setFacebookPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('news');
  const [editingItem, setEditingItem] = useState(null);
  const [extractingVideo, setExtractingVideo] = useState(false);
  const [extractingImage, setExtractingImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    category: 'General',
    published: true,
    flashNews: false,
    featured: false,
    trending: false,
    url: '',
    description: '',
    youtubeUrl: '',
    facebookUrl: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const [newsRes, videosRes, postsRes, settingsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.NEWS),
        axios.get(API_ENDPOINTS.VIDEOS),
        axios.get(API_ENDPOINTS.FACEBOOK_POSTS).catch(() => ({ data: [] })),
        axios.get(API_ENDPOINTS.SETTINGS)
      ]);
      setNews(newsRes.data);
      setVideos(videosRes.data);
      setFacebookPosts(postsRes.data || []);
      setSettings(settingsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData(item);
      setImagePreview(item.imageUrl || null);
    } else {
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        imageUrl: '',
        category: 'General',
        published: true,
        flashNews: false,
        featured: false,
        trending: false,
        url: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setImagePreview(null);
    setUploadProgress(0);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      category: 'General',
      published: true,
      url: '',
      description: '',
      featured: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (modalType === 'news') {
        if (editingItem) {
          await axios.put(API_ENDPOINTS.NEWS_BY_ID(editingItem.id), formData, config);
        } else {
          await axios.post(API_ENDPOINTS.NEWS, formData, config);
        }
      } else if (modalType === 'video') {
        if (editingItem) {
          // Videos update logic if needed
          alert('Video editing coming soon');
        } else {
          await axios.post(API_ENDPOINTS.VIDEOS, formData, config);
        }
      } else if (modalType === 'facebook-post') {
        if (editingItem) {
          // Facebook posts update logic if needed
          alert('Facebook post editing coming soon');
        } else {
          await axios.post(API_ENDPOINTS.FACEBOOK_POSTS, formData, config);
        }
      }

      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving. Please try again.');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      if (type === 'news') {
        await axios.delete(API_ENDPOINTS.NEWS_BY_ID(id), config);
        setNews(news.filter(n => n.id !== id));
      } else if (type === 'video') {
        await axios.delete(API_ENDPOINTS.VIDEOS_BY_ID(id), config);
        setVideos(videos.filter(v => v.id !== id));
      } else if (type === 'facebook-post') {
        await axios.delete(API_ENDPOINTS.FACEBOOK_POSTS_BY_ID(id), config);
        setFacebookPosts(facebookPosts.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting. Please try again.');
    }
  };

  const handleExtractVideoDetails = async () => {
    if (!formData.url) {
      alert('Please enter a YouTube URL first');
      return;
    }

    // Check if token exists
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      console.error('No token available');
      return;
    }

    setExtractingVideo(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      console.log('Sending request to extract video details with token:', token ? 'Token present' : 'No token');

      const response = await axios.post(API_ENDPOINTS.VIDEOS_EXTRACT_DETAILS, {
        url: formData.url
      }, config);

      setFormData({
        ...formData,
        title: response.data.title || formData.title,
        description: response.data.description || formData.description
      });

      alert('Video details extracted successfully!');
    } catch (error) {
      console.error('Error extracting video details:', error);
      console.error('Token used:', token ? 'Token present' : 'No token');
      console.error('Response:', error.response);

      if (error.response?.status === 401) {
        alert('Authentication failed. Please log out and log in again.');
      } else {
        alert(error.response?.data?.error || 'Failed to extract video details. Please try again.');
      }
    } finally {
      setExtractingVideo(false);
    }
  };

  const handleExtractImageUrl = async () => {
    if (!formData.imageUrl) {
      alert('Please enter a YouTube or Facebook URL first');
      return;
    }

    // Check if token exists
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      console.error('No token available');
      return;
    }

    // Check if it's already a direct image URL (ends with image extensions)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const isDirectImageUrl = imageExtensions.some(ext =>
      formData.imageUrl.toLowerCase().includes(ext)
    );

    if (isDirectImageUrl && !formData.imageUrl.includes('youtube.com') && !formData.imageUrl.includes('facebook.com') && !formData.imageUrl.includes('fb.com')) {
      alert('This appears to be a direct image URL. No extraction needed.');
      return;
    }

    setExtractingImage(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post(API_ENDPOINTS.NEWS_EXTRACT_IMAGE, {
        url: formData.imageUrl
      }, config);

      setFormData({
        ...formData,
        imageUrl: response.data.thumbnailUrl
      });

      alert(`Image URL extracted successfully from ${response.data.sourceType}!`);
    } catch (error) {
      console.error('Error extracting image URL:', error);

      if (error.response?.status === 401) {
        alert('Authentication failed. Please log out and log in again.');
        return;
      }

      const errorMessage = error.response?.data?.error || 'Failed to extract image URL. Please try again or use a direct image URL.';

      // Provide helpful suggestions for Facebook URLs
      if (formData.imageUrl && (formData.imageUrl.includes('facebook.com') || formData.imageUrl.includes('fb.com'))) {
        alert(
          errorMessage + '\n\n' +
          'For Facebook images, you can:\n' +
          '1. Right-click on the Facebook image and select "Copy image address"\n' +
          '2. Use that direct image URL instead\n' +
          '3. Or use a YouTube video URL (thumbnails work reliably)'
        );
      } else {
        alert(errorMessage);
      }
    } finally {
      setExtractingImage(false);
    }
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      alert('Invalid file type. Please select an image file (JPEG, PNG, GIF, or WebP).');
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB.');
      e.target.value = ''; // Reset input
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload the file
    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const downloadURL = await uploadImageToSupabase(
        file,
        'news-images',
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Update form with the uploaded image URL
      setFormData({
        ...formData,
        imageUrl: downloadURL
      });

      setImagePreview(downloadURL);
      alert('Image uploaded successfully to Supabase!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImagePreview = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      imageUrl: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-soft sticky top-0 z-40">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-3 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">Welcome, <span className="text-blue-600 font-semibold">{user?.username}</span></span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              <FaHome className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Tabs */}
        <div className="card mb-6 sm:mb-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-300 relative group text-sm sm:text-base ${activeTab === 'news'
                  ? 'text-blue-600 bg-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <FaNewspaper className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${activeTab === 'news' ? 'scale-110' : ''}`} />
                <span className="hidden sm:inline">News Articles</span>
                <span className="sm:hidden">News</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${activeTab === 'news'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-200 text-gray-600'
                  }`}>
                  {news.length}
                </span>
              </div>
              {activeTab === 'news' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-300 relative group text-sm sm:text-base ${activeTab === 'videos'
                  ? 'text-blue-600 bg-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <FaVideo className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${activeTab === 'videos' ? 'scale-110' : ''}`} />
                <span>Videos</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${activeTab === 'videos'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-200 text-gray-600'
                  }`}>
                  {videos.length}
                </span>
              </div>
              {activeTab === 'videos' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-300 relative group text-sm sm:text-base ${activeTab === 'settings'
                  ? 'text-blue-600 bg-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <FaCog className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${activeTab === 'settings' ? 'scale-110 rotate-90' : ''}`} />
                <span>Settings</span>
              </div>
              {activeTab === 'settings' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="card p-4 sm:p-6 lg:p-8">
          {activeTab === 'news' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">News Articles</h2>
                <button
                  onClick={() => openModal('news')}
                  className="btn-primary flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <FaPlus />
                  <span>Add News</span>
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Title</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Author</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Flags</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map((article) => (
                      <tr key={article.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{article.title}</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">{article.author}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {article.flashNews && (
                              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                                Flash
                              </span>
                            )}
                            {article.featured && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                            {article.trending && (
                              <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
                                Trending
                              </span>
                            )}
                            {!article.flashNews && !article.featured && !article.trending && (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${article.published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {article.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            {(article.youtubeUrl || article.facebookUrl) && (
                              <div className="flex space-x-1 border-r pr-2 mr-2">
                                {article.youtubeUrl && (
                                  <a
                                    href={article.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-600 hover:text-red-700"
                                    title="View on YouTube"
                                  >
                                    <FaYoutube />
                                  </a>
                                )}
                                {article.facebookUrl && (
                                  <a
                                    href={article.facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700"
                                    title="View on Facebook"
                                  >
                                    <FaFacebook />
                                  </a>
                                )}
                              </div>
                            )}
                            <button
                              onClick={() => openModal('news', article)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete('news', article.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-4">
                {news.map((article) => (
                  <div key={article.id} className="card p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800 flex-1 pr-2 line-clamp-2">{article.title}</h3>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button
                          onClick={() => openModal('news', article)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete('news', article.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {article.category}
                      </span>
                      {article.flashNews && (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                          Flash
                        </span>
                      )}
                      {article.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                      {article.trending && (
                        <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
                          Trending
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${article.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    {(article.youtubeUrl || article.facebookUrl) && (
                      <div className="flex space-x-3 pt-2 border-t">
                        {article.youtubeUrl && (
                          <a
                            href={article.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                          >
                            <FaYoutube />
                            <span>YouTube</span>
                          </a>
                        )}
                        {article.facebookUrl && (
                          <a
                            href={article.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <FaFacebook />
                            <span>Facebook</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Videos</h2>
                <button
                  onClick={() => openModal('video')}
                  className="btn-primary flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <FaPlus />
                  <span>Add Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="card">
                    <img
                      src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        if (e.target.src.includes('maxresdefault')) {
                          e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                        } else if (e.target.src.includes('hqdefault')) {
                          e.target.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
                        } else {
                          e.target.src = 'https://via.placeholder.com/400x225?text=Video+Thumbnail';
                        }
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{video.title}</h3>
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs px-2 py-1 rounded ${video.featured
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {video.featured ? 'Featured' : 'Regular'}
                        </span>
                        <button
                          onClick={() => handleDelete('video', video.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'facebook-posts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Facebook Posts</h2>
                <button
                  onClick={() => openModal('facebook-post')}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Add Facebook Post</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facebookPosts.map((post) => (
                  <div key={post.id} className="card">
                    <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <FaFacebook className="w-16 h-16 text-white opacity-80" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
                      {post.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-3">
                        <span
                          className={`text-xs px-2 py-1 rounded ${post.featured
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {post.featured ? 'Featured' : 'Regular'}
                        </span>
                        <div className="flex space-x-2">
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                            title="View Post"
                          >
                            <FaExternalLinkAlt />
                          </a>
                          <button
                            onClick={() => handleDelete('facebook-post', post.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {facebookPosts.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FaFacebook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No Facebook posts added yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Click "Add Facebook Post" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Site Title</label>
                  <input
                    type="text"
                    value={settings.siteTitle || ''}
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">YouTube Channel URL</label>
                  <input
                    type="text"
                    value={settings.youtubeChannelUrl || ''}
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Facebook Page URL</label>
                  <input
                    type="text"
                    value={settings.facebookPageUrl || ''}
                    className="input-field"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {editingItem ? 'Edit' : 'Add'} {
                  modalType === 'news' ? 'News Article' :
                    modalType === 'video' ? 'Video' :
                      modalType === 'facebook-post' ? 'Facebook Post' :
                        'Item'
                }
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 p-1">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {modalType === 'news' ? (
                <>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Content *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="input-field"
                      rows="8"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Excerpt</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="input-field"
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Image</label>

                      {/* Upload Button */}
                      <div className="flex gap-2 mb-2">
                        <label className="flex-1">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleImageFileSelect}
                            className="hidden"
                            disabled={uploadingImage}
                            id="image-upload-input"
                          />
                          <button
                            type="button"
                            disabled={uploadingImage}
                            className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                            onClick={() => document.getElementById('image-upload-input').click()}
                          >
                            {uploadingImage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                <span>Uploading... {uploadProgress}%</span>
                              </>
                            ) : (
                              <>
                                <FaUpload className="w-4 h-4" />
                                <span>Upload Image</span>
                              </>
                            )}
                          </button>
                        </label>
                      </div>

                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImagePreview}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                            title="Remove image"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Upload Progress Bar */}
                      {uploadingImage && uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}

                      <div className="text-center text-gray-500 text-xs py-2 border-t border-gray-200">
                        <span>OR</span>
                      </div>

                      {/* URL Input */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => {
                              setFormData({ ...formData, imageUrl: e.target.value });
                              if (e.target.value) {
                                setImagePreview(e.target.value);
                              }
                            }}
                            className="input-field flex-1"
                            placeholder="Direct image URL or YouTube URL"
                            disabled={extractingImage}
                          />
                          <button
                            type="button"
                            onClick={handleExtractImageUrl}
                            disabled={extractingImage || !formData.imageUrl}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
                            title="Extract thumbnail from YouTube URL"
                          >
                            {extractingImage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                <span className="hidden sm:inline">Extracting...</span>
                              </>
                            ) : (
                              <>
                                <FaDownload className="w-4 h-4" />
                                <span className="hidden sm:inline">Extract</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Paste a direct image URL or YouTube video URL to extract thumbnail
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field text-sm sm:text-base"
                      >
                        <option>General</option>
                        <option>Local</option>
                        <option>Sports</option>
                        <option>Politics</option>
                        <option>Entertainment</option>
                        <option>Technology</option>
                      </select>
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">YouTube URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.youtubeUrl || ''}
                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                        className="input-field text-sm sm:text-base"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Add a YouTube link to view this article on YouTube</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Facebook URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.facebookUrl || ''}
                        onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                        className="input-field text-sm sm:text-base"
                        placeholder="https://www.facebook.com/..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Add a Facebook link to view this article on Facebook</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="published"
                          checked={formData.published}
                          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="published" className="ml-2 text-gray-700 font-semibold">
                          Published
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="flashNews"
                          checked={formData.flashNews}
                          onChange={(e) => setFormData({ ...formData, flashNews: e.target.checked })}
                          className="w-4 h-4 text-red-600 rounded"
                        />
                        <label htmlFor="flashNews" className="ml-2 text-gray-700 font-semibold">
                          Flash News (Breaking)
                        </label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 text-yellow-600 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 text-gray-700 font-semibold">
                          Featured
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="trending"
                          checked={formData.trending}
                          onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <label htmlFor="trending" className="ml-2 text-gray-700 font-semibold">
                          Trending
                        </label>
                      </div>
                    </div>
                  </div>
                  {formData.flashNews && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                      <strong>Note:</strong> Only one article can be marked as Flash News at a time. Setting this will unmark any other flash news article.
                    </div>
                  )}
                </>
              ) : modalType === 'video' ? (
                <>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">YouTube URL *</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="input-field flex-1"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                        disabled={extractingVideo}
                      />
                      <button
                        type="button"
                        onClick={handleExtractVideoDetails}
                        disabled={extractingVideo || !formData.url}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
                      >
                        {extractingVideo ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            <span>Extracting...</span>
                          </>
                        ) : (
                          <>
                            <FaDownload className="w-4 h-4" />
                            <span>Extract Details</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Paste the YouTube URL and click "Extract Details" to automatically fill in the title and description
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field"
                      rows="4"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-gray-700 font-semibold">
                      Featured Video
                    </label>
                  </div>
                </>
              ) : modalType === 'facebook-post' ? (
                <>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Facebook Post URL *</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="input-field"
                      placeholder="https://www.facebook.com/permalink.php?story_fbid=..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Paste the full URL of the Facebook post you want to embed
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      placeholder="Facebook Post"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field"
                      rows="4"
                      placeholder="Optional description or summary of the post"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured-post"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="featured-post" className="ml-2 text-gray-700 font-semibold">
                      Featured Post
                    </label>
                  </div>
                </>
              ) : null}

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary w-full sm:w-auto text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base">
                  <FaSave />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

