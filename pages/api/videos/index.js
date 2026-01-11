import { readData, writeData, videosFile, extractYouTubeId } from '../../../lib/data';
import { authenticateToken } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const videos = readData(videosFile);
      res.json(videos.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)));
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
      const videos = readData(videosFile);
      const videoId = extractYouTubeId(req.body.url);
      if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
      }

      const newVideo = {
        id: videos.length > 0 ? Math.max(...videos.map(v => v.id)) + 1 : 1,
        videoId: videoId,
        url: req.body.url,
        title: req.body.title || 'Untitled Video',
        description: req.body.description || '',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        addedAt: new Date().toISOString(),
        featured: req.body.featured || false
      };

      videos.push(newVideo);
      writeData(videosFile, videos);
      res.status(201).json(newVideo);
    } catch (error) {
      console.error('Error adding video:', error);
      res.status(500).json({ error: 'Failed to add video' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

