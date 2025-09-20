-- Add public access policies for system_settings table
-- Execute this in your Supabase SQL Editor

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Public can view system settings for active restaurants" ON system_settings;
DROP POLICY IF EXISTS "Anyone can view appearance settings" ON system_settings;

-- Policy: Allow public to view system settings for logo access (more explicit version)
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

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'system_settings' 
ORDER BY policyname;