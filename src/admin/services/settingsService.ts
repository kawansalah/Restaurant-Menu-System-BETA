import supabase from "@/lib/supabase";
import { uploadLogoToSupabase, deleteImageFromSupabase } from "@/admin/utils/imageUpload";

export interface AppearanceSettings {
  id?: string;
  restaurant_id?: string;
  logo_url?: string; // Legacy field for backward compatibility
  light_logo_url?: string; // Logo for light theme
  dark_logo_url?: string; // Logo for dark theme
  theme_color?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Settings Service
 * 
 * This service handles system settings including appearance configuration
 */

// Fetch current appearance settings for a specific restaurant
export const fetchAppearanceSettings = async (restaurantId?: string): Promise<AppearanceSettings | null> => {
  try {
    // Get current user to determine restaurant_id if not provided
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's restaurant_id if not provided
    let targetRestaurantId = restaurantId;
    if (!targetRestaurantId) {
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('restaurant_id')
        .eq('id', user.id)
        .single();

      if (userError || !adminUser) {
        throw new Error('Failed to get user restaurant information');
      }
      targetRestaurantId = adminUser.restaurant_id;
    }

    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('setting_type', 'appearance')
      .eq('restaurant_id', targetRestaurantId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching appearance settings:', error);
      throw new Error(`Failed to fetch appearance settings: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error('Error in fetchAppearanceSettings:', error);
    throw error;
  }
};

// Save appearance settings with dual logo support
export const saveAppearanceSettings = async (
  lightLogoFile: File | null,
  darkLogoFile: File | null,
  themeColor: string,
  restaurantId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get current user to determine restaurant_id if not provided
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's restaurant_id if not provided
    let targetRestaurantId = restaurantId;
    if (!targetRestaurantId) {
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('restaurant_id')
        .eq('id', user.id)
        .single();

      if (userError || !adminUser) {
        throw new Error('Failed to get user restaurant information');
      }
      targetRestaurantId = adminUser.restaurant_id;
    }

    let lightLogoUrl: string | undefined;
    let darkLogoUrl: string | undefined;

    // Check if settings already exist for this restaurant
    const existingSettings = await fetchAppearanceSettings(targetRestaurantId);

    // Upload light logo if provided
    if (lightLogoFile) {
      // Delete old light logo if it exists
      if (existingSettings?.light_logo_url) {
        try {
          await deleteImageFromSupabase(existingSettings.light_logo_url);
        } catch (error) {
          console.warn('Failed to delete old light logo:', error);
          // Continue with upload even if deletion fails
        }
      }

      const uploadResult = await uploadLogoToSupabase(lightLogoFile, 'system/logos');
      
      if (uploadResult.error) {
        return { success: false, error: uploadResult.error };
      }
      
      lightLogoUrl = uploadResult.originalUrl;
    }

    // Upload dark logo if provided
    if (darkLogoFile) {
      // Delete old dark logo if it exists
      if (existingSettings?.dark_logo_url) {
        try {
          await deleteImageFromSupabase(existingSettings.dark_logo_url);
        } catch (error) {
          console.warn('Failed to delete old dark logo:', error);
          // Continue with upload even if deletion fails
        }
      }

      const uploadResult = await uploadLogoToSupabase(darkLogoFile, 'system/logos');
      
      if (uploadResult.error) {
        return { success: false, error: uploadResult.error };
      }
      
      darkLogoUrl = uploadResult.originalUrl;
    }
    
    const settingsData = {
      restaurant_id: targetRestaurantId,
      setting_type: 'appearance',
      logo_url: existingSettings?.logo_url, // Keep legacy field for backward compatibility
      light_logo_url: lightLogoUrl || existingSettings?.light_logo_url,
      dark_logo_url: darkLogoUrl || existingSettings?.dark_logo_url,
      theme_color: themeColor,
      updated_at: new Date().toISOString()
    };

    let result;
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('system_settings')
        .update(settingsData)
        .eq('id', existingSettings.id)
        .select()
        .single();
    } else {
      // Create new settings
      result = await supabase
        .from('system_settings')
        .insert({
          ...settingsData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving appearance settings:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveAppearanceSettings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save settings'
    };
  }
};

// Get current logo URL (legacy function for backward compatibility)
export const getCurrentLogo = async (restaurantId?: string): Promise<string | null> => {
  try {
    const settings = await fetchAppearanceSettings(restaurantId);
    return settings?.logo_url || null;
  } catch (error) {
    console.error('Error getting current logo:', error);
    return null;
  }
};

// Get current light logo URL
export const getCurrentLightLogo = async (restaurantId?: string): Promise<string | null> => {
  try {
    const settings = await fetchAppearanceSettings(restaurantId);
    return settings?.light_logo_url || null;
  } catch (error) {
    console.error('Error getting current light logo:', error);
    return null;
  }
};

// Get current dark logo URL
export const getCurrentDarkLogo = async (restaurantId?: string): Promise<string | null> => {
  try {
    const settings = await fetchAppearanceSettings(restaurantId);
    return settings?.dark_logo_url || null;
  } catch (error) {
    console.error('Error getting current dark logo:', error);
    return null;
  }
};

// Get current theme color
export const getCurrentThemeColor = async (restaurantId?: string): Promise<string> => {
  try {
    const settings = await fetchAppearanceSettings(restaurantId);
    return settings?.theme_color || '#4e98ff';
  } catch (error) {
    console.error('Error getting current theme color:', error);
    return '#4e98ff';
  }
};

// Delete specific logo type from settings
export const deleteLogo = async (logoType: 'light' | 'dark', restaurantId?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get current user to determine restaurant_id if not provided
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's restaurant_id if not provided
    let targetRestaurantId = restaurantId;
    if (!targetRestaurantId) {
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('restaurant_id')
        .eq('id', user.id)
        .single();

      if (userError || !adminUser) {
        throw new Error('Failed to get user restaurant information');
      }
      targetRestaurantId = adminUser.restaurant_id;
    }

    const existingSettings = await fetchAppearanceSettings(targetRestaurantId);
    
    if (!existingSettings) {
      return { success: true }; // No settings to update
    }

    const logoUrlField = logoType === 'light' ? 'light_logo_url' : 'dark_logo_url';
    const logoUrl = existingSettings[logoUrlField];

    // Delete logo file if it exists
    if (logoUrl) {
      try {
        await deleteImageFromSupabase(logoUrl);
      } catch (error) {
        console.warn(`Failed to delete ${logoType} logo file:`, error);
        // Continue with database update even if file deletion fails
      }
    }

    // Update settings to remove the specific logo_url
    const updateData = {
      [logoUrlField]: null,
      updated_at: new Date().toISOString()
    };

    const result = await supabase
      .from('system_settings')
      .update(updateData)
      .eq('id', existingSettings.id)
      .select()
      .single();

    if (result.error) {
      console.error(`Error updating settings after ${logoType} logo deletion:`, result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error(`Error in delete${logoType}Logo:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to delete ${logoType} logo`
    };
  }
};

// Delete legacy logo from settings (for backward compatibility)
export const deleteLegacyLogo = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const existingSettings = await fetchAppearanceSettings();
    
    if (!existingSettings) {
      return { success: true }; // No settings to update
    }

    // Delete logo file if it exists
    if (existingSettings.logo_url) {
      try {
        await deleteImageFromSupabase(existingSettings.logo_url);
      } catch (error) {
        console.warn('Failed to delete legacy logo file:', error);
        // Continue with database update even if file deletion fails
      }
    }

    // Update settings to remove logo_url
    const result = await supabase
      .from('system_settings')
      .update({
        logo_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSettings.id)
      .select()
      .single();

    if (result.error) {
      console.error('Error updating settings after legacy logo deletion:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteLegacyLogo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete legacy logo'
    };
  }
};