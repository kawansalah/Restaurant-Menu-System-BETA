import React, { useState } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { AdminMenuItem } from "@/admin/types/admin";
import {
  getMenuItemDisplayName,
  getMenuItemDescription,
  formatPrice,
  getRatingColor,
  getStatusColor,
} from "./MenuItemConstants";
import {
  formatDate,
  truncateText,
  getAvailabilityStatusText,
} from "./MenuItemUtils";
import {
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  MapPin,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/admin/components/Input";

interface MenuItemMobileCardProps {
  menuItem: AdminMenuItem;
  isSelected: boolean;
  onSelect: (menuItem: AdminMenuItem) => void;
  onEdit: (menuItem: AdminMenuItem) => void;
  onDelete: (menuItem: AdminMenuItem) => void;
  onToggleAvailability: (menuItem: AdminMenuItem) => void;
}

const MenuItemMobileCard: React.FC<MenuItemMobileCardProps> = ({
  menuItem,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();

  // Get category name in current language
  const getCategoryName = (category: any): string => {
    if (!category) return "No Category";
    switch (language) {
      case "ku":
        return category.label_ku || category.label_en;
      case "ar":
        return category.label_ar || category.label_en;
      case "en":
      default:
        return category.label_en;
    }
  };

  // Get subcategory name in current language
  const getSubCategoryName = (subcategory: any): string => {
    if (!subcategory) return "";
    switch (language) {
      case "ku":
        return subcategory.label_ku || subcategory.label_en;
      case "ar":
        return subcategory.label_ar || subcategory.label_en;
      case "en":
      default:
        return subcategory.label_en;
    }
  };

  const getText = (key: string) => {
    const texts = {
      edit: {
        en: "Edit",
        ar: "تحرير",
        ku: "دەستکاریکردن",
      },
      makeAvailable: {
        en: "Make Available",
        ar: "جعل متاح",
        ku: "گۆڕینی دۆخ",
      },
      makeUnavailable: {
        en: "Make Unavailable",
        ar: "جعل غير متاح",
        ku: "گۆڕینی دۆخ",
      },
      delete: {
        en: "Delete",
        ar: "حذف",
        ku: "سڕینەوە",
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
  const [showActions, setShowActions] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  const name = getMenuItemDisplayName(menuItem, language);
  const description = getMenuItemDescription(menuItem, language);
  const statusColor = getStatusColor(menuItem.is_available);
  const ratingColor = getRatingColor(menuItem.rating || 0);
  const price = formatPrice(menuItem.price);
  const availabilityText = getAvailabilityStatusText(
    menuItem.is_available,
    language
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't interact when touching action buttons
    if ((e.target as HTMLElement).closest(".action-button")) {
      return;
    }

    setIsLongPress(false);
    const timer = setTimeout(() => {
      setIsLongPress(true);
      onSelect(menuItem);
    }, 500);
    setPressTimer(timer);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't interact when clicking action buttons
    if ((e.target as HTMLElement).closest(".action-button")) {
      return;
    }

    // Only show modal if it wasn't a long press
    if (!isLongPress) {
      // Show modal - for now we'll use the edit function as the modal
      onEdit(menuItem);
    }
    setIsLongPress(false);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowActions(false);
  };

  return (
    <div
      className={`${
        theme.isDark ? theme.bgPrimary : theme.bgCard
      } relative rounded-[25px] ${
        theme.topbarShadowStyle
      } w-full cursor-pointer mb-3 border ${
        theme.borderSubCategory
      } p-4 min-h-[140px] transition-all duration-200
        ${isSelected ? "ring-2 ring-[var(--bg-main)] ring-opacity-50" : ""}
      `}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Top Row: ID, Checkbox, Image, Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <Input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(menuItem)}
            className="w-4 h-4 text-[var(--bg-main)] border-gray-300 rounded focus:ring-[var(--bg-main)]"
          />

          {/* Menu Item ID Badge */}
          <div
            className={`inline-flex items-center justify-center h-6 px-2 py-1 rounded-full ${theme.bgSecondary}`}
          >
            <span className={`text-[10px] font-bold ${theme.textSecondary}`}>
              #{menuItem.id.slice(-8)}
            </span>
          </div>

          {/* Image - Made Larger */}
          {menuItem.image_url ? (
            <img
              src={menuItem.image_url}
              alt={name}
              className="w-16 h-16 object-cover rounded-xl border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div
              className={`w-16 h-16 ${theme.bgSecondary} rounded-xl flex items-center justify-center`}
            >
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className={`${theme.bgSecondary} p-1 rounded-full w-[22px] h-[22px] flex items-center justify-center ${theme.itemHover} transition-colors`}
          >
            <MoreVertical
              className={`w-3 h-3 ${
                theme.isDark ? "text-white" : theme.textPrimary
              }`}
            />
          </button>

          {showActions && (
            <div
              className={`absolute ${
                language === "en" ? "right-0" : "left-0"
              } top-full mt-1 z-10 ${theme.bgPrimary} rounded-lg ${
                theme.topbarShadowStyle
              } border ${theme.borderSubCategory} py-1 min-w-[140px]`}
            >
              <button
                onClick={(e) => handleActionClick(e, () => onEdit(menuItem))}
                className={`
                  w-full px-3 py-2 text-sm text-left flex items-center gap-2
                  transition-colors
                  ${theme.isDark ? theme.textSecondary : theme.textPrimary} ${
                  theme.itemHover
                }
                `}
              >
                <Edit className="h-3 w-3" />
                {getText("edit")}
              </button>
              <button
                onClick={(e) =>
                  handleActionClick(e, () => onToggleAvailability(menuItem))
                }
                className={`
                  w-full px-3 py-2 text-sm text-left flex items-center gap-2
                  transition-colors
                  ${theme.isDark ? theme.textSecondary : theme.textPrimary} ${
                  theme.itemHover
                }
                `}
              >
                <Package className="h-3 w-3" />
                {menuItem.is_available
                  ? getText("makeUnavailable")
                  : getText("makeAvailable")}
              </button>
              <button
                onClick={(e) => handleActionClick(e, () => onDelete(menuItem))}
                className={`
                  w-full px-3 py-2 text-sm text-left flex items-center gap-2
                  transition-colors
                  ${theme.isDark ? theme.textSecondary : theme.textPrimary} ${
                  theme.itemHover
                }
                  text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                `}
              >
                <Trash2 className="h-3 w-3" />
                {getText("delete")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="mb-3">
        <h3
          className={`font-semibold ${
            theme.isDark ? theme.textSecondary : theme.textPrimary
          } text-sm leading-tight mb-1`}
        >
          {name}
        </h3>

        {description && (
          <p className={`text-xs ${theme.textSecondary} leading-tight mb-2`}>
            {truncateText(description, 60)}
          </p>
        )}

        {/* Category and Subcategory */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`
            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
            text-white bg-[#FF8E53]
          `}
          >
            {getCategoryName(menuItem.category)}
          </span>
          {menuItem.subcategory && (
            <span
              className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
              text-white bg-[#799FFF]
            `}
            >
              {getSubCategoryName(menuItem.subcategory)}
            </span>
          )}
        </div>
      </div>

      {/* Price and Rating */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${theme.textPrimary}`}>
              {price}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {menuItem.rating && menuItem.rating > 0 ? (
              <div
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                  ${ratingColor.bg} ${ratingColor.text} ${ratingColor.border}
                  border transition-all duration-200 hover:shadow-sm
                `}
              >
                <Star className="h-3 w-3 fill-current" />
                <span>{menuItem.rating.toFixed(1)}</span>
              </div>
            ) : (
              <span className={`text-xs ${theme.textSecondary}`}>
                No rating
              </span>
            )}
            {/* Rating Count */}
            <span className={`text-xs ${theme.textSecondary}`}>
              ({menuItem.rating_count || 0})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div
            className={`
            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            ${statusColor}
          `}
          >
            {availabilityText}
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="h-3 w-3" />
              {menuItem.views_count || 0} views
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div
        className={`flex flex-col sm:flex-row sm:justify-between gap-1 text-xs ${theme.textSecondary} pt-2 border-t ${theme.borderSubCategory}`}
      >
        <div>
          <span className="font-medium">Created: </span>
          <span>{formatDate(menuItem.created_at)}</span>
        </div>
        <div>
          <span className="font-medium">Updated: </span>
          <span>{formatDate(menuItem.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuItemMobileCard;
