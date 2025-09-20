import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Category } from "@/admin/types/admin";
import Button from "@/components/Button";
import { Trash2 } from "lucide-react";

interface CategoryBulkActionsProps {
  selectedCategories: Category[];
  onBulkDelete: () => void;
}

const CategoryBulkActions: React.FC<CategoryBulkActionsProps> = ({
  selectedCategories,
  onBulkDelete,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.categories;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div className="hidden md:block">
      <div
        className={`${theme.bgCard} rounded-3xl p-6 border ${theme.borderCategory}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3
              className={`text-lg font-semibold ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              }`}
            >
              {getText("bulkActions")}
            </h3>
            <div
              className={`px-3 py-1 rounded-full ${theme.bgSecondary} ${theme.textSecondary} text-sm`}
            >
              {selectedCategories.length} {getText("selectedCategories")}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="delete" onClick={onBulkDelete}>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                {getText("delete")}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBulkActions;
