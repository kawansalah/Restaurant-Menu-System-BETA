import supabase from "@/lib/supabase";
import { publicSupabase } from "@/lib/publicSupabase";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  theme_color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch restaurant by slug (public access - works even for admin users)
 */
export const getRestaurantBySlug = async (
  slug: string
): Promise<Restaurant | null> => {
  try {
    // Use public client to bypass admin user restrictions
    const { data, error } = await publicSupabase
      .from("restaurants")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching restaurant by slug:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching restaurant:", error);
    return null;
  }
};

/**
 * Fetch restaurant by ID
 */
export const getRestaurantById = async (
  id: string
): Promise<Restaurant | null> => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching restaurant by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching restaurant:", error);
    return null;
  }
};

/**
 * Get restaurant settings (logo, theme, etc.) - public access
 */
export const getRestaurantSettings = async (restaurantId: string) => {
  try {
    // Use public client to bypass admin user restrictions
    const { data, error } = await publicSupabase
      .from("system_settings")
      .select("*")
      .eq("restaurant_id", restaurantId);

    if (error) {
      console.error("Error fetching restaurant settings:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching restaurant settings:", error);
    return [];
  }
};
