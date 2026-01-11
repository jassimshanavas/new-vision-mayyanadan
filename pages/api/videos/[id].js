import { readData, writeData, videosFile } from '../../../lib/data';
import { authenticateToken } from '../../../lib/auth';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const videos = readData(videosFile);
      const filteredVideos = videos.filter(v => v.id !== parseInt(id));
      writeData(videosFile, filteredVideos);
      res.json({ message: 'Video deleted' });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

