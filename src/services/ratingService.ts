import { publicSupabase } from "@/lib/publicSupabase";

export interface Rating {
  id: string;
  menu_item_id: string; // Changed back to string to support UUIDs
  rating: number;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface RatingStats {
  average_rating: number;
  total_ratings: number;
}

/**
 * Submit a rating for a menu item
 * @param menuItemId - The UUID of the menu item being rated
 * @param rating - The rating value (1-5)
 * @returns Promise with the submitted rating
 */
export const submitRating = async (
  menuItemId: string,
  rating: number
): Promise<Rating> => {
  try {
    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      throw new Error("Rating must be an integer between 1 and 5");
    }

    // Get client info for basic duplicate prevention
    const userAgent = navigator.userAgent;

    // Insert the rating
    const { data, error } = await publicSupabase
      .from("ratings")
      .insert({
        menu_item_id: menuItemId,
        rating: rating,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) {
      console.error("Error submitting rating:", error);
      throw new Error("Failed to submit rating");
    }

    // After successful rating submission, update the menu item's average rating
    await updateMenuItemRating(menuItemId);

    return data;
  } catch (error) {
    console.error("Error in submitRating:", error);
    throw error;
  }
};

/**
 * Get rating statistics for a menu item
 * @param menuItemId - The UUID of the menu item
 * @returns Promise with rating statistics
 */
export const getRatingStats = async (
  menuItemId: string
): Promise<RatingStats> => {
  try {
    const { data, error } = await publicSupabase
      .from("ratings")
      .select("rating")
      .eq("menu_item_id", menuItemId);

    if (error) {
      console.error("Error fetching rating stats:", error);
      throw new Error("Failed to fetch rating statistics");
    }

    if (!data || data.length === 0) {
      return {
        average_rating: 0,
        total_ratings: 0,
      };
    }

    const totalRatings = data.length;
    const sumRatings = data.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = Math.round((sumRatings / totalRatings) * 10) / 10; // Round to 1 decimal place

    return {
      average_rating: averageRating,
      total_ratings: totalRatings,
    };
  } catch (error) {
    console.error("Error in getRatingStats:", error);
    throw error;
  }
};

/**
 * Update the menu item's rating field with the current average
 * @param menuItemId - The UUID of the menu item
 */
export const updateMenuItemRating = async (
  menuItemId: string
): Promise<void> => {
  try {
    // Get current rating stats
    const stats = await getRatingStats(menuItemId);

    // Update the menu item's rating field
    const { error } = await publicSupabase
      .from("menu_items")
      .update({ rating: stats.average_rating })
      .eq("id", menuItemId);

    if (error) {
      console.error("Error updating menu item rating:", error);
      throw new Error("Failed to update menu item rating");
    }
  } catch (error) {
    console.error("Error in updateMenuItemRating:", error);
    throw error;
  }
};

/**
 * Check if user has already rated this item (basic prevention using user agent)
 * @param menuItemId - The UUID of the menu item
 * @returns Promise with boolean indicating if user has rated
 */
export const hasUserRated = async (menuItemId: string): Promise<boolean> => {
  try {
    const userAgent = navigator.userAgent;

    const { data, error } = await publicSupabase
      .from("ratings")
      .select("id")
      .eq("menu_item_id", menuItemId)
      .eq("user_agent", userAgent)
      .limit(1);

    if (error) {
      console.error("Error checking user rating:", error);
      return false; // If error, allow rating attempt
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Error in hasUserRated:", error);
    return false; // If error, allow rating attempt
  }
};

/**
 * Get ratings for a specific menu item and restaurant
 * @param menuItemId - The UUID of the menu item
 * @param restaurantId - The UUID of the restaurant
 * @returns Promise with array of ratings
 */
export const getRatingsByMenuItemAndRestaurant = async (
  menuItemId: string,
  restaurantId: string
): Promise<Rating[]> => {
  try {
    // First, verify that the menu item belongs to the specified restaurant
    const { data: menuItemData, error: menuItemError } = await publicSupabase
      .from("menu_items")
      .select("restaurant_id")
      .eq("id", menuItemId)
      .single();

    if (menuItemError) {
      console.error("Error verifying menu item restaurant:", menuItemError);
      throw new Error("Failed to verify menu item restaurant");
    }

    if (!menuItemData || menuItemData.restaurant_id !== restaurantId) {
      throw new Error("Menu item does not belong to the specified restaurant");
    }

    // Get all ratings for the menu item
    const { data, error } = await publicSupabase
      .from("ratings")
      .select("*")
      .eq("menu_item_id", menuItemId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching ratings:", error);
      throw new Error("Failed to fetch ratings");
    }

    return data || [];
  } catch (error) {
    console.error("Error in getRatingsByMenuItemAndRestaurant:", error);
    throw error;
  }
};

/**
 * Get rating statistics for a specific menu item and restaurant
 * @param menuItemId - The UUID of the menu item
 * @param restaurantId - The UUID of the restaurant
 * @returns Promise with rating statistics
 */
export const getRatingStatsByMenuItemAndRestaurant = async (
  menuItemId: string,
  restaurantId: string
): Promise<RatingStats> => {
  try {
    // Get all ratings for the menu item and restaurant
    const ratings = await getRatingsByMenuItemAndRestaurant(
      menuItemId,
      restaurantId
    );

    if (!ratings || ratings.length === 0) {
      return {
        average_rating: 0,
        total_ratings: 0,
      };
    }

    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = Math.round((sumRatings / totalRatings) * 10) / 10; // Round to 1 decimal place

    return {
      average_rating: averageRating,
      total_ratings: totalRatings,
    };
  } catch (error) {
    console.error("Error in getRatingStatsByMenuItemAndRestaurant:", error);
    throw error;
  }
};
