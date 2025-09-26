import supabase from "@/lib/supabase";
import { publicSupabase } from "@/lib/publicSupabase";

export interface SubCategory {
  id: string;
  restaurant_id: string;
  category_id: string;
  label_ku: string;
  label_ar: string;
  label_en: string;
  image_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SubCategoryWithLabel {
  id: string;
  restaurant_id: string;
  category_id: string;
  label: {
    ku: string;
    ar: string;
    en: string;
  };
  img?: string;
  image_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch subcategories by restaurant ID and optionally by category ID (public access)
 */
export const getSubCategoriesByRestaurant = async (
  restaurantId: string,
  categoryId?: string
): Promise<SubCategoryWithLabel[]> => {
  try {
    let query = publicSupabase
      .from("subcategories")
      .select("*")
      .eq("restaurant_id", restaurantId);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query.order("created_at");

    if (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }

    // Transform data to match expected format
    return (data || []).map((subcategory: SubCategory) => ({
      id: subcategory.id,
      restaurant_id: subcategory.restaurant_id,
      category_id: subcategory.category_id,
      label: {
        ku: subcategory.label_ku,
        ar: subcategory.label_ar,
        en: subcategory.label_en,
      },
      img: subcategory.thumbnail_url || subcategory.image_url, // Use thumbnail first, then fallback to original
      image_url: subcategory.image_url,
      thumbnail_url: subcategory.thumbnail_url,
      created_at: subcategory.created_at,
      updated_at: subcategory.updated_at,
    }));
  } catch (error) {
    console.error("Unexpected error fetching subcategories:", error);
    return [];
  }
};

/**
 * Fetch subcategories by category ID
 */
export const getSubCategoriesByCategory = async (
  categoryId: string
): Promise<SubCategoryWithLabel[]> => {
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .order("created_at");

    if (error) {
      console.error("Error fetching subcategories by category:", error);
      return [];
    }

    return (data || []).map((subcategory: SubCategory) => ({
      id: subcategory.id,
      restaurant_id: subcategory.restaurant_id,
      category_id: subcategory.category_id,
      label: {
        ku: subcategory.label_ku,
        ar: subcategory.label_ar,
        en: subcategory.label_en,
      },
      img: subcategory.thumbnail_url || subcategory.image_url, // Use thumbnail first, then fallback to original
      image_url: subcategory.image_url,
      thumbnail_url: subcategory.thumbnail_url,
      created_at: subcategory.created_at,
      updated_at: subcategory.updated_at,
    }));
  } catch (error) {
    console.error("Unexpected error fetching subcategories:", error);
    return [];
  }
};

/**
 * Fetch single subcategory by ID
 */
export const getSubCategoryById = async (
  subcategoryId: string
): Promise<SubCategoryWithLabel | null> => {
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("id", subcategoryId)
      .single();

    if (error) {
      console.error("Error fetching subcategory:", error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      restaurant_id: data.restaurant_id,
      category_id: data.category_id,
      label: {
        ku: data.label_ku,
        ar: data.label_ar,
        en: data.label_en,
      },
      img: data.thumbnail_url || data.image_url, // Use thumbnail first, then fallback to original
      image_url: data.image_url,
      thumbnail_url: data.thumbnail_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error("Unexpected error fetching subcategory:", error);
    return null;
  }
};
