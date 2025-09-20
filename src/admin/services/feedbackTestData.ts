import supabase from "@/lib/supabase";

// Function to insert sample feedback data for testing
export const insertSampleFeedbackData = async () => {
  try {
    const sampleData = [
      {
        customer_name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        message: "Great food and excellent service! I really enjoyed my meal.",
        rating: 5,
      },
      {
        customer_name: "Sarah Smith",
        email: "sarah@example.com",
        phone: "+1234567891",
        message: "Good food but service could be improved.",
        rating: 4,
      },
      {
        customer_name: "Ahmed Ali",
        email: "ahmed@example.com",
        phone: "+1234567892",
        message: "Average experience. Food was okay.",
        rating: 3,
      },
      {
        customer_name: "Maria Garcia",
        email: "maria@example.com",
        message: "Excellent restaurant! Will definitely come back.",
        rating: 5,
      },
      {
        customer_name: null,
        email: null,
        phone: null,
        message: "Anonymous feedback - food was delicious!",
        rating: 4,
      },
    ];

    const { data, error } = await supabase
      .from("feedback")
      .insert(sampleData)
      .select();

    if (error) {
      console.error("Error inserting sample data:", error);
      throw error;
    }

    console.log("Sample feedback data inserted:", data);
    return data;
  } catch (error) {
    console.error("Failed to insert sample data:", error);
    throw error;
  }
};

// Function to check if feedback table is empty
export const checkFeedbackTableEmpty = async (): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from("feedback")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error checking feedback table:", error);
      return false;
    }

    return count === 0;
  } catch (error) {
    console.error("Error checking feedback table:", error);
    return false;
  }
};
