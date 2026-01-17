import { supabaseHelpers, isSupabaseConfigured } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (!isSupabaseConfigured()) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method === 'GET') {
    try {
      const news = await supabaseHelpers.getNews({ published: true, featured: true });
      res.json(news);
    } catch (error) {
      console.error('Error fetching featured news:', error);
      res.status(500).json({ error: 'Failed to fetch featured news' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
