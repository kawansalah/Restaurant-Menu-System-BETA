import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import Input from "@/admin/components/Input";
import {
  Search,
  Filter,
  X,
  Check,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { TableColumn } from "./Table";

// Types
export interface MobileFilterModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  columns: TableColumn<T>[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  columnFilters: Record<string, string>;
  onColumnFiltersChange: (filters: Record<string, string>) => void;
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: (visibility: Record<string, boolean>) => void;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  onSortChange: (
    config: { key: string; direction: "asc" | "desc" } | null
  ) => void;
  showIdColumn?: boolean;
  idColumnTitle?: string;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  showColumnVisibility?: boolean;
  onClearAll?: () => void;
  onApply?: () => void;
  // Additional props for menu items filtering
  categories?: Array<{ id: string; label_en: string }>;
  subcategories?: Array<{ id: string; label_en: string; category_id: string }>;
}

// Custom Checkbox Component
interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
  onClick?: (e: React.MouseEvent) => void;
  indeterminate?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  onClick,
  indeterminate = false,
}) => {
  const theme = useThemeClasses();

  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        onChange();
      }}
      className={`
        w-5 h-5 rounded-md border-2 transition-all duration-300 ease-out
        flex items-center justify-center cursor-pointer
        transform hover:scale-110 active:scale-95
        ${
          checked || indeterminate
            ? `${theme.bgMain} ${theme.borderMain} border-[var(--bg-main)] shadow-md`
            : `${theme.bgCard} ${theme.borderCategory} hover:${theme.borderMain} hover:shadow-sm`
        }
      `}
    >
      {checked && (
        <Check
          className={`w-3 h-3 ${theme.buttonTextPrimary}`}
          strokeWidth={3}
        />
      )}
      {indeterminate && !checked && (
        <div className={`w-2 h-0.5 ${theme.buttonTextPrimary} rounded-full`} />
      )}
    </button>
  );
};

const MobileFilterModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  columns,
  searchQuery,
  onSearchChange,
  columnFilters,
  onColumnFiltersChange,
  columnVisibility,
  onColumnVisibilityChange,
  sortConfig,
  onSortChange,
  showIdColumn = true,
  idColumnTitle = "ID",
  searchable = true,
  filterable = true,
  sortable = true,
  showColumnVisibility = true,
  onClearAll,
  onApply,
  categories = [],
  subcategories = [],
}: MobileFilterModalProps<T>) => {
  const theme = useThemeClasses();
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "search" | "filters" | "columns" | "sort"
  >("search");

  // Translations
  const texts = {
    search: {
      ku: "گەڕان",
      ar: "بحث",
      en: "Search",
    },
    filters: {
      ku: "فلتەرەکان",
      ar: "المرشحات",
      en: "Filters",
    },
    columns: {
      ku: "ستوونەکان",
      ar: "الأعمدة",
      en: "Columns",
    },
    sort: {
      ku: "ڕیزکردن",
      ar: "ترتيب",
      en: "Sort",
    },
    clearAll: {
      ku: "پاککردنەوەی هەموو",
      ar: "مسح الكل",
      en: "Clear All",
    },
    apply: {
      ku: "جێبەجێکردن",
      ar: "تطبيق",
      en: "Apply",
    },
    close: {
      ku: "داخستن",
      ar: "إغلاق",
      en: "Close",
    },
    searchPlaceholder: {
      ku: "گەڕان...",
      ar: "بحث...",
      en: "Search...",
    },
    filterBy: {
      ku: "گەڕان بە پێی",
      ar: "بحث عن",
      en: "Filter by",
    },
    ascending: {
      ku: "سەرەوە",
      ar: "تصاعدي",
      en: "Ascending",
    },
    descending: {
      ku: "خوارەوە",
      ar: "تنازلي",
      en: "Descending",
    },
    noSort: {
      ku: "بێ ڕیزکردن",
      ar: "بدون ترتيب",
      en: "No Sort",
    },
  };

  // Handle clear all filters
  const handleClearAll = () => {
    onSearchChange("");
    onColumnFiltersChange({});
    onSortChange(null);
    onClearAll?.();
  };

  // Handle apply and close
  const handleApply = () => {
    onApply?.();
    onClose();
  };

  // Handle column filter change
  const handleColumnFilterChange = (columnKey: string, value: string) => {
    onColumnFiltersChange({
      ...columnFilters,
      [columnKey]: value,
    });
  };

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnKey: string) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [columnKey]: !columnVisibility[columnKey],
    });
  };

  // Handle sort change
  const handleSortChange = (columnKey: string) => {
    if (!sortable) return;

    if (sortConfig?.key === columnKey) {
      if (sortConfig.direction === "asc") {
        onSortChange({ key: columnKey, direction: "desc" });
      } else {
        onSortChange(null);
      }
    } else {
      onSortChange({ key: columnKey, direction: "asc" });
    }
  };

  // Get visible columns
  const visibleColumns = columns.filter(
    (col) => columnVisibility[col.key] !== false
  );
  const filterableColumns = visibleColumns.filter((col) => col.filterable);
  const sortableColumns = columns.filter((col) => col.sortable !== false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-lg mx-4 rounded-t-3xl overflow-hidden
          ${theme.bgCard} border ${theme.borderCategory}
          max-h-[80vh] flex flex-col
          transform transition-all duration-300 ease-out
          ${
            isOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-full opacity-0 scale-95"
          }
        `}
        style={{
          boxShadow: "0 -10px 25px rgba(0, 0, 0, 0.15)",
          transformOrigin: "bottom center",
        }}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${theme.borderCategory} ${theme.bgTopbar}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className={`w-5 h-5 ${theme.textMain}`} />
              <h3
                className={`text-lg font-semibold ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                }`}
              >
                {texts.filters[language]}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-full ${theme.bgSecondary} ${theme.textSecondary} 
                hover:${theme.bgSearchBar} transition-all duration-200 ease-out
                transform hover:scale-110 active:scale-95 hover:rotate-90
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div
            className={`flex mt-4 gap-1 p-1 rounded-xl ${theme.bgSecondary}`}
          >
            {searchable && (
              <button
                onClick={() => setActiveTab("search")}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ease-out
                  transform hover:scale-105 active:scale-95
                  ${
                    activeTab === "search"
                      ? `${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg`
                      : `${theme.textSecondary} hover:${theme.bgSearchBar} hover:shadow-md`
                  }
                `}
              >
                {texts.search[language]}
              </button>
            )}
            {filterable && filterableColumns.length > 0 && (
              <button
                onClick={() => setActiveTab("filters")}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ease-out
                  transform hover:scale-105 active:scale-95
                  ${
                    activeTab === "filters"
                      ? `${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg`
                      : `${theme.textSecondary} hover:${theme.bgSearchBar} hover:shadow-md`
                  }
                `}
              >
                {texts.filters[language]}
              </button>
            )}
            {showColumnVisibility && (
              <button
                onClick={() => setActiveTab("columns")}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ease-out
                  transform hover:scale-105 active:scale-95
                  ${
                    activeTab === "columns"
                      ? `${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg`
                      : `${theme.textSecondary} hover:${theme.bgSearchBar} hover:shadow-md`
                  }
                `}
              >
                {texts.columns[language]}
              </button>
            )}
            {sortable && sortableColumns.length > 0 && (
              <button
                onClick={() => setActiveTab("sort")}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ease-out
                  transform hover:scale-105 active:scale-95
                  ${
                    activeTab === "sort"
                      ? `${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg`
                      : `${theme.textSecondary} hover:${theme.bgSearchBar} hover:shadow-md`
                  }
                `}
              >
                {texts.sort[language]}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Search Tab */}
          {activeTab === "search" && searchable && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-2 duration-300">
              <Input
                type="text"
                placeholder={texts.searchPlaceholder[language]}
                value={searchQuery}
                onChange={(value) => onSearchChange(String(value))}
                icon={<Search className="w-4 h-4" />}
                iconPosition="left"
              />
            </div>
          )}

          {/* Filters Tab */}
          {activeTab === "filters" && filterable && (
            <div className="space-y-10 animate-in fade-in-0 slide-in-from-right-2 duration-300">
              {filterableColumns.map((column) => {
                const renderFilterInput = () => {
                  switch (column.key) {
                    case "is_active":
                      return (
                        <Input
                          type="dropdown"
                          value={columnFilters[column.key] || ""}
                          onSelect={(value) =>
                            handleColumnFilterChange(column.key, value)
                          }
                          placeholder="All Status"
                          options={[
                            { value: "", label: "All Status" },
                            { value: "true", label: "Active" },
                            { value: "false", label: "Inactive" },
                          ]}
                        />
                      );

                    case "is_available":
                      return (
                        <Input
                          type="dropdown"
                          value={columnFilters[column.key] || ""}
                          onSelect={(value) =>
                            handleColumnFilterChange(column.key, value)
                          }
                          placeholder="All Status"
                          options={[
                            { value: "", label: "All Status" },
                            { value: "true", label: "Available" },
                            { value: "false", label: "Unavailable" },
                          ]}
                        />
                      );

                    case "category_id":
                      return (
                        <Input
                          type="dropdown"
                          value={columnFilters[column.key] || ""}
                          onSelect={(value) =>
                            handleColumnFilterChange(column.key, value)
                          }
                          placeholder="All Categories"
                          options={[
                            { value: "", label: "All Categories" },
                            ...categories.map((cat) => ({
                              value: cat.id,
                              label: cat.label_en,
                            })),
                          ]}
                        />
                      );

                    case "subcategory_id":
                      const filteredSubcategories = subcategories.filter(
                        (sub) =>
                          !columnFilters.category_id ||
                          sub.category_id === columnFilters.category_id
                      );
                      return (
                        <Input
                          type="dropdown"
                          value={columnFilters[column.key] || ""}
                          onSelect={(value) =>
                            handleColumnFilterChange(column.key, value)
                          }
                          placeholder="All Subcategories"
                          options={[
                            { value: "", label: "All Subcategories" },
                            ...filteredSubcategories.map((sub) => ({
                              value: sub.id,
                              label: sub.label_en,
                            })),
                          ]}
                          disabled={!columnFilters.category_id}
                        />
                      );

                    case "role":
                      return (
                        <Input
                          type="dropdown"
                          value={columnFilters[column.key] || ""}
                          onSelect={(value) =>
                            handleColumnFilterChange(column.key, value)
                          }
                          placeholder="All Roles"
                          options={[
                            { value: "", label: "All Roles" },
                            { value: "super_admin", label: "Super Admin" },
                            { value: "admin", label: "Admin" },
                            { value: "manager", label: "Manager" },
                            { value: "staff", label: "Staff" },
                          ]}
                        />
                      );

                    case "rating":
                      return (
                        <Input
                          type="dropdown"
                          value={columnFilters[column.key] || ""}
                          onSelect={(value) =>
                            handleColumnFilterChange(column.key, value)
                          }
                          placeholder="All Ratings"
                          options={[
                            { value: "", label: "All Ratings" },
                            { value: "1", label: "1 Star" },
                            { value: "2", label: "2 Stars" },
                            { value: "3", label: "3 Stars" },
                            { value: "4", label: "4 Stars" },
                            { value: "5", label: "5 Stars" },
                          ]}
                        />
                      );

                    case "created_at":
                    case "updated_at":
                    case "last_login":
                      return (
                        <Input
                          type="date"
                          value={columnFilters[column.key] || ""}
                          onChange={(value) =>
                            handleColumnFilterChange(
                              column.key,
                              value as string
                            )
                          }
                        />
                      );

                    default:
                      return (
                        <Input
                          type="text"
                          placeholder={`${texts.filterBy[language]} ${column.title}...`}
                          value={columnFilters[column.key] || ""}
                          onChange={(value) =>
                            handleColumnFilterChange(
                              column.key,
                              value as string
                            )
                          }
                        />
                      );
                  }
                };

                return (
                  <div key={column.key}>
                    <label
                      className={`block text-sm font-medium ${
                        theme.isDark ? theme.textSecondary : theme.textPrimary
                      } mb-2`}
                    >
                      {column.title}
                    </label>
                    {renderFilterInput()}
                  </div>
                );
              })}
            </div>
          )}

          {/* Columns Tab */}
          {activeTab === "columns" && showColumnVisibility && (
            <div className="space-y-3 animate-in fade-in-0 slide-in-from-right-2 duration-300">
              {/* ID Column Option */}
              {showIdColumn && (
                <div
                  className={`
                  flex items-center gap-3 p-3 rounded-xl ${theme.bgSecondary}
                  transition-all duration-200 ease-out hover:shadow-md
                  transform hover:scale-[1.02] cursor-pointer
                `}
                  onClick={() => toggleColumnVisibility("__id__")}
                >
                  <CustomCheckbox
                    checked={columnVisibility["__id__"] !== false}
                    onChange={() => {}}
                  />
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${
                        theme.isDark ? theme.textSecondary : theme.textPrimary
                      }`}
                    >
                      {idColumnTitle}
                    </div>
                  </div>
                  <div className="transition-all duration-200">
                    {columnVisibility["__id__"] !== false ? (
                      <Eye className={`w-4 h-4 ${theme.textMain}`} />
                    ) : (
                      <EyeOff className={`w-4 h-4 ${theme.textSecondary}`} />
                    )}
                  </div>
                </div>
              )}

              {/* Regular Columns */}
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl ${theme.bgSecondary}
                    transition-all duration-200 ease-out hover:shadow-md
                    transform hover:scale-[1.02] cursor-pointer
                  `}
                  onClick={() => toggleColumnVisibility(column.key)}
                >
                  <CustomCheckbox
                    checked={columnVisibility[column.key] !== false}
                    onChange={() => {}}
                  />
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${
                        theme.isDark ? theme.textSecondary : theme.textPrimary
                      }`}
                    >
                      {column.title}
                    </div>
                  </div>
                  <div className="transition-all duration-200">
                    {columnVisibility[column.key] !== false ? (
                      <Eye className={`w-4 h-4 ${theme.textMain}`} />
                    ) : (
                      <EyeOff className={`w-4 h-4 ${theme.textSecondary}`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sort Tab */}
          {activeTab === "sort" && sortable && (
            <div className="space-y-3 animate-in fade-in-0 slide-in-from-right-2 duration-300">
              {/* No Sort Option */}
              <button
                onClick={() => onSortChange(null)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ease-out
                  transform hover:scale-[1.02] active:scale-98
                  ${
                    !sortConfig
                      ? `${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg`
                      : `${theme.bgSecondary} ${
                          theme.isDark ? theme.textSecondary : theme.textPrimary
                        } hover:${theme.bgSearchBar} hover:shadow-md`
                  }
                `}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {texts.noSort[language]}
                </span>
              </button>

              {/* Sortable Columns */}
              {sortableColumns.map((column) => (
                <div key={column.key} className="space-y-2">
                  <div
                    className={`text-sm font-medium ${
                      theme.isDark ? theme.textSecondary : theme.textPrimary
                    } px-1`}
                  >
                    {column.title}
                  </div>

                  {/* Ascending */}
                  <button
                    onClick={() =>
                      onSortChange({ key: column.key, direction: "asc" })
                    }
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ease-out
                      transform hover:scale-[1.02] active:scale-98
                      ${
                        sortConfig?.key === column.key &&
                        sortConfig.direction === "asc"
                          ? `${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg`
                          : `${theme.bgSecondary} ${
                              theme.isDark
                                ? theme.textSecondary
                                : theme.textPrimary
                            } hover:${theme.bgSearchBar} hover:shadow-md`
                      }
                    `}
                  >
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm">{texts.ascending[language]}</span>
                  </button>

                  {/* Descending */}
                  <button
                    onClick={() =>
                      onSortChange({ key: column.key, direction: "desc" })
                    }
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ease-out
                      transform hover:scale-[1.02] active:scale-98
                      ${
                        sortConfig?.key === column.key &&
                        sortConfig.direction === "desc"
                          ? `${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg`
                          : `${theme.bgSecondary} ${
                              theme.isDark
                                ? theme.textSecondary
                                : theme.textPrimary
                            } hover:${theme.bgSearchBar} hover:shadow-md`
                      }
                    `}
                  >
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-sm">
                      {texts.descending[language]}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${theme.borderCategory} ${theme.bgTopbar}`}
        >
          <div className="flex gap-3">
            <button
              onClick={handleClearAll}
              className={`
                flex-1 py-3 px-4 rounded-xl border transition-all duration-300 ease-out
                ${theme.bgCard} ${theme.borderCategory} ${theme.textSecondary}
                hover:${theme.bgSearchBar} hover:shadow-md flex items-center justify-center gap-2
                transform hover:scale-105 active:scale-95
              `}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">
                {texts.clearAll[language]}
              </span>
            </button>

            <button
              onClick={handleApply}
              className={`
                flex-1 py-3 px-4 rounded-xl transition-all duration-300 ease-out
                ${theme.bgMain} ${theme.buttonTextPrimary} shadow-lg
                hover:opacity-90 hover:shadow-xl flex items-center justify-center gap-2
                transform hover:scale-105 active:scale-95
              `}
            >
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">
                {texts.apply[language]}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterModal;
