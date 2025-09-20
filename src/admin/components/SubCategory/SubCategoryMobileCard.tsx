import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { SubCategory } from "@/admin/types/admin";
import { Edit, Trash2, MoreVertical } from "lucide-react";

interface SubCategoryMobileCardProps {
  subcategory: SubCategory;
  onEdit?: (subcategory: SubCategory) => void;
  onDelete?: (subcategory: SubCategory) => void;
  onClick?: (subcategory: SubCategory) => void;
  className?: string;
}

export function SubCategoryMobileCard({
  subcategory,
  onEdit,
  onDelete,
  onClick,
  className = "",
}: SubCategoryMobileCardProps) {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.categories; // Using same text config as categories for consistency
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;
  const [showActionsMenu, setShowActionsMenu] = React.useState(false);
  const [displaySubCategory, setDisplaySubCategory] =
    React.useState(subcategory);

  // Update display subcategory when prop changes
  React.useEffect(() => {
    setDisplaySubCategory(subcategory);
  }, [subcategory]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Truncate text for display
  const truncateText = (text: string, maxLength: number = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get category name
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

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(displaySubCategory);
    } else if (onEdit) {
      onEdit(displaySubCategory);
    }
  };

  // Handle action click
  const handleActionClick = (action: () => void, e: React.MouseEvent) => {
    e.stopPropagation();
    action();
    setShowActionsMenu(false);
  };

  // Define actions
  const actions = [
    ...(onEdit
      ? [
          {
            label: "Edit SubCategory",
            icon: <Edit className="w-4 h-4" />,
            onClick: onEdit,
            variant: "primary" as const,
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            label: "Delete SubCategory",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: onDelete,
            variant: "danger" as const,
          },
        ]
      : []),
  ];

  return (
    <div
      className={`${
        theme.isDark ? theme.bgPrimary : theme.bgCard
      } relative rounded-[25px] ${theme.topbarShadowStyle} w-full ${
        onClick || onEdit ? "cursor-pointer" : ""
      } ${className} mb-3 border ${theme.borderSubCategory} p-4 min-h-[140px]`}
      onClick={handleCardClick}
    >
      {/* Top Row: ID, Image, Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Category ID Badge */}
          <div
            className={`inline-flex items-center justify-center h-6 px-2 py-1 rounded-full ${theme.bgSecondary}`}
          >
            <span className={`text-[10px] font-bold ${theme.textSecondary}`}>
              #{displaySubCategory.id.toString().slice(-8)}
            </span>
          </div>

          {/* Image */}
          {displaySubCategory.thumbnail_url || displaySubCategory.image_url ? (
            <img
              src={
                displaySubCategory.thumbnail_url || displaySubCategory.image_url
              }
              alt={displaySubCategory.label_en}
              className="w-10 h-10 object-cover rounded-xl border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div
              className={`w-10 h-10 ${theme.bgSecondary} rounded-xl flex items-center justify-center`}
            >
              <span className={`text-xs ${theme.textSecondary}`}>No</span>
            </div>
          )}
        </div>

        {/* Actions Menu */}
        {actions.length > 0 && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionsMenu(!showActionsMenu);
              }}
              className={`${theme.bgSecondary} p-1 rounded-full w-[22px] h-[22px] flex items-center justify-center ${theme.itemHover} transition-colors`}
            >
              <MoreVertical
                className={`w-3 h-3 ${
                  theme.isDark ? "text-white" : theme.textPrimary
                }`}
              />
            </button>

            {showActionsMenu && (
              <div
                className={`absolute ${
                  language === "en" ? "right-0" : "left-0"
                } top-full mt-1 z-10 ${theme.bgPrimary} rounded-lg ${
                  theme.topbarShadowStyle
                } border ${theme.borderSubCategory} py-1 min-w-[140px]`}
              >
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={(e) =>
                      handleActionClick(
                        () => action.onClick(displaySubCategory),
                        e
                      )
                    }
                    className={`
                      w-full px-3 py-2 text-sm text-left flex items-center gap-2
                      transition-colors
                      ${
                        theme.isDark ? theme.textSecondary : theme.textPrimary
                      } ${theme.itemHover}
                      ${
                        action.variant === "danger"
                          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          : ""
                      }
                    `}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main SubCategory Info */}
      <div className="space-y-2 mb-4">
        {/* Parent Category */}
        <div
          className={`text-xs ${theme.textSecondary} ${
            theme.isDark
              ? "bg-orange-800 text-orange-100"
              : "bg-orange-100 text-orange-800"
          } px-2 py-1 rounded-full inline-block`}
        >
          {getCategoryName(displaySubCategory.category)}
        </div>

        {/* English Label (Primary) */}
        <div>
          <div
            className={`text-left text-lg font-bold ${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            } leading-tight`}
          >
            {displaySubCategory.label_en}
          </div>
        </div>

        {/* Arabic Label */}
        <div
          className={`text-sm ${
            theme.isDark ? theme.textSecondary : theme.textPrimary
          }`}
        >
          <span className="font-medium">{getText("labelAr")}: </span>
          {truncateText(displaySubCategory.label_ar)}
        </div>

        {/* Kurdish Label */}
        <div
          className={`text-sm ${
            theme.isDark ? theme.textSecondary : theme.textPrimary
          }`}
        >
          <span className="font-medium">{getText("labelKu")}: </span>
          {truncateText(displaySubCategory.label_ku)}
        </div>
      </div>

      {/* Footer Info */}
      <div
        className={`flex flex-col sm:flex-row sm:justify-between gap-1 text-xs ${theme.textSecondary} pt-2 border-t ${theme.borderSubCategory}`}
      >
        <div>
          <span className="font-medium">{getText("created")}: </span>
          <span>{formatDate(displaySubCategory.created_at)}</span>
        </div>
        <div>
          <span className="font-medium">{getText("updated")}: </span>
          <span>{formatDate(displaySubCategory.updated_at)}</span>
        </div>
      </div>
    </div>
  );
}

export default SubCategoryMobileCard;
