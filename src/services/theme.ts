import supabase from "@/lib/supabase";
import { SystemSettings } from "@/types/menu";

// Fetch all system settings
export const fetchSystemSettings = async (): Promise<SystemSettings[]> => {
  try {
    let query = supabase
      .from("system_settings")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching system settings:", error);
      throw new Error(`Failed to fetch system settings: ${error.message}`);
    }

    return data || [];  
  } catch (error) {
    console.error("Error in fetchSystemSettings:", error);
    throw error;
  }
};


  // Fetch a single system setting by ID
export const fetchSystemSettingById = async (id: number): Promise<SystemSettings | null> => {
  try {
    const { data, error } = await supabase
      .from("system_settings")
      .select("*")
      .eq("restaurant_id", id)
      .single();

    if (error) {
      console.error("Error fetching system setting by ID:", error);
      throw new Error(`Failed to fetch system setting by ID: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error("Error in fetchSystemSettingById:", error);
    throw error;
  }
};