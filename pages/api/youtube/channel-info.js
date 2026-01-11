import { readData, settingsFile } from '../../../lib/data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const settings = readData(settingsFile);
    res.json({
      channelName: 'New Vision Mayyanadan',
      channelUrl: settings.youtubeChannelUrl,
      channelId: settings.youtubeChannelId
    });
  } catch (error) {
    console.error('Error fetching channel info:', error);
    res.status(500).json({ error: 'Failed to fetch channel info' });
  }
}

