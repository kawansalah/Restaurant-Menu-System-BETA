import supabase from "@/lib/supabase";
import {
  AdminMenuItem,
  MenuItemFilters,
  MenuItemCreateData,
} from "@/admin/types/admin";
import { deleteImageFromSupabase } from "@/admin/utils/imageUpload";

/**
 * Menu Item Service
 *
 * This service handles all CRUD operations for menu items, including:
 * - Automatic image deletion when menu items are deleted
 * - Support for both single and bulk operations
 * - Proper error handling and storage cleanup
 * - Rating management (read-only for admins)
 *
 * Note: When deleting menu items, associated images (image_url)
 * are automatically removed from Supabase storage to prevent orphaned files.
 */

/**
 * Fetch all menu items with optional filtering
 */
export const fetchMenuItems = async (
  filters?: MenuItemFilters
): Promise<{
  data: AdminMenuItem[];
  error?: string;
}> => {
  try {
    let query = supabase
      .from("menu_items")
      .select(
        `
        *,
        categories!inner(*),
        subcategories!inner(*)
      `
      )
      .order("created_at", { ascending: false });

    // Apply search filter
    if (filters?.search) {
      query = query.or(`
        name_ku.ilike.%${filters.search}%,
        name_ar.ilike.%${filters.search}%,
        name_en.ilike.%${filters.search}%,
        description_ku.ilike.%${filters.search}%,
        description_ar.ilike.%${filters.search}%,
        description_en.ilike.%${filters.search}%
      `);
    }

    // Apply category filter
    if (filters?.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    // Apply subcategory filter
    if (filters?.subcategory_id) {
      query = query.eq("subcategory_id", filters.subcategory_id);
    }

    // Apply availability filter
    if (filters?.is_available !== undefined) {
      query = query.eq("is_available", filters.is_available);
    }

    // Apply price range filters
    if (filters?.min_price !== undefined) {
      query = query.gte("price", filters.min_price);
    }
    if (filters?.max_price !== undefined) {
      query = query.lte("price", filters.max_price);
    }

    // Apply rating filter
    if (filters?.min_rating !== undefined) {
      query = query.gte("rating", filters.min_rating);
    }

    // Apply sorting
    if (filters?.sort_by) {
      const direction = filters.sort_direction === "desc" ? false : true;
      query = query.order(filters.sort_by, { ascending: direction });
    }

    const { data, error } = await query;

    if (error) {
      return { data: [], error: error.message };
    }

    // Map the data to match our AdminMenuItem interface
    const mappedData = (data || []).map((item: any) => ({
      ...item,
      category: Array.isArray(item.categories)
        ? item.categories[0]
        : item.categories,
      subcategory: Array.isArray(item.subcategories)
        ? item.subcategories[0]
        : item.subcategories,
    }));

    return { data: mappedData as AdminMenuItem[] };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Get a single menu item by ID
 */
export const fetchMenuItemById = async (
  id: string
): Promise<{
  data: AdminMenuItem | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        categories!inner(*),
        subcategories!inner(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Map the data to match our AdminMenuItem interface
    const mappedData = {
      ...data,
      category: Array.isArray(data.categories)
        ? data.categories[0]
        : data.categories,
      subcategory: Array.isArray(data.subcategories)
        ? data.subcategories[0]
        : data.subcategories,
    };

    return { data: mappedData as AdminMenuItem };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Create a new menu item
 */
export const createMenuItem = async (
  menuItemData: MenuItemCreateData
): Promise<{
  data: AdminMenuItem | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        ...menuItemData,
        // Price is already a number from MenuItemCreateData
      })
      .select(
        `
        *,
        categories!inner(*),
        subcategories!inner(*)
      `
      )
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Map the data to match our AdminMenuItem interface
    const mappedData = {
      ...data,
      category: Array.isArray(data.categories)
        ? data.categories[0]
        : data.categories,
      subcategory: Array.isArray(data.subcategories)
        ? data.subcategories[0]
        : data.subcategories,
    };

    return { data: mappedData as AdminMenuItem };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Update an existing menu item
 */
export const updateMenuItem = async (
  id: string,
  updates: Partial<MenuItemCreateData>
): Promise<{
  data: AdminMenuItem | null;
  error?: string;
}> => {
  try {
    const updateData: any = { ...updates };
    // Price is already a number from MenuItemUpdateData interface
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("menu_items")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        categories!inner(*),
        subcategories!inner(*)
      `
      )
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Map the data to match our AdminMenuItem interface
    const mappedData = {
      ...data,
      category: Array.isArray(data.categories)
        ? data.categories[0]
        : data.categories,
      subcategory: Array.isArray(data.subcategories)
        ? data.subcategories[0]
        : data.subcategories,
    };

    return { data: mappedData as AdminMenuItem };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Delete a single menu item
 * Note: This will also clean up the associated image from storage
 */
export const deleteMenuItem = async (
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // First get the menu item to access its image_url for cleanup
    const { data: menuItem } = await supabase
      .from("menu_items")
      .select("image_url")
      .eq("id", id)
      .single();

 

    // Delete the menu item
    const { error: deleteError } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);
      
    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Clean up image from storage if it exists
    if (menuItem?.image_url) {
      try {
        await deleteImageFromSupabase(menuItem.image_url);
      } catch (storageError) {
        console.warn("Failed to delete image from storage:", storageError);
        // Don't fail the operation if image cleanup fails
      }
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
 * Delete multiple menu items
 * Note: This will also clean up associated images from storage
 */
export const deleteMenuItems = async (
  ids: string[]
): Promise<{
  success: boolean;
  deletedCount: number;
  error?: string;
}> => {
  try {
    // First get all menu items to access their image_urls for cleanup
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("id, image_url")
      .in("id", ids);

    // Delete the menu items
    const { error: deleteError, count } = await supabase
      .from("menu_items")
      .delete()
      .in("id", ids);

    if (deleteError) {
      return { success: false, deletedCount: 0, error: deleteError.message };
    }

    // Clean up images from storage
    if (menuItems && menuItems.length > 0) {
      const imagePaths = menuItems
        .filter((item) => item.image_url)
        .map((item) => item.image_url!.split("/").pop())
        .filter(Boolean) as string[];

      if (imagePaths.length > 0) {
        try {
          await supabase.storage.from("menu-images").remove(imagePaths);
        } catch (storageError) {
          console.warn(
            "Failed to delete some images from storage:",
            storageError
          );
          // Don't fail the operation if image cleanup fails
        }
      }
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
 * Toggle availability of a menu item
 */
export const toggleMenuItemAvailability = async (
  id: string,
  isAvailable: boolean
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from("menu_items")
      .update({
        is_available: isAvailable,
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
 * Bulk toggle availability of multiple menu items
 */
export const bulkToggleMenuItemAvailability = async (
  ids: string[],
  isAvailable: boolean
): Promise<{
  success: boolean;
  updatedCount: number;
  error?: string;
}> => {
  try {
    const { error, count } = await supabase
      .from("menu_items")
      .update({
        is_available: isAvailable,
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
 * Get menu item statistics
 */
export const getMenuItemStats = async (
  restaurantId?: string
): Promise<{
  data: {
    totalItems: number;
    availableItems: number;
    unavailableItems: number;
    averageRating: number;
    totalViews: number;
    averagePrice: number;
  };
  error?: string;
}> => {
  try {
    let query = supabase
      .from("menu_items")
      .select("is_available, rating, views_count, price");

    // Filter by restaurant if provided
    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: {
          totalItems: 0,
          availableItems: 0,
          unavailableItems: 0,
          averageRating: 0,
          totalViews: 0,
          averagePrice: 0,
        },
        error: error.message,
      };
    }

    const totalItems = data.length;
    const availableItems = data.filter((item) => item.is_available).length;
    const unavailableItems = totalItems - availableItems;
    const averageRating =
      data.reduce((sum, item) => sum + (item.rating || 0), 0) / totalItems || 0;
    const totalViews = data.reduce((sum, item) => sum + (item.views_count || 0), 0);
    const averagePrice =
      data.reduce((sum, item) => sum + (item.price || 0), 0) /
        totalItems || 0;

    return {
      data: {
        totalItems,
        availableItems,
        unavailableItems,
        averageRating: Math.round(averageRating * 100) / 100,
        totalViews,
        averagePrice: Math.round(averagePrice * 100) / 100,
      },
    };
  } catch (error) {
    return {
      data: {
        totalItems: 0,
        availableItems: 0,
        unavailableItems: 0,
        averageRating: 0,
        totalViews: 0,
        averagePrice: 0,
      },
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
