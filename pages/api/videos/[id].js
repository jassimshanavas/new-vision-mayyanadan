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

  if (req.method === 'DELETE') {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      await supabaseHelpers.deleteVideo(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

