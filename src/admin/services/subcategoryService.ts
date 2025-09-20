import supabase from "@/lib/supabase";
import {
  SubCategory,
  SubCategoryFilters,
  SubCategoryUpdateData,
  SubCategoryCreateData,
} from "@/admin/types/admin";

/**
 * SubCategory Service
 *
 * This service handles all CRUD operations for subcategories, including:
 * - Automatic image deletion when subcategories are deleted
 * - Support for both single and bulk operations
 * - Proper error handling and storage cleanup
 *
 * Note: When deleting subcategories, associated images (image_url and thumbnail_url)
 * are automatically removed from Supabase storage to prevent orphaned files.
 */

/**
 * Fetch all subcategories with optional filtering
 */
export const fetchSubCategories = async (
  filters?: SubCategoryFilters
): Promise<{
  data: SubCategory[];
  error?: string;
}> => {
  try {
    let query = supabase
      .from("subcategories")
      .select(
        `
        id,
        restaurant_id,
        category_id,
        label_ku,
        label_ar,
        label_en,
        image_url,
        thumbnail_url,
        created_at,
        updated_at,
        categories!inner(
          id,
          label_ku,
          label_ar,
          label_en
        )
      `
      )
      .order("created_at", { ascending: false });

    // Apply restaurant filter (important for multi-tenant support)
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

    // Apply category filter
    if (filters?.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    const { data, error } = await query;

    if (error) {
      return { data: [], error: error.message };
    }

    // Map the data to match our SubCategory interface
    const mappedData = (data || []).map((item: any) => ({
      ...item,
      category: Array.isArray(item.categories)
        ? item.categories[0]
        : item.categories, // Take first category from array
    }));

    return { data: mappedData as SubCategory[] };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Get a single subcategory by ID
 */
export const fetchSubCategoryById = async (
  id: string
): Promise<{
  data: SubCategory | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select(
        `
        id,
        restaurant_id,
        category_id,
        label_ku,
        label_ar,
        label_en,
        image_url,
        thumbnail_url,
        created_at,
        updated_at,
        categories!inner(
          id,
          label_ku,
          label_ar,
          label_en
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Map the data to match our SubCategory interface
    const mappedData = {
      ...data,
      category: Array.isArray(data.categories)
        ? data.categories[0]
        : data.categories, // Take first category from array
    };

    return { data: mappedData as unknown as SubCategory };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Create a new subcategory
 */
export const createSubCategory = async (
  subcategoryData: SubCategoryCreateData
): Promise<{
  data: SubCategory | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .insert([
        {
          restaurant_id: subcategoryData.restaurant_id,
          category_id: subcategoryData.category_id,
          label_ku: subcategoryData.label_ku,
          label_ar: subcategoryData.label_ar,
          label_en: subcategoryData.label_en,
          image_url: subcategoryData.image_url,
          thumbnail_url: subcategoryData.thumbnail_url,
        },
      ])
      .select(
        `
        id,
        restaurant_id,
        category_id,
        label_ku,
        label_ar,
        label_en,
        image_url,
        thumbnail_url,
        created_at,
        updated_at,
        categories!inner(
          id,
          label_ku,
          label_ar,
          label_en
        )
      `
      )
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Map the data to match our SubCategory interface
    const mappedData = {
      ...data,
      category: Array.isArray(data.categories)
        ? data.categories[0]
        : data.categories,
    };

    return { data: mappedData as unknown as SubCategory };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Update an existing subcategory
 */
export const updateSubCategory = async (
  id: string,
  subcategoryData: SubCategoryUpdateData
): Promise<{
  data: SubCategory | null;
  error?: string;
}> => {
  try {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (subcategoryData.category_id !== undefined) {
      updateData.category_id = subcategoryData.category_id;
    }
    if (subcategoryData.label_ku !== undefined) {
      updateData.label_ku = subcategoryData.label_ku;
    }
    if (subcategoryData.label_ar !== undefined) {
      updateData.label_ar = subcategoryData.label_ar;
    }
    if (subcategoryData.label_en !== undefined) {
      updateData.label_en = subcategoryData.label_en;
    }
    if (subcategoryData.image_url !== undefined) {
      updateData.image_url = subcategoryData.image_url;
    }
    if (subcategoryData.thumbnail_url !== undefined) {
      updateData.thumbnail_url = subcategoryData.thumbnail_url;
    }

    const { data, error } = await supabase
      .from("subcategories")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        id,
        category_id,
        label_ku,
        label_ar,
        label_en,
        image_url,
        thumbnail_url,
        created_at,
        updated_at,
        categories!inner(
          id,
          label_ku,
          label_ar,
          label_en
        )
      `
      )
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as unknown as SubCategory };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Helper function to delete images from Supabase storage
 */
const deleteImagesFromStorage = async (
  imageUrls: (string | null)[]
): Promise<void> => {
  const validUrls = imageUrls.filter(
    (url): url is string => url !== null && url.trim() !== ""
  );

  if (validUrls.length === 0) return;

  for (const url of validUrls) {
    try {
      // Extract the file path from the full URL
      // Handle different URL formats:
      // 1. https://your-project.supabase.co/storage/v1/object/public/bucket-name/file-path
      // 2. https://your-project.supabase.co/storage/v1/object/public/bucket/folder/file.ext

      let bucketName: string | null = null;
      let filePath: string | null = null;

      if (url.includes("/storage/v1/object/public/")) {
        const urlParts = url.split("/storage/v1/object/public/");
        if (urlParts.length === 2) {
          const pathAfterPublic = urlParts[1];
          const pathSegments = pathAfterPublic.split("/");

          if (pathSegments.length >= 2) {
            bucketName = pathSegments[0];
            filePath = pathSegments.slice(1).join("/");
          }
        }
      } else if (url.includes("/storage/v1/object/")) {
        // Handle other storage URL formats if needed
        const urlParts = url.split("/storage/v1/object/");
        if (urlParts.length === 2) {
          const pathSegments = urlParts[1].split("/");
          if (pathSegments.length >= 2) {
            bucketName = pathSegments[0];
            filePath = pathSegments.slice(1).join("/");
          }
        }
      }

      if (bucketName && filePath) {
        const { error } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);

        if (error) {
          console.warn(`Failed to delete image from storage: ${url}`, error);
        } else {
          console.log(
            `Successfully deleted image: ${filePath} from bucket: ${bucketName}`
          );
        }
      } else {
        console.warn(`Could not parse storage URL: ${url}`);
      }
    } catch (error) {
      console.warn(`Error deleting image from storage: ${url}`, error);
    }
  }
};

/**
 * Delete a subcategory
 */
export const deleteSubCategory = async (
  id: string,
  deleteImages: boolean = true
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    let subcategory = null;

    // Fetch subcategory data if we need to delete images
    if (deleteImages) {
      const { data: fetchedSubcategory, error: fetchError } = await supabase
        .from("subcategories")
        .select("image_url, thumbnail_url")
        .eq("id", id)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      subcategory = fetchedSubcategory;
    }

    // Delete the subcategory from database
    const { error: deleteError } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Delete associated images from storage if requested
    if (deleteImages && subcategory) {
      await deleteImagesFromStorage([
        subcategory.image_url,
        subcategory.thumbnail_url,
      ]);
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
 * Bulk delete subcategories
 */
export const bulkDeleteSubCategories = async (
  ids: string[],
  deleteImages: boolean = true
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    let subcategories = null;

    // Fetch subcategories data if we need to delete images
    if (deleteImages) {
      const { data: fetchedSubcategories, error: fetchError } = await supabase
        .from("subcategories")
        .select("image_url, thumbnail_url")
        .in("id", ids);

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      subcategories = fetchedSubcategories;
    }

    // Delete subcategories from database
    const { error: deleteError } = await supabase
      .from("subcategories")
      .delete()
      .in("id", ids);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Collect all image URLs and delete them from storage if requested
    if (deleteImages && subcategories && subcategories.length > 0) {
      const allImageUrls: (string | null)[] = [];
      subcategories.forEach((subcategory) => {
        allImageUrls.push(subcategory.image_url, subcategory.thumbnail_url);
      });

      await deleteImagesFromStorage(allImageUrls);
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
 * Get subcategory statistics
 */
export const getSubCategoryStats = async (
  restaurantId?: string
): Promise<{
  data: { total: number };
  error?: string;
}> => {
  try {
    let query = supabase.from("subcategories").select("id");

    // Filter by restaurant if provided
    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId);
    }

    const { data: subcategories, error } = await query;

    if (error) {
      return {
        data: { total: 0 },
        error: error.message,
      };
    }

    return {
      data: {
        total: subcategories?.length || 0,
      },
    };
  } catch (error) {
    return {
      data: { total: 0 },
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
