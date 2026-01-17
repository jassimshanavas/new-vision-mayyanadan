// Server-side Supabase client with service role access
// This bypasses RLS for server-side operations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Supabase credentials. Using fallback file storage.');
}

// Create Supabase client for server-side use
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabaseAdmin !== null;
};

// Transform snake_case to camelCase
const toCamelCase = (str) => {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

// Transform object keys from snake_case to camelCase
const transformToCamelCase = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(transformToCamelCase);

    const transformed = {};
    for (const key in obj) {
        const camelKey = toCamelCase(key);
        transformed[camelKey] = obj[key];
    }
    return transformed;
};

// Helper functions for common operations
export const supabaseHelpers = {
    // Videos
    async getVideos() {
        const { data, error } = await supabaseAdmin
            .from('videos')
            .select('*')
            .order('added_at', { ascending: false });

        if (error) throw error;
        return data.map(transformToCamelCase);
    },

    async createVideo(video) {
        const { data, error } = await supabaseAdmin
            .from('videos')
            .insert(video)
            .select()
            .single();

        if (error) throw error;
        return transformToCamelCase(data);
    },

    async deleteVideo(id) {
        const { error } = await supabaseAdmin
            .from('videos')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // News
    async getNews(filters = {}) {
        let query = supabaseAdmin.from('news').select('*');

        if (filters.published !== undefined) {
            query = query.eq('published', filters.published);
        }
        if (filters.flashNews) {
            query = query.eq('flash_news', true);
        }
        if (filters.featured) {
            query = query.eq('featured', true);
        }
        if (filters.trending) {
            query = query.eq('trending', true);
        }
        if (filters.category) {
            query = query.eq('category', filters.category);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;
        return data.map(transformToCamelCase);
    },

    async getNewsById(id) {
        const { data, error } = await supabaseAdmin
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return transformToCamelCase(data);
    },

    async createNews(news) {
        const { data, error } = await supabaseAdmin
            .from('news')
            .insert(news)
            .select()
            .single();

        if (error) throw error;
        return transformToCamelCase(data);
    },

    async updateNews(id, updates) {
        const { data, error } = await supabaseAdmin
            .from('news')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return transformToCamelCase(data);
    },

    async deleteNews(id) {
        const { error } = await supabaseAdmin
            .from('news')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async incrementNewsViews(id) {
        const { error } = await supabaseAdmin.rpc('increment_views', { news_id: id });
        if (error) {
            // Fallback if RPC doesn't exist
            const news = await this.getNewsById(id);
            await this.updateNews(id, { views: (news.views || 0) + 1 });
        }
    },

    // Facebook Posts
    async getFacebookPosts() {
        const { data, error } = await supabaseAdmin
            .from('facebook_posts')
            .select('*')
            .order('added_at', { ascending: false });

        if (error) throw error;
        return data.map(transformToCamelCase);
    },

    async createFacebookPost(post) {
        const { data, error } = await supabaseAdmin
            .from('facebook_posts')
            .insert(post)
            .select()
            .single();

        if (error) throw error;
        return transformToCamelCase(data);
    },

    async deleteFacebookPost(id) {
        const { error } = await supabaseAdmin
            .from('facebook_posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Settings
    async getSettings() {
        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('*');

        if (error) throw error;

        // Convert array of {key, value} to object
        const settings = {};
        data.forEach(item => {
            settings[item.key] = item.value;
        });
        return settings;
    },

    async updateSettings(settings) {
        // Convert object to array of {key, value}
        const updates = Object.entries(settings).map(([key, value]) => ({
            key,
            value: String(value)
        }));

        // Upsert each setting
        for (const setting of updates) {
            await supabaseAdmin
                .from('settings')
                .upsert(setting, { onConflict: 'key' });
        }
    },

    // Users
    async getUserByUsername(username) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
        return data;
    },

    async createUser(user) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .insert(user)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
