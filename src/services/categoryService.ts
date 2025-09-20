import supabase from "@/lib/supabase";
import { publicSupabase } from "@/lib/publicSupabase";

export interface Category {
  id: string;
  restaurant_id: string;
  label_ku: string;
  label_ar: string;
  label_en: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithLabel {
  id: string;
  restaurant_id: string;
  label: {
    ku: string;
    ar: string;
    en: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Fetch categories by restaurant ID (public access)
 */
export const getCategoriesByRestaurant = async (
  restaurantId: string
): Promise<CategoryWithLabel[]> => {
  try {
    // Use public client to bypass admin user restrictions
    const { data, error } = await publicSupabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    // Transform data to match expected format
    return (data || []).map((category: Category) => ({
      id: category.id,
      restaurant_id: category.restaurant_id,
      label: {
        ku: category.label_ku,
        ar: category.label_ar,
        en: category.label_en,
      },
      created_at: category.created_at,
      updated_at: category.updated_at,
    }));
  } catch (error) {
    console.error("Unexpected error fetching categories:", error);
    return [];
  }
};

/**
 * Fetch single category by ID
 */
export const getCategoryById = async (
  categoryId: string
): Promise<CategoryWithLabel | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      restaurant_id: data.restaurant_id,
      label: {
        ku: data.label_ku,
        ar: data.label_ar,
        en: data.label_en,
      },
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error("Unexpected error fetching category:", error);
    return null;
  }
};
