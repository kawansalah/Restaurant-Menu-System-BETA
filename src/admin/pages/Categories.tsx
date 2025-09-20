import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";
import Table from "@/admin/components/Table";
import { Category } from "@/admin/types/admin";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
  getCategoryStats,
} from "@/admin/services/categoryService";
import CategoryStatsCards from "@/admin/components/Category/CategoryStatsCards";
import CategoryFormModal from "@/admin/components/Category/CategoryFormModal";
import CategoryBulkActions from "@/admin/components/Category/CategoryBulkActions";
import { useCategoryTableConfig } from "@/admin/components/Category/CategoryTableConfig";
import { useCategoryUtils } from "@/admin/components/Category/CategoryUtils";
import {
  CATEGORY_TABLE_CONFIG,
  CATEGORY_ERROR_MESSAGES,
} from "@/admin/components/Category/CategoryConstants";
import PaginatedCategoryList from "@/admin/components/Category/PaginatedCategoryList";
import MobileFilterModal from "@/admin/components/MobileFilterModal";
import { Plus, Filter, RefreshCw } from "lucide-react";

interface CategoryFormData {
  label_ku: string;
  label_ar: string;
  label_en: string;
}

const Categories: React.FC = () => {
  const theme = useThemeClasses();
  const { user } = useAdminAuth();
  const { getText, handleExportCategories } = useCategoryUtils();

  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
  });

  // Mobile filter modal state
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileColumnFilters, setMobileColumnFilters] = useState<
    Record<string, string>
  >({});
  const [mobileColumnVisibility, setMobileColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [mobileSortConfig, setMobileSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filterKey, setFilterKey] = useState(0); // Key to force PaginatedCategoryList re-render
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for card refreshes

  // Load data
  useEffect(() => {
    if (user?.restaurant_id) {
      loadCategories();
      loadStats();
    }
  }, [user?.restaurant_id]);

  const loadCategories = async () => {
    if (!user?.restaurant_id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await fetchCategories({
        restaurant_id: user.restaurant_id,
      });

      if (fetchError) {
        setError(fetchError);
        console.error("Failed to load categories:", fetchError);
      } else {
        setCategories(data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : getText("failedToLoad");
      setError(errorMessage);
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mobile filter handlers
  const handleMobileFilterOpen = () => {
    setShowMobileFilterModal(true);
  };

  const handleMobileFilterClose = () => {
    setShowMobileFilterModal(false);
  };

  const handleMobileClearAll = () => {
    setMobileSearchQuery("");
    setMobileColumnFilters({});
    setMobileSortConfig(null);

    // Force refresh of the PaginatedCategoryList
    setFilterKey((prev) => prev + 1);
  };

  const handleMobileApply = () => {
    try {
      // Apply filters to mobile view
      console.log("Applied filters:", {
        search: mobileSearchQuery,
        columnFilters: mobileColumnFilters,
        sort: mobileSortConfig,
        visibility: mobileColumnVisibility,
      });

      // Force re-render of PaginatedCategoryList by incrementing the key
      setFilterKey((prev) => prev + 1);

      // Close the modal automatically after applying filters
      setShowMobileFilterModal(false);
    } catch (error) {
      console.error("Error applying mobile filters:", error);
    }
  };

  const loadStats = async () => {
    if (!user?.restaurant_id) return;

    try {
      const { data, error: statsError } = await getCategoryStats(
        user.restaurant_id
      );

      if (statsError) {
        console.error("Failed to load stats:", statsError);
      } else {
        setStats(data);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  // Table event handlers
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`${getText("confirmDelete")} ${category.label_en}?`)) {
      try {
        const { success, error } = await deleteCategory(category.id);

        if (error) {
          alert(`${getText("failedToDelete")}: ${error}`);
        } else if (success) {
          setCategories((prev) => prev.filter((c) => c.id !== category.id));
          loadStats();
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error deleting category:", err);
        alert(getText("failedToDelete"));
      }
    }
  };

  // Table configuration
  const { columns, actions } = useCategoryTableConfig({
    onEdit: handleEditCategory,
    onDelete: handleDeleteCategory,
  });

  // Initialize mobile column visibility
  useEffect(() => {
    if (
      columns.length > 0 &&
      Object.keys(mobileColumnVisibility).length === 0
    ) {
      const initialVisibility: Record<string, boolean> = { __id__: true };
      columns.forEach((col) => {
        initialVisibility[col.key] = true;
      });
      setMobileColumnVisibility(initialVisibility);
    }
  }, [columns, mobileColumnVisibility]);

  // Form handlers
  const handleFormSubmit = async (formData: CategoryFormData) => {
    if (!user?.restaurant_id) {
      alert("Restaurant context not available");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Update existing category
        const { data, error } = await updateCategory(editingCategory.id, {
          label_ku: formData.label_ku,
          label_ar: formData.label_ar,
          label_en: formData.label_en,
        });

        if (error) {
          alert(`Failed to update category: ${error}`);
        } else if (data) {
          alert("Category updated successfully");
          setShowCategoryModal(false);
          setEditingCategory(null);

          // Trigger data refresh
          loadCategories();
          loadStats();
          setRefreshTrigger((prev) => prev + 1);
        }
      } else {
        // Create new category
        const { data, error } = await createCategory({
          restaurant_id: user.restaurant_id,
          label_ku: formData.label_ku,
          label_ar: formData.label_ar,
          label_en: formData.label_en,
        });

        if (error) {
          alert(`Failed to create category: ${error}`);
        } else if (data) {
          alert("Category created successfully");
          setShowCategoryModal(false);

          // Trigger data refresh
          loadCategories();
          loadStats();
          setRefreshTrigger((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(CATEGORY_ERROR_MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  // Action handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleExportCategoriesClick = () => {
    handleExportCategories(categories);
  };

  const handleRefreshCategories = async () => {
    await loadCategories();
    await loadStats();
  };

  const handleSelectionChange = (selected: Category[]) => {
    setSelectedCategories(selected);
  };

  const handleRowClick = (category: Category) => {
    console.log("Row clicked:", category);
    // TODO: Navigate to category details page or open modal
  };

  // Bulk action handlers
  const handleBulkDelete = async () => {
    const categoryCount = selectedCategories.length;
    const categoryText =
      categoryCount > 1
        ? `${categoryCount} ${getText("selectedCategories")}`
        : selectedCategories[0]?.label_en;

    if (window.confirm(`${getText("confirmBulkDelete")} ${categoryText}?`)) {
      try {
        const categoryIds = selectedCategories.map((c) => c.id);
        const { success, error } = await bulkDeleteCategories(categoryIds);

        if (error) {
          alert(`${getText("failedToDelete")}: ${error}`);
        } else if (success) {
          setCategories((prev) =>
            prev.filter(
              (category) =>
                !selectedCategories.some(
                  (selected) => selected.id === category.id
                )
            )
          );
          setSelectedCategories([]);
          loadStats();
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error deleting categories:", err);
        alert(getText("failedToDelete"));
      }
    }
  };

  // Show loading or error if no user context
  if (!user) {
    return (
      <div className={`min-h-screen ${theme.bgPrimary} py-6`}>
        <div className="w-full mx-auto space-y-6">
          <div className="text-center">
            <p className={`text-lg ${theme.textPrimary}`}>
              Please log in to access categories.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bgPrimary} py-6`}>
      <div className="w-full mx-auto space-y-6">
        {/* Error Message */}
        {error && (
          <div
            className={`${theme.bgCard} border ${theme.borderCategory} ${theme.textPrimary} px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300`}
          >
            <strong>{getText("errorPrefix")}</strong> {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1
            className={`text-2xl font-bold ${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            } `}
          >
            {getText("pageTitle")}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshCategories}
              disabled={loading}
              className={`p-2 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} border ${theme.borderSubCategory} hover:${theme.bgCard} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={() => setShowMobileFilterModal(true)}
              className={`p-2 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} border ${theme.borderSubCategory} hover:${theme.bgCard} transition-colors flex items-center gap-2`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <CategoryStatsCards stats={stats} />

        {/* Desktop/Tablet Table View */}
        <div className="hidden md:block">
          <Table
            data={categories}
            columns={columns}
            actions={actions}
            // title={getText("pageTitle")}
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            pageSize={CATEGORY_TABLE_CONFIG.PAGE_SIZE}
            loading={loading}
            emptyMessage={getText("noCategoriesFound")}
            selectable={true}
            onAdd={handleAddCategory}
            onExport={handleExportCategoriesClick}
            onRefresh={handleRefreshCategories}
            onSelectionChange={handleSelectionChange}
            onRowClick={handleRowClick}
            className="animate-fade-in"
          />
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden space-y-4">
          <PaginatedCategoryList
            key={filterKey}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            searchQuery={mobileSearchQuery}
            filters={{
              ...mobileColumnFilters,
              restaurant_id: user.restaurant_id,
            }}
            sortConfig={mobileSortConfig}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Bulk Actions */}
        <CategoryBulkActions
          selectedCategories={selectedCategories}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={showCategoryModal}
        editingCategory={editingCategory}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Floating Action Button */}
      <button
        onClick={handleAddCategory}
        className={`fixed md:hidden bottom-6 right-6 w-14 h-14 ${theme.bgMain} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-40 ${theme.topbarShadowStyle}`}
        aria-label={getText("addCategory")}
      >
        <Plus className="w-6 h-6 stroke-6" />
      </button>

      {/* Floating Filter Button */}
      <button
        onClick={handleMobileFilterOpen}
        className={`fixed md:hidden bottom-6 left-6 w-14 h-14 bg-[#4e7dff] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-40 ${theme.topbarShadowStyle}`}
        aria-label="Filter"
      >
        <Filter className="w-6 h-6 stroke-6" />
      </button>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={showMobileFilterModal}
        onClose={handleMobileFilterClose}
        columns={columns}
        searchQuery={mobileSearchQuery}
        onSearchChange={setMobileSearchQuery}
        columnFilters={mobileColumnFilters}
        onColumnFiltersChange={setMobileColumnFilters}
        columnVisibility={mobileColumnVisibility}
        onColumnVisibilityChange={setMobileColumnVisibility}
        sortConfig={mobileSortConfig}
        onSortChange={setMobileSortConfig}
        showIdColumn={true}
        idColumnTitle="ID"
        searchable={true}
        filterable={true}
        sortable={true}
        showColumnVisibility={true}
        onClearAll={handleMobileClearAll}
        onApply={handleMobileApply}
      />
    </div>
  );
};

export default Categories;
