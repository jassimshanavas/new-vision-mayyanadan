import { readData, newsFile } from '../../../../lib/data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const news = readData(newsFile);
    const currentArticle = news.find(n => n.id === parseInt(id));
    if (!currentArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    const related = news
      .filter(n => 
        n.id !== currentArticle.id &&
        n.published &&
        (n.category === currentArticle.category || 
         n.title.toLowerCase().split(' ').some(word => 
           currentArticle.title.toLowerCase().includes(word) && word.length > 4
         ))
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
    
    res.json(related);
  } catch (error) {
    console.error('Error fetching related news:', error);
    res.status(500).json({ error: 'Failed to fetch related news' });
  }
}

