import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Category } from "@/admin/components/Icons";

interface CategoryStatsCardsProps {
  stats: {
    total: number;
  };
}

const CategoryStatsCards: React.FC<CategoryStatsCardsProps> = ({ stats }) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.categories;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Categories */}
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory} transition-all duration-200`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Category className={`w-5 h-5 ${theme.textMain}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>
              {getText("title")}
            </span>
          </div>
          <span
            className={`text-3xl font-bold ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            }`}
          >
            {stats.total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryStatsCards;
