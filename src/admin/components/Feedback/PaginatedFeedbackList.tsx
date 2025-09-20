import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Feedback } from "@/admin/types/admin";
import { fetchFeedback } from "@/admin/services/feedbackService";
import FeedbackMobileCard from "./FeedbackMobileCard";
import { Loader2 } from "lucide-react";

interface PaginatedFeedbackListProps {
  onEdit?: (feedback: Feedback) => void;
  onDelete?: (feedback: Feedback) => void;
  onClick?: (feedback: Feedback) => void;
  className?: string;
  searchQuery?: string;
  filters?: Record<string, string>;
  sortConfig?: {
    key: string;
    direction: "asc" | "desc";
  } | null;
  refreshTrigger?: number; // Add refresh trigger prop
}

const PaginatedFeedbackList: React.FC<PaginatedFeedbackListProps> = ({
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
  const t = defaultAdminConfig.ui.feedback;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  // Pagination state
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const PAGE_SIZE = 10;

  // Utility function to apply sorting
  const applySorting = (
    data: Feedback[],
    sortConfig: { key: string; direction: "asc" | "desc" }
  ) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Feedback];
      const bValue = b[sortConfig.key as keyof Feedback];

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
    loadInitialFeedback();
  }, [searchQuery, filters, sortConfig]);

  // Handle refresh trigger (prevent duplicate calls)
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadInitialFeedback();
      // Don't call onRefresh here to prevent duplicate API calls
    }
  }, [refreshTrigger]);

  const loadInitialFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      // Fetch all feedback without backend search filter (client-side filtering instead)
      const allFeedback = await fetchFeedback({});

      // Apply client-side search filtering (similar to Table.tsx)
      let filteredData = [...allFeedback];

      // Apply search query filtering across all string fields
      if (searchQuery && searchQuery.trim()) {
        filteredData = filteredData.filter((item) => {
          const searchTerm = searchQuery.toLowerCase().trim();
          return (
            item.customer_name?.toString().toLowerCase().includes(searchTerm) ||
            item.email?.toString().toLowerCase().includes(searchTerm) ||
            item.message?.toString().toLowerCase().includes(searchTerm) ||
            item.rating?.toString().toLowerCase().includes(searchTerm)
          );
        });
      }

      // Apply column filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim()) {
          filteredData = filteredData.filter((item) => {
            const fieldValue = item[key as keyof typeof item];
            if (fieldValue === null || fieldValue === undefined) {
              return false;
            }

            // Handle different field types
            switch (key) {
              case "created_at":
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
        }
      });

      // Apply sorting if configured
      if (sortConfig) {
        filteredData = applySorting(filteredData, sortConfig);
      }

      const initialFeedback = filteredData.slice(0, PAGE_SIZE);
      setFeedback(initialFeedback);
      setTotalFeedback(filteredData.length);
      setHasNextPage(filteredData.length > PAGE_SIZE);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load feedback";
      setError(errorMessage);
      console.error("Error loading feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreFeedback = async () => {
    try {
      setLoadingMore(true);
      setError(null);

      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fetch all feedback without backend search filter (client-side filtering instead)
      const allFeedback = await fetchFeedback({});

      // Apply client-side search filtering (similar to Table.tsx)
      let filteredData = [...allFeedback];

      // Apply search query filtering across all string fields
      if (searchQuery && searchQuery.trim()) {
        filteredData = filteredData.filter((item) => {
          const searchTerm = searchQuery.toLowerCase().trim();
          return (
            item.customer_name?.toString().toLowerCase().includes(searchTerm) ||
            item.email?.toString().toLowerCase().includes(searchTerm) ||
            item.message?.toString().toLowerCase().includes(searchTerm) ||
            item.rating?.toString().toLowerCase().includes(searchTerm)
          );
        });
      }

      // Apply column filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim()) {
          filteredData = filteredData.filter((item) => {
            const fieldValue = item[key as keyof typeof item];
            if (fieldValue === null || fieldValue === undefined) {
              return false;
            }

            // Handle different field types
            switch (key) {
              case "created_at":
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
        }
      });

      // Apply sorting if configured
      if (sortConfig) {
        filteredData = applySorting(filteredData, sortConfig);
      }

      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const newFeedback = filteredData.slice(startIndex, endIndex);

      if (newFeedback.length > 0) {
        setFeedback((prev) => [...prev, ...newFeedback]);
        setCurrentPage(nextPage);
        setHasNextPage(endIndex < filteredData.length);

        // Smooth scroll to the first new item after a short delay
        setTimeout(() => {
          const newItemIndex = currentPage * PAGE_SIZE;
          const newItemElement = document.querySelector(
            `[data-feedback-index="${newItemIndex}"]`
          );
          if (newItemElement) {
            newItemElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        }, 100);
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load more feedback";
      setError(errorMessage);
      console.error("Error loading more feedback:", err);
    } finally {
      setLoadingMore(false);
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
            {/* Customer Name */}
            <div className={`h-6 ${theme.bgCard} rounded w-3/4`}></div>
            {/* Email */}
            <div className={`h-4 ${theme.bgCard} rounded w-2/3`}></div>
            {/* Message */}
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

  // Professional loader component with advanced animations
  const LoaderComponent = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`w-12 h-12 border-4 border-transparent rounded-full animate-spin`}
          style={{
            animationDuration: "1.2s",
            borderTopColor: "var(--bg-main)",
            borderRightColor: "var(--bg-main)",
          }}
        ></div>
        {/* Inner ring */}
        <div
          className={`absolute top-2 left-2 w-8 h-8 border-4 border-transparent rounded-full animate-spin`}
          style={{
            animationDirection: "reverse",
            animationDuration: "1.8s",
            borderBottomColor: theme.isDark
              ? "var(--text-secondary)"
              : "var(--text-primary)",
            borderLeftColor: theme.isDark
              ? "var(--text-secondary)"
              : "var(--text-primary)",
          }}
        ></div>
        {/* Center dot with pulse effect */}
        <div
          className={`absolute top-4 left-4 w-4 h-4 ${theme.bgMain} rounded-full animate-pulse`}
          style={{ animationDuration: "2s" }}
        ></div>

        {/* Loading dots animation */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 ${theme.bgMain} rounded-full animate-bounce`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
            ></div>
          ))}
        </div>
      </div>

      <p
        className={`mt-8 text-sm font-medium ${theme.textPrimary} animate-pulse`}
      >
        {loadingMore
          ? getText("loadingMoreFeedback")
          : getText("loadingFeedback")}
      </p>

      {/* Progress indicator */}
      <div
        className={`mt-3 w-32 h-1 ${theme.bgSecondary} rounded-full overflow-hidden`}
      >
        <div
          className={`h-full ${theme.bgMain} rounded-full progress-shimmer`}
        ></div>
      </div>
    </div>
  );

  // Enhanced load more button component
  const LoadMoreButton = () => (
    <div className="flex justify-center py-6">
      <button
        onClick={loadMoreFeedback}
        disabled={loadingMore}
        className={`
          group flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-sm
          transition-all duration-300 transform hover:scale-105 active:scale-95
          ${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${theme.borderMain} border backdrop-blur-sm
          relative overflow-hidden
        `}
        style={{
          boxShadow: theme.isDark
            ? "0 4px 12px rgba(253, 187, 42, 0.3)"
            : "0 4px 12px rgba(253, 187, 42, 0.2)",
        }}
      >
        {/* Background shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>

        {loadingMore ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{getText("loadingMore")}</span>
          </>
        ) : (
          <>
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
            <span className="font-semibold">{getText("loadMoreFeedback")}</span>
            <div className="ml-1 w-1.5 h-1.5 bg-white/70 rounded-full animate-ping"></div>
          </>
        )}
      </button>
    </div>
  );

  // Error state
  if (error && !loadingMore) {
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
            {getText("errorLoadingFeedback")}
          </h3>
          <p className={`text-sm ${theme.textSecondary} mb-4`}>{error}</p>
          <button
            onClick={loadInitialFeedback}
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
              {getText("loadingFeedback")}
            </div>
          </div>

          {/* Skeleton Cards */}
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // Empty state
  if (feedback.length === 0 && !loading) {
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3
            className={`text-lg font-semibold ${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            } mb-2`}
          >
            {getText("noFeedbackFound")}
          </h3>
          <p className={`text-sm ${theme.textSecondary}`}>
            {searchQuery || Object.keys(filters).length > 0
              ? "Try adjusting your search or filters"
              : "No feedback has been submitted yet"}
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
            {getText("showing")} {feedback.length}
            {totalFeedback > feedback.length &&
              ` ${getText("of")} ${totalFeedback}`}
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-3">
          {feedback.map((item, index) => (
            <div
              key={item.id}
              data-feedback-index={index}
              className="animate-fade-in"
              style={{
                animationDelay: `${(index % PAGE_SIZE) * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <FeedbackMobileCard
                feedback={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onClick={onClick}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasNextPage && !loading && <LoadMoreButton />}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="mt-4">
            <LoaderComponent />
          </div>
        )}

        {/* End of list indicator */}
        {!hasNextPage && feedback.length > PAGE_SIZE && (
          <div className="text-center py-4">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme.bgSecondary} ${theme.textSecondary} text-sm`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{getText("allFeedbackLoaded")}</span>
            </div>
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

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes shimmer-progress {
          0% {
            transform: translateX(-100%);
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0.4;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
          opacity: 0;
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }

        .group:hover .animate-shimmer {
          animation-duration: 0.6s;
        }

        /* Enhanced progress bar animation */
        .progress-shimmer {
          animation: shimmer-progress 2s infinite linear;
        }

        /* Custom bounce with stagger */
        @keyframes bounce-stagger {
          0%, 60%, 100% {
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

export default PaginatedFeedbackList;
