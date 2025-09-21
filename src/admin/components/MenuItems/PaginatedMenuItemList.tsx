import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlerts } from "@/hooks/useAlerts";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import {
  AdminMenuItem,
  MenuItemFilters,
  Category,
  SubCategory,
  MenuItemCreateData,
} from "@/admin/types/admin";
import { Input } from "@/admin/components/Input";
import Table from "@/admin/components/Table";
import MobileFilterModal from "@/admin/components/MobileFilterModal";
import Button from "@/components/Button";
import MenuItemStatsCards from "./MenuItemStatsCards";
import MenuItemBulkActions from "./MenuItemBulkActions";
import MenuItemMobileCard from "./MenuItemMobileCard";
import MenuItemFormModal from "./MenuItemFormModal";
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  getMenuItemStats,
} from "@/admin/services/menuItemService";
import { fetchCategories } from "@/admin/services/categoryService";
import { fetchSubCategories } from "@/admin/services/subcategoryService";
import {
  DEFAULT_ITEMS_PER_PAGE,
  MENU_ITEMS_PER_PAGE_OPTIONS,
  MENU_ITEM_SORT_OPTIONS,
  MENU_ITEM_STATUS_OPTIONS,
  getMenuItemDisplayName,
  formatPrice,
} from "./MenuItemConstants";
import useScreenSize from "@/admin/hooks/useScreenSize";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Star,
  Eye,
  BrushCleaning,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
} from "lucide-react";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";

interface PaginatedMenuItemListProps {
  className?: string;
}

const PaginatedMenuItemList: React.FC<PaginatedMenuItemListProps> = ({
  className = "",
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const alerts = useAlerts();
  const { isMobile } = useScreenSize();
  const { user } = useAdminAuth();
  const config = defaultAdminConfig.ui.menuItems;

  // Data states
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    unavailableItems: 0,
    averageRating: 0,
    totalRatings: 0,
    totalViews: 0,
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<MenuItemFilters>({
    search: "",
    category_id: "",
    subcategory_id: "",
    is_available: undefined,
    restaurant_id: user?.restaurant_id || "",
    sort_by: "created_at",
    sort_direction: "desc",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [totalItems, setTotalItems] = useState(0);

  // Selection states
  const [selectedItems, setSelectedItems] = useState<AdminMenuItem[]>([]);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<AdminMenuItem | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  const getText = (key: string) => {
    const texts = {
      addFirstMenuItem: {
        ku: "خواردنێک زیادبکە",
        ar: "إضافة عنصر جديد",
        en: "Add First Menu Item",
      },
      menuItems: {
        ku: "خواردنەکان",
        ar: "عناصر القائمة",
        en: "Menu Items",
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
      sortBy: {
        ku: "ڕیزکردن بەپێی",
        ar: "ترتيب حسب",
        en: "Sort by",
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
      views: {
        ku: "بینین",
        ar: "المشاهدات",
        en: "Views",
      },
      actions: {
        ku: "کردارەکان",
        ar: "الإجراءات",
        en: "Actions",
      },
      noRating: {
        ku: "هیچ هەڵسەنگاندنێک نییە",
        ar: "لا يوجد تقييم",
        en: "No rating",
      },
      reviewCount: {
        ku: "ژمارەی پێداچوونەوە",
        ar: "عدد التقييمات",
        en: "Reviews",
      },
      makeUnavailable: {
        ku: "نابەردەست بکە",
        ar: "جعل غير متاح",
        en: "Make Unavailable",
      },
      makeAvailable: {
        ku: "بەردەست بکە",
        ar: "جعل متاح",
        en: "Make Available",
      },
      allCategories: {
        ku: "هەموو پۆلەکان",
        ar: "جميع الفئات",
        en: "All Categories",
      },
      allSubcategories: {
        ku: "هەموو ژێرپۆلەکان",
        ar: "جميع الفئات الفرعية",
        en: "All Subcategories",
      },
      title: {
        en: "Menu Items",
        ku: "خواردنەکان",
        ar: "القائمة",
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
    loadMenuItems();
    loadCategories();
    loadSubcategories();
    loadStats();
  }, []);

  // Reload when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadMenuItems();
  }, [filters]);

  // Reload when pagination changes
  useEffect(() => {
    loadMenuItems();
  }, [currentPage, itemsPerPage]);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchMenuItems(filters);
      if (!error) {
        setMenuItems(data);
        setTotalItems(data.length);
      } else {
        await alerts.showError(error, "Failed to load menu items");
      }
    } catch (error) {
      console.error("Failed to load menu items:", error);
      await alerts.showError("Failed to load menu items", "Error");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // Pass restaurant filter to categories like in Category component
      const categoryFilters = { restaurant_id: user?.restaurant_id || "" };
      const { data, error } = await fetchCategories(categoryFilters);
      if (!error) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadSubcategories = async () => {
    try {
      // Pass restaurant filter to subcategories like in Category component
      const subcategoryFilters = { restaurant_id: user?.restaurant_id || "" };
      const { data, error } = await fetchSubCategories(subcategoryFilters);
      if (!error) {
        setSubcategories(data);
      }
    } catch (error) {
      console.error("Failed to load subcategories:", error);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const { data, error } = await getMenuItemStats(user?.restaurant_id);
      if (error) {
        console.error("Error loading menu item stats:", error);
      } else {
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
    await Promise.all([loadMenuItems(), loadStats()]);
    setRefreshing(false);
  };

  const handleFilterChange = (key: keyof MenuItemFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category_id: "",
      subcategory_id: "",
      is_available: undefined,
      sort_by: "created_at",
      sort_direction: "desc",
    });
  };

  const handleAddMenuItem = () => {
    setEditingMenuItem(null);
    setShowFormModal(true);
  };

  const handleEditMenuItem = (menuItem: AdminMenuItem) => {
    setEditingMenuItem(menuItem);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (formData: MenuItemCreateData) => {
    setSubmitting(true);
    try {
      if (editingMenuItem) {
        const { error } = await updateMenuItem(editingMenuItem.id, formData);
        if (!error) {
          await alerts.showSuccess("Menu item updated successfully", "Success");
          setShowFormModal(false);
          await loadMenuItems();
          await loadStats();
        } else {
          await alerts.showError(error, "Update failed");
        }
      } else {
        const { error } = await createMenuItem(formData);
        if (!error) {
          await alerts.showSuccess("Menu item created successfully", "Success");
          setShowFormModal(false);
          await loadMenuItems();
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

  const handleDeleteMenuItem = async (menuItem: AdminMenuItem) => {
    const confirmed = await alerts.confirmDelete(
      getMenuItemDisplayName(menuItem, language)
    );
    if (!confirmed) return;

    try {
      const { success, error } = await deleteMenuItem(menuItem.id);
      if (success) {
        await alerts.showSuccess("Menu item deleted successfully", "Success");
        await loadMenuItems();
        await loadStats();
        setSelectedItems((prev) =>
          prev.filter((item) => item.id !== menuItem.id)
        );
      } else {
        await alerts.showError(
          error || "Failed to delete menu item",
          "Delete failed"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      await alerts.showError("An unexpected error occurred", "Error");
    }
  };

  const handleToggleAvailability = async (menuItem: AdminMenuItem) => {
    try {
      const { success, error } = await toggleMenuItemAvailability(
        menuItem.id,
        !menuItem.is_available
      );
      if (success) {
        await alerts.showSuccess(
          `Menu item ${
            menuItem.is_available ? "made unavailable" : "made available"
          } successfully`,
          "Success"
        );
        await loadMenuItems();
        await loadStats();
      } else {
        await alerts.showError(
          error || "Failed to update menu item",
          "Update failed"
        );
      }
    } catch (error) {
      console.error("Toggle availability error:", error);
      await alerts.showError("An unexpected error occurred", "Error");
    }
  };

  const handleSelection = (menuItem: AdminMenuItem) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((item) => item.id === menuItem.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== menuItem.id);
      } else {
        return [...prev, menuItem];
      }
    });
  };

  const handleBulkActionComplete = () => {
    loadMenuItems();
    loadStats();
    setSelectedItems([]);
  };

  // Paginate items
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return menuItems.slice(startIndex, endIndex);
  }, [menuItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Table columns for desktop
  const columns = [
    {
      key: "image",
      title: config.menuItemImage[language],
      render: (_value: any, item: AdminMenuItem) => (
        <div className="w-12 h-12">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={getMenuItemDisplayName(item, language)}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-lg ${theme.bgSecondary} flex items-center justify-center`}
            >
              <Package className="h-6 w-6 text-gray-400" />
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
      render: (_value: any, item: AdminMenuItem) => (
        <div>
          <div
            className={`${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            }`}
          >
            {getMenuItemDisplayName(item, language)}
          </div>
          <div className={`text-sm ${theme.textSecondary}`}>
            {item.category?.label_en} › {item.subcategory?.label_en}
          </div>
        </div>
      ),
    },
    {
      key: "price",
      title: config.price[language],
      sortable: true,
      filterable: true,
      render: (_value: any, item: AdminMenuItem) => (
        <span
          className={` ${
            theme.isDark ? theme.textSecondary : theme.textPrimary
          }`}
        >
          {formatPrice(item.price)}
        </span>
      ),
    },
    {
      key: "rating",
      title: config.rating[language],
      sortable: true,
      align: "center" as const,
      render: (_value: any, item: AdminMenuItem) => {
        if (!item.rating || item.rating === 0) {
          return (
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                <Star className="h-4 w-4" />
                {getText("noRating")}
              </span>
            </div>
          );
        }

        const RATING_COLORS = {
          bad: {
            bg: "bg-[#ffd042]",
            text: "text-white",
            border: "border-[#ffd042]",
          }, // 3.0+
          worse: {
            bg: "bg-[#FF5E5E]",
            text: "text-white",
            border: "border-[#FF5E5E]",
          }, // <3.0
        };

        const getRatingStyle = (rating: number) => {
          if (rating >= 3.0) return RATING_COLORS.bad;
          return RATING_COLORS.worse;
        };

        const ratingStyle = getRatingStyle(item.rating);

        return (
          <div className="flex items-center justify-center">
            <div
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border
                ${ratingStyle.bg} ${ratingStyle.text} ${ratingStyle.border}
                transition-all duration-200 hover:shadow-sm
              `}
            >
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{item.rating.toFixed(1)}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "rating_count",
      title: getText("reviewCount"),
      sortable: true,
      align: "center" as const,
      render: (_value: any, item: AdminMenuItem) => (
        <div className="flex items-center justify-center">
          <span className={`text-sm font-medium ${theme.textSecondary}`}>
            {item.rating_count || 0}
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
      render: (_value: any, item: AdminMenuItem) => {
        const STATUS_COLORS = {
          available:
            "bg-[#18b577] text-white dark:bg-[#18b577] dark:text-white",
          unavailable:
            "bg-[#FF5E5E] text-white dark:bg-[#FF5E5E] dark:text-white",
        };

        return (
          <div className="flex items-center justify-center">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[16px] font-medium ${
                item.is_available
                  ? STATUS_COLORS.available
                  : STATUS_COLORS.unavailable
              }`}
            >
              <Package className="w-4 h-4" />
              {item.is_available
                ? config.available[language]
                : config.unavailable[language]}
            </span>
          </div>
        );
      },
    },
    {
      key: "views",
      title: getText("views"),
      sortable: true,
      render: (_value: any, item: AdminMenuItem) => (
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4 text-gray-400" />
          <span className={theme.textSecondary}>{item.views_count}</span>
        </div>
      ),
    },
    {
      key: "actions",
      title: getText("actions"),
      render: (_value: any, item: AdminMenuItem) => {
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
              onClick={() => handleEditMenuItem(item)}
              className={`${getActionButtonClass(
                "primary"
              )} transform hover:scale-110 transition-all duration-150`}
              title={config.editMenuItem[language]}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleAvailability(item)}
              className={`${getActionButtonClass(
                "success"
              )} transform hover:scale-110 transition-all duration-150`}
              title={
                item.is_available
                  ? getText("makeUnavailable")
                  : getText("makeAvailable")
              }
            >
              <Package className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteMenuItem(item)}
              className={`${getActionButtonClass(
                "danger"
              )} transform hover:scale-110 transition-all duration-150`}
              title={config.deleteMenuItem[language]}
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
      <MenuItemStatsCards stats={stats} loading={statsLoading} />

      {/* Filters */}
      <div
        className={`${theme.bgCard} border-2 ${theme.borderItem} rounded-3xl p-4 lg:p-6 space-y-4 hidden lg:block`}
      >
        {/* Filter Controls */}
        <div className="flex flex-col items-start justify-center">
          {/* Desktop Filters - Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="col-span-1">
              <Input
                type="dropdown"
                value={filters.category_id || ""}
                onChange={(value) => handleFilterChange("category_id", value)}
                options={[
                  { value: "", label: getText("allCategories") },
                  ...categories.map((cat) => ({
                    value: cat.id,
                    label: cat.label_en,
                  })),
                ]}
                placeholder={config.category[language]}
                className="w-full"
              />
            </div>

            {/* Subcategory Filter */}
            <div className="col-span-1">
              <Input
                type="dropdown"
                value={filters.subcategory_id || ""}
                onChange={(value) =>
                  handleFilterChange("subcategory_id", value)
                }
                options={[
                  { value: "", label: getText("allSubcategories") },
                  ...subcategories
                    .filter(
                      (sub) =>
                        !filters.category_id ||
                        sub.category_id === filters.category_id
                    )
                    .map((sub) => ({ value: sub.id, label: sub.label_en })),
                ]}
                placeholder={config.subcategory[language]}
                className="w-full"
                disabled={!filters.category_id}
              />
            </div>

            {/* Status Filter */}
            <div className="col-span-1">
              <Input
                type="dropdown"
                value={filters.is_available?.toString() || ""}
                onChange={(value) =>
                  handleFilterChange(
                    "is_available",
                    value === "" ? undefined : value === "true"
                  )
                }
                options={[...MENU_ITEM_STATUS_OPTIONS]}
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
                options={[...MENU_ITEM_SORT_OPTIONS]}
                placeholder={getText("sortBy")}
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
          {/* Header with count */}
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-lg font-bold ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              }`}
            >
              {getText("menuItems")}
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
            // Professional skeleton loader
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`${theme.bgSecondary} relative rounded-[25px] p-4 min-h-[140px] border ${theme.borderItem} animate-pulse`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Top Row: ID Badge and Action Button */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-16 h-6 ${theme.bgCard} rounded-full`}
                    ></div>
                    <div
                      className={`w-6 h-6 ${theme.bgCard} rounded-full`}
                    ></div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-2 mb-4">
                    {/* Menu Item Name */}
                    <div className={`h-6 ${theme.bgCard} rounded w-3/4`}></div>
                    {/* Category/Price */}
                    <div className={`h-4 ${theme.bgCard} rounded w-2/3`}></div>
                    {/* Description */}
                    <div className={`h-4 ${theme.bgCard} rounded w-1/2`}></div>
                  </div>

                  {/* Footer */}
                  <div
                    className={`pt-2 border-t ${theme.borderItem} flex justify-between`}
                  >
                    <div className={`h-3 ${theme.bgCard} rounded w-20`}></div>
                    <div className={`h-3 ${theme.bgCard} rounded w-20`}></div>
                  </div>

                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer rounded-[25px]"></div>
                </div>
              ))}
            </div>
          ) : paginatedItems.length === 0 ? (
            <div className="text-center py-8">
              <div
                className={`w-16 h-16 mx-auto mb-4 ${theme.bgSecondary} rounded-full flex items-center justify-center`}
              >
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3
                className={`text-lg font-semibold ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } mb-2`}
              >
                {config.noMenuItemsFound[language]}
              </h3>
              <p className={`text-sm ${theme.textSecondary} mb-4`}>
                {getText("addFirstMenuItem")}
              </p>
              <Button variant="primary" onClick={handleAddMenuItem}>
                <Plus className="h-4 w-4 mr-2" />
                {config.addMenuItem[language]}
              </Button>
            </div>
          ) : (
            // Menu Items List
            <div className="space-y-3">
              {paginatedItems.map((item, index) => (
                <div
                  key={item.id}
                  data-menuitem-index={index}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${(index % itemsPerPage) * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <MenuItemMobileCard
                    menuItem={item}
                    isSelected={selectedItems.some(
                      (selected) => selected.id === item.id
                    )}
                    onSelect={handleSelection}
                    onEdit={handleEditMenuItem}
                    onDelete={handleDeleteMenuItem}
                    onToggleAvailability={handleToggleAvailability}
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
          emptyMessage={config.noMenuItemsFound[language]}
          onAdd={handleAddMenuItem}
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
              {MENU_ITEMS_PER_PAGE_OPTIONS.map((option) => (
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

      {/* Floating Action Buttons */}
      <div className="fixed md:hidden mx-auto bottom-6 right-0 flex justify-between w-full px-6 z-40">
        {/* Floating Action Button */}
        <button
          onClick={() => setShowFormModal(true)}
          className={`w-14 h-14 ${theme.bgMain} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${theme.topbarShadowStyle}`}
          // aria-label={getText("addFeedback")}
        >
          <Plus className="w-6 h-6 stroke-6" />
        </button>

        {/* Floating Filter Button */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className={`w-14 h-14 bg-[#4e7dff] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${theme.topbarShadowStyle}`}
          aria-label="Filter"
        >
          <Filter className="w-6 h-6 stroke-6" />
        </button>
      </div>

      {/* Bulk Actions */}
      <MenuItemBulkActions
        selectedItems={selectedItems}
        allItems={paginatedItems}
        onSelectionChange={setSelectedItems}
        onActionComplete={handleBulkActionComplete}
      />
      {/* Form Modal */}
      <MenuItemFormModal
        isOpen={showFormModal}
        editingMenuItem={editingMenuItem}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default PaginatedMenuItemList;
