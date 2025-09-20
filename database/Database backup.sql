CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('super_admin', 'admin', 'manager', 'staff')) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  label_ku VARCHAR(255) NOT NULL,
  label_ar VARCHAR(255) NOT NULL,
  label_en VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
); -- ✅

CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    setting_type VARCHAR(50) NOT NULL,
    logo_url TEXT, -- Legacy logo field for backward compatibility
    light_logo_url TEXT, -- Logo for light theme
    dark_logo_url TEXT, -- Logo for dark theme
    theme_color VARCHAR(7) DEFAULT '#ff6b35',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(setting_type)
);


-- Enable RLS on all admin tables
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


-- Allow admins to select/update/delete their own entry
create policy "Admins can manage their row"
on admin_users
for all
using (auth.uid() = id);

-- Now create the policies using these functions
CREATE POLICY "Admin users can view all admin users" ON admin_users
  FOR SELECT USING (is_admin_user(auth.uid()));

CREATE POLICY "Super admins can create admin users" ON admin_users
  FOR INSERT WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins and admins can update admin users" ON admin_users
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super admins can delete admin users" ON admin_users
  FOR DELETE USING (is_super_admin(auth.uid()));

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

  -- All authenticated admin users can view categories
CREATE POLICY "Admin users can view categories" ON categories
  FOR SELECT USING (
     is_manager_admin_or_super(auth.uid())
  );

-- Admins and above can manage categories
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
      is_admin_or_super(auth.uid())
  );
-- categories ---------------------------------------------------------------------------------------------- categories policys -- ✅ 




-- subcategories ---------------------------------------------------------------------------------------------- subcategories policys -- ✅ 
-- All authenticated admin users can view subcategories
CREATE POLICY "(  manager ,admin  ,  super_admin )   can view subcategories" ON subcategories
  FOR SELECT USING (
     is_manager_admin_or_super(auth.uid())
  );

-- Admins and above can manage subcategories
CREATE POLICY "Admins can manage subcategories" ON subcategories
  FOR ALL USING (
     is_admin_or_super(auth.uid())
  );
-- subcategories ---------------------------------------------------------------------------------------------- subcategories policys -- ✅ 



-- menu_items ---------------------------------------------------------------------------------------------- menu_items policys -- ✅ 
-- All authenticated admin users can view menu items
CREATE POLICY "(  manager ,admin  ,  super_admin )  users can view menu items" ON menu_items
  FOR SELECT USING (
     is_manager_admin_or_super(auth.uid())
  );

-- All admin roles can manage menu items
CREATE POLICY "(  admin  ,  super_admin ) can manage menu items" ON menu_items
  FOR ALL USING (
      is_admin_or_super(auth.uid())
  );
-- menu_items ---------------------------------------------------------------------------------------------- menu_items policys -- ✅ 




-- feedback ---------------------------------------------------------------------------------------------- feedback policys -- ✅ 
  -- All authenticated admin users can view feedback
CREATE POLICY "(  manager ,admin  ,  super_admin )  users can view feedback" ON feedback
  FOR SELECT USING (
      is_manager_admin_or_super(auth.uid())
  );

-- Anyone can insert feedback (public form)
CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- Only admins and above can delete feedback
CREATE POLICY "( admin  ,  super_admin )   can delete feedback" ON feedback
  FOR DELETE USING (
      is_admin_or_super(auth.uid())
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
-- Policy: Only authenticated admin users can read settings
CREATE POLICY "Admin users can read system settings" ON system_settings
    FOR SELECT
    USING (
        is_admin_or_super(auth.uid())
    );

-- Policy: Only authenticated admin users can insert settings
CREATE POLICY "( admin , super_admin )  users can insert system settings" ON system_settings
    FOR INSERT
    WITH CHECK (
       is_admin_or_super(auth.uid())
    );

-- Policy: Only authenticated admin users can update settings
CREATE POLICY "( admin , super_admin )  users can update system settings" ON system_settings
    FOR UPDATE
    USING (
       is_admin_or_super(auth.uid())
    )
    WITH CHECK (
        is_admin_or_super(auth.uid())
    );

-- Policy: Only authenticated admin users can delete settings
CREATE POLICY "( admin , super_admin )  users can delete system settings" ON system_settings
    FOR DELETE
    USING (
       is_admin_or_super(auth.uid())
    );
-- system_settings ---------------------------------------------------------------------------------------------- system_settings policys -- ✅