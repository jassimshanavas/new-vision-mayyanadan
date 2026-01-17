/**
 * Utility functions to extract thumbnail URLs from YouTube and Facebook URLs
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - YouTube video ID or null if not found
 */
export const extractYouTubeId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2] && match[2].length === 11) ? match[2] : null;
};

/**
 * Get YouTube thumbnail URL from video ID or URL
 * @param {string} videoIdOrUrl - YouTube video ID or URL
 * @param {string} quality - Thumbnail quality: 'maxresdefault', 'hqdefault', 'mqdefault', 'sddefault', 'default'
 * @returns {string|null} - Thumbnail URL or null if invalid
 */
export const getYouTubeThumbnail = (videoIdOrUrl, quality = 'hqdefault') => {
  const videoId = extractYouTubeId(videoIdOrUrl) || videoIdOrUrl;
  
  if (!videoId || videoId.length !== 11) {
    return null;
  }
  
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Check if URL is a YouTube URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export const isYouTubeUrl = (url) => {
  if (!url) return false;
  return /(youtube\.com|youtu\.be)/i.test(url);
};

/**
 * Check if URL is a Facebook URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export const isFacebookUrl = (url) => {
  if (!url) return false;
  return /(facebook\.com|fb\.com|fb\.watch)/i.test(url);
};

/**
 * Check if URL is a direct image URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export const isDirectImageUrl = (url) => {
  if (!url) return false;
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
  return imageExtensions.test(url) || url.includes('data:image');
};

/**
 * Extract thumbnail URL from YouTube or Facebook URL
 * For YouTube: Returns thumbnail URL directly
 * For Facebook: Returns null (requires server-side extraction with API)
 * For direct image URLs: Returns the URL as-is
 * @param {string} url - YouTube, Facebook, or direct image URL
 * @returns {string|null} - Thumbnail URL or null if cannot be extracted client-side
 */
export const extractThumbnailUrl = (url) => {
  if (!url) return null;
  
  // If it's already a direct image URL, return it
  if (isDirectImageUrl(url)) {
    return url;
  }
  
  // If it's a YouTube URL, extract thumbnail
  if (isYouTubeUrl(url)) {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      // Try maxresdefault first, fallback to hqdefault
      return getYouTubeThumbnail(videoId, 'maxresdefault') || getYouTubeThumbnail(videoId, 'hqdefault');
    }
  }
  
  // For Facebook URLs, we can't extract thumbnails client-side without API
  // Return null so the component can handle it (show placeholder or make server request)
  if (isFacebookUrl(url)) {
    return null;
  }
  
  // Unknown URL type
  return null;
};

/**
 * Get the best available thumbnail URL
 * Tries to extract from URL, falls back to placeholder
 * @param {string} url - Image URL, YouTube URL, or Facebook URL
 * @param {string} placeholder - Placeholder image URL
 * @returns {string} - Thumbnail URL or placeholder
 */
export const getBestThumbnailUrl = (url, placeholder = 'https://via.placeholder.com/800x400?text=News+Image') => {
  if (!url) return placeholder;
  
  const extracted = extractThumbnailUrl(url);
  return extracted || placeholder;
};

