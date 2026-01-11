import axios from 'axios';
import { extractYouTubeId } from '../../../lib/data';
import { authenticateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let thumbnailUrl = null;
    let sourceType = null;

    // Check if it's a YouTube URL
    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      sourceType = 'youtube';
      thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      
      // Verify if maxresdefault exists by checking with oEmbed
      try {
        const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const oEmbedResponse = await axios.get(oEmbedUrl);
        if (oEmbedResponse.data.thumbnail_url) {
          thumbnailUrl = oEmbedResponse.data.thumbnail_url;
        }
      } catch (error) {
        thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      }
    }
    // Check if it's a Facebook URL
    else if (url.includes('facebook.com') || url.includes('fb.com') || url.includes('fb.watch')) {
      sourceType = 'facebook';
      
      // Try Facebook oEmbed API for videos
      if (url.includes('video') || url.includes('watch')) {
        try {
          const oEmbedUrl = `https://www.facebook.com/plugins/video/oembed.json?url=${encodeURIComponent(url)}`;
          const oEmbedResponse = await axios.get(oEmbedUrl, {
            timeout: 5000,
            validateStatus: (status) => status < 500
          });
          if (oEmbedResponse.status === 200 && oEmbedResponse.data && oEmbedResponse.data.thumbnail_url) {
            thumbnailUrl = oEmbedResponse.data.thumbnail_url;
          }
        } catch (error) {
          console.error('Facebook video oEmbed error:', error.message);
        }
      }

      // Try to extract photo ID
      if (!thumbnailUrl) {
        let photoId = null;
        const fbidMatch = url.match(/[?&](?:fbid|story_fbid)=(\d+)/);
        if (fbidMatch) {
          photoId = fbidMatch[1];
        }
        
        if (!photoId) {
          const photoPhpMatch = url.match(/photo\.php\?.*[?&]fbid=(\d+)/);
          if (photoPhpMatch) photoId = photoPhpMatch[1];
        }
        
        if (!photoId) {
          const permalinkMatch = url.match(/permalink\.php\?.*[?&]story_fbid=(\d+)/);
          if (permalinkMatch) photoId = permalinkMatch[1];
        }
        
        if (!photoId) {
          const postsMatch = url.match(/\/(?:posts|photos)\/(\d+)/);
          if (postsMatch) photoId = postsMatch[1];
        }

        if (photoId) {
          try {
            const graphUrl = `https://graph.facebook.com/${photoId}/picture?type=large&redirect=false`;
            const graphResponse = await axios.get(graphUrl, {
              timeout: 5000,
              validateStatus: (status) => status < 500,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            
            if (graphResponse.status === 200) {
              if (graphResponse.data?.data?.url) {
                thumbnailUrl = graphResponse.data.data.url;
              } else if (graphResponse.data?.picture) {
                thumbnailUrl = graphResponse.data.picture;
              } else if (graphResponse.data?.url) {
                thumbnailUrl = graphResponse.data.url;
              }
            }
          } catch (error) {
            console.error('Facebook Graph API error:', error.message);
          }
          
          if (!thumbnailUrl) {
            thumbnailUrl = `https://graph.facebook.com/${photoId}/picture?type=large`;
          }
        }
      }

      // Try page post oEmbed (for posts)
      if (!thumbnailUrl && !url.includes('photo')) {
        try {
          const oEmbedUrl = `https://www.facebook.com/plugins/post/oembed.json?url=${encodeURIComponent(url)}`;
          const oEmbedResponse = await axios.get(oEmbedUrl, {
            timeout: 5000,
            validateStatus: (status) => status < 500
          });
          if (oEmbedResponse.status === 200 && oEmbedResponse.data?.thumbnail_url) {
            thumbnailUrl = oEmbedResponse.data.thumbnail_url;
          }
        } catch (error) {
          console.error('Facebook post oEmbed error:', error.message);
        }
      }

      if (!thumbnailUrl) {
        return res.status(400).json({ 
          error: 'Could not extract thumbnail from Facebook URL. Please try:\n' +
                 '• Right-click on the Facebook image → "Copy image address" → Paste that URL\n' +
                 '• Use a YouTube video URL instead\n' +
                 '• Upload the image to an image hosting service'
        });
      }
    } else {
      return res.status(400).json({ 
        error: 'Unsupported URL type. Please provide a YouTube video URL or Facebook post/photo URL.' 
      });
    }

    res.json({
      thumbnailUrl: thumbnailUrl,
      sourceType: sourceType,
      originalUrl: url
    });
  } catch (error) {
    console.error('Error extracting image URL:', error);
    res.status(500).json({ 
      error: 'Failed to extract image URL: ' + error.message
    });
  }
}

