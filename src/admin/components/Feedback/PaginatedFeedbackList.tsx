import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Feedback } from "@/admin/types/admin";
import { fetchFeedback } from "@/admin/services/feedbackService";
import FeedbackMobileCard from "./FeedbackMobileCard";

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

  // State for feedback
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial display limit state
  const [showAllItems, setShowAllItems] = useState(false);
  const INITIAL_DISPLAY_LIMIT = 10;

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
          // Date sorting
          const dateA = new Date(aValue as string).getTime();
          const dateB = new Date(bValue as string).getTime();
          comparison = dateA - dateB;
          break;

        case "rating":
          // Number sorting
          comparison = (aValue as number) - (bValue as number);
          break;

        default:
          // String sorting
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
      setShowAllItems(false); // Reset to show initial limit

      // Fetch all feedback with filters
      const data = await fetchFeedback(filters);

      // Apply client-side search filtering (similar to Table.tsx)
      let filteredData = [...data];

      // Apply search query filtering across all string fields
      if (searchQuery && searchQuery.trim()) {
        filteredData = filteredData.filter((feedbackItem) => {
          const searchTerm = searchQuery.toLowerCase().trim();
          return (
            feedbackItem.customer_name
              ?.toString()
              .toLowerCase()
              .includes(searchTerm) ||
            feedbackItem.email
              ?.toString()
              .toLowerCase()
              .includes(searchTerm) ||
            feedbackItem.message?.toString().toLowerCase().includes(searchTerm)
          );
        });
      }

      // Apply column filters
      Object.entries(filters).forEach(([key, value]) => {
        if (!value || !value.trim()) return;
        
        filteredData = filteredData.filter((feedbackItem) => {
          const fieldValue = feedbackItem[key as keyof typeof feedbackItem];
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
                  const filterDateOnly = new Date(
                    filterDate.toDateString()
                  );
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

            case "rating":
              // Number filtering
              return fieldValue.toString() === value;

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

      // Set all feedback (no pagination)
      setFeedback(filteredData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load feedback";
      setError(errorMessage);
      console.error("Error loading feedback:", err);
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
            {/* Name */}
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

  // Calculate displayed items based on showAllItems state
  const displayedFeedback = showAllItems
    ? feedback
    : feedback.slice(0, INITIAL_DISPLAY_LIMIT);

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
            {getText("showing")} {displayedFeedback.length}
            {feedback.length > displayedFeedback.length &&
              ` ${getText("of")} ${feedback.length}`}
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-3">
          {displayedFeedback.map((feedbackItem, index) => (
            <div
              key={feedbackItem.id}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <FeedbackMobileCard
                feedback={feedbackItem}
                onEdit={onEdit}
                onDelete={onDelete}
                onClick={onClick}
              />
            </div>
          ))}
        </div>

        {/* See More Button */}
        {!showAllItems && feedback.length > INITIAL_DISPLAY_LIMIT && (
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
                {getText("loadMoreFeedback")}
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

export default PaginatedFeedbackList;