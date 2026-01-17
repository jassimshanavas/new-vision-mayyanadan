import { supabaseHelpers, isSupabaseConfigured } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (!isSupabaseConfigured()) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method === 'GET') {
    try {
      const news = await supabaseHelpers.getNews({ published: true, flashNews: true });
      res.json(news.slice(0, 5)); // Return top 5 flash news
    } catch (error) {
      console.error('Error fetching flash news:', error);
      res.status(500).json({ error: 'Failed to fetch flash news' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
