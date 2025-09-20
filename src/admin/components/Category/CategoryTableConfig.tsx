import { useThemeClasses } from "@/hooks/useThemeClasses";
import { TableColumn, TableAction } from "@/admin/components/Table";
import { Category } from "@/admin/types/admin";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Edit, Trash2, Eye, Activity } from "lucide-react";

interface CategoryTableConfigProps {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const useCategoryTableConfig = ({
  onEdit,
  onDelete,
}: CategoryTableConfigProps) => {
  const { language } = useLanguage();
  const theme = useThemeClasses();
  const t = defaultAdminConfig.ui.categories;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const columns: TableColumn<Category>[] = [
    {
      key: "label_en",
      title: getText("labelEn"),
      sortable: true,
      filterable: true,
      width: "25%",
      render: (value, row) => (
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
      key: "label_ar",
      title: getText("labelAr"),
      sortable: true,
      filterable: true,
      width: "25%",
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
      width: "25%",
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

  const actions: TableAction<Category>[] = [
    {
      label: getText("editCategory"),
      icon: <Edit className="w-4 h-4" />,
      onClick: (category) => onEdit(category),
      variant: "primary",
    },
    {
      label: getText("deleteCategory"),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (category) => onDelete(category),
      variant: "danger",
    },
  ];
  return { columns, actions };
};
