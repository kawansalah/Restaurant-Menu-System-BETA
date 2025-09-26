import supabase from "@/lib/supabase";
import { publicSupabase } from "@/lib/publicSupabase";

/**
 * Convert image URL from original to thumbnail for item cards
 * @param imageUrl - Original image URL
 * @param useThumbnail - Whether to use thumbnail (default: true for cards)
 * @returns Converted image URL
 */
const getImageUrl = (
  imageUrl: string | null | undefined,
  useThumbnail: boolean = true
): string | undefined => {
  if (!imageUrl) return undefined;

  if (useThumbnail && imageUrl.includes("/original/")) {
    return imageUrl.replace("/original/", "/thumbnails/");
  }

  return imageUrl;
};

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  subcategory_id: string;
  name_ku: string;
  name_ar: string;
  name_en: string;
  description_ku?: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  image_url?: string;
  rating: number;
  is_available: boolean;
  views_count: number;
  cart_additions_count: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItemWithLabel {
  id: string; // Changed from number | string to string for UUID consistency
  restaurant_id: string;
  category_id: string;
  subcategory_id: string;
  subcategory: string;
  name: {
    ku: string;
    ar: string;
    en: string;
  };
  description?: {
    ku: string;
    ar: string;
    en: string;
  };
  price: string;
  image?: string;
  rating?: number;
  is_available?: boolean;
  views_count?: number;
  cart_additions_count?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch menu items by restaurant ID with optional filtering (public access)
 */
export const getMenuItemsByRestaurant = async (
  restaurantId: string,
  categoryId?: string,
  subcategoryId?: string
): Promise<MenuItemWithLabel[]> => {
  try {
    let query = publicSupabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (subcategoryId) {
      query = query.eq("subcategory_id", subcategoryId);
    }

    const { data, error } = await query.order("created_at");

    if (error) {
      console.error("Error fetching menu items:", error);
      return [];
    }

    // Transform data to match expected format
    return (data || []).map((item: MenuItem) => ({
      id: item.id,
      restaurant_id: item.restaurant_id,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      subcategory: item.subcategory_id, // For backward compatibility
      name: {
        ku: item.name_ku,
        ar: item.name_ar,
        en: item.name_en,
      },
      description: {
        ku: item.description_ku || "",
        ar: item.description_ar || "",
        en: item.description_en || "",
      },
      price: item.price.toString(),
      image: getImageUrl(item.image_url, true), // Use thumbnail for cards
      rating: item.rating,
      is_available: item.is_available,
      views_count: item.views_count,
      cart_additions_count: item.cart_additions_count,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  } catch (error) {
    console.error("Unexpected error fetching menu items:", error);
    return [];
  }
};

/**
 * Fetch menu items by category ID
 */
export const getMenuItemsByCategory = async (
  categoryId: string
): Promise<MenuItemWithLabel[]> => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_available", true)
      .order("created_at");

    if (error) {
      console.error("Error fetching menu items by category:", error);
      return [];
    }

    return (data || []).map((item: MenuItem) => ({
      id: item.id,
      restaurant_id: item.restaurant_id,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      subcategory: item.subcategory_id,
      name: {
        ku: item.name_ku,
        ar: item.name_ar,
        en: item.name_en,
      },
      description: {
        ku: item.description_ku || "",
        ar: item.description_ar || "",
        en: item.description_en || "",
      },
      price: item.price.toString(),
      image: getImageUrl(item.image_url, true), // Use thumbnail for cards
      rating: item.rating,
      is_available: item.is_available,
      views_count: item.views_count,
      cart_additions_count: item.cart_additions_count,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  } catch (error) {
    console.error("Unexpected error fetching menu items:", error);
    return [];
  }
};

/**
 * Fetch menu items by subcategory ID
 */
export const getMenuItemsBySubCategory = async (
  subcategoryId: string
): Promise<MenuItemWithLabel[]> => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("subcategory_id", subcategoryId)
      .eq("is_available", true)
      .order("created_at");

    if (error) {
      console.error("Error fetching menu items by subcategory:", error);
      return [];
    }

    return (data || []).map((item: MenuItem) => ({
      id: item.id,
      restaurant_id: item.restaurant_id,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      subcategory: item.subcategory_id,
      name: {
        ku: item.name_ku,
        ar: item.name_ar,
        en: item.name_en,
      },
      description: {
        ku: item.description_ku || "",
        ar: item.description_ar || "",
        en: item.description_en || "",
      },
      price: item.price.toString(),
      image: getImageUrl(item.image_url, true), // Use thumbnail for cards
      rating: item.rating,
      is_available: item.is_available,
      views_count: item.views_count,
      cart_additions_count: item.cart_additions_count,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  } catch (error) {
    console.error("Unexpected error fetching menu items:", error);
    return [];
  }
};

/**
 * Fetch single menu item by ID
 */
export const getMenuItemById = async (
  itemId: string
): Promise<MenuItemWithLabel | null> => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (error) {
      console.error("Error fetching menu item:", error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      restaurant_id: data.restaurant_id,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      subcategory: data.subcategory_id,
      name: {
        ku: data.name_ku,
        ar: data.name_ar,
        en: data.name_en,
      },
      description: {
        ku: data.description_ku || "",
        ar: data.description_ar || "",
        en: data.description_en || "",
      },
      price: data.price.toString(),
      image: getImageUrl(data.image_url, false), // Use original for detailed view
      rating: data.rating,
      is_available: data.is_available,
      views_count: data.views_count,
      cart_additions_count: data.cart_additions_count,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error("Unexpected error fetching menu item:", error);
    return null;
  }
};

/**
 * Search menu items by name or description
 */
export const searchMenuItems = async (
  restaurantId: string,
  searchTerm: string,
  language: "ku" | "ar" | "en" = "en"
): Promise<MenuItemWithLabel[]> => {
  try {
    const searchColumn = `name_${language}`;
    const descriptionColumn = `description_${language}`;

    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .or(
        `${searchColumn}.ilike.%${searchTerm}%,${descriptionColumn}.ilike.%${searchTerm}%`
      )
      .order("created_at");

    if (error) {
      console.error("Error searching menu items:", error);
      return [];
    }

    return (data || []).map((item: MenuItem) => ({
      id: item.id,
      restaurant_id: item.restaurant_id,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      subcategory: item.subcategory_id,
      name: {
        ku: item.name_ku,
        ar: item.name_ar,
        en: item.name_en,
      },
      description: {
        ku: item.description_ku || "",
        ar: item.description_ar || "",
        en: item.description_en || "",
      },
      price: item.price.toString(),
      image: getImageUrl(item.image_url, true), // Use thumbnail for cards
      rating: item.rating,
      is_available: item.is_available,
      views_count: item.views_count,
      cart_additions_count: item.cart_additions_count,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  } catch (error) {
    console.error("Unexpected error searching menu items:", error);
    return [];
  }
};

/**
 * Increment view count for a menu item
 */
export const incrementViewCount = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc("increment_view_count", {
      item_id: itemId,
    });

    if (error) {
      console.error("Error incrementing view count:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error incrementing view count:", error);
    return false;
  }
};
