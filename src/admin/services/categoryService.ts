import supabase from "@/lib/supabase";
import {
  Category,
  CategoryFilters,
  CategoryUpdateData,
  CategoryCreateData,
} from "@/admin/types/admin";
import {
  fetchSubCategories,
  bulkDeleteSubCategories,
} from "./subcategoryService";

/**
 * Category Service
 *
 * This service handles all CRUD operations for categories, including:
 * - Multi-restaurant support: All operations are scoped to specific restaurants
 * - Cascade deletion: When a category is deleted, all associated subcategories
 *   and their images are automatically deleted to maintain data integrity
 * - Bulk operations for efficient category management
 * - Comprehensive error handling and validation
 */

/**
 * Fetch all categories with optional filtering, scoped to restaurant
 */
export const fetchCategories = async (
  filters?: CategoryFilters
): Promise<{
  data: Category[];
  error?: string;
}> => {
  try {
    let query = supabase
      .from("categories")
      .select(
        `
        id,
        restaurant_id,
        label_ku,
        label_ar,
        label_en,
        created_at,
        updated_at
      `
      )
      .order("created_at", { ascending: false });

    // Apply restaurant filter if provided
    if (filters?.restaurant_id) {
      query = query.eq("restaurant_id", filters.restaurant_id);
    }

    // Apply search filter
    if (filters?.search) {
      query = query.or(`
        label_ku.ilike.%${filters.search}%,
        label_ar.ilike.%${filters.search}%,
        label_en.ilike.%${filters.search}%
      `);
    }

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
 * Get a single category by ID
 */
export const fetchCategoryById = async (
  id: string
): Promise<{
  data: Category | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        id,
        restaurant_id,
        label_ku,
        label_ar,
        label_en,
        created_at,
        updated_at
      `
      )
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
 * Create a new category
 */
export const createCategory = async (
  categoryData: CategoryCreateData
): Promise<{
  data: Category | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        ...categoryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(
        `
        id,
        restaurant_id,
        label_ku,
        label_ar,
        label_en,
        created_at,
        updated_at
      `
      )
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
 * Update a category
 */
export const updateCategory = async (
  id: string,
  updateData: CategoryUpdateData
): Promise<{
  data: Category | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        id,
        restaurant_id,
        label_ku,
        label_ar,
        label_en,
        created_at,
        updated_at
      `
      )
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
 * Delete a category and all its subcategories (cascade delete)
 */
export const deleteCategory = async (
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // First, fetch all subcategories that belong to this category
    const { data: subcategories, error: fetchError } = await fetchSubCategories(
      {
        category_id: id,
      }
    );

    if (fetchError) {
      return {
        success: false,
        error: `Failed to fetch subcategories: ${fetchError}`,
      };
    }

    // If there are subcategories, delete them first (this will also delete their images)
    if (subcategories && subcategories.length > 0) {
      const subcategoryIds = subcategories.map((sub) => sub.id);
      const { success: deleteSubsSuccess, error: deleteSubsError } =
        await bulkDeleteSubCategories(
          subcategoryIds,
          true // deleteImages = true
        );

      if (!deleteSubsSuccess) {
        return {
          success: false,
          error: `Failed to delete subcategories: ${deleteSubsError}`,
        };
      }
    }

    // Now delete the category
    const { error } = await supabase.from("categories").delete().eq("id", id);

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
 * Bulk delete categories and all their subcategories (cascade delete)
 */
export const bulkDeleteCategories = async (
  categoryIds: string[]
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Collect all subcategories from all categories being deleted
    const allSubcategoryIds: string[] = [];

    for (const categoryId of categoryIds) {
      const { data: subcategories, error: fetchError } =
        await fetchSubCategories({
          category_id: categoryId,
        });

      if (fetchError) {
        return {
          success: false,
          error: `Failed to fetch subcategories for category ${categoryId}: ${fetchError}`,
        };
      }

      if (subcategories && subcategories.length > 0) {
        const subcategoryIds = subcategories.map((sub) => sub.id);
        allSubcategoryIds.push(...subcategoryIds);
      }
    }

    // Delete all subcategories if any exist (this will also delete their images)
    if (allSubcategoryIds.length > 0) {
      const { success: deleteSubsSuccess, error: deleteSubsError } =
        await bulkDeleteSubCategories(
          allSubcategoryIds,
          true // deleteImages = true
        );

      if (!deleteSubsSuccess) {
        return {
          success: false,
          error: `Failed to delete subcategories: ${deleteSubsError}`,
        };
      }
    }

    // Now delete all categories
    const { error } = await supabase
      .from("categories")
      .delete()
      .in("id", categoryIds);

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
 * Get category statistics for a specific restaurant
 */
export const getCategoryStats = async (
  restaurantId?: string
): Promise<{
  data: {
    total: number;
  };
  error?: string;
}> => {
  try {
    let query = supabase.from("categories").select("id");

    // Filter by restaurant if provided
    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId);
    }

    const { data: categories, error } = await query;

    if (error) {
      return {
        data: { total: 0 },
        error: error.message,
      };
    }

    const stats = {
      total: categories.length,
    };

    return { data: stats };
  } catch (error) {
    return {
      data: { total: 0 },
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
