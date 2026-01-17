-- Migration: Add display_order column to news table
-- Date: 2026-01-17
-- Description: Adds display_order column to enable manual reordering of news articles

-- Add display_order column with default value
ALTER TABLE news ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Set initial display_order values based on created_at (newest = 0, oldest = highest)
-- This maintains the current display order (newest first)
WITH ordered_news AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 AS new_order
  FROM news
)
UPDATE news
SET display_order = ordered_news.new_order
FROM ordered_news
WHERE news.id = ordered_news.id;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_news_display_order ON news(display_order ASC);

-- Verify the migration
SELECT id, title, created_at, display_order 
FROM news 
ORDER BY display_order ASC 
LIMIT 10;
