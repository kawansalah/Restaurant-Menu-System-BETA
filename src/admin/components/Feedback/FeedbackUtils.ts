import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Feedback } from "@/admin/types/admin";
import { exportFeedbackData } from "@/admin/services/feedbackService";

export const useFeedbackUtils = () => {
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.feedback;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const handleExportFeedback = useCallback(async (): Promise<void> => {
    try {
      const feedback = await exportFeedbackData();

      if (feedback.length === 0) {
        alert(getText("noFeedbackFound"));
        return;
      }

      // Convert feedback to CSV format
      const headers = [
        getText("customerName"),
        getText("email"),
        getText("phone"),
        getText("message"),
        getText("rating"),
        getText("created"),
      ];

      const csvContent = [
        headers.join(","),
        ...feedback.map((item: Feedback) =>
          [
            `"${item.customer_name || ""}"`,
            `"${item.email || ""}"`,
            `"${item.phone || ""}"`,
            `"${item.message.replace(/"/g, '""')}"`,
            item.rating || "",
            `"${new Date(item.created_at).toLocaleDateString()}"`,
          ].join(",")
        ),
      ].join("\n");

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `feedback_export_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting feedback:", error);
      alert(`${getText("errorPrefix")} ${getText("failedToLoad")}`);
    }
  }, [getText]);

  const formatRating = useCallback((rating?: number): string => {
    if (!rating) return "-";
    return `${rating} ★`;
  }, []);

  const formatDate = useCallback(
    (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString(
        language === "ku" ? "ku-IQ" : language === "ar" ? "ar-IQ" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    },
    [language]
  );

  const truncateText = useCallback(
    (text: string, maxLength: number = 100): string => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    },
    []
  );

  return {
    getText,
    handleExportFeedback,
    formatRating,
    formatDate,
    truncateText,
  };
};
