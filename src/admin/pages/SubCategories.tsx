import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import Table from "@/admin/components/Table";
import { SubCategory } from "@/admin/types/admin";
import {
  fetchSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  bulkDeleteSubCategories,
  getSubCategoryStats,
} from "@/admin/services/subcategoryService";
import CategoryStatsCards from "@/admin/components/SubCategory/SubCategoryStatsCards";
import SubCategoryFormModal from "@/admin/components/SubCategory/SubCategoryFormModal";
import SubCategoryBulkActions from "@/admin/components/SubCategory/SubCategoryBulkActions";
import { useSubCategoryTableConfig } from "@/admin/components/SubCategory/SubCategoryTableConfig";
import { useCategoryUtils } from "@/admin/components/Category/CategoryUtils";
import {
  CATEGORY_TABLE_CONFIG,
  CATEGORY_ERROR_MESSAGES,
} from "@/admin/components/Category/CategoryConstants";
import PaginatedSubCategoryList from "@/admin/components/SubCategory/PaginatedSubCategoryList";
import MobileFilterModal from "@/admin/components/MobileFilterModal";
import { Plus, Filter, RefreshCw, KeyRound } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";

interface SubCategoryFormData {
  label_ku: string;
  label_ar: string;
  label_en: string;
  category_id: string;
  image_url?: string;
  thumbnail_url?: string;
}

const SubCategories: React.FC = () => {
  const theme = useThemeClasses();
  const { getText } = useCategoryUtils();
  const { language } = useLanguage();
  const { user } = useAdminAuth();

  // State management
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCategories, setSelectedSubCategories] = useState<
    SubCategory[]
  >([]);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
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
    loadSubCategories();
    loadStats();
  }, []);

  const loadSubCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await fetchSubCategories({
        restaurant_id: user?.restaurant_id,
      });

      if (fetchError) {
        setError(fetchError);
        console.error("Failed to load subcategories:", fetchError);
      } else {
        setSubCategories(data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load subcategories";
      setError(errorMessage);
      console.error("Error loading subcategories:", err);
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
    try {
      const { data, error: statsError } = await getSubCategoryStats(
        user?.restaurant_id
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
  const handleEditSubCategory = (subcategory: SubCategory) => {
    setEditingSubCategory(subcategory);
    setShowSubCategoryModal(true);
  };

  const handleDeleteSubCategory = async (subcategory: SubCategory) => {
    if (
      window.confirm(`${getText("confirmDelete")} ${subcategory.label_en}?`)
    ) {
      try {
        const { success, error } = await deleteSubCategory(subcategory.id);

        if (error) {
          alert(`${getText("failedToDelete")}: ${error}`);
        } else if (success) {
          setSubCategories((prev) =>
            prev.filter((c) => c.id !== subcategory.id)
          );
          loadStats();
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error deleting subcategory:", err);
        alert(getText("failedToDelete"));
      }
    }
  };

  // Table configuration
  const { columns, actions } = useSubCategoryTableConfig({
    onEdit: handleEditSubCategory,
    onDelete: handleDeleteSubCategory,
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
  const handleFormSubmit = async (formData: SubCategoryFormData) => {
    setIsSubmitting(true);

    try {
      if (editingSubCategory) {
        // Update existing subcategory
        const { data, error } = await updateSubCategory(editingSubCategory.id, {
          label_ku: formData.label_ku,
          label_ar: formData.label_ar,
          label_en: formData.label_en,
          category_id: formData.category_id,
          image_url: formData.image_url,
          thumbnail_url: formData.thumbnail_url,
        });

        if (error) {
          alert(`Failed to update subcategory: ${error}`);
        } else if (data) {
          alert("SubCategory updated successfully");
          setShowSubCategoryModal(false);
          setEditingSubCategory(null);

          // Trigger data refresh
          loadSubCategories();
          loadStats();
          setRefreshTrigger((prev) => prev + 1);
        }
      } else {
        // Create new subcategory
        const { data, error } = await createSubCategory({
          restaurant_id: user?.restaurant_id || "",
          label_ku: formData.label_ku,
          label_ar: formData.label_ar,
          label_en: formData.label_en,
          category_id: formData.category_id,
          image_url: formData.image_url,
          thumbnail_url: formData.thumbnail_url,
        });

        if (error) {
          alert(`Failed to create subcategory: ${error}`);
        } else if (data) {
          alert("SubCategory created successfully");
          setShowSubCategoryModal(false);

          // Trigger data refresh
          loadSubCategories();
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
    setShowSubCategoryModal(false);
    setEditingSubCategory(null);
  };

  // Action handlers
  const handleAddSubCategory = () => {
    setEditingSubCategory(null);
    setShowSubCategoryModal(true);
  };

  const handleExportSubCategoriesClick = () => {
    // Create CSV export functionality for subcategories
    const csvContent = subcategories
      .map(
        (sub) =>
          `"${sub.label_en}","${sub.label_ar}","${sub.label_ku}","${
            sub.category?.label_en || "No Category"
          }","${sub.created_at}"`
      )
      .join("\n");

    const blob = new Blob(
      [`English,Arabic,Kurdish,Category,Created\n${csvContent}`],
      {
        type: "text/csv",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subcategories.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefreshSubCategories = async () => {
    await loadSubCategories();
    await loadStats();
    setRefreshTrigger((prev) => prev + 1); // Refresh mobile cards
  };

  const handleSelectionChange = (selected: SubCategory[]) => {
    setSelectedSubCategories(selected);
  };

  const handleRowClick = (subcategory: SubCategory) => {
    console.log("Row clicked:", subcategory);
    // TODO: Navigate to subcategory details page or open modal
  };

  // Bulk action handlers
  const handleBulkDelete = async () => {
    const subcategoryCount = selectedSubCategories.length;
    const subcategoryText =
      subcategoryCount > 1
        ? `${subcategoryCount} selected subcategories`
        : selectedSubCategories[0]?.label_en;

    if (window.confirm(`${getText("confirmBulkDelete")} ${subcategoryText}?`)) {
      try {
        const subcategoryIds = selectedSubCategories.map((c) => c.id);
        const { success, error } = await bulkDeleteSubCategories(
          subcategoryIds
        );

        if (error) {
          alert(`${getText("failedToDelete")}: ${error}`);
        } else if (success) {
          setSubCategories((prev) =>
            prev.filter(
              (subcategory) =>
                !selectedSubCategories.some(
                  (selected) => selected.id === subcategory.id
                )
            )
          );
          setSelectedSubCategories([]);
          loadStats();
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error deleting subcategories:", err);
        alert(getText("failedToDelete"));
      }
    }
  };

  const title = {
    en: "SubCategories",
    ar: "المجموعات الفرعية",
    ku: "جۆرەکان",
  };

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
            {
              title[language as keyof typeof title]
            }
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshSubCategories}
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
            data={subcategories}
            columns={columns}
            actions={actions}
            // title="SubCategories"
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            pageSize={CATEGORY_TABLE_CONFIG.PAGE_SIZE}
            loading={loading}
            emptyMessage="No subcategories found"
            selectable={true}
            onAdd={handleAddSubCategory}
            onExport={handleExportSubCategoriesClick}
            onRefresh={handleRefreshSubCategories}
            onSelectionChange={handleSelectionChange}
            onRowClick={handleRowClick}
            className="animate-fade-in"
          />
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden space-y-4">
          <PaginatedSubCategoryList
            key={filterKey}
            onEdit={handleEditSubCategory}
            onDelete={handleDeleteSubCategory}
            searchQuery={mobileSearchQuery}
            filters={mobileColumnFilters}
            sortConfig={mobileSortConfig}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Bulk Actions */}
        <SubCategoryBulkActions
          selectedSubCategories={selectedSubCategories}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      {/* SubCategory Form Modal */}
      <SubCategoryFormModal
        isOpen={showSubCategoryModal}
        editingSubCategory={editingSubCategory}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Floating Action Button */}
      <button
        onClick={handleAddSubCategory}
        className={`fixed md:hidden bottom-6 right-6 w-14 h-14 ${theme.bgMain} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-40 ${theme.topbarShadowStyle}`}
        aria-label="Add SubCategory"
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

export default SubCategories;
