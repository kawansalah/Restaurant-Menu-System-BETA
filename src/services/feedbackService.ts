import supabase from "@/lib/supabase";
import { publicSupabase } from "@/lib/publicSupabase";

export interface FeedbackData {
  foodQuality: number;
  serviceQuality: number;
  cleanliness: number;
  overallSatisfaction: number;
  staffBehavior: number;
}

export interface ContactFormData {
  phone: string;
  tableNumber: string;
  comment: string;
}

export interface FeedbackSubmission extends FeedbackData, ContactFormData {
  restaurantId: string;
  name?: string;
  email?: string;
}

export interface FeedbackRecord {
  id: string;
  restaurant_id: string;
  customer_name?: string;
  email?: string;
  phone: string;
  message: string;
  rating: number;
  created_at: string;
}

/**
 * Submit feedback to Supabase (public access)
 */
export const submitFeedback = async (feedbackData: FeedbackSubmission) => {
  try {
    // Calculate average rating from all individual ratings
    const ratings = [
      feedbackData.foodQuality,
      feedbackData.serviceQuality,
      feedbackData.cleanliness,
      feedbackData.staffBehavior,
      feedbackData.overallSatisfaction,
    ].filter((rating) => rating > 0); // Only include ratings that were actually given

    if (ratings.length === 0) {
      throw new Error("At least one rating must be provided");
    }

    const averageRating = Math.round(
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    );

    const feedbackRecord = {
      restaurant_id: feedbackData.restaurantId,
      customer_name: feedbackData.name || null,
      email: feedbackData.email || null,
      phone: feedbackData.phone,
      message: feedbackData.comment,
      rating: averageRating, // Store the calculated average rating
    };

    // Use public client to ensure feedback can be submitted regardless of auth status
    const { data, error } = await publicSupabase
      .from("feedback")
      .insert([feedbackRecord])
      .select()
      .single();

    if (error) {
      console.error("Error submitting feedback:", error);
      throw new Error(`Failed to submit feedback: ${error.message}`);
    }

    return data as FeedbackRecord;
  } catch (error) {
    console.error("Feedback submission error:", error);
    throw error;
  }
};

/**
 * Get feedback for a specific restaurant (admin only)
 */
export const getFeedbackByRestaurant = async (restaurantId: string) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching feedback:", error);
      throw new Error(`Failed to fetch feedback: ${error.message}`);
    }

    return data as FeedbackRecord[];
  } catch (error) {
    console.error("Feedback fetch error:", error);
    throw error;
  }
};

/**
 * Get feedback statistics for a restaurant (admin only)
 */
export const getFeedbackStats = async (restaurantId: string) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("rating")
      .eq("restaurant_id", restaurantId);

    if (error) {
      console.error("Error fetching feedback stats:", error);
      throw new Error(`Failed to fetch feedback stats: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
      };
    }

    const totalFeedback = data.length;
    const averageRating =
      data.reduce((sum, item) => sum + (item.rating || 0), 0) / totalFeedback;

    return {
      totalFeedback,
      averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
    };
  } catch (error) {
    console.error("Feedback stats error:", error);
    throw error;
  }
};
