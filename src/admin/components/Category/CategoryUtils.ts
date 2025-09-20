import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Category } from "@/admin/types/admin";

export const useCategoryUtils = () => {
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.categories;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const handleExportCategories = (categories: Category[]) => {
    try {
      // Create CSV content
      const headers = [
        "ID",
        getText("labelEn"),
        getText("labelAr"),
        getText("labelKu"),
        getText("created"),
        getText("updated"),
      ];

      const csvContent = [
        headers.join(","),
        ...categories.map((category) =>
          [
            category.id,
            `"${category.label_en}"`,
            `"${category.label_ar}"`,
            `"${category.label_ku}"`,
            `"${new Date(category.created_at).toLocaleDateString()}"`,
            `"${new Date(category.updated_at).toLocaleDateString()}"`,
          ].join(",")
        ),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `categories_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting categories:", error);
      alert("Failed to export categories");
    }
  };

  return {
    getText,
    handleExportCategories,
  };
};
