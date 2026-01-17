import { authenticateToken } from '../../../lib/auth';
import { supabaseHelpers, isSupabaseConfigured } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { id } = req.query;

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return res.status(500).json({
      error: 'Database not configured. Please set up Supabase credentials.'
    });
  }

  if (req.method === 'GET') {
    try {
      const article = await supabaseHelpers.getNewsById(parseInt(id));
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      // Increment views if published
      if (article.published) {
        await supabaseHelpers.incrementNewsViews(parseInt(id));
        article.views = (article.views || 0) + 1;
      }

      res.json(article);
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  } else if (req.method === 'PUT') {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // If marking as flash news, unmark other flash news first
      if (req.body.flashNews) {
        const allNews = await supabaseHelpers.getNews({});
        for (const article of allNews) {
          if (article.id !== parseInt(id) && article.flash_news) {
            await supabaseHelpers.updateNews(article.id, { flash_news: false });
          }
        }
      }

      const updates = {
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt,
        image_url: req.body.imageUrl,
        category: req.body.category,
        published: req.body.published,
        flash_news: req.body.flashNews,
        featured: req.body.featured,
        trending: req.body.trending,
        views: req.body.views,
        youtube_url: req.body.youtubeUrl,
        facebook_url: req.body.facebookUrl
      };

      // Remove undefined fields
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      });

      const updated = await supabaseHelpers.updateNews(parseInt(id), updates);
      res.json(updated);
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).json({ error: 'Failed to update article' });
    }
  } else if (req.method === 'DELETE') {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      await supabaseHelpers.deleteNews(parseInt(id));
      res.json({ message: 'Article deleted' });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
