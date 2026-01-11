import { readData, newsFile } from '../../../lib/data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const news = readData(newsFile);
    const trending = news.filter(n => n.trending && n.published)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
    res.json(trending);
  } catch (error) {
    console.error('Error fetching trending news:', error);
    res.status(500).json({ error: 'Failed to fetch trending news' });
  }
}

