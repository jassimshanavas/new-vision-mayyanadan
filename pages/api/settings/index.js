import { readData, writeData, settingsFile } from '../../../lib/data';
import { authenticateToken } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const settings = readData(settingsFile);
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  } else if (req.method === 'PUT') {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const settings = readData(settingsFile);
      const updatedSettings = { ...settings, ...req.body };
      writeData(settingsFile, updatedSettings);
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

