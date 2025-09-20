import supabase from "@/lib/supabase";
import { 
  Restaurant, 
  RestaurantFilters, 
  RestaurantCreateData, 
  RestaurantUpdateData, 
  RestaurantStats 
} from "@/admin/types/admin";

/**
 * Fetch all restaurants (for super_admin users)
 */
export const fetchRestaurants = async (filters?: RestaurantFilters): Promise<{
  data: Restaurant[];
  error?: string;
}> => {
  try {
    let query = supabase
      .from("restaurants")
      .select("*");

    // Apply filters
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }

    // Apply sorting
    const sortBy = filters?.sort_by || "created_at";
    const sortDirection = filters?.sort_direction === "asc" ? true : false;
    query = query.order(sortBy, { ascending: sortDirection });

    const { data, error } = await query;

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data || [] };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Get a single restaurant by ID
 */
export const fetchRestaurantById = async (
  id: string
): Promise<{
  data: Restaurant | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Create a new restaurant
 */
export const createRestaurant = async (
  restaurantData: RestaurantCreateData
): Promise<{
  data: Restaurant | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .insert([{
        ...restaurantData,
        is_active: restaurantData.is_active ?? true,
      }])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Update a restaurant
 */
export const updateRestaurant = async (
  id: string,
  restaurantData: RestaurantUpdateData
): Promise<{
  data: Restaurant | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .update({
        ...restaurantData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Delete a restaurant
 */
export const deleteRestaurant = async (
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Toggle restaurant active status
 */
export const toggleRestaurantStatus = async (
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from("restaurants")
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Bulk delete restaurants
 */
export const deleteRestaurants = async (
  ids: string[]
): Promise<{
  success: boolean;
  deletedCount: number;
  error?: string;
}> => {
  try {
    const { error, count } = await supabase
      .from("restaurants")
      .delete()
      .in("id", ids);

    if (error) {
      return { success: false, deletedCount: 0, error: error.message };
    }

    return { success: true, deletedCount: count || 0 };
  } catch (error) {
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Bulk toggle restaurant status
 */
export const bulkToggleRestaurantStatus = async (
  ids: string[],
  isActive: boolean
): Promise<{
  success: boolean;
  updatedCount: number;
  error?: string;
}> => {
  try {
    const { error, count } = await supabase
      .from("restaurants")
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .in("id", ids);

    if (error) {
      return { success: false, updatedCount: 0, error: error.message };
    }

    return { success: true, updatedCount: count || 0 };
  } catch (error) {
    return {
      success: false,
      updatedCount: 0,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Get restaurant statistics
 */
export const getRestaurantStats = async (): Promise<{
  data: RestaurantStats;
  error?: string;
}> => {
  try {
    // Get restaurant counts
    const { data: restaurants, error: restaurantError } = await supabase
      .from("restaurants")
      .select("is_active");

    if (restaurantError) {
      return {
        data: { total: 0, active: 0, inactive: 0, totalUsers: 0, totalMenuItems: 0, totalCategories: 0 },
        error: restaurantError.message,
      };
    }

    const total = restaurants?.length || 0;
    const active = restaurants?.filter(r => r.is_active).length || 0;
    const inactive = total - active;

    // Get total users count
    const { count: totalUsers } = await supabase
      .from("admin_users")
      .select("*", { count: "exact", head: true });

    // Get total menu items count
    const { count: totalMenuItems } = await supabase
      .from("menu_items")
      .select("*", { count: "exact", head: true });

    // Get total categories count
    const { count: totalCategories } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    return {
      data: {
        total,
        active,
        inactive,
        totalUsers: totalUsers || 0,
        totalMenuItems: totalMenuItems || 0,
        totalCategories: totalCategories || 0,
      },
    };
  } catch (error) {
    return {
      data: { total: 0, active: 0, inactive: 0, totalUsers: 0, totalMenuItems: 0, totalCategories: 0 },
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};