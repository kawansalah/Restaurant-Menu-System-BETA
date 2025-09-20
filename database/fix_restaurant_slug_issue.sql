-- Execute this script in your Supabase SQL editor to fix the restaurant slug issue

-- Step 1: Add slug column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'restaurants' AND column_name = 'slug'
    ) THEN
        ALTER TABLE restaurants ADD COLUMN slug VARCHAR(255) UNIQUE;
        CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug) WHERE is_active = true;
    END IF;
END $$;

-- Step 2: Create the slug generation function if it doesn't exist
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Step 3: Add the missing restaurant that was causing the error
INSERT INTO restaurants (name, slug, description, address, phone, email, website, theme_color, is_active) 
VALUES 
  ('The Rest Caffe', 'the-rest-caffe', 'A cozy coffee shop with amazing atmosphere and great food', '789 Coffee Street, City', '+1234567892', 'info@therestcaffe.com', 'https://therestcaffe.com', '#8B4513', true)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  theme_color = EXCLUDED.theme_color,
  is_active = EXCLUDED.is_active;

-- Step 4: Add more sample restaurants for testing
INSERT INTO restaurants (name, slug, description, address, phone, email, website, theme_color, is_active) 
VALUES 
  ('Main Restaurant', 'main-restaurant', 'Our flagship restaurant location', '123 Main Street, City', '+1234567890', 'info@mainrestaurant.com', 'https://mainrestaurant.com', '#ff6b35', true),
  ('Branch Restaurant', 'branch-restaurant', 'Our second location', '456 Branch Avenue, City', '+1234567891', 'info@branchrestaurant.com', 'https://branchrestaurant.com', '#2563eb', true),
  ('Delicious Bites', 'delicious-bites', 'Modern cuisine with traditional flavors', '321 Taste Avenue, City', '+1234567893', 'info@deliciousbites.com', 'https://deliciousbites.com', '#FF6B35', true),
  ('Ocean View Restaurant', 'ocean-view', 'Fresh seafood with a beautiful ocean view', '654 Seaside Boulevard, City', '+1234567894', 'info@oceanview.com', 'https://oceanview.com', '#1E40AF', true)
ON CONFLICT (slug) DO NOTHING;

-- Step 5: Update existing restaurants without slugs
UPDATE restaurants 
SET slug = generate_slug(name) 
WHERE slug IS NULL OR slug = '';

-- Step 6: Make slug NOT NULL after setting values (only if column exists and has values)
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'restaurants' AND column_name = 'slug'
    ) THEN
        -- Only set NOT NULL if all restaurants have slugs
        IF NOT EXISTS (SELECT 1 FROM restaurants WHERE slug IS NULL OR slug = '') THEN
            ALTER TABLE restaurants ALTER COLUMN slug SET NOT NULL;
        END IF;
    END IF;
END $$;

-- Step 7: Add public access policy for system_settings if it doesn't exist
DO $$
BEGIN
    -- Check if the policy already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'system_settings' 
        AND policyname = 'Public can view system settings for active restaurants'
    ) THEN
        -- Create the policy
        EXECUTE 'CREATE POLICY "Public can view system settings for active restaurants" ON system_settings
            FOR SELECT USING (
                (auth.uid() IS NULL OR NOT EXISTS (
                    SELECT 1 FROM admin_users 
                    WHERE id = auth.uid() AND is_active = true
                )) AND
                setting_type = ''appearance'' AND
                EXISTS (
                    SELECT 1 FROM restaurants r 
                    WHERE r.id = system_settings.restaurant_id 
                    AND r.is_active = true
                )
            )';
    END IF;
END $$;

-- Step 8: Show the restaurants we just created
SELECT id, name, slug, is_active FROM restaurants ORDER BY created_at;