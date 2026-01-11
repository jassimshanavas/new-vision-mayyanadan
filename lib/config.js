// API Configuration for Next.js
// API routes are now relative since they're in the same Next.js app
const API_BASE_URL = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_API_URL || '';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  
  // News
  NEWS: `${API_BASE_URL}/api/news`,
  NEWS_BY_ID: (id) => `${API_BASE_URL}/api/news/${id}`,
  NEWS_RELATED: (id) => `${API_BASE_URL}/api/news/${id}/related`,
  NEWS_FLASH: `${API_BASE_URL}/api/news/flash`,
  NEWS_FEATURED: `${API_BASE_URL}/api/news/featured`,
  NEWS_TRENDING: `${API_BASE_URL}/api/news/trending`,
  NEWS_VIEW: (id) => `${API_BASE_URL}/api/news/${id}/view`,
  NEWS_EXTRACT_IMAGE: `${API_BASE_URL}/api/news/extract-image`,
  
  // Videos
  VIDEOS: `${API_BASE_URL}/api/videos`,
  VIDEOS_BY_ID: (id) => `${API_BASE_URL}/api/videos/${id}`,
  VIDEOS_EXTRACT_DETAILS: `${API_BASE_URL}/api/videos/extract-details`,
  
  // Facebook Posts
  FACEBOOK_POSTS: `${API_BASE_URL}/api/facebook-posts`,
  FACEBOOK_POSTS_BY_ID: (id) => `${API_BASE_URL}/api/facebook-posts/${id}`,
  
  // Settings
  SETTINGS: `${API_BASE_URL}/api/settings`,
  
  // YouTube
  YOUTUBE_CHANNEL_INFO: `${API_BASE_URL}/api/youtube/channel-info`,
};

export default API_BASE_URL;

