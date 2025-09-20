import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useSubCategoryUtils } from "./SubCategoryUtils";
import { Layers } from "lucide-react";

interface SubCategoryStatsCardsProps {
  stats: {
    total: number;
  };
}

const SubCategoryStatsCards: React.FC<SubCategoryStatsCardsProps> = ({
  stats,
}) => {
  const theme = useThemeClasses();
  const { getText } = useSubCategoryUtils();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total SubCategories */}
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory} transition-all duration-200`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Layers className={`w-5 h-5 ${theme.textMain}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>
              {getText("pageTitle")}
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

export default SubCategoryStatsCards;
