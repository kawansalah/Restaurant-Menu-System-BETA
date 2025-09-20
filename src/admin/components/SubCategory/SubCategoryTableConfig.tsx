import { useThemeClasses } from "@/hooks/useThemeClasses";
import { TableColumn, TableAction } from "@/admin/components/Table";
import { SubCategory } from "@/admin/types/admin";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Edit, Trash2 } from "lucide-react";

interface SubCategoryTableConfigProps {
  onEdit: (subcategory: SubCategory) => void;
  onDelete: (subcategory: SubCategory) => void;
}

export const useSubCategoryTableConfig = ({
  onEdit,
  onDelete,
}: SubCategoryTableConfigProps) => {
  const { language } = useLanguage();
  const theme = useThemeClasses();
  const t = defaultAdminConfig.ui.categories; // Using same text config as categories for consistency
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  // Get category name based on language
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

  const columns: TableColumn<SubCategory>[] = [
    {
      key: "label_en",
      title: getText("labelEn"),
      sortable: true,
      filterable: true,
      width: "20%",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {/* Image */}
          {row.thumbnail_url || row.image_url ? (
            <img
              src={row.thumbnail_url || row.image_url}
              alt={value}
              className="w-8 h-8 object-cover rounded-lg border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div
              className={`w-8 h-8 ${theme.bgSecondary} rounded-lg flex items-center justify-center`}
            >
              <span className={`text-xs ${theme.textSecondary}`}>No</span>
            </div>
          )}
          <div>
            <div
              className={`font-semibold ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {value}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "label_ar",
      title: getText("labelAr"),
      sortable: true,
      filterable: true,
      width: "20%",
      render: (value) => (
        <div className="flex items-center gap-3">
          <div>
            <div
              className={`font-semibold ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {value}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "label_ku",
      title: getText("labelKu"),
      sortable: true,
      filterable: true,
      width: "20%",
      render: (value) => (
        <div className="flex items-center gap-3">
          <div>
            <div
              className={`font-semibold ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {value}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      title: "Category", // Using hardcoded as this is specific to subcategories
      sortable: false,
      filterable: true,
      width: "15%",
      render: (_, row) => (
        <div className="flex items-center gap-2">
        <span
            className={`text-sm px-4 py-1 rounded-full ${
            theme.isDark 
                ? "bg-orange-800 text-orange-100" 
                : "bg-orange-100 text-orange-800"
            } ${
            theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            }`}
        >
            {getCategoryName(row.category)}
        </span>
        </div>
      ),
    },
    {
      key: "created_at",
      title: getText("created"),
      sortable: true,
      width: "12.5%",
      render: (value: string) => {
        return (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        );
      },
    },
    {
      key: "updated_at",
      title: getText("updated"),
      sortable: true,
      width: "12.5%",
      render: (value: string) => {
        return (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        );
      },
    },
  ];

  const actions: TableAction<SubCategory>[] = [
    {
      label: "Edit SubCategory", // Using specific text for subcategories
      icon: <Edit className="w-4 h-4" />,
      onClick: (subcategory) => onEdit(subcategory),
      variant: "primary",
    },
    {
      label: "Delete SubCategory", // Using specific text for subcategories
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (subcategory) => onDelete(subcategory),
      variant: "danger",
    },
  ];

  return { columns, actions };
};
