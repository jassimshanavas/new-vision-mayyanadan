import { readData, newsFile } from '../../../lib/data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const news = readData(newsFile);
    const featured = news.filter(n => n.featured && n.published)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(featured);
  } catch (error) {
    console.error('Error fetching featured news:', error);
    res.status(500).json({ error: 'Failed to fetch featured news' });
  }
}

