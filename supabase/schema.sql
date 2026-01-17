-- Supabase Database Schema for New Vision Mayyanadan
-- Run this SQL in Supabase SQL Editor to create all necessary tables

-- =====================================================
-- TABLE: videos
-- =====================================================
CREATE TABLE IF NOT EXISTS videos (
  id BIGSERIAL PRIMARY KEY,
  video_id TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  featured BOOLEAN DEFAULT FALSE
);

-- =====================================================
-- TABLE: news
-- =====================================================
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'General',
  author TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT TRUE,
  flash_news BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  youtube_url TEXT,
  facebook_url TEXT
);

-- =====================================================
-- TABLE: facebook_posts
-- =====================================================
CREATE TABLE IF NOT EXISTS facebook_posts (
  id BIGSERIAL PRIMARY KEY,
  post_id TEXT,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  image_url TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  featured BOOLEAN DEFAULT FALSE
);

-- =====================================================
-- TABLE: settings
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: users
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE facebook_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - Public Read Access
-- =====================================================

-- Videos: Allow public read
DROP POLICY IF EXISTS "Allow public read for videos" ON videos;
CREATE POLICY "Allow public read for videos" 
  ON videos FOR SELECT 
  TO public 
  USING (true);

-- Videos: Allow public insert (for migration)
DROP POLICY IF EXISTS "Allow public insert for videos" ON videos;
CREATE POLICY "Allow public insert for videos" 
  ON videos FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Videos: Allow public delete (for admin operations)
DROP POLICY IF EXISTS "Allow public delete for videos" ON videos;
CREATE POLICY "Allow public delete for videos" 
  ON videos FOR DELETE 
  TO public 
  USING (true);

-- News: Allow public read
DROP POLICY IF EXISTS "Allow public read for news" ON news;
CREATE POLICY "Allow public read for news" 
  ON news FOR SELECT 
  TO public 
  USING (true);

-- News: Allow public insert
DROP POLICY IF EXISTS "Allow public insert for news" ON news;
CREATE POLICY "Allow public insert for news" 
  ON news FOR INSERT 
  TO public 
  WITH CHECK (true);

-- News: Allow public update
DROP POLICY IF EXISTS "Allow public update for news" ON news;
CREATE POLICY "Allow public update for news" 
  ON news FOR UPDATE 
  TO public 
  USING (true);

-- News: Allow public delete
DROP POLICY IF EXISTS "Allow public delete for news" ON news;
CREATE POLICY "Allow public delete for news" 
  ON news FOR DELETE 
  TO public 
  USING (true);

-- Facebook Posts: Allow public read
DROP POLICY IF EXISTS "Allow public read for facebook_posts" ON facebook_posts;
CREATE POLICY "Allow public read for facebook_posts" 
  ON facebook_posts FOR SELECT 
  TO public 
  USING (true);

-- Facebook Posts: Allow public insert
DROP POLICY IF EXISTS "Allow public insert for facebook_posts" ON facebook_posts;
CREATE POLICY "Allow public insert for facebook_posts" 
  ON facebook_posts FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Facebook Posts: Allow public delete
DROP POLICY IF EXISTS "Allow public delete for facebook_posts" ON facebook_posts;
CREATE POLICY "Allow public delete for facebook_posts" 
  ON facebook_posts FOR DELETE 
  TO public 
  USING (true);

-- Settings: Allow public read
DROP POLICY IF EXISTS "Allow public read for settings" ON settings;
CREATE POLICY "Allow public read for settings" 
  ON settings FOR SELECT 
  TO public 
  USING (true);

-- Settings: Allow public insert/update (upsert for migration)
DROP POLICY IF EXISTS "Allow public upsert for settings" ON settings;
CREATE POLICY "Allow public upsert for settings" 
  ON settings FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);

-- Users: Allow public insert (for migration and registration)
DROP POLICY IF EXISTS "Allow public insert for users" ON users;
CREATE POLICY "Allow public insert for users" 
  ON users FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Users: Allow public select (for authentication)
DROP POLICY IF EXISTS "Allow public select for users" ON users;
CREATE POLICY "Allow public select for users" 
  ON users FOR SELECT 
  TO public 
  USING (true);

-- Users: No public access (handled via service role in API)


-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_videos_added_at ON videos(added_at DESC);
CREATE INDEX IF NOT EXISTS idx_facebook_posts_added_at ON facebook_posts(added_at DESC);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for news table
DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for settings table
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
