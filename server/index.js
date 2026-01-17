const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize data files
const initDataFile = (filename, defaultData) => {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
  return filePath;
};

const newsFile = initDataFile('news.json', []);
const videosFile = initDataFile('videos.json', []);
const facebookPostsFile = initDataFile('facebookPosts.json', []);
const settingsFile = initDataFile('settings.json', {
  youtubeChannelId: '@newvisionmayyanadan',
  facebookPageId: '61577465543293',
  facebookPageUrl: 'https://www.facebook.com/profile.php?id=61577465543293',
  youtubeChannelUrl: 'https://www.youtube.com/@newvisionmayyanadan',
  siteTitle: 'New Vision Mayyanadan',
  siteDescription: 'Local news reporting from Mayyanadan',
  contactEmail: '',
  contactPhone: ''
});

// Helper functions
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Initialize admin user (default password: admin123)
const usersFile = initDataFile('users.json', []);
const users = readData(usersFile);
if (users.length === 0) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  users.push({
    id: 1,
    username: 'admin',
    email: 'admin@newvision.com',
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date().toISOString()
  });
  writeData(usersFile, users);
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readData(usersFile);
    const user = users.find(u => u.username === username || u.email === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// News routes
app.get('/api/news', (req, res) => {
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

    // Sort by display order (ascending, lower numbers first)
    news.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get flash news - MUST come before /api/news/:id route
app.get('/api/news/flash', (req, res) => {
  try {
    const news = readData(newsFile);
    const flashNews = news.find(n => n.flashNews && n.published);
    res.json(flashNews || null);
  } catch (error) {
    console.error('Error fetching flash news:', error);
    res.status(500).json({ error: 'Failed to fetch flash news' });
  }
});

// Get featured news - MUST come before /api/news/:id route
app.get('/api/news/featured', (req, res) => {
  try {
    const news = readData(newsFile);
    const featured = news.filter(n => n.featured && n.published)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(featured);
  } catch (error) {
    console.error('Error fetching featured news:', error);
    res.status(500).json({ error: 'Failed to fetch featured news' });
  }
});

// Get trending news - MUST come before /api/news/:id route
app.get('/api/news/trending', (req, res) => {
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
});

// Increment article views
app.post('/api/news/:id/view', (req, res) => {
  const news = readData(newsFile);
  const index = news.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }
  news[index].views = (news[index].views || 0) + 1;
  writeData(newsFile, news);
  res.json({ views: news[index].views });
});

app.get('/api/news/:id', (req, res) => {
  const news = readData(newsFile);
  const article = news.find(n => n.id === parseInt(req.params.id));
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Increment views on read
  if (article.published) {
    article.views = (article.views || 0) + 1;
    writeData(newsFile, news);
  }

  res.json(article);
});

// Get related news (same category, excluding current article)
app.get('/api/news/:id/related', (req, res) => {
  const news = readData(newsFile);
  const currentArticle = news.find(n => n.id === parseInt(req.params.id));
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
});

app.post('/api/news', authenticateToken, (req, res) => {
  const news = readData(newsFile);

  // Calculate the highest display_order and add 1 for new article
  const maxDisplayOrder = news.length > 0
    ? Math.max(...news.map(n => n.display_order || 0))
    : -1;

  const newArticle = {
    id: news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1,
    title: req.body.title,
    content: req.body.content,
    excerpt: req.body.excerpt || req.body.content.substring(0, 150) + '...',
    imageUrl: req.body.imageUrl || '',
    category: req.body.category || 'General',
    author: req.user.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: req.body.published !== undefined ? req.body.published : true,
    flashNews: req.body.flashNews || false,
    featured: req.body.featured || false,
    trending: req.body.trending || false,
    views: 0,
    youtubeUrl: req.body.youtubeUrl || '',
    facebookUrl: req.body.facebookUrl || '',
    display_order: maxDisplayOrder + 1
  };
  news.push(newArticle);
  writeData(newsFile, news);
  res.status(201).json(newArticle);
});

app.put('/api/news/:id', authenticateToken, (req, res) => {
  const news = readData(newsFile);
  const index = news.findIndex(n => n.id === parseInt(req.params.id));
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
    display_order: req.body.display_order !== undefined ? req.body.display_order : (news[index].display_order || 0),
    updatedAt: new Date().toISOString()
  };

  writeData(newsFile, news);
  res.json(news[index]);
});

// Reorder news articles (bulk update display_order)
app.put('/api/news/reorder', authenticateToken, (req, res) => {
  try {
    const { articles } = req.body; // Expecting array of { id, display_order }

    if (!Array.isArray(articles)) {
      return res.status(400).json({ error: 'Articles must be an array' });
    }

    const news = readData(newsFile);

    // Update display_order for each article
    articles.forEach(({ id, display_order }) => {
      const index = news.findIndex(n => n.id === parseInt(id));
      if (index !== -1) {
        news[index].display_order = display_order;
        news[index].updatedAt = new Date().toISOString();
      }
    });

    writeData(newsFile, news);
    res.json({ message: 'News order updated successfully', count: articles.length });
  } catch (error) {
    console.error('Error reordering news:', error);
    res.status(500).json({ error: 'Failed to reorder news' });
  }
});

app.delete('/api/news/:id', authenticateToken, (req, res) => {
  const news = readData(newsFile);
  const filteredNews = news.filter(n => n.id !== parseInt(req.params.id));
  writeData(newsFile, filteredNews);
  res.json({ message: 'Article deleted' });
});

// YouTube videos routes
app.get('/api/videos', (req, res) => {
  const videos = readData(videosFile);
  res.json(videos.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)));
});

app.post('/api/videos', authenticateToken, (req, res) => {
  const videos = readData(videosFile);
  const videoId = extractYouTubeId(req.body.url);
  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const newVideo = {
    id: videos.length > 0 ? Math.max(...videos.map(v => v.id)) + 1 : 1,
    videoId: videoId,
    url: req.body.url,
    title: req.body.title || 'Untitled Video',
    description: req.body.description || '',
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, // hqdefault is more reliable than maxresdefault
    addedAt: new Date().toISOString(),
    featured: req.body.featured || false
  };

  videos.push(newVideo);
  writeData(videosFile, videos);
  res.status(201).json(newVideo);
});

// Extract YouTube video details (must be before /api/videos/:id route)
app.post('/api/videos/extract-details', authenticateToken, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Use YouTube oEmbed API to get title
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    let title = '';
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    try {
      const oEmbedResponse = await axios.get(oEmbedUrl);
      title = oEmbedResponse.data.title || '';
      if (oEmbedResponse.data.thumbnail_url) {
        thumbnailUrl = oEmbedResponse.data.thumbnail_url;
      }
    } catch (error) {
      console.error('Error fetching oEmbed data:', error);
      // Continue without title if oEmbed fails
    }

    // Try to get description from YouTube video page
    let description = '';
    try {
      const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const videoPageResponse = await axios.get(videoPageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // Try to extract description from meta tags
      const metaDescriptionMatch = videoPageResponse.data.match(/<meta name="description" content="([^"]+)"/);
      if (metaDescriptionMatch && metaDescriptionMatch[1]) {
        description = metaDescriptionMatch[1];
      } else {
        // Try to extract from JSON-LD structured data
        const jsonLdMatch = videoPageResponse.data.match(/"description":"([^"]+)"/);
        if (jsonLdMatch && jsonLdMatch[1]) {
          description = jsonLdMatch[1].replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
            return String.fromCharCode(parseInt(code, 16));
          });
        }
      }
    } catch (error) {
      console.error('Error fetching video page for description:', error);
      // Description extraction failed, continue without it
    }

    res.json({
      title: title || 'Untitled Video',
      description: description || '',
      thumbnailUrl: thumbnailUrl
    });
  } catch (error) {
    console.error('Error extracting video details:', error);
    res.status(500).json({ error: 'Failed to extract video details' });
  }
});

// Extract thumbnail image URL from YouTube or Facebook URL
app.post('/api/news/extract-image', authenticateToken, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let thumbnailUrl = null;
    let sourceType = null;

    // Check if it's a YouTube URL
    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      sourceType = 'youtube';
      // Try maxresdefault first (highest quality), fallback to hqdefault
      thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

      // Verify if maxresdefault exists by checking with oEmbed
      try {
        const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const oEmbedResponse = await axios.get(oEmbedUrl);
        if (oEmbedResponse.data.thumbnail_url) {
          thumbnailUrl = oEmbedResponse.data.thumbnail_url;
        }
      } catch (error) {
        // If maxresdefault doesn't exist, use hqdefault
        thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      }
    }
    // Check if it's a Facebook URL
    else if (url.includes('facebook.com') || url.includes('fb.com') || url.includes('fb.watch')) {
      sourceType = 'facebook';

      // Try multiple methods to extract Facebook thumbnail

      // Method 1: Try Facebook oEmbed API for videos
      if (url.includes('video') || url.includes('watch')) {
        try {
          const oEmbedUrl = `https://www.facebook.com/plugins/video/oembed.json?url=${encodeURIComponent(url)}`;
          const oEmbedResponse = await axios.get(oEmbedUrl, {
            timeout: 5000,
            validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
          });
          if (oEmbedResponse.status === 200 && oEmbedResponse.data && oEmbedResponse.data.thumbnail_url) {
            thumbnailUrl = oEmbedResponse.data.thumbnail_url;
          }
        } catch (error) {
          console.error('Facebook video oEmbed error:', error.message);
        }
      }

      // Method 2: Try to extract photo ID from various Facebook URL formats
      if (!thumbnailUrl) {
        let photoId = null;

        // Format 1: https://www.facebook.com/photo?fbid=...
        const fbidMatch = url.match(/[?&](?:fbid|story_fbid)=(\d+)/);
        if (fbidMatch) {
          photoId = fbidMatch[1];
        }

        // Format 2: https://www.facebook.com/photo.php?fbid=...
        if (!photoId) {
          const photoPhpMatch = url.match(/photo\.php\?.*[?&]fbid=(\d+)/);
          if (photoPhpMatch) {
            photoId = photoPhpMatch[1];
          }
        }

        // Format 3: https://www.facebook.com/permalink.php?story_fbid=...
        if (!photoId) {
          const permalinkMatch = url.match(/permalink\.php\?.*[?&]story_fbid=(\d+)/);
          if (permalinkMatch) {
            photoId = permalinkMatch[1];
          }
        }

        // Format 4: https://www.facebook.com/posts/ or /photos/
        if (!photoId) {
          const postsMatch = url.match(/\/(?:posts|photos)\/(\d+)/);
          if (postsMatch) {
            photoId = postsMatch[1];
          }
        }

        // If we found a photo ID, try to get thumbnail using Graph API
        if (photoId) {
          // Method 2a: Try Graph API with redirect=false (returns JSON with URL)
          try {
            const graphUrl = `https://graph.facebook.com/${photoId}/picture?type=large&redirect=false`;
            const graphResponse = await axios.get(graphUrl, {
              timeout: 5000,
              validateStatus: (status) => status < 500,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });

            if (graphResponse.status === 200) {
              if (graphResponse.data && graphResponse.data.data && graphResponse.data.data.url) {
                thumbnailUrl = graphResponse.data.data.url;
              } else if (graphResponse.data && graphResponse.data.picture) {
                thumbnailUrl = graphResponse.data.picture;
              } else if (graphResponse.data && graphResponse.data.url) {
                thumbnailUrl = graphResponse.data.url;
              }
            } else if (graphResponse.status === 400 || graphResponse.status === 403) {
              // API returned error - likely requires access token or privacy restrictions
              console.log(`Facebook Graph API returned ${graphResponse.status} for photo ID ${photoId} - may require access token`);
            }
          } catch (error) {
            console.error('Facebook Graph API (redirect=false) error:', error.message);
            if (error.response) {
              console.error('Response status:', error.response.status);
              console.error('Response data:', error.response.data);
            }
          }

          // Method 2b: Try Graph API without redirect=false (redirects to image directly)
          // Note: This may not work for all photos due to privacy settings
          if (!thumbnailUrl) {
            try {
              // Try to verify if the redirect URL works by checking response status
              const graphRedirectUrl = `https://graph.facebook.com/${photoId}/picture?type=large`;
              const redirectResponse = await axios.head(graphRedirectUrl, {
                timeout: 5000,
                maxRedirects: 0,
                validateStatus: (status) => status >= 200 && status < 400
              });

              // If redirect works, use the redirect URL (axios will follow it)
              if (redirectResponse.status >= 300 && redirectResponse.status < 400 && redirectResponse.headers.location) {
                thumbnailUrl = redirectResponse.headers.location;
              } else {
                // Use the Graph API URL directly (browser will handle redirect)
                thumbnailUrl = graphRedirectUrl;
              }
            } catch (error) {
              // If head request fails, still try using the URL (might work in browser)
              if (!thumbnailUrl) {
                thumbnailUrl = `https://graph.facebook.com/${photoId}/picture?type=large`;
              }
            }
          }
        }
      }

      // Method 3: Try page post oEmbed (for posts)
      if (!thumbnailUrl && !url.includes('photo')) {
        try {
          const oEmbedUrl = `https://www.facebook.com/plugins/post/oembed.json?url=${encodeURIComponent(url)}`;
          const oEmbedResponse = await axios.get(oEmbedUrl, {
            timeout: 5000,
            validateStatus: (status) => status < 500
          });
          if (oEmbedResponse.status === 200 && oEmbedResponse.data && oEmbedResponse.data.thumbnail_url) {
            thumbnailUrl = oEmbedResponse.data.thumbnail_url;
          }
        } catch (error) {
          console.error('Facebook post oEmbed error:', error.message);
        }
      }

      // If still no thumbnail, provide helpful error message
      if (!thumbnailUrl) {
        // Try to extract photo ID for better error message
        let photoId = null;
        const fbidMatch = url.match(/[?&](?:fbid|story_fbid)=(\d+)/);
        if (fbidMatch) photoId = fbidMatch[1];

        return res.status(400).json({
          error: 'Could not extract thumbnail from Facebook URL. This may be due to:\n' +
            '1. The post/photo privacy settings (private posts require authentication)\n' +
            '2. Facebook API limitations (requires access token for many requests)\n' +
            '3. Invalid or unsupported URL format\n\n' +
            'Recommended solutions:\n' +
            '• Right-click on the Facebook image → "Copy image address" → Paste that URL\n' +
            '• Use a YouTube video URL instead (thumbnails work reliably)\n' +
            '• Upload the image to an image hosting service (Imgur, etc.)' +
            (photoId ? `\n\nDetected Photo ID: ${photoId} (may require Facebook access token)` : '')
        });
      }
    } else {
      return res.status(400).json({
        error: 'Unsupported URL type. Please provide a YouTube video URL or Facebook post/photo URL.'
      });
    }

    if (!thumbnailUrl) {
      return res.status(400).json({
        error: 'Could not extract thumbnail from the provided URL. Please ensure it is a valid YouTube video URL or Facebook post/photo URL.',
        url: url
      });
    }

    res.json({
      thumbnailUrl: thumbnailUrl,
      sourceType: sourceType,
      originalUrl: url
    });
  } catch (error) {
    console.error('Error extracting image URL:', error);
    res.status(500).json({
      error: 'Failed to extract image URL: ' + error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

app.delete('/api/videos/:id', authenticateToken, (req, res) => {
  const videos = readData(videosFile);
  const filteredVideos = videos.filter(v => v.id !== parseInt(req.params.id));
  writeData(videosFile, filteredVideos);
  res.json({ message: 'Video deleted' });
});

// Facebook Posts routes
app.get('/api/facebook-posts', (req, res) => {
  try {
    const posts = readData(facebookPostsFile);
    res.json(posts.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)));
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    res.status(500).json({ error: 'Failed to fetch Facebook posts' });
  }
});

app.post('/api/facebook-posts', authenticateToken, (req, res) => {
  try {
    const posts = readData(facebookPostsFile);
    const postId = extractFacebookPostId(req.body.url);

    if (!req.body.url || !req.body.url.includes('facebook.com')) {
      return res.status(400).json({ error: 'Invalid Facebook URL' });
    }

    const newPost = {
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      postId: postId,
      url: req.body.url,
      title: req.body.title || 'Facebook Post',
      description: req.body.description || '',
      addedAt: new Date().toISOString(),
      featured: req.body.featured || false
    };

    posts.push(newPost);
    writeData(facebookPostsFile, posts);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error adding Facebook post:', error);
    res.status(500).json({ error: 'Failed to add Facebook post' });
  }
});

app.delete('/api/facebook-posts/:id', authenticateToken, (req, res) => {
  try {
    const posts = readData(facebookPostsFile);
    const filteredPosts = posts.filter(p => p.id !== parseInt(req.params.id));
    writeData(facebookPostsFile, filteredPosts);
    res.json({ message: 'Facebook post deleted' });
  } catch (error) {
    console.error('Error deleting Facebook post:', error);
    res.status(500).json({ error: 'Failed to delete Facebook post' });
  }
});

// Settings routes
app.get('/api/settings', (req, res) => {
  const settings = readData(settingsFile);
  res.json(settings);
});

app.put('/api/settings', authenticateToken, (req, res) => {
  const settings = readData(settingsFile);
  const updatedSettings = { ...settings, ...req.body };
  writeData(settingsFile, updatedSettings);
  res.json(updatedSettings);
});

// Helper function to extract YouTube video ID
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper function to extract Facebook post ID from URL
function extractFacebookPostId(url) {
  try {
    // Handle various Facebook URL formats
    const urlObj = new URL(url);

    // Try to get story_fbid from query params
    const storyFbid = urlObj.searchParams.get('story_fbid');
    if (storyFbid) {
      return storyFbid;
    }

    // Try to extract from pathname (e.g., /posts/123456789)
    const pathMatch = url.match(/\/posts\/(\d+)/);
    if (pathMatch) {
      return pathMatch[1];
    }

    // If URL contains the post ID pattern, extract it
    const idMatch = url.match(/[?&](story_fbid|id)=(\d+)/);
    if (idMatch) {
      return idMatch[2];
    }

    // Return the full URL if we can't extract a specific ID
    return url;
  } catch (error) {
    // If URL parsing fails, return the URL as-is
    return url;
  }
}

// Fetch YouTube channel info (requires API key in production)
app.get('/api/youtube/channel-info', async (req, res) => {
  try {
    const settings = readData(settingsFile);
    // This would require YouTube API key in production
    // For now, return basic info
    res.json({
      channelName: 'New Vision Mayyanadan',
      channelUrl: settings.youtubeChannelUrl,
      channelId: settings.youtubeChannelId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch channel info' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

