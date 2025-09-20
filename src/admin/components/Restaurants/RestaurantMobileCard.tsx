import React, { useState } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { Restaurant } from "@/admin/types/admin";
import {
  getRestaurantDisplayName,
  getRestaurantDescription,
  getStatusColor,
  formatPhoneNumber,
  formatWebsiteUrl,
} from "./RestaurantConstants";
import {
  formatDate,
  truncateText,
  getStatusText,
} from "./RestaurantUtils";
import {
  Edit,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/admin/components/Input";

interface RestaurantMobileCardProps {
  restaurant: Restaurant;
  isSelected: boolean;
  onSelect: (restaurant: Restaurant) => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (restaurant: Restaurant) => void;
  onToggleStatus: (restaurant: Restaurant) => void;
}

const RestaurantMobileCard: React.FC<RestaurantMobileCardProps> = ({
  restaurant,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();

  const getText = (key: string) => {
    const texts = {
      edit: {
        en: "Edit",
        ar: "تحرير",
        ku: "دەستکاریکردن",
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
      delete: {
        en: "Delete",
        ar: "حذف",
        ku: "سڕینەوە",
      },
    };

    return (
      texts[key as keyof typeof texts]?.[language as keyof (typeof texts)[keyof typeof texts]] ||
      texts[key as keyof typeof texts]?.en ||
      key
    );
  };

  const [showActions, setShowActions] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  const name = getRestaurantDisplayName(restaurant);
  const description = getRestaurantDescription(restaurant);
  const statusColor = getStatusColor(restaurant.is_active);
  const statusText = getStatusText(restaurant.is_active, language);
  const formattedPhone = formatPhoneNumber(restaurant.phone);
  const websiteUrl = formatWebsiteUrl(restaurant.website);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't interact when touching action buttons
    if ((e.target as HTMLElement).closest(".action-button")) {
      return;
    }
    
    setIsLongPress(false);
    const timer = setTimeout(() => {
      setIsLongPress(true);
      onSelect(restaurant);
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
      onEdit(restaurant);
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
      } relative rounded-[25px] ${theme.topbarShadowStyle} w-full cursor-pointer mb-3 border ${theme.borderSubCategory} p-4 min-h-[140px] transition-all duration-200
        ${isSelected ? "ring-2 ring-[var(--bg-main)] ring-opacity-50" : ""}
      `}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Top Row: ID, Checkbox, Logo, Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <Input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(restaurant)}
            className="w-4 h-4 text-[var(--bg-main)] border-gray-300 rounded focus:ring-[var(--bg-main)]"
          />
          
          {/* Restaurant ID Badge */}
          <div
            className={`inline-flex items-center justify-center h-6 px-2 py-1 rounded-full ${theme.bgSecondary}`}
          >
            <span className={`text-[10px] font-bold ${theme.textSecondary}`}>
              #{restaurant.id.slice(-8)}
            </span>
          </div>

          {/* Logo */}
          {restaurant.logo_url ? (
            <img
              src={restaurant.logo_url}
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
              <Building2 className="h-6 w-6 text-gray-400" />
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
                onClick={(e) => handleActionClick(e, () => onEdit(restaurant))}
                className={`
                  w-full px-3 py-2 text-sm text-left flex items-center gap-2
                  transition-colors
                  ${
                    theme.isDark ? theme.textSecondary : theme.textPrimary
                  } ${theme.itemHover}
                `}
              >
                <Edit className="h-3 w-3" />
                {getText("edit")}
              </button>
              <button
                onClick={(e) =>
                  handleActionClick(e, () => onToggleStatus(restaurant))
                }
                className={`
                  w-full px-3 py-2 text-sm text-left flex items-center gap-2
                  transition-colors
                  ${
                    theme.isDark ? theme.textSecondary : theme.textPrimary
                  } ${theme.itemHover}
                `}
              >
                <Building2 className="h-3 w-3" />
                {restaurant.is_active ? getText("deactivate") : getText("activate")}
              </button>
              <button
                onClick={(e) => handleActionClick(e, () => onDelete(restaurant))}
                className={`
                  w-full px-3 py-2 text-sm text-left flex items-center gap-2
                  transition-colors
                  ${
                    theme.isDark ? theme.textSecondary : theme.textPrimary
                  } ${theme.itemHover}
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
          className={`font-semibold ${theme.isDark? theme.textSecondary : theme.textPrimary} text-sm leading-tight mb-1`}
        >
          {name}
        </h3>

        {description && (
          <p className={`text-xs ${theme.textSecondary} leading-tight mb-2`}>
            {truncateText(description, 60)}
          </p>
        )}

        {/* Contact Information */}
        <div className="space-y-1 mb-2">
          {restaurant.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className={`text-xs ${theme.textSecondary} truncate`}>
                {truncateText(restaurant.address, 40)}
              </span>
            </div>
          )}
          
          {restaurant.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className={`text-xs ${theme.textSecondary}`}>
                {formattedPhone}
              </span>
            </div>
          )}
          
          {restaurant.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className={`text-xs ${theme.textSecondary} truncate`}>
                {restaurant.email}
              </span>
            </div>
          )}
          
          {restaurant.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <a
                href={websiteUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs ${theme.textMain} hover:underline truncate`}
                onClick={(e) => e.stopPropagation()}
              >
                {restaurant.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Theme Color and Status */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs ${theme.textSecondary}`}>Theme:</span>
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: restaurant.theme_color }}
            ></div>
            <span className={`text-xs ${theme.textSecondary} font-mono`}>
              {restaurant.theme_color}
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
            {statusText}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div
        className={`flex flex-col sm:flex-row sm:justify-between gap-1 text-xs ${theme.textSecondary} pt-2 border-t ${theme.borderSubCategory}`}
      >
        <div>
          <span className="font-medium">Created: </span>
          <span>{formatDate(restaurant.created_at)}</span>
        </div>
        <div>
          <span className="font-medium">Updated: </span>
          <span>{formatDate(restaurant.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMobileCard;