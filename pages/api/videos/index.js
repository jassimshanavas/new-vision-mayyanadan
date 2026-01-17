import { extractYouTubeId } from '../../../lib/data';
import { authenticateToken } from '../../../lib/auth';
import { supabaseHelpers, isSupabaseConfigured } from '../../../lib/supabase';

export default async function handler(req, res) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return res.status(500).json({
      error: 'Database not configured. Please set up Supabase credentials.'
    });
  }

  if (req.method === 'GET') {
    try {
      const videos = await supabaseHelpers.getVideos();
      res.json(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  } else if (req.method === 'POST') {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const videoId = extractYouTubeId(req.body.url);
      if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
      }

      const newVideo = {
        video_id: videoId,
        url: req.body.url,
        title: req.body.title || 'Untitled Video',
        description: req.body.description || '',
        thumbnail_url: req.body.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        featured: req.body.featured || false
      };

      const createdVideo = await supabaseHelpers.createVideo(newVideo);
      res.status(201).json(createdVideo);
    } catch (error) {
      console.error('Error adding video:', error);
      res.status(500).json({ error: 'Failed to add video' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

