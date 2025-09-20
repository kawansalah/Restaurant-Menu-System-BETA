import { useLanguage } from "@/contexts/LanguageContext";
import { SubCategory } from "@/admin/types/admin";
import { SUBCATEGORY_TEXTS } from "./SubCategoryConstants";

export const useSubCategoryUtils = () => {
  const { language } = useLanguage();

  // Get text in current language
  const getText = (key: keyof typeof SUBCATEGORY_TEXTS): string => {
    return SUBCATEGORY_TEXTS[key][language] || SUBCATEGORY_TEXTS[key].en;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === "ku" ? "ku-Arab" : language === "ar" ? "ar" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // Get subcategory name in current language
  const getSubCategoryName = (subcategory: SubCategory): string => {
    switch (language) {
      case "ku":
        return subcategory.label_ku || subcategory.label_en;
      case "ar":
        return subcategory.label_ar || subcategory.label_en;
      case "en":
      default:
        return subcategory.label_en;
    }
  };

  // Get category name in current language
  const getCategoryName = (category: any): string => {
    if (!category) return "";
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

  // Export subcategories to CSV
  const handleExportSubCategories = (subcategories: SubCategory[]) => {
    try {
      const headers = [
        getText("columnId"),
        getText("columnCategory"),
        getText("columnName") + " (Kurdish)",
        getText("columnName") + " (Arabic)",
        getText("columnName") + " (English)",
        "Image URL",
        getText("columnCreatedAt"),
      ];

      const csvContent = [
        headers.join(","),
        ...subcategories.map((subcategory) =>
          [
            subcategory.id,
            getCategoryName(subcategory.category),
            `"${subcategory.label_ku}"`,
            `"${subcategory.label_ar}"`,
            `"${subcategory.label_en}"`,
            `"${subcategory.image_url || ""}"`,
            formatDate(subcategory.created_at),
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `subcategories_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting subcategories:", error);
      alert(getText("failedToLoad"));
    }
  };

  // Validate subcategory form data
  const validateSubCategoryForm = (formData: {
    category_id: string;
    label_ku: string;
    label_ar: string;
    label_en: string;
    image_url?: string;
  }): string | null => {
    if (!formData.category_id?.trim()) {
      return getText("requiredField") + ": " + getText("categoryLabel");
    }
    if (!formData.label_ku?.trim()) {
      return getText("requiredField") + ": " + getText("labelKu");
    }
    if (!formData.label_ar?.trim()) {
      return getText("requiredField") + ": " + getText("labelAr");
    }
    if (!formData.label_en?.trim()) {
      return getText("requiredField") + ": " + getText("labelEn");
    }
    return null;
  };

  // Search filter function
  const filterSubCategories = (
    subcategories: SubCategory[],
    searchQuery: string
  ): SubCategory[] => {
    if (!searchQuery.trim()) return subcategories;

    const query = searchQuery.toLowerCase();
    return subcategories.filter(
      (subcategory) =>
        subcategory.label_ku.toLowerCase().includes(query) ||
        subcategory.label_ar.toLowerCase().includes(query) ||
        subcategory.label_en.toLowerCase().includes(query) ||
        getCategoryName(subcategory.category).toLowerCase().includes(query) ||
        (subcategory.category &&
          (subcategory.category.label_ku?.toLowerCase().includes(query) ||
            subcategory.category.label_ar?.toLowerCase().includes(query) ||
            subcategory.category.label_en?.toLowerCase().includes(query)))
    );
  };

  return {
    getText,
    formatDate,
    getSubCategoryName,
    getCategoryName,
    handleExportSubCategories,
    validateSubCategoryForm,
    filterSubCategories,
  };
};
