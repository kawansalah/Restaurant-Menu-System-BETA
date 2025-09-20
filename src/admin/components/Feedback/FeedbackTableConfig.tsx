import { useMemo } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Feedback } from "@/admin/types/admin";
import { TableColumn, TableAction } from "@/admin/components/Table";
import { Star, Trash2 } from "lucide-react";

interface FeedbackTableConfigProps {
  onDelete: (feedback: Feedback) => void;
}

export const useFeedbackTableConfig = ({
  onDelete,
}: FeedbackTableConfigProps) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.feedback;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const columns: TableColumn<Feedback>[] = useMemo(
    () => [
      {
        key: "customer_name",
        title: getText("customerName"),
        width: "150px",
        sortable: true,
        filterable: true,
        render: (value: string) => (
          <div className={`font-medium ${theme.isDark ? theme.textSecondary : theme.textPrimary} `}>
            {value || "Anonymous"}
          </div>
        ),
      },
      {
        key: "email",
        title: getText("email"),
        width: "200px",
        sortable: true,
        filterable: true,
        render: (value: string) => (
          <div className={`${theme.textSecondary}`}>{value || "-"}</div>
        ),
      },
      {
        key: "phone",
        title: getText("phone"),
        width: "120px",
        render: (value: string) => (
          <div className={`${theme.textSecondary}`}>{value || "-"}</div>
        ),
      },
      {
        key: "message",
        title: getText("message"),
        width: "300px",
        render: (value: string) => (
          <div
            className={`${theme.textSecondary} max-w-xs truncate`}
            title={value}
          >
            {value}
          </div>
        ),
      },
      {
        key: "rating",
        title: getText("rating"),
        width: "120px",
        sortable: true,
        filterable: true,
        render: (value: number) => (
          <div className="flex items-center gap-1">
            {value ? (
              <>
                <span className={`font-medium ${theme.isDark ? theme.textSecondary : theme.textPrimary}`}>
                  {value}
                </span>
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </>
            ) : (
              <span className={`${theme.textSecondary}`}>-</span>
            )}
          </div>
        ),
      },
      {
        key: "created_at",
        title: getText("created"),
        width: "150px",
        sortable: true,
        render: (value: string) => (
          <div className={`text-sm ${theme.textSecondary}`}>
            {new Date(value).toLocaleDateString(
              language === "ku"
                ? "ku-IQ"
                : language === "ar"
                ? "ar-IQ"
                : "en-US"
            )}
          </div>
        ),
      },
    ],
    [theme, language, getText]
  );

  const actions: TableAction<Feedback>[] = useMemo(
    () => [
      {
        label: getText("delete"),
        icon: <Trash2 className="w-4 h-4" />,
        onClick: (row: Feedback) => onDelete(row),
        variant: "danger" as const,
      },
    ],
    [getText, onDelete]
  );

  return {
    columns,
    actions,
  };
};
