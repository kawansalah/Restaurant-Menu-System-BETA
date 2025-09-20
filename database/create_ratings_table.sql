-- Create ratings table for individual menu item ratings
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_ratings_menu_item_id ON ratings(menu_item_id);
CREATE INDEX idx_ratings_created_at ON ratings(created_at);

-- Add constraint to prevent spamming (optional - can be adjusted based on needs)
-- This allows same user agent to rate different items but prevents multiple ratings of same item
CREATE UNIQUE INDEX idx_ratings_unique_user_item ON ratings(menu_item_id, user_agent) WHERE user_agent IS NOT NULL;

-- Add RLS (Row Level Security) policies for public access
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to ratings
CREATE POLICY "Allow public read access to ratings" ON ratings
  FOR SELECT USING (true);

-- Allow public insert access to ratings (for submitting new ratings)
CREATE POLICY "Allow public insert access to ratings" ON ratings
  FOR INSERT WITH CHECK (true);