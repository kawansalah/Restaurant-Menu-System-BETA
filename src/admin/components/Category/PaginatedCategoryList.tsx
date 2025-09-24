import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Category } from "@/admin/types/admin";
import { CategoryMobileCard } from "./CategoryMobileCard";
import { fetchCategories } from "@/admin/services/categoryService";

interface PaginatedCategoryListProps {
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onClick?: (category: Category) => void;
  className?: string;
  searchQuery?: string;
  filters?: Record<string, string>;
  sortConfig?: {
    key: string;
    direction: "asc" | "desc";
  } | null;
  refreshTrigger?: number; // Add refresh trigger prop
}

const PaginatedCategoryList: React.FC<PaginatedCategoryListProps> = ({
  onEdit,
  onDelete,
  onClick,
  className = "",
  searchQuery = "",
  filters = {},
  sortConfig = null,
  refreshTrigger,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.categories;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial display limit state
  const [showAllItems, setShowAllItems] = useState(false);
  const INITIAL_DISPLAY_LIMIT = 10;

  // Utility function to apply sorting
  const applySorting = (
    data: Category[],
    sortConfig: { key: string; direction: "asc" | "desc" }
  ) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Category];
      const bValue = b[sortConfig.key as keyof Category];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) {
        return bValue === null || bValue === undefined ? 0 : 1;
      }
      if (bValue === null || bValue === undefined) {
        return -1;
      }

      // Handle different data types for sorting
      let comparison = 0;

      switch (sortConfig.key) {
        case "created_at":
        case "updated_at":
          // Date sorting
          const dateA = new Date(aValue as string).getTime();
          const dateB = new Date(bValue as string).getTime();
          comparison = dateA - dateB;
          break;

        default:
          // String/number sorting
          if (aValue < bValue) comparison = -1;
          else if (aValue > bValue) comparison = 1;
          else comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  };

  // Load initial data
  useEffect(() => {
    loadInitialCategories();
  }, [searchQuery, filters, sortConfig]);

  // Handle refresh trigger (prevent duplicate calls)
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadInitialCategories();
      // Don't call onRefresh here to prevent duplicate API calls
    }
  }, [refreshTrigger]);

  const loadInitialCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowAllItems(false); // Reset to show initial limit

      // Fetch all categories with restaurant filter
      const { data, error: fetchError } = await fetchCategories(filters);

      if (fetchError) {
        setError(fetchError);
        console.error("Failed to load categories:", fetchError);
      } else {
        // Apply client-side search filtering (similar to Table.tsx)
        let filteredData = [...data];

        // Apply search query filtering across all string fields
        if (searchQuery && searchQuery.trim()) {
          filteredData = filteredData.filter((category) => {
            const searchTerm = searchQuery.toLowerCase().trim();
            return (
              category.label_ku
                ?.toString()
                .toLowerCase()
                .includes(searchTerm) ||
              category.label_ar
                ?.toString()
                .toLowerCase()
                .includes(searchTerm) ||
              category.label_en?.toString().toLowerCase().includes(searchTerm)
            );
          });
        }

        // Apply column filters (excluding restaurant_id as it's already handled by service)
        Object.entries(filters).forEach(([key, value]) => {
          if (key === "restaurant_id" || !value || !value.trim()) return;

          filteredData = filteredData.filter((category) => {
            const fieldValue = category[key as keyof typeof category];
            if (fieldValue === null || fieldValue === undefined) {
              return false;
            }

            // Handle different field types
            switch (key) {
              case "created_at":
              case "updated_at":
                // Date filtering
                try {
                  const dateValue = new Date(fieldValue as string);
                  const filterTerm = value.toLowerCase().trim();

                  // If filter term looks like a date (YYYY-MM-DD), do exact date match
                  if (/^\d{4}-\d{2}-\d{2}$/.test(filterTerm)) {
                    const filterDate = new Date(filterTerm);
                    const valueDate = new Date(dateValue.toDateString());
                    const filterDateOnly = new Date(filterDate.toDateString());
                    return valueDate.getTime() === filterDateOnly.getTime();
                  }

                  // Otherwise, do partial string matching
                  const formattedDate = dateValue.toLocaleDateString();
                  const isoDate = dateValue.toISOString().split("T")[0];
                  return (
                    formattedDate.toLowerCase().includes(filterTerm) ||
                    isoDate.includes(filterTerm)
                  );
                } catch {
                  return false;
                }

              default:
                // String filtering
                return fieldValue
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase().trim());
            }
          });
        });

        // Apply sorting if configured
        if (sortConfig) {
          filteredData = applySorting(filteredData, sortConfig);
        }

        // Set all categories (no pagination)
        setCategories(filteredData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load categories";
      setError(errorMessage);
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Professional skeleton loader for initial load
  const SkeletonLoader = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`${theme.bgSecondary} relative rounded-[25px] p-4 min-h-[140px] border ${theme.borderSubCategory} animate-pulse`}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Top Row: ID Badge and Action Button */}
          <div className="flex items-start justify-between mb-3">
            <div className={`w-16 h-6 ${theme.bgCard} rounded-full`}></div>
            <div className={`w-6 h-6 ${theme.bgCard} rounded-full`}></div>
          </div>

          {/* Main Content */}
          <div className="space-y-2 mb-4">
            {/* English Label */}
            <div className={`h-6 ${theme.bgCard} rounded w-3/4`}></div>
            {/* Arabic Label */}
            <div className={`h-4 ${theme.bgCard} rounded w-2/3`}></div>
            {/* Kurdish Label */}
            <div className={`h-4 ${theme.bgCard} rounded w-1/2`}></div>
          </div>

          {/* Footer */}
          <div
            className={`pt-2 border-t ${theme.borderSubCategory} flex justify-between`}
          >
            <div className={`h-3 ${theme.bgCard} rounded w-20`}></div>
            <div className={`h-3 ${theme.bgCard} rounded w-20`}></div>
          </div>

          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer rounded-[25px]"></div>
        </div>
      ))}
    </div>
  );

  // Calculate displayed items based on showAllItems state
  const displayedCategories = showAllItems
    ? categories
    : categories.slice(0, INITIAL_DISPLAY_LIMIT);

  // Error state
  if (error) {
    return (
      <div className={`${className}`}>
        <div
          className={`${theme.bgCard} rounded-3xl p-6 border ${theme.borderCategory} text-center`}
        >
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-500 mb-2">
            {getText("errorLoadingCategories")}
          </h3>
          <p className={`text-sm ${theme.textSecondary} mb-4`}>{error}</p>
          <button
            onClick={loadInitialCategories}
            className={`px-4 py-2 rounded-lg ${theme.bgMain} text-white font-medium hover:opacity-90 transition-opacity`}
          >
            {getText("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  // Loading state for initial load
  if (loading) {
    return (
      <div className={`${className}`}>
        <div
          className={`${theme.bgCard} rounded-3xl p-4 border ${theme.borderCategory}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-lg font-bold ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              }`}
            >
              {getText("pageTitle")}
            </h2>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${theme.bgSecondary} ${theme.textSecondary} animate-pulse`}
            >
              {getText("loadingCategories")}
            </div>
          </div>

          {/* Skeleton Cards */}
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0 && !loading) {
    return (
      <div className={`${className}`}>
        <div
          className={`${theme.bgCard} rounded-3xl p-6 border ${theme.borderCategory} text-center`}
        >
          <div
            className={`w-16 h-16 mx-auto mb-4 ${theme.bgSecondary} rounded-full flex items-center justify-center`}
          >
            <svg
              className={`w-8 h-8 ${theme.textSecondary}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3
            className={`text-lg font-semibold ${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            } mb-2`}
          >
            {getText("noCategoriesFound")}
          </h3>
          <p className={`text-sm ${theme.textSecondary}`}>
            {searchQuery || Object.keys(filters).length > 0
              ? "Try adjusting your search or filters"
              : "Start by creating your first category"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div
        className={`${theme.bgCard} rounded-3xl p-4 border ${theme.borderCategory}`}
      >
        {/* Header with count */}
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-lg font-bold ${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            }`}
          >
            {getText("pageTitle")}
          </h2>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${theme.bgSecondary} ${theme.textSecondary}`}
          >
            {getText("showing")} {displayedCategories.length}
            {categories.length > displayedCategories.length &&
              ` ${getText("of")} ${categories.length}`}
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {displayedCategories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <CategoryMobileCard
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                onClick={onClick}
              />
            </div>
          ))}
        </div>

        {/* See More Button */}
        {!showAllItems && categories.length > INITIAL_DISPLAY_LIMIT && (
          <div className="flex justify-center py-6">
            <button
              onClick={() => setShowAllItems(true)}
              className={`
                group flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-sm
                transition-all duration-300 transform hover:scale-105 active:scale-95
                ${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg hover:shadow-xl
                ${theme.borderMain} border backdrop-blur-sm
                relative overflow-hidden
              `}
              style={{
                boxShadow: theme.isDark
                  ? "0 4px 12px rgba(253, 187, 42, 0.3)"
                  : "0 4px 12px rgba(253, 187, 42, 0.2)",
              }}
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="font-semibold">
                {getText("loadMoreCategories")}
              </span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
          opacity: 0;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }

        .progress-shimmer {
          position: relative;
          overflow: hidden;
        }

        .progress-shimmer::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: progress-shimmer 1.5s infinite;
        }

        @keyframes progress-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes bounce-stagger {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-stagger {
          animation: bounce-stagger 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default PaginatedCategoryList;
