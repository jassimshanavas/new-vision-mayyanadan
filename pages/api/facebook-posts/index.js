import { readData, writeData, facebookPostsFile, extractFacebookPostId } from '../../../lib/data';
import { authenticateToken } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const posts = readData(facebookPostsFile);
      res.json(posts.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)));
    } catch (error) {
      console.error('Error fetching Facebook posts:', error);
      res.status(500).json({ error: 'Failed to fetch Facebook posts' });
    }
  } else if (req.method === 'POST') {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const posts = readData(facebookPostsFile);
      const postId = extractFacebookPostId(req.body.url);
      
      if (!req.body.url || !req.body.url.includes('facebook.com')) {
        return res.status(400).json({ error: 'Invalid Facebook URL' });
      }

      const newPost = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        postId: postId,
        url: req.body.url,
        title: req.body.title || 'Facebook Post',
        description: req.body.description || '',
        addedAt: new Date().toISOString(),
        featured: req.body.featured || false
      };

      posts.push(newPost);
      writeData(facebookPostsFile, posts);
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error adding Facebook post:', error);
      res.status(500).json({ error: 'Failed to add Facebook post' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

