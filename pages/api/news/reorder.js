import { authenticateToken } from '../../../lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check authentication
    const user = authenticateToken(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
        return res.status(500).json({
            error: 'Database not configured. Please set up Supabase credentials.'
        });
    }

    try {
        const { articles } = req.body;

        if (!Array.isArray(articles)) {
            return res.status(400).json({ error: 'Articles must be an array' });
        }

        // Update each article's display_order individually
        // Note: We don't use .single() here because we're updating multiple rows
        const updatePromises = articles.map(({ id, display_order }) =>
            supabaseAdmin
                .from('news')
                .update({
                    display_order,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
        );

        const results = await Promise.all(updatePromises);

        // Check for errors
        const errors = results.filter(r => r.error);
        if (errors.length > 0) {
            console.error('Error updating articles:', errors);
            return res.status(500).json({
                error: 'Failed to update some articles',
                details: errors
            });
        }

        res.status(200).json({
            message: 'News order updated successfully',
            count: articles.length
        });
    } catch (error) {
        console.error('Error reordering news:', error);
        res.status(500).json({ error: 'Failed to reorder news' });
    }
}
