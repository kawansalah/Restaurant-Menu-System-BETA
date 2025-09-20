import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import Table from "@/admin/components/Table";
import MobileFilterModal from "@/admin/components/MobileFilterModal";
import { Feedback, FeedbackStats, FeedbackFilters } from "@/admin/types/admin";
import {
  fetchFeedback,
  deleteFeedback,
  getFeedbackStats,
} from "@/admin/services/feedbackService";
import FeedbackStatsCards from "@/admin/components/Feedback/FeedbackStatsCards";
import { FeedbackBulkActions } from "@/admin/components/Feedback/FeedbackBulkActions";
import { useFeedbackTableConfig } from "@/admin/components/Feedback/FeedbackTableConfig";
import { useFeedbackUtils } from "@/admin/components/Feedback/FeedbackUtils";
import { FEEDBACK_TABLE_CONFIG } from "@/admin/components/Feedback/FeedbackConstants";
import PaginatedFeedbackList from "../components/Feedback/PaginatedFeedbackList";
import { useAlerts } from "@/hooks/useAlerts";
import { Filter, RefreshCw, Plus } from "lucide-react";

const FeedbackPage: React.FC = () => {
  const theme = useThemeClasses();
  const { getText } = useFeedbackUtils();
  const { showAlert, confirm } = useAlerts();

  // State management
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedItems, setSelectedItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    totalWithRating: 0,
  });

  // Filter states
  // const [filters, setMobileColumnFilters] = useState<FeedbackFilters>({});
  const [mobileColumnFilters, setMobileColumnFilters] = useState<
    Record<string, string>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  // Mobile filter modal state
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {}
  );
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handlers
  const handleDeleteFeedback = async (feedbackItem: Feedback) => {
    const confirmed = await confirm(getText("confirmDelete"));

    if (!confirmed) {
      return;
    }

    try {
      await deleteFeedback(feedbackItem.id);

      showAlert({
        type: "success",
        title: getText("feedbackDeletedSuccess"),
        message: "",
      });

      handleRefresh();
    } catch (err) {
      console.error("Error deleting feedback:", err);
      showAlert({
        type: "error",
        title: getText("errorPrefix"),
        message: err instanceof Error ? err.message : getText("failedToDelete"),
      });
    }
  };

  // Table configuration (after handler definition)
  const { columns, actions } = useFeedbackTableConfig({
    onDelete: handleDeleteFeedback,
  });

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);

      const [feedbackData, statsData] = await Promise.all([
        fetchFeedback(mobileColumnFilters),
        getFeedbackStats(),
      ]);

      setFeedback(feedbackData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading feedback data:", err);
      showAlert({
        type: "error",
        title: getText("errorPrefix"),
        message: err instanceof Error ? err.message : getText("failedToLoad"),
      });
    } finally {
      setLoading(false);
    }
  };

  // Bulk action handler
  const handleBulkActionComplete = () => {
    loadData();
    setSelectedItems([]);
  };

  // Effects
  useEffect(() => {
    loadData();
  }, [mobileColumnFilters, refreshTrigger]);

  // Apply filters with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const newFilters: FeedbackFilters = {};

      if (ratingFilter) {
        newFilters.rating = parseInt(ratingFilter);
      }

      setMobileColumnFilters(mobileColumnFilters);
    }, FEEDBACK_TABLE_CONFIG.filterDebounceMs);

    return () => clearTimeout(timer);
  }, [ratingFilter]); // Remove searchQuery dependency

  // Handlers
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Mobile filter handlers
  const handleMobileFilterApply = () => {
    // Apply filters from the mobile modal
    const activeFilters: FeedbackFilters = {};

    if (columnFilters.rating) {
      activeFilters.rating = parseInt(columnFilters.rating);
      setRatingFilter(columnFilters.rating);
    }

    setMobileColumnFilters(mobileColumnFilters);
    setShowMobileFilterModal(false);
  };

  const handleMobileFilterClear = () => {
    setSearchQuery("");
    setColumnFilters({});
    setSortConfig(null);
    setMobileColumnFilters({});
    setRatingFilter("");
  };

  return (
    <div className="py-6 space-y-6">
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
            onClick={handleRefresh}
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

      {/* Stats Cards */}
      <FeedbackStatsCards stats={stats} />

      {/* Bulk Actions */}
      <FeedbackBulkActions
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        onActionComplete={handleBulkActionComplete}
      />

      <div className="block md:hidden space-y-4">
        <PaginatedFeedbackList
          searchQuery={searchQuery}
          filters={mobileColumnFilters}
          onDelete={handleDeleteFeedback}
          refreshTrigger={refreshTrigger}
        />
      </div>
      <div
        className={`hidden md:block ${theme.bgButtomNavigation} rounded-3xl ${theme.topbarShadowStyle} border ${theme.borderSubCategory} overflow-hidden`}
      >
        <Table
          data={feedback}
          columns={columns}
          actions={actions}
          loading={loading}
          selectable={true}
          onSelectionChange={setSelectedItems}
          emptyMessage={getText("noFeedbackFound")}
          className="animate-fade-in "
        />
      </div>
      
      {/* Floating Filter Button */}
      <button
        onClick={() => setShowMobileFilterModal(true)}
        className={`fixed md:hidden bottom-6 left-6 w-14 h-14 bg-[#4e7dff] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-40 ${theme.topbarShadowStyle}`}
        aria-label="Filter"
      >
        <Filter className="w-6 h-6 stroke-6" />
      </button>


      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={showMobileFilterModal}
        onClose={() => setShowMobileFilterModal(false)}
        columns={columns}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
        showIdColumn={false}
        searchable={true}
        filterable={true}
        sortable={true}
        showColumnVisibility={false}
        onClearAll={handleMobileFilterClear}
        onApply={handleMobileFilterApply}
      />
    </div>
  );
};

export default FeedbackPage;
