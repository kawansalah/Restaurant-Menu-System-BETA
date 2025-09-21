import { publicSupabase } from "@/lib/publicSupabase";
import supabase from "@/lib/supabase";
import {
  Rating,
  RatingStats,
  getRatingsByMenuItemAndRestaurant,
  getRatingStatsByMenuItemAndRestaurant,
} from "@/services/ratingService";

// Extended rating interface for admin use
export interface AdminRating extends Rating {
  menu_item?: {
    id: string;
    name_en: string;
    name_ar: string;
    name_ku: string;
    restaurant_id: string;
  };
  restaurant?: {
    id: string;
    name_en: string;
    name_ar: string;
    name_ku: string;
  };
}

// Rating statistics by restaurant
export interface RestaurantRatingStats {
  restaurant_id: string;
  restaurant_name: string;
  total_ratings: number;
  average_rating: number;
  rating_distribution: {
    [key: number]: number; // rating value -> count
  };
}

// Rating analytics data
export interface RatingAnalytics {
  totalRatings: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  topRatedItems: Array<{
    menu_item_id: string;
    name: string;
    restaurant_name: string;
    average_rating: number;
    total_ratings: number;
  }>;
  recentRatings: AdminRating[];
  ratingsByRestaurant: RestaurantRatingStats[];
}

/**
 * Get all ratings with menu item and restaurant details for admin panel
 * @param limit - Number of ratings to fetch
 * @param offset - Offset for pagination
 * @param filters - Optional filters
 * @returns Promise with array of admin ratings
 */
export const getAdminRatings = async (
  limit: number = 50,
  offset: number = 0,
  filters?: {
    restaurant_id?: string;
    rating?: number;
    date_from?: string;
    date_to?: string;
    search?: string;
  }
): Promise<{ data: AdminRating[]; total: number }> => {
  try {
    let query = publicSupabase
      .from("ratings")
      .select(
        `
        *,
        menu_item:menu_items!ratings_menu_item_id_fkey (
          id,
          name_en,
          name_ar,
          name_ku,
          restaurant_id,
          restaurant:restaurants!menu_items_restaurant_id_fkey (
            id,
            name_en,
            name_ar,
            name_ku
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters?.restaurant_id) {
      query = query.eq("menu_item.restaurant_id", filters.restaurant_id);
    }

    if (filters?.rating) {
      query = query.eq("rating", filters.rating);
    }

    if (filters?.date_from) {
      query = query.gte("created_at", filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte("created_at", filters.date_to);
    }

    // Get total count for pagination
    const { count } = await publicSupabase
      .from("ratings")
      .select("id", { count: "exact", head: true });

    // Get paginated results
    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching admin ratings:", error);
      throw new Error("Failed to fetch ratings");
    }

    // Transform data to match AdminRating interface
    const adminRatings: AdminRating[] = (data || []).map((rating: any) => ({
      ...rating,
      menu_item: rating.menu_item
        ? {
            id: rating.menu_item.id,
            name_en: rating.menu_item.name_en,
            name_ar: rating.menu_item.name_ar,
            name_ku: rating.menu_item.name_ku,
            restaurant_id: rating.menu_item.restaurant_id,
          }
        : undefined,
      restaurant: rating.menu_item?.restaurant
        ? {
            id: rating.menu_item.restaurant.id,
            name_en: rating.menu_item.restaurant.name_en,
            name_ar: rating.menu_item.restaurant.name_ar,
            name_ku: rating.menu_item.restaurant.name_ku,
          }
        : undefined,
    }));

    return {
      data: adminRatings,
      total: count || 0,
    };
  } catch (error) {
    console.error("Error in getAdminRatings:", error);
    throw error;
  }
};

/**
 * Get rating analytics for admin dashboard
 * @param restaurantId - Optional restaurant ID to filter by
 * @returns Promise with rating analytics data
 */
export const getRatingAnalytics = async (
  restaurantId?: string
): Promise<RatingAnalytics> => {
  try {
    // Base query for ratings
    let ratingsQuery = publicSupabase.from("ratings").select(`
        *,
        menu_item:menu_items!ratings_menu_item_id_fkey (
          id,
          name_en,
          restaurant_id,
          restaurant:restaurants!menu_items_restaurant_id_fkey (
            id,
            name_en
          )
        )
      `);

    if (restaurantId) {
      ratingsQuery = ratingsQuery.eq("menu_item.restaurant_id", restaurantId);
    }

    const { data: ratings, error } = await ratingsQuery;

    if (error) {
      console.error("Error fetching ratings analytics:", error);
      throw new Error("Failed to fetch rating analytics");
    }

    const allRatings = ratings || [];

    // Calculate overall statistics
    const totalRatings = allRatings.length;
    const averageRating =
      totalRatings > 0
        ? allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    // Calculate rating distribution
    const ratingDistribution: { [key: number]: number } = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = allRatings.filter((r) => r.rating === i).length;
    }

    // Get top rated items
    const itemRatings = new Map<
      string,
      {
        name: string;
        restaurant_name: string;
        ratings: number[];
      }
    >();

    allRatings.forEach((rating: any) => {
      if (rating.menu_item) {
        const key = rating.menu_item.id;
        if (!itemRatings.has(key)) {
          itemRatings.set(key, {
            name: rating.menu_item.name_en,
            restaurant_name: rating.menu_item.restaurant?.name_en || "Unknown",
            ratings: [],
          });
        }
        itemRatings.get(key)!.ratings.push(rating.rating);
      }
    });

    const topRatedItems = Array.from(itemRatings.entries())
      .map(([menu_item_id, data]) => ({
        menu_item_id,
        name: data.name,
        restaurant_name: data.restaurant_name,
        average_rating:
          data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length,
        total_ratings: data.ratings.length,
      }))
      .filter((item) => item.total_ratings >= 3) // Only items with at least 3 ratings
      .sort((a, b) => b.average_rating - a.average_rating)
      .slice(0, 10);

    // Get recent ratings (last 10)
    const recentRatings: AdminRating[] = allRatings
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10)
      .map((rating: any) => ({
        ...rating,
        menu_item: rating.menu_item
          ? {
              id: rating.menu_item.id,
              name_en: rating.menu_item.name_en,
              name_ar: rating.menu_item.name_ar || "",
              name_ku: rating.menu_item.name_ku || "",
              restaurant_id: rating.menu_item.restaurant_id,
            }
          : undefined,
        restaurant: rating.menu_item?.restaurant
          ? {
              id: rating.menu_item.restaurant.id,
              name_en: rating.menu_item.restaurant.name_en,
              name_ar: rating.menu_item.restaurant.name_ar || "",
              name_ku: rating.menu_item.restaurant.name_ku || "",
            }
          : undefined,
      }));

    // Get ratings by restaurant
    const restaurantRatings = new Map<
      string,
      {
        name: string;
        ratings: number[];
      }
    >();

    allRatings.forEach((rating: any) => {
      if (rating.menu_item?.restaurant) {
        const restaurantId = rating.menu_item.restaurant.id;
        if (!restaurantRatings.has(restaurantId)) {
          restaurantRatings.set(restaurantId, {
            name: rating.menu_item.restaurant.name_en,
            ratings: [],
          });
        }
        restaurantRatings.get(restaurantId)!.ratings.push(rating.rating);
      }
    });

    const ratingsByRestaurant: RestaurantRatingStats[] = Array.from(
      restaurantRatings.entries()
    )
      .map(([restaurant_id, data]) => {
        const distribution: { [key: number]: number } = {};
        for (let i = 1; i <= 5; i++) {
          distribution[i] = data.ratings.filter((r) => r === i).length;
        }

        return {
          restaurant_id,
          restaurant_name: data.name,
          total_ratings: data.ratings.length,
          average_rating:
            data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length,
          rating_distribution: distribution,
        };
      })
      .sort((a, b) => b.average_rating - a.average_rating);

    return {
      totalRatings,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      topRatedItems,
      recentRatings,
      ratingsByRestaurant,
    };
  } catch (error) {
    console.error("Error in getRatingAnalytics:", error);
    throw error;
  }
};

/**
 * Delete a rating (admin only)
 * @param ratingId - The ID of the rating to delete
 * @returns Promise with success status
 */
export const deleteRating = async (ratingId: string): Promise<void> => {
  try {
    // First get the rating to know which menu item to update
    const { data: rating, error: fetchError } = await supabase
      .from("ratings")
      .select("menu_item_id")
      .eq("id", ratingId)
      .single();

    if (fetchError || !rating) {
      throw new Error("Rating not found");
    }

    // Delete the rating
    const { error: deleteError } = await supabase
      .from("ratings")
      .delete()
      .eq("id", ratingId);

    if (deleteError) {
      console.error("Error deleting rating:", deleteError);
      throw new Error("Failed to delete rating");
    }

    // Update the menu item's average rating
    // Note: This would typically be done via a database trigger in production
    // For now, we'll import and use the updateMenuItemRating function
    const { updateMenuItemRating } = await import("@/services/ratingService");
    await updateMenuItemRating(rating.menu_item_id);
  } catch (error) {
    console.error("Error in deleteRating:", error);
    throw error;
  }
};

/**
 * Get detailed rating information for a specific menu item and restaurant
 * @param menuItemId - The menu item ID
 * @param restaurantId - The restaurant ID
 * @returns Promise with detailed rating data
 */
export const getDetailedRatingInfo = async (
  menuItemId: string,
  restaurantId: string
): Promise<{
  ratings: Rating[];
  stats: RatingStats;
  distribution: { [key: number]: number };
}> => {
  try {
    const ratings = await getRatingsByMenuItemAndRestaurant(
      menuItemId,
      restaurantId
    );
    const stats = await getRatingStatsByMenuItemAndRestaurant(
      menuItemId,
      restaurantId
    );

    // Calculate rating distribution
    const distribution: { [key: number]: number } = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = ratings.filter((r) => r.rating === i).length;
    }

    return {
      ratings,
      stats,
      distribution,
    };
  } catch (error) {
    console.error("Error in getDetailedRatingInfo:", error);
    throw error;
  }
};
