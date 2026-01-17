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
      const { search, category, featured, trending, flashNews } = req.query;

      // Build filters
      const filters = { published: true };

      if (category && category !== 'All') {
        filters.category = category;
      }
      if (featured === 'true') {
        filters.featured = true;
      }
      if (trending === 'true') {
        filters.trending = true;
      }
      if (flashNews === 'true') {
        filters.flashNews = true;
      }

      let news = await supabaseHelpers.getNews(filters);

      // Search filter (client-side for now, can be moved to SQL later)
      if (search) {
        const searchLower = search.toLowerCase();
        news = news.filter(n =>
          n.title.toLowerCase().includes(searchLower) ||
          n.content.toLowerCase().includes(searchLower) ||
          (n.excerpt && n.excerpt.toLowerCase().includes(searchLower)) ||
          (n.category && n.category.toLowerCase().includes(searchLower))
        );
      }

      res.json(news);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  } else if (req.method === 'POST') {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const newArticle = {
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt || req.body.content.substring(0, 150) + '...',
        image_url: req.body.imageUrl || '',
        category: req.body.category || 'General',
        author: user.username,
        published: req.body.published !== undefined ? req.body.published : true,
        flash_news: req.body.flashNews || false,
        featured: req.body.featured || false,
        trending: req.body.trending || false,
        views: 0,
        youtube_url: req.body.youtubeUrl || '',
        facebook_url: req.body.facebookUrl || ''
      };

      const created = await supabaseHelpers.createNews(newArticle);
      res.status(201).json(created);
    } catch (error) {
      console.error('Error creating news:', error);
      res.status(500).json({ error: 'Failed to create news' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
