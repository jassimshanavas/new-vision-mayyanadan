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

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Use YouTube oEmbed API to get title
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    let title = '';
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    try {
      const oEmbedResponse = await axios.get(oEmbedUrl);
      title = oEmbedResponse.data.title || '';
      if (oEmbedResponse.data.thumbnail_url) {
        thumbnailUrl = oEmbedResponse.data.thumbnail_url;
      }
    } catch (error) {
      console.error('Error fetching oEmbed data:', error);
      // Continue without title if oEmbed fails
    }

    // Try to get description from YouTube video page
    let description = '';
    try {
      const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const videoPageResponse = await axios.get(videoPageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      // Try to extract description from meta tags
      const metaDescriptionMatch = videoPageResponse.data.match(/<meta name="description" content="([^"]+)"/);
      if (metaDescriptionMatch && metaDescriptionMatch[1]) {
        description = metaDescriptionMatch[1];
      } else {
        // Try to extract from JSON-LD structured data
        const jsonLdMatch = videoPageResponse.data.match(/"description":"([^"]+)"/);
        if (jsonLdMatch && jsonLdMatch[1]) {
          description = jsonLdMatch[1].replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
            return String.fromCharCode(parseInt(code, 16));
          });
        }
      }
    } catch (error) {
      console.error('Error fetching video page for description:', error);
      // Description extraction failed, continue without it
    }

    res.json({
      title: title || 'Untitled Video',
      description: description || '',
      thumbnailUrl: thumbnailUrl
    });
  } catch (error) {
    console.error('Error extracting video details:', error);
    res.status(500).json({ error: 'Failed to extract video details' });
  }
}

