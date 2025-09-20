import React, { useState } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlerts } from "@/hooks/useAlerts";
import {
  Trash2,
} from "lucide-react";
import { Feedback } from "@/admin/types/admin";
import { bulkDeleteFeedback } from "@/admin/services/feedbackService";
import { defaultAdminConfig } from "@/admin/config/adminConfig";

interface FeedbackBulkActionsProps {
  selectedItems: Feedback[];
  onSelectionChange: (items: Feedback[]) => void;
  onActionComplete: () => void;
}

export const FeedbackBulkActions: React.FC<FeedbackBulkActionsProps> = ({
  selectedItems,
  onSelectionChange,
  onActionComplete,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const alerts = useAlerts();
  const t = defaultAdminConfig.ui.feedback;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) {
      alerts.showError("Please select items first", "No items selected");
      return;
    }

    if (action === "delete") {
        const confirmed = await alerts.confirm(
          `${getText("confirmBulkDelete")} ${selectedItems.length} feedback items?`,
          getText("confirmDelete") || "Confirm Delete",
          getText("delete"),
          "Cancel"
        );

        if (!confirmed) return;
      }

    await executeBulkAction(action);
  };

  const executeBulkAction = async (action: string) => {
    setIsProcessing(true);
    const selectedIds = selectedItems.map((item) => item.id);

    try {
      switch (action) {
        case "delete":
          await bulkDeleteFeedback(selectedIds);
          alerts.showSuccess(
            `${selectedItems.length} feedback deleted successfully`,
            "Items deleted"
          );
          onSelectionChange([]);
          onActionComplete();
          break;
      }
    } catch (error) {
      alerts.showError(
        error instanceof Error ? error.message : "Unknown error occurred",
        "Operation failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={`${theme.bgCard} rounded-3xl p-3 sm:p-4 ${theme.topbarShadowStyle} border ${theme.borderCategory}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full ${theme.bgMain} flex items-center justify-center ${theme.buttonTextPrimary} font-bold text-sm`}
            >
              {selectedItems.length}
            </div>
            <span
              className={`font-semibold text-sm sm:text-base ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {getText("selectedFeedback")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
            <button
              onClick={() => handleBulkAction("delete")}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#f86262] dark:bg-[#f86262] text-white font-medium hover:bg-[#f86262] dark:hover:bg-[#f86262] transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">{getText("delete")}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};