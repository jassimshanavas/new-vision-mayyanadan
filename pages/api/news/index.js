import { readData, writeData, newsFile } from '../../../lib/data';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      let news = readData(newsFile);
      const { search, category, featured, trending, flashNews } = req.query;
      
      // Ensure all articles have default values for new fields
      news = news.map(article => ({
        ...article,
        flashNews: article.flashNews !== undefined ? article.flashNews : false,
        featured: article.featured !== undefined ? article.featured : false,
        trending: article.trending !== undefined ? article.trending : false,
        views: article.views !== undefined ? article.views : 0
      }));
      
      // Filter by published
      news = news.filter(n => n.published === true);
      
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        news = news.filter(n => 
          n.title.toLowerCase().includes(searchLower) ||
          n.content.toLowerCase().includes(searchLower) ||
          (n.excerpt && n.excerpt.toLowerCase().includes(searchLower)) ||
          (n.category && n.category.toLowerCase().includes(searchLower))
        );
      }
      
      // Category filter
      if (category && category !== 'All') {
        news = news.filter(n => n.category === category);
      }
      
      // Featured filter
      if (featured === 'true') {
        news = news.filter(n => n.featured === true);
      }
      
      // Trending filter
      if (trending === 'true') {
        news = news.filter(n => n.trending === true);
      }
      
      // Flash news filter
      if (flashNews === 'true') {
        news = news.filter(n => n.flashNews === true);
      }
      
      // Sort by date (newest first)
      news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      res.json(news);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  } else if (req.method === 'POST') {
    const { authenticateToken } = require('../../../lib/auth');
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const news = readData(newsFile);
      const newArticle = {
        id: news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1,
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt || req.body.content.substring(0, 150) + '...',
        imageUrl: req.body.imageUrl || '',
        category: req.body.category || 'General',
        author: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: req.body.published !== undefined ? req.body.published : true,
        flashNews: req.body.flashNews || false,
        featured: req.body.featured || false,
        trending: req.body.trending || false,
        views: 0,
        youtubeUrl: req.body.youtubeUrl || '',
        facebookUrl: req.body.facebookUrl || ''
      };
      news.push(newArticle);
      writeData(newsFile, news);
      res.status(201).json(newArticle);
    } catch (error) {
      console.error('Error creating news:', error);
      res.status(500).json({ error: 'Failed to create news' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

