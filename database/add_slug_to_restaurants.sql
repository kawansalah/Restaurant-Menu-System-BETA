-- Update restaurants table to add slug field for URL-friendly restaurant names
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);

-- Function to generate slug from restaurant name
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Update existing restaurants with slugs if they don't have them
UPDATE restaurants 
SET slug = generate_slug(name) 
WHERE slug IS NULL;

-- Make slug NOT NULL after setting values
ALTER TABLE restaurants ALTER COLUMN slug SET NOT NULL;

-- Create trigger to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION set_restaurant_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  
  -- Ensure slug uniqueness by appending number if needed
  WHILE EXISTS (SELECT 1 FROM restaurants WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())) LOOP
    NEW.slug := NEW.slug || '-' || floor(random() * 1000)::text;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_restaurant_slug_trigger
  BEFORE INSERT OR UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION set_restaurant_slug();