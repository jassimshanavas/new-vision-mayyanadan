const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
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

// Initialize admin user (default password: admin123)
const usersFile = initDataFile('users.json', []);
const users = JSON.parse(fs.existsSync(usersFile) ? fs.readFileSync(usersFile, 'utf8') : '[]');
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
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Helper functions
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Helper function to extract YouTube video ID
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper function to extract Facebook post ID from URL
function extractFacebookPostId(url) {
  try {
    const urlObj = new URL(url);
    const storyFbid = urlObj.searchParams.get('story_fbid');
    if (storyFbid) {
      return storyFbid;
    }
    const pathMatch = url.match(/\/posts\/(\d+)/);
    if (pathMatch) {
      return pathMatch[1];
    }
    const idMatch = url.match(/[?&](story_fbid|id)=(\d+)/);
    if (idMatch) {
      return idMatch[2];
    }
    return url;
  } catch (error) {
    return url;
  }
}

module.exports = {
  newsFile,
  videosFile,
  facebookPostsFile,
  settingsFile,
  usersFile,
  readData,
  writeData,
  extractYouTubeId,
  extractFacebookPostId,
};

