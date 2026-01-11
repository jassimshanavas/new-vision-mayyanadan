import { readData, writeData, facebookPostsFile } from '../../../lib/data';
import { authenticateToken } from '../../../lib/auth';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const posts = readData(facebookPostsFile);
      const filteredPosts = posts.filter(p => p.id !== parseInt(id));
      writeData(facebookPostsFile, filteredPosts);
      res.json({ message: 'Facebook post deleted' });
    } catch (error) {
      console.error('Error deleting Facebook post:', error);
      res.status(500).json({ error: 'Failed to delete Facebook post' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

