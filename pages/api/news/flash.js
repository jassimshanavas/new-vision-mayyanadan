import { readData, newsFile } from '../../../lib/data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const news = readData(newsFile);
    const flashNews = news.find(n => n.flashNews && n.published);
    res.json(flashNews || null);
  } catch (error) {
    console.error('Error fetching flash news:', error);
    res.status(500).json({ error: 'Failed to fetch flash news' });
  }
}

