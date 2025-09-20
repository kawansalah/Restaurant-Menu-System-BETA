import React from "react";
import { Trash2 } from "lucide-react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { SubCategory } from "@/admin/types/admin";
import { useSubCategoryUtils } from "./SubCategoryUtils";
import Button from "@/components/Button";

interface SubCategoryBulkActionsProps {
  selectedSubCategories: SubCategory[];
  onBulkDelete: () => void;
}

const SubCategoryBulkActions: React.FC<SubCategoryBulkActionsProps> = ({
  selectedSubCategories,
  onBulkDelete,
}) => {
  const theme = useThemeClasses();
  const { getText } = useSubCategoryUtils();

  if (selectedSubCategories.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${theme.bgCard} ${theme.borderCategory} border rounded-3xl p-4 shadow-lg z-50`}
      style={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-center gap-4">
        <div className={`text-sm ${theme.textSecondary}`}>
          {selectedSubCategories.length}{" "}
          {selectedSubCategories.length === 1
            ? "subcategory"
            : getText("selectedSubCategories")}{" "}
          selected
        </div>

        <div className="flex gap-2">
          <Button onClick={onBulkDelete} variant="delete">
            <Trash2 className="w-4 h-4" />
            {getText("delete")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryBulkActions;
