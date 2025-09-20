import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlerts } from "@/hooks/useAlerts";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import {
  Restaurant,
  RestaurantFilters,
  RestaurantCreateData,
} from "@/admin/types/admin";
import { Input } from "@/admin/components/Input";
import Table from "@/admin/components/Table";
import MobileFilterModal from "@/admin/components/MobileFilterModal";
import Button from "@/components/Button";
import RestaurantStatsCards from "./RestaurantStatsCards";
import RestaurantBulkActions from "./RestaurantBulkActions";
import RestaurantMobileCard from "./RestaurantMobileCard";
import RestaurantFormModal from "./RestaurantFormModal";
import {
  fetchRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
  getRestaurantStats,
} from "@/admin/services/restaurantService";
import {
  DEFAULT_ITEMS_PER_PAGE,
  RESTAURANTS_PER_PAGE_OPTIONS,
  RESTAURANT_SORT_OPTIONS,
  RESTAURANT_STATUS_OPTIONS,
  getRestaurantDisplayName,
  getStatusColor,
} from "./RestaurantConstants";
import useScreenSize from "@/admin/hooks/useScreenSize";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Eye,
  BrushCleaning,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
} from "lucide-react";

interface PaginatedRestaurantListProps {
  className?: string;
}

const PaginatedRestaurantList: React.FC<PaginatedRestaurantListProps> = ({
  className = "",
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const alerts = useAlerts();
  const { isMobile } = useScreenSize();
  const config = defaultAdminConfig.ui.restaurants;

  // Data states
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalUsers: 0,
    totalMenuItems: 0,
    totalCategories: 0,
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<RestaurantFilters>({
    search: "",
    is_active: undefined,
    sort_by: "created_at",
    sort_direction: "desc",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [totalItems, setTotalItems] = useState(0);

  // Selection states
  const [selectedItems, setSelectedItems] = useState<Restaurant[]>([]);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const getText = (key: string) => {
    const texts = {
      addFirstRestaurant: {
        ku: "چێشتخانەیەک زیادبکە",
        ar: "إضافة مطعم جديد",
        en: "Add First Restaurant",
      },
      restaurants: {
        ku: "چێشتخانەکان",
        ar: "المطاعم",
        en: "Restaurants",
      },
      showing: {
        ku: "پیشاندان",
        ar: "عرض",
        en: "Showing",
      },
      to: {
        ku: "بۆ",
        ar: "إلى",
        en: "to",
      },
      of: {
        ku: "لە",
        ar: "من",
        en: "of",
      },
      items: {
        ku: "بڕگە",
        ar: "عنصر",
        en: "items",
      },
      previous: {
        ku: "پێشوو",
        ar: "السابق",
        en: "Previous",
      },
      next: {
        ku: "دواتر",
        ar: "التالي",
        en: "Next",
      },
      itemsPerPage: {
        ku: "بڕگە لە هەر پەڕەیەک",
        ar: "عناصر لكل صفحة",
        en: "Items per page:",
      },
      actions: {
        ku: "کردارەکان",
        ar: "الإجراءات",
        en: "Actions",
      },
      activate: {
        ku: "چالاککردن",
        ar: "تفعيل",
        en: "Activate",
      },
      deactivate: {
        ku: "ناچالاککردن",
        ar: "إلغاء التفعيل",
        en: "Deactivate",
      },
      allStatus: {
        ku: "هەموو دۆخەکان",
        ar: "جميع الحالات",
        en: "All Status",
      },
      title: {
        en: "Restaurants",
        ku: "چێشتخانەکان",
        ar: "المطاعم",
      },
    };

    return (
      texts[key as keyof typeof texts]?.[
        language as keyof (typeof texts)[keyof typeof texts]
      ] ||
      texts[key as keyof typeof texts]?.en ||
      key
    );
  };

  // Load initial data
  useEffect(() => {
    loadRestaurants();
    loadStats();
  }, []);

  // Reload when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadRestaurants();
  }, [filters]);

  // Reload when pagination changes
  useEffect(() => {
    loadRestaurants();
  }, [currentPage, itemsPerPage]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchRestaurants(filters);
      if (!error) {
        setRestaurants(data);
        setTotalItems(data.length);
      } else {
        await alerts.showError(error, "Failed to load restaurants");
      }
    } catch (error) {
      console.error("Failed to load restaurants:", error);
      await alerts.showError("Failed to load restaurants", "Error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const { data, error } = await getRestaurantStats();
      if (!error) {
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadRestaurants(), loadStats()]);
    setRefreshing(false);
  };

  const handleFilterChange = (key: keyof RestaurantFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      is_active: undefined,
      sort_by: "created_at",
      sort_direction: "desc",
    });
  };

  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setShowFormModal(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (formData: RestaurantCreateData) => {
    setSubmitting(true);
    try {
      if (editingRestaurant) {
        const { error } = await updateRestaurant(editingRestaurant.id, formData);
        if (!error) {
          await alerts.showSuccess("Restaurant updated successfully", "Success");
          setShowFormModal(false);
          await loadRestaurants();
          await loadStats();
        } else {
          await alerts.showError(error, "Update failed");
        }
      } else {
        const { error } = await createRestaurant(formData);
        if (!error) {
          await alerts.showSuccess("Restaurant created successfully", "Success");
          setShowFormModal(false);
          await loadRestaurants();
          await loadStats();
        } else {
          await alerts.showError(error, "Creation failed");
        }
      }
    } catch (error) {
      console.error("Form submit error:", error);
      await alerts.showError("An unexpected error occurred", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRestaurant = async (restaurant: Restaurant) => {
    const confirmed = await alerts.confirmDelete(
      getRestaurantDisplayName(restaurant)
    );
    if (!confirmed) return;

    try {
      const { success, error } = await deleteRestaurant(restaurant.id);
      if (success) {
        await alerts.showSuccess("Restaurant deleted successfully", "Success");
        await loadRestaurants();
        await loadStats();
        setSelectedItems((prev) =>
          prev.filter((item) => item.id !== restaurant.id)
        );
      } else {
        await alerts.showError(
          error || "Failed to delete restaurant",
          "Delete failed"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      await alerts.showError("An unexpected error occurred", "Error");
    }
  };

  const handleToggleStatus = async (restaurant: Restaurant) => {
    try {
      const { success, error } = await toggleRestaurantStatus(
        restaurant.id,
        !restaurant.is_active
      );
      if (success) {
        await alerts.showSuccess(
          `Restaurant ${
            restaurant.is_active ? "deactivated" : "activated"
          } successfully`,
          "Success"
        );
        await loadRestaurants();
        await loadStats();
      } else {
        await alerts.showError(
          error || "Failed to update restaurant",
          "Update failed"
        );
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      await alerts.showError("An unexpected error occurred", "Error");
    }
  };

  const handleSelection = (restaurant: Restaurant) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((item) => item.id === restaurant.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== restaurant.id);
      } else {
        return [...prev, restaurant];
      }
    });
  };

  const handleBulkActionComplete = () => {
    loadRestaurants();
    loadStats();
    setSelectedItems([]);
  };

  // Paginate items
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return restaurants.slice(startIndex, endIndex);
  }, [restaurants, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Table columns for desktop
  const columns = [
    {
      key: "logo",
      title: config.restaurantLogo[language],
      render: (_value: any, item: Restaurant) => (
        <div className="w-12 h-12">
          {item.logo_url ? (
            <img
              src={item.logo_url}
              alt={getRestaurantDisplayName(item)}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-lg ${theme.bgSecondary} flex items-center justify-center`}
            >
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      title: config.name[language],
      sortable: true,
      filterable: true,
      render: (_value: any, item: Restaurant) => (
        <div>
          <div
            className={`${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            }`}
          >
            {getRestaurantDisplayName(item)}
          </div>
          <div className={`text-sm ${theme.textSecondary}`}>
            {item.email || "No email"}
          </div>
        </div>
      ),
    },
    {
      key: "theme_color",
      title: config.themeColor[language],
      render: (_value: any, item: Restaurant) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: item.theme_color }}
          ></div>
          <span className={`text-sm ${theme.textSecondary} font-mono`}>
            {item.theme_color}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      title: config.status[language],
      sortable: true,
      filterable: false,
      align: "center" as const,
      render: (_value: any, item: Restaurant) => {
        const statusColor = getStatusColor(item.is_active);
        return (
          <div className="flex items-center justify-center">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[16px] font-medium ${statusColor}`}
            >
              <Building2 className="w-4 h-4" />
              {item.is_active
                ? config.active[language]
                : config.inactive[language]}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      title: getText("actions"),
      render: (_value: any, item: Restaurant) => {
        const getActionButtonClass = (variant: string = "secondary") => {
          const baseClass = `p-2 rounded-full transition-all duration-200`;

          switch (variant) {
            case "primary":
              return `${baseClass} ${theme.bgMain} ${theme.buttonTextPrimary} hover:opacity-90`;
            case "danger":
              return `${baseClass} bg-red-500 text-white hover:bg-red-600`;
            case "success":
              return `${baseClass} bg-green-500 text-white hover:bg-green-600`;
            default:
              return `${baseClass} ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar}`;
          }
        };

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEditRestaurant(item)}
              className={`${getActionButtonClass(
                "primary"
              )} transform hover:scale-110 transition-all duration-150`}
              title={config.editRestaurant[language]}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleStatus(item)}
              className={`${getActionButtonClass(
                "success"
              )} transform hover:scale-110 transition-all duration-150`}
              title={
                item.is_active
                  ? getText("deactivate")
                  : getText("activate")
              }
            >
              <Building2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteRestaurant(item)}
              className={`${getActionButtonClass(
                "danger"
              )} transform hover:scale-110 transition-all duration-150`}
              title={config.deleteRestaurant[language]}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex sm:flex-row sm:items-center justify-between gap-4">
        <h1
          className={`text-2xl font-bold ${
            theme.isDark ? theme.textSecondary : theme.textPrimary
          } `}
        >
          {getText("title")}
        </h1>
        <div className="flex md:hidden items-center gap-3 ">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} border ${theme.borderSubCategory} hover:${theme.bgCard} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setShowMobileFilters(true)}
            className={`p-2 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} border ${theme.borderSubCategory} hover:${theme.bgCard} transition-colors flex items-center gap-2`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <RestaurantStatsCards stats={stats} loading={statsLoading} />

      {/* Filters */}
      <div
        className={`${theme.bgCard} border-2 ${theme.borderItem} rounded-3xl p-4 lg:p-6 space-y-4 hidden lg:block`}
      >
        <div className="flex flex-col items-start justify-center">
          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div className="col-span-1">
              <Input
                type="dropdown"
                value={filters.is_active?.toString() || ""}
                onChange={(value) =>
                  handleFilterChange(
                    "is_active",
                    value === "" ? undefined : value === "true"
                  )
                }
                options={[...RESTAURANT_STATUS_OPTIONS]}
                placeholder={config.status[language]}
                className="w-full"
              />
            </div>

            {/* Sort By */}
            <div className="col-span-1">
              <Input
                type="dropdown"
                value={filters.sort_by || "created_at"}
                onChange={(value) => handleFilterChange("sort_by", value)}
                options={[...RESTAURANT_SORT_OPTIONS]}
                placeholder="Sort by"
                className="w-full"
              />
            </div>

            {/* Clear Button */}
            <div className="my-auto">
              <button
                onClick={handleClearFilters}
                className={`${theme.buttonSecondary} px-4 py-4 rounded-full flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer`}
              >
                <BrushCleaning className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isMobile ? (
        // Mobile Cards
        <div
          className={`${theme.bgCard} rounded-3xl p-4 border ${theme.borderCategory}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-lg font-bold ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              }`}
            >
              {getText("restaurants")}
            </h2>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${theme.bgSecondary} ${theme.textSecondary}`}
            >
              {getText("showing")} {paginatedItems.length}
              {totalItems > paginatedItems.length &&
                ` ${getText("to")} ${totalItems}`}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`${theme.bgSecondary} relative rounded-[25px] p-4 min-h-[140px] border ${theme.borderItem} animate-pulse`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-16 h-6 ${theme.bgCard} rounded-full`}
                    ></div>
                    <div
                      className={`w-6 h-6 ${theme.bgCard} rounded-full`}
                    ></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className={`h-6 ${theme.bgCard} rounded w-3/4`}></div>
                    <div className={`h-4 ${theme.bgCard} rounded w-2/3`}></div>
                    <div className={`h-4 ${theme.bgCard} rounded w-1/2`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedItems.length === 0 ? (
            <div className="text-center py-8">
              <div
                className={`w-16 h-16 mx-auto mb-4 ${theme.bgSecondary} rounded-full flex items-center justify-center`}
              >
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3
                className={`text-lg font-semibold ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } mb-2`}
              >
                {config.noRestaurantsFound[language]}
              </h3>
              <p className={`text-sm ${theme.textSecondary} mb-4`}>
                {getText("addFirstRestaurant")}
              </p>
              <Button variant="primary" onClick={handleAddRestaurant}>
                <Plus className="h-4 w-4 mr-2" />
                {config.addRestaurant[language]}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${(index % itemsPerPage) * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <RestaurantMobileCard
                    restaurant={item}
                    isSelected={selectedItems.some(
                      (selected) => selected.id === item.id
                    )}
                    onSelect={handleSelection}
                    onEdit={handleEditRestaurant}
                    onDelete={handleDeleteRestaurant}
                    onToggleStatus={handleToggleStatus}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Desktop Table
        <Table
          columns={columns}
          data={paginatedItems}
          loading={loading}
          selectable={true}
          onSelectionChange={setSelectedItems}
          emptyMessage={config.noRestaurantsFound[language]}
          onAdd={handleAddRestaurant}
          onRefresh={handleRefresh}
          className="animate-fade-in"
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme.textSecondary}`}>
              {getText("showing")} {(currentPage - 1) * itemsPerPage + 1}{" "}
              {getText("to")} {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
              {getText("of")} {totalItems} {getText("items")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              {getText("previous")}
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + Math.max(1, currentPage - 2);
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      w-8 h-8 rounded-lg text-sm font-medium transition-colors
                      ${
                        page === currentPage
                          ? "bg-[var(--bg-main)] text-white"
                          : `${theme.bgSecondary} ${theme.textSecondary} hover:bg-gray-200 dark:hover:bg-gray-700`
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <Button
              variant="secondary"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              {getText("next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme.textSecondary}`}>
              {getText("itemsPerPage")}
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`
                px-2 py-1 rounded border text-sm
                ${theme.bgCard} ${theme.textPrimary} ${theme.border}
                focus:ring-2 focus:ring-[var(--bg-main)] focus:border-transparent
              `}
            >
              {RESTAURANTS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Mobile Filter Modal */}
      {isMobile && (
        <MobileFilterModal
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          columns={columns}
          searchQuery={filters.search || ""}
          onSearchChange={(query) =>
            setFilters((prev) => ({ ...prev, search: query }))
          }
          columnFilters={{}}
          onColumnFiltersChange={() => {}}
          columnVisibility={{}}
          onColumnVisibilityChange={() => {}}
          sortConfig={null}
          onSortChange={() => {}}
          onClearAll={handleClearFilters}
          onApply={() => {
            setShowMobileFilters(false);
          }}
        />
      )}

      {/* Bulk Actions */}
      <RestaurantBulkActions
        selectedItems={selectedItems}
        allItems={paginatedItems}
        onSelectionChange={setSelectedItems}
        onActionComplete={handleBulkActionComplete}
      />

      {/* Form Modal */}
      <RestaurantFormModal
        isOpen={showFormModal}
        editingRestaurant={editingRestaurant}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default PaginatedRestaurantList;