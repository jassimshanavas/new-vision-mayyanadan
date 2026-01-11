import { readData, writeData, newsFile } from '../../../lib/data';
import { authenticateToken } from '../../../lib/auth';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const news = readData(newsFile);
      const article = news.find(n => n.id === parseInt(id));
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      // Increment views on read
      if (article.published) {
        article.views = (article.views || 0) + 1;
        writeData(newsFile, news);
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
      const news = readData(newsFile);
      const index = news.findIndex(n => n.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ error: 'Article not found' });
      }

      // If marking as flash news, unmark other flash news
      if (req.body.flashNews && req.body.flashNews !== news[index].flashNews) {
        news.forEach((article, i) => {
          if (i !== index && article.flashNews) {
            article.flashNews = false;
          }
        });
      }

      news[index] = {
        ...news[index],
        title: req.body.title !== undefined ? req.body.title : news[index].title,
        content: req.body.content !== undefined ? req.body.content : news[index].content,
        excerpt: req.body.excerpt !== undefined ? req.body.excerpt : news[index].excerpt,
        imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : news[index].imageUrl,
        category: req.body.category !== undefined ? req.body.category : news[index].category,
        published: req.body.published !== undefined ? req.body.published : news[index].published,
        flashNews: req.body.flashNews !== undefined ? req.body.flashNews : news[index].flashNews,
        featured: req.body.featured !== undefined ? req.body.featured : news[index].featured,
        trending: req.body.trending !== undefined ? req.body.trending : news[index].trending,
        views: req.body.views !== undefined ? req.body.views : (news[index].views || 0),
        youtubeUrl: req.body.youtubeUrl !== undefined ? req.body.youtubeUrl : (news[index].youtubeUrl || ''),
        facebookUrl: req.body.facebookUrl !== undefined ? req.body.facebookUrl : (news[index].facebookUrl || ''),
        updatedAt: new Date().toISOString()
      };

      writeData(newsFile, news);
      res.json(news[index]);
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
      const news = readData(newsFile);
      const filteredNews = news.filter(n => n.id !== parseInt(id));
      writeData(newsFile, filteredNews);
      res.json({ message: 'Article deleted' });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

