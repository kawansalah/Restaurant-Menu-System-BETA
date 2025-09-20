-- Restaurants table - Master table for multi-restaurant support
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  logo_url TEXT,
  theme_color VARCHAR(7) DEFAULT '#ff6b35',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
); -- ✅

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('super_admin', 'admin', 'manager', 'staff')) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(restaurant_id, username),
  UNIQUE(restaurant_id, email)
); -- ✅


CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
); -- ✅

CREATE TABLE admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(20) NOT NULL,
  permission VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, permission)
);

CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id VARCHAR(100),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
); -- ✅

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  label_ku VARCHAR(255) NOT NULL,
  label_ar VARCHAR(255) NOT NULL,
  label_en VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
); -- ✅

CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  label_ku VARCHAR(255) NOT NULL,
  label_ar VARCHAR(255) NOT NULL,
  label_en VARCHAR(255) NOT NULL,
  image_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
); -- ✅

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  name_ku VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ku TEXT,
  description_ar TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  cart_additions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
); -- ✅

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
); -- ✅

-- Create system_settings table for storing application configuration
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    setting_type VARCHAR(50) NOT NULL,
    logo_url TEXT, -- Legacy logo field for backward compatibility
    light_logo_url TEXT, -- Logo for light theme
    dark_logo_url TEXT, -- Logo for dark theme
    theme_color VARCHAR(7) DEFAULT '#ff6b35',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, setting_type)
);


-- Enable RLS on all admin tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;-- ✅
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;-- ✅
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;-- ✅
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;-- ✅
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;-- ✅
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;-- ✅
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;-- ✅
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;-- ✅
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;-- ✅
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY; -- ✅



-- Admin users can view all admin users ------------------------------------------------------------------------- admin users policys -- ✅

-- Method 1: Using a function approach (Recommended)
-- First, create a function to check admin status
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id AND is_active = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND role = 'super_admin' 
    AND is_active = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_admin_or_super(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND role IN ('super_admin', 'admin') 
    AND is_active = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_manager_admin_or_super(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND role IN ('super_admin', 'admin', 'manager') 
    AND is_active = true
  );
END;
$$;

-- Function to get user's restaurant ID
CREATE OR REPLACE FUNCTION get_user_restaurant_id(user_id UUID DEFAULT auth.uid())
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT restaurant_id FROM admin_users 
    WHERE id = user_id AND is_active = true
  );
END;
$$;

-- Function to check if user belongs to specific restaurant
CREATE OR REPLACE FUNCTION user_belongs_to_restaurant(restaurant_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND admin_users.restaurant_id = user_belongs_to_restaurant.restaurant_id
    AND is_active = true
  );
END;
$$;


-- Allow admins to select/update/delete their own entry
create policy "Admins can manage their row"
on admin_users
for all
using (auth.uid() = id);


-- Super admin comprehensive management policy
CREATE POLICY "Super admins can manage everything" ON admin_users
  FOR ALL USING (is_super_admin(auth.uid()));


-- Now create the policies using these functions
CREATE POLICY "Admin users can view admin users in same restaurant" ON admin_users
  FOR SELECT USING (
    (is_admin_user(auth.uid()) AND 
     user_belongs_to_restaurant(restaurant_id, auth.uid()) AND
     role != 'super_admin') OR
    is_super_admin(auth.uid())
  );


CREATE POLICY "Super admins can create admin users" ON admin_users
  FOR INSERT WITH CHECK (is_super_admin(auth.uid()));
  

CREATE POLICY "Admins can create admin, manager, staff users in same restaurant" ON admin_users
  FOR INSERT WITH CHECK (
    is_admin_or_super(auth.uid()) AND 
    user_belongs_to_restaurant(restaurant_id, auth.uid()) AND
    role IN ('admin', 'manager', 'staff')
  );


CREATE POLICY "Super admins and admins can update admin users in same restaurant" ON admin_users
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR
    (is_admin_or_super(auth.uid()) AND 
     user_belongs_to_restaurant(restaurant_id, auth.uid()) AND
     role IN ('admin', 'manager', 'staff'))
  );


CREATE POLICY "Super admins can delete admin users" ON admin_users
  FOR DELETE USING (is_super_admin(auth.uid()));


CREATE POLICY "Admins can delete admin, manager, staff users in same restaurant" ON admin_users
  FOR DELETE USING (
    is_admin_or_super(auth.uid()) AND 
    user_belongs_to_restaurant(restaurant_id, auth.uid()) AND
    role IN ('admin', 'manager', 'staff')
  );


-- Admin users can view all admin users ------------------------------------------------------------------------- admin users policys -- ✅






-- admin_sessions ---------------------------------------------------------------------------------------------- admin_sessions policys -- ✅
  -- Users can view their own sessions
CREATE POLICY "Users can view their own sessions" ON admin_sessions
  FOR SELECT USING (admin_user_id = auth.uid());

-- Users can insert their own sessions
CREATE POLICY "Users can create their own sessions" ON admin_sessions
  FOR INSERT WITH CHECK (admin_user_id = auth.uid());

-- Users can update their own sessions
CREATE POLICY "Users can update their own sessions" ON admin_sessions
  FOR UPDATE USING (admin_user_id = auth.uid());

-- Super admins can view all sessions
CREATE POLICY "Super admins can view all sessions" ON admin_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );
-- admin_sessions ---------------------------------------------------------------------------------------------- admin_sessions policys -- ✅ 




-- categories ---------------------------------------------------------------------------------------------- categories policys -- ✅ 

  -- All authenticated admin users can view categories in their restaurant
CREATE POLICY "Admin users can view categories in their restaurant" ON categories
  FOR SELECT USING (
     is_manager_admin_or_super(auth.uid()) AND
     user_belongs_to_restaurant(restaurant_id, auth.uid())
  );

-- Admins and above can manage categories in their restaurant
CREATE POLICY "Admins can manage categories in their restaurant" ON categories
  FOR ALL USING (
      is_admin_or_super(auth.uid()) AND
      user_belongs_to_restaurant(restaurant_id, auth.uid())
  );
-- categories ---------------------------------------------------------------------------------------------- categories policys -- ✅ 




-- subcategories ---------------------------------------------------------------------------------------------- subcategories policys -- ✅ 
-- All authenticated admin users can view subcategories in their restaurant
CREATE POLICY "(manager, admin, super_admin) can view subcategories in their restaurant" ON subcategories
  FOR SELECT USING (
     is_manager_admin_or_super(auth.uid()) AND
     user_belongs_to_restaurant(restaurant_id, auth.uid())
  );

-- Admins and above can manage subcategories in their restaurant
CREATE POLICY "Admins can manage subcategories in their restaurant" ON subcategories
  FOR ALL USING (
     is_admin_or_super(auth.uid()) AND
     user_belongs_to_restaurant(restaurant_id, auth.uid())
  );
-- subcategories ---------------------------------------------------------------------------------------------- subcategories policys -- ✅ 



-- menu_items ---------------------------------------------------------------------------------------------- menu_items policys -- ✅ 
-- All authenticated admin users can view menu items in their restaurant
CREATE POLICY "(manager, admin, super_admin) users can view menu items in their restaurant" ON menu_items
  FOR SELECT USING (
     is_manager_admin_or_super(auth.uid()) AND
     user_belongs_to_restaurant(restaurant_id, auth.uid())
  );

-- All admin roles can manage menu items in their restaurant
CREATE POLICY "(admin, super_admin) can manage menu items in their restaurant" ON menu_items
  FOR ALL USING (
      is_admin_or_super(auth.uid()) AND
      user_belongs_to_restaurant(restaurant_id, auth.uid())
  );


  -- Function to increment view count❌
CREATE OR REPLACE FUNCTION increment_view_count(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE menu_items 
  SET views_count = views_count + 1,
      updated_at = NOW()
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

-- menu_items ---------------------------------------------------------------------------------------------- menu_items policys -- ✅ 




-- feedback ---------------------------------------------------------------------------------------------- feedback policys -- ✅ 
  -- All authenticated admin users can view feedback for their restaurant
CREATE POLICY "(manager, admin, super_admin) users can view feedback for their restaurant" ON feedback
  FOR SELECT USING (
      is_manager_admin_or_super(auth.uid()) AND
      user_belongs_to_restaurant(restaurant_id, auth.uid())
  );

-- Anyone can insert feedback (public form) - restaurant_id must be provided
CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT WITH CHECK (restaurant_id IS NOT NULL);

-- Only admins and above can delete feedback for their restaurant
CREATE POLICY "(admin, super_admin) can delete feedback for their restaurant" ON feedback
  FOR DELETE USING (
      is_admin_or_super(auth.uid()) AND
      user_belongs_to_restaurant(restaurant_id, auth.uid())
  );
-- feedback ---------------------------------------------------------------------------------------------- feedback policys -- ✅





-- admin_activity_logs ---------------------------------------------------------------------------------------------- admin_activity_logs policys -- ❌

  -- All authenticated admin users can view activity logs
CREATE POLICY "Admin users can view activity logs" ON admin_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- System can insert activity logs
CREATE POLICY "System can insert activity logs" ON admin_activity_logs
  FOR INSERT WITH CHECK (true);

-- Only super admins can delete activity logs
CREATE POLICY "Super admins can delete activity logs" ON admin_activity_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );
-- admin_activity_logs ---------------------------------------------------------------------------------------------- admin_activity_logs policys -- ❌





-- admin_permissions ---------------------------------------------------------------------------------------------- admin_permissions policys -- ❌
  -- All authenticated admin users can view permissions
CREATE POLICY "Admin users can view permissions" ON admin_permissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- Only super admins can manage permissions
CREATE POLICY "Super admins can manage permissions" ON admin_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );
  -- admin_permissions ---------------------------------------------------------------------------------------------- admin_permissions policys -- ❌



-- system_settings ---------------------------------------------------------------------------------------------- system_settings policys -- ✅

-- Performance Indexes for restaurant_id columns
CREATE INDEX IF NOT EXISTS idx_admin_users_restaurant_id ON admin_users(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_restaurant_id ON subcategories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_feedback_restaurant_id ON feedback(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_restaurant_id ON system_settings(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug) WHERE is_active = true;

-- Composite indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_users_restaurant_role ON admin_users(restaurant_id, role) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_created ON categories(restaurant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_category ON menu_items(restaurant_id, category_id) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_feedback_restaurant_created ON feedback(restaurant_id, created_at);

-- Insert sample restaurant data
INSERT INTO restaurants (id, name, slug, description, address, phone, email, website, theme_color) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Main Restaurant', 'main-restaurant', 'Our flagship restaurant location', '123 Main Street, City', '+1234567890', 'info@mainrestaurant.com', 'https://mainrestaurant.com', '#ff6b35'),
  ('00000000-0000-0000-0000-000000000002', 'Branch Restaurant', 'branch-restaurant', 'Our second location', '456 Branch Avenue, City', '+1234567891', 'info@branchrestaurant.com', 'https://branchrestaurant.com', '#2563eb')
ON CONFLICT (id) DO NOTHING;
-- Policy: Only authenticated admin users can read settings for their restaurant
CREATE POLICY "(admin, super_admin) users can read system settings for their restaurant" ON system_settings
    FOR SELECT
    USING (
        is_admin_or_super(auth.uid()) AND
        user_belongs_to_restaurant(restaurant_id, auth.uid())
    );

-- Policy: Only authenticated admin users can insert settings for their restaurant
CREATE POLICY "(admin, super_admin) users can insert system settings for their restaurant" ON system_settings
    FOR INSERT
    WITH CHECK (
       is_admin_or_super(auth.uid()) AND
       user_belongs_to_restaurant(restaurant_id, auth.uid())
    );

-- Policy: Only authenticated admin users can update settings for their restaurant
CREATE POLICY "(admin, super_admin) users can update system settings for their restaurant" ON system_settings
    FOR UPDATE
    USING (
       is_admin_or_super(auth.uid()) AND
       user_belongs_to_restaurant(restaurant_id, auth.uid())
    )
    WITH CHECK (
        is_admin_or_super(auth.uid()) AND
        user_belongs_to_restaurant(restaurant_id, auth.uid())
    );

-- Policy: Only authenticated admin users can delete settings for their restaurant
CREATE POLICY "(admin, super_admin) users can delete system settings for their restaurant" ON system_settings
    FOR DELETE
    USING (
       is_admin_or_super(auth.uid()) AND
       user_belongs_to_restaurant(restaurant_id, auth.uid())
    );

-- Policy: Allow public to view system settings for logo access
CREATE POLICY "Public can view system settings for active restaurants" ON system_settings
    FOR SELECT USING (
        -- Allow both unauthenticated users and non-admin users
        (auth.uid() IS NULL OR is_not_admin_user(auth.uid())) AND
        setting_type = 'appearance' AND
        EXISTS (
            SELECT 1 FROM restaurants r 
            WHERE r.id = system_settings.restaurant_id 
            AND r.is_active = true
        )
    );

-- Policy: Allow anyone to view appearance settings (for public logo access)
CREATE POLICY "Anyone can view appearance settings" ON system_settings
    FOR SELECT USING (
        setting_type = 'appearance'
    );
-- system_settings ---------------------------------------------------------------------------------------------- system_settings policys -- ✅

-- ==============================================================================================================
-- PUBLIC ACCESS POLICIES - For restaurant visitors using slug-based access
-- ==============================================================================================================

-- Helper function to get restaurant ID from slug for public access
CREATE OR REPLACE FUNCTION get_restaurant_id_by_slug(slug_param TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT id FROM restaurants 
    WHERE slug = slug_param AND is_active = true
    LIMIT 1
  );
END;
$$;

-- Function to check if current user is NOT an admin (to prevent admin panel access conflicts)
CREATE OR REPLACE FUNCTION is_not_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return true if user is not authenticated OR not an admin user
  RETURN (
    user_id IS NULL OR 
    NOT EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = user_id AND is_active = true
    )
  );
END;
$$;

-- ==============================================================================================================
-- PUBLIC RESTAURANTS ACCESS - Allow public to view basic restaurant info by slug
-- ==============================================================================================================

CREATE POLICY "Public can view active restaurants by slug" ON restaurants
  FOR SELECT USING (
    is_not_admin_user(auth.uid()) AND
    is_active = true
  );

-- ==============================================================================================================
-- PUBLIC CATEGORIES ACCESS - Allow public to view categories for specific restaurant via slug
-- ==============================================================================================================

CREATE POLICY "Public can view categories for active restaurants" ON categories
  FOR SELECT USING (
    is_not_admin_user(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM restaurants r 
      WHERE r.id = categories.restaurant_id 
      AND r.is_active = true
    )
  );

-- ==============================================================================================================
-- PUBLIC SUBCATEGORIES ACCESS - Allow public to view subcategories for specific restaurant via slug
-- ==============================================================================================================

CREATE POLICY "Public can view subcategories for active restaurants" ON subcategories
  FOR SELECT USING (
    is_not_admin_user(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM restaurants r 
      WHERE r.id = subcategories.restaurant_id 
      AND r.is_active = true
    )
  );

-- ==============================================================================================================
-- PUBLIC MENU ITEMS ACCESS - Allow public to view available menu items for specific restaurant via slug
-- ==============================================================================================================

CREATE POLICY "Public can view available menu items for active restaurants" ON menu_items
  FOR SELECT USING (
    is_not_admin_user(auth.uid()) AND
    is_available = true AND
    EXISTS (
      SELECT 1 FROM restaurants r 
      WHERE r.id = menu_items.restaurant_id 
      AND r.is_active = true
    )
  );

-- ==============================================================================================================
-- PUBLIC FEEDBACK ACCESS - Allow public to submit feedback for specific restaurant via slug
-- ==============================================================================================================

-- Update existing policy to be more specific about public access
DROP POLICY IF EXISTS "Anyone can submit feedback" ON feedback;

CREATE POLICY "Public can submit feedback for active restaurants" ON feedback
  FOR INSERT WITH CHECK (
    is_not_admin_user(auth.uid()) AND
    restaurant_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM restaurants r 
      WHERE r.id = feedback.restaurant_id 
      AND r.is_active = true
    )
  );

-- ==============================================================================================================
-- INDEXES FOR PUBLIC ACCESS PERFORMANCE
-- ==============================================================================================================

-- Additional indexes for better public query performance
CREATE INDEX IF NOT EXISTS idx_restaurants_slug_active ON restaurants(slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_public ON categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_restaurant_public ON subcategories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_available_public ON menu_items(restaurant_id, is_available);

-- ((bucket_id = 'restaurant'::text) AND is_admin_or_super(auth.uid()))



-- ============================================================================================================== 

-- Rating system for menu items

-- ============================================================================================================== 


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

  -- ============================================================================================================== 

-- Rating system for menu items

-- ============================================================================================================== 