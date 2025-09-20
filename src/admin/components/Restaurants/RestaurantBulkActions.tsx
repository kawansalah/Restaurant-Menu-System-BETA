import React, { useState } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlerts } from "@/hooks/useAlerts";
import {
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Restaurant } from "@/admin/types/admin";
import {
  deleteRestaurants,
  bulkToggleRestaurantStatus,
} from "@/admin/services/restaurantService";

interface RestaurantBulkActionsProps {
  selectedItems: Restaurant[];
  allItems: Restaurant[];
  onSelectionChange: (items: Restaurant[]) => void;
  onActionComplete: () => void;
}

const RestaurantBulkActions: React.FC<RestaurantBulkActionsProps> = ({
  selectedItems,
  onSelectionChange,
  onActionComplete,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const alerts = useAlerts();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const getText = (key: string) => {
    const texts = {
      deleteSelected: {
        en: "Delete Selected",
        ar: "حذف المحدد",
        ku: "هەڵبژراوەکان بسڕەوە",
      },
      activate: {
        en: "Activate",
        ar: "تفعيل",
        ku: "چالاککردن",
      },
      deactivate: {
        en: "Deactivate",
        ar: "إلغاء التفعيل",
        ku: "ناچالاککردن",
      },
      confirmDelete: {
        en: "Are you sure you want to delete the selected restaurants? This action cannot be undone.",
        ar: "هل أنت متأكد من أنك تريد حذف المطاعم المحددة؟ لا يمكن التراجع عن هذا الإجراء.",
        ku: "دڵنیای کە دەتەوێت چێشتخانە هەڵبژراوەکان بسڕیتەوە؟ ئەم کردارە ناگەڕێتەوە.",
      },
      cancel: {
        en: "Cancel",
        ar: "إلغاء",
        ku: "پاشگەزبوونەوە",
      },
      confirm: {
        en: "Confirm",
        ar: "تأكيد",
        ku: "پشتڕاستکردنەوە",
      },
      processing: {
        en: "Processing...",
        ar: "جاري المعالجة...",
        ku: "لە جێبەجێکردن...",
      },
      selectedItems: {
        en: "Selected Items",
        ar: "العناصر المحددة",
        ku: "بڕگەکانی هەڵبژراو",
      },
    };

    return (
      texts[key as keyof typeof texts]?.[
        language as keyof (typeof texts)[keyof typeof texts]
      ] ||
      texts[key as keyof typeof texts]?.en ||
      key
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) {
      alerts.showError("Please select items first", "No items selected");
      return;
    }

    if (action === "delete") {
      setPendingAction(action);
      setShowConfirmDialog(true);
      return;
    }

    await executeBulkAction(action);
  };

  const executeBulkAction = async (action: string) => {
    setIsProcessing(true);
    const selectedIds = selectedItems.map((item) => item.id);

    try {
      switch (action) {
        case "delete":
          const deleteResult = await deleteRestaurants(selectedIds);
          if (deleteResult.success) {
            alerts.showSuccess(
              `${deleteResult.deletedCount} restaurants deleted successfully`,
              "Items deleted"
            );
            onSelectionChange([]);
            onActionComplete();
          } else {
            alerts.showError(
              deleteResult.error || "Failed to delete items",
              "Delete failed"
            );
          }
          break;

        case "activate":
          const activateResult = await bulkToggleRestaurantStatus(
            selectedIds,
            true
          );
          if (activateResult.success) {
            alerts.showSuccess(
              `${activateResult.updatedCount} restaurants activated`,
              "Items updated"
            );
            onActionComplete();
          } else {
            alerts.showError(
              activateResult.error || "Failed to update items",
              "Update failed"
            );
          }
          break;

        case "deactivate":
          const deactivateResult = await bulkToggleRestaurantStatus(
            selectedIds,
            false
          );
          if (deactivateResult.success) {
            alerts.showSuccess(
              `${deactivateResult.updatedCount} restaurants deactivated`,
              "Items updated"
            );
            onActionComplete();
          } else {
            alerts.showError(
              deactivateResult.error || "Failed to update items",
              "Update failed"
            );
          }
          break;
      }
    } catch (error) {
      alerts.showError(
        error instanceof Error ? error.message : "Unknown error occurred",
        "Operation failed"
      );
    } finally {
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      executeBulkAction(pendingAction);
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
              {getText("selectedItems")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
            <button
              onClick={() => handleBulkAction("activate")}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#18b577] dark:bg-[#18b577] text-white font-medium hover:bg-[#18b577] dark:hover:bg-[#18b577] transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">{getText("activate")}</span>
            </button>

            <button
              onClick={() => handleBulkAction("deactivate")}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#e98e0f] dark:bg-[#e98e0f] text-white font-medium hover:bg-[#e98e0f] dark:hover:bg-[#e98e0f] transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">{getText("deactivate")}</span>
            </button>

            <button
              onClick={() => handleBulkAction("delete")}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#f86262] dark:bg-[#f86262] text-white font-medium hover:bg-[#f86262] dark:hover:bg-[#f86262] transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">{getText("deleteSelected")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme.bgCard} rounded-lg p-6 max-w-md mx-4`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>
                {getText("confirmDelete")}
              </h3>
            </div>

            <p className={`text-sm ${theme.textSecondary} mb-6`}>
              {getText("confirmDelete")}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingAction(null);
                }}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-full ${theme.bgSecondary} ${theme.textPrimary} font-medium hover:${theme.bgMain} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {getText("cancel")}
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className="px-4 py-2 rounded-full bg-[#f86262] dark:bg-[#f86262] text-white font-medium hover:bg-[#f86262] dark:hover:bg-[#f86262] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? getText("processing") : getText("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantBulkActions;