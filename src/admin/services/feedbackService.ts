import supabase from "@/lib/supabase";
import { Feedback, FeedbackStats, FeedbackFilters } from "@/admin/types/admin";

// Fetch all feedback with optional filters
export const fetchFeedback = async (
  filters?: FeedbackFilters
): Promise<Feedback[]> => {
  try {
    let query = supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply search filter
    if (filters?.search) {
      query = query.or(
        `customer_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,message.ilike.%${filters.search}%`
      );
    }

    // Apply rating filter
    if (filters?.rating) {
      query = query.eq("rating", filters.rating);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching feedback:", error);
      throw new Error(`Failed to fetch feedback: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchFeedback:", error);
    throw error;
  }
};

// Get feedback statistics
export const getFeedbackStats = async (): Promise<FeedbackStats> => {
  try {
    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from("feedback")
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw new Error(`Failed to get feedback count: ${countError.message}`);
    }

    // Get average rating
    const { data: ratingData, error: ratingError } = await supabase
      .from("feedback")
      .select("rating")
      .not("rating", "is", null);

    if (ratingError) {
      throw new Error(`Failed to get ratings: ${ratingError.message}`);
    }

    const averageRating =
      ratingData && ratingData.length > 0
        ? ratingData.reduce((sum, item) => sum + (item.rating || 0), 0) /
          ratingData.length
        : 0;

    // Get rating distribution
    const { data: ratingDistribution, error: distributionError } =
      await supabase
        .from("feedback")
        .select("rating")
        .not("rating", "is", null);

    if (distributionError) {
      throw new Error(
        `Failed to get rating distribution: ${distributionError.message}`
      );
    }

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution?.forEach((item) => {
      if (item.rating && item.rating >= 1 && item.rating <= 5) {
        distribution[item.rating as keyof typeof distribution]++;
      }
    });

    return {
      total: totalCount || 0,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution: distribution,
      totalWithRating: ratingData?.length || 0,
    };
  } catch (error) {
    console.error("Error in getFeedbackStats:", error);
    throw error;
  }
};

// Delete feedback by ID
export const deleteFeedback = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("feedback").delete().eq("id", id);

    if (error) {
      console.error("Error deleting feedback:", error);
      throw new Error(`Failed to delete feedback: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteFeedback:", error);
    throw error;
  }
};

// Bulk delete feedback
export const bulkDeleteFeedback = async (ids: string[]): Promise<void> => {
  try {
    if (ids.length === 0) {
      throw new Error("No feedback IDs provided for deletion");
    }

    const { error } = await supabase.from("feedback").delete().in("id", ids);

    if (error) {
      console.error("Error bulk deleting feedback:", error);
      throw new Error(`Failed to bulk delete feedback: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in bulkDeleteFeedback:", error);
    throw error;
  }
};

// Export feedback data (for admin use)
export const exportFeedbackData = async (): Promise<Feedback[]> => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error exporting feedback data:", error);
      throw new Error(`Failed to export feedback data: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in exportFeedbackData:", error);
    throw error;
  }
};
