import React, { useState, useMemo, useRef, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  Download,
  RefreshCw,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Columns,
} from "lucide-react";

// Types
export interface TableColumn<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T, index: number) => void;
  variant?: "primary" | "secondary" | "danger" | "success";
  disabled?: (row: T) => boolean;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  title?: string;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  onRefresh?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
  className?: string;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  showIdColumn?: boolean;
  idColumnTitle?: string;
  showColumnVisibility?: boolean;
  tableId?: string;
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
        w-5 h-5 rounded-md border-2 transition-all duration-200 
        flex items-center justify-center cursor-pointer
        ${
          checked || indeterminate
            ? `${theme.bgMain} ${theme.borderMain} border-[var(--bg-main)]`
            : `${theme.bgCard} ${theme.borderCategory} hover:${theme.borderMain}`
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

const Table = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  title,
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = "No data available",
  onRefresh,
  onAdd,
  onExport,
  className = "",
  rowClassName,
  onRowClick,
  selectable = false,
  onSelectionChange,
  showIdColumn = true,
  idColumnTitle = "ID",
  showColumnVisibility = true,
  tableId = "default-table",
}: TableProps<T>) => {
  const theme = useThemeClasses();
  const { language, isRTL } = useLanguage();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {}
  );
  const [previousPage, setPreviousPage] = useState(1);
  const [wasFiltered, setWasFiltered] = useState(false);

  // Reset to first page only when filters are applied (not cleared)
  useEffect(() => {
    const hasActiveSearch = searchQuery.trim() !== "";
    const hasActiveFilters = Object.values(columnFilters).some(
      (filter) => filter.trim() !== ""
    );
    const currentlyHasFilters = hasActiveSearch || hasActiveFilters;

    if (currentlyHasFilters) {
      if (!wasFiltered) {
        // First time applying filters - save current page
        setPreviousPage(currentPage);
        setWasFiltered(true);
      }
      setCurrentPage(1);
    } else if (wasFiltered) {
      // Filters were just cleared - return to previous page
      setWasFiltered(false);
      if (previousPage <= Math.ceil(data.length / pageSize)) {
        setTimeout(() => setCurrentPage(previousPage), 0);
      }
    }
  }, [
    searchQuery,
    columnFilters,
    currentPage,
    wasFiltered,
    previousPage,
    data.length,
    pageSize,
  ]);

  // Column visibility state
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const columnDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize column visibility from localStorage
  const getStoredColumnVisibility = () => {
    try {
      const stored = localStorage.getItem(`table-columns-${tableId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(
        "Error reading column visibility from localStorage:",
        error
      );
    }
    // Default: all columns visible
    const defaultVisibility: Record<string, boolean> = {};
    // Add ID column if enabled
    if (showIdColumn) {
      defaultVisibility["__id__"] = true;
    }
    columns.forEach((col) => {
      defaultVisibility[col.key] = true;
    });
    return defaultVisibility;
  };

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(getStoredColumnVisibility);

  // Save column visibility to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        `table-columns-${tableId}`,
        JSON.stringify(columnVisibility)
      );
    } catch (error) {
      console.error("Error saving column visibility to localStorage:", error);
    }
  }, [columnVisibility, tableId]);

  // Update column visibility when columns change
  useEffect(() => {
    const newVisibility = { ...columnVisibility };
    let hasChanges = false;

    // Add ID column if enabled and not present
    if (showIdColumn && !("__id__" in newVisibility)) {
      newVisibility["__id__"] = true;
      hasChanges = true;
    }

    columns.forEach((col) => {
      if (!(col.key in newVisibility)) {
        newVisibility[col.key] = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setColumnVisibility(newVisibility);
    }
  }, [columns, showIdColumn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target as Node)
      ) {
        setShowColumnDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => columnVisibility[col.key] !== false);
  }, [columns, columnVisibility]);

  // Check if ID column is visible
  const isIdColumnVisible =
    showIdColumn && columnVisibility["__id__"] !== false;

  // Filtering logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Search filter - search across all columns, not just visible ones
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        columns.some((column) => {
          const value = row[column.key];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        })
      );
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter((row) => {
          const value = row[key];
          return value
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        });
      }
    });

    return filtered;
  }, [data, searchQuery, columnFilters, columns]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle returning to previous page when filters are cleared - this is now handled in the main effect above
  // This effect just handles page bounds validation
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Handlers
  const handleSort = (key: string) => {
    if (!sortable) return;

    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  const handleSelectRow = (row: T) => {
    if (!selectable) return;

    const newSelection = selectedRows.includes(row)
      ? selectedRows.filter((r) => r !== row)
      : [...selectedRows, row];

    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectAll = () => {
    if (!selectable) return;

    const newSelection =
      selectedRows.length === paginatedData.length ? [] : [...paginatedData];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

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

  // Check if all visible rows are selected
  const isAllSelected =
    selectedRows.length === paginatedData.length && paginatedData.length > 0;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < paginatedData.length;

  // Column visibility toggle function
  const toggleColumnVisibility = (columnKey: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const addTexts = {
    ku: "زیادکردن",
    ar: "إضافة جديد",
    en: "Add New",
  };
  const filterTexts = {
    ku: "گەڕان بە پێی",
    ar: "بحث عن",
    en: "Filter by",
  };
  const columnTexts = {
    ku: "ستوونەکان",
    ar: "الأعمدة",
    en: "Columns",
  };
  return (
    <div
      className={`${theme.bgCard} rounded-3xl ${theme.borderCategory} border overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className={`p-6 border-b ${theme.borderCategory} ${theme.bgTopbar}`}>
        <div className="flex  lg:flex-row md:flex-row sm:flex-col xs:flex-col items-center justify-between gap-4">
          {/* Title and Stats */}
          <div className="flex items-center gap-4">
            {title && (
              <h2
                className={`text-xl font-semibold ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                }`}
              >
                {title}
              </h2>
            )}
            <div
              className={`px-3 py-1 rounded-full ${theme.bgMain} ${theme.buttonTextPrimary} text-sm font-medium`}
            >
              {sortedData.length} items
            </div>
            {selectedRows.length > 0 && (
              <div
                className={`px-3 py-1 rounded-full ${theme.bgSecondary} ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } text-sm font-medium`}
              >
                {selectedRows.length} selected
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {onAdd && (
              <div className="w-fit">
                <Button onClick={onAdd} variant="adminpanel">
                  <Plus className="w-4 h-4" />
                  {addTexts[language]}
                </Button>
              </div>
            )}

            {onExport && (
              <button
                onClick={onExport}
                className={`p-2 rounded-xl border ${theme.bgCard} ${theme.textSecondary} ${theme.borderCategory} hover:${theme.bgSearchBar} transition-all duration-200`}
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                className={`p-2 rounded-xl border ${theme.bgCard} ${
                  theme.borderCategory
                } ${theme.textSecondary} hover:${
                  theme.bgSearchBar
                }`}
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 transition-all duration-200 ${loading ? "animate-spin" : ""}` } />
              </button>
            )}

            {showColumnVisibility && (
              <div className="relative" ref={columnDropdownRef}>
                <button
                  onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                  className={`
                    flex items-center gap-2 p-2 rounded-xl transition-colors duration-200
                    ${theme.bgCard} border ${theme.borderCategory}
                    hover:${theme.bgSearchBar}
                  `}
                  // style={{ boxShadow: 'var(--shadow)' }}
                  title={columnTexts[language]}
                >
                  <Columns
                    className={`w-4 h-4 ${
                      theme.isDark ? theme.textSecondary : theme.textPrimary
                    }`}
                  />
                  <ChevronDown
                    className={`w-4 h-4 ${
                      theme.textSecondary
                    } transition-transform duration-200 ${
                      showColumnDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showColumnDropdown && (
                  <div
                    className={`
                      absolute top-full mt-2 min-w-[200px] max-h-[300px] rounded-2xl overflow-auto hide-scrollbar
                      ${theme.bgCard} border ${theme.borderLanguage} 
                      ${isRTL ? "left-0" : "right-0"}
                      z-50
                      px-2
                    `}
                    style={{ boxShadow: "0 20px 20px rgba(0, 0, 0, 0.1.5)" }}
                  >
                    <div className="py-2 flex flex-col gap-2">
                      {/* ID Column Option */}
                      {showIdColumn && (
                        <button
                          key="__id__"
                          onClick={() => toggleColumnVisibility("__id__")}
                          className={`
                            w-full px-4 py-3 flex items-center gap-3 transition-colors duration-200
                            ${theme.languageHover}
                            ${isRTL ? "text-right" : "text-left"}
                          `}
                        >
                          <CustomCheckbox
                            checked={columnVisibility["__id__"] !== false}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <div
                              className={`text-sm font-medium ${
                                theme.isDark
                                  ? theme.textSecondary
                                  : theme.textPrimary
                              }`}
                            >
                              {idColumnTitle}
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Regular Columns */}
                      {columns.map((column) => (
                        <button
                          key={column.key}
                          onClick={() => toggleColumnVisibility(column.key)}
                          className={`
                            w-full px-4 py-3 flex items-center gap-3 transition-colors duration-200
                            ${theme.languageHover}
                            ${isRTL ? "text-right" : "text-left"}
                          `}
                        >
                          <CustomCheckbox
                            checked={columnVisibility[column.key] !== false}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <div
                              className={`text-sm font-medium ${
                                theme.isDark
                                  ? theme.textSecondary
                                  : theme.textPrimary
                              }`}
                            >
                              {column.title}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl border  transition-all duration-200 ${
                  showFilters
                    ? `${theme.bgMain} ${theme.buttonTextPrimary} ${theme.borderMain}`
                    : `${theme.bgCard} ${theme.textSecondary} hover:${theme.bgSearchBar} ${theme.borderCategory}`
                }`}
                title="Filters"
              >
                <Filter className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        {(searchable || showFilters) && (
          <div className="mt-4 space-y-3">
            {/* Search Bar */}
            {searchable && (
              <div
                className={`relative flex items-center ${theme.bgSearchBar} rounded-full px-4 py-3 ${theme.borderCategory} border`}
              >
                <Search className={`w-4 h-4 ${theme.textSearch} mx-3`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent outline-none ${theme.inputSearch} placeholder:${theme.textSearch}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`ml-2 rounded ${theme.textSecondary} hover:${theme.bgSecondary} transition-colors`}
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {/* Column Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {visibleColumns
                  .filter((col) => col.filterable)
                  .map((column) => (
                    <div key={column.key}>
                      <input
                        type="text"
                        placeholder={`${filterTexts[language]} ${column.title}...`}
                        value={columnFilters[column.key] || ""}
                        onChange={(e) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            [column.key]: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 rounded-full ${theme.bgSearchBar} ${theme.borderCategory} border outline-none ${theme.inputSearch} placeholder:${theme.textSearch}`}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[calc(100vh-500px)]">
        <table className="w-full">
          {/* Table Header */}
          <thead
            className={`${theme.bgSecondary} border-b ${theme.borderCategory}`}
          >
            <tr>
              {selectable && (
                <th className="p-4 text-left w-12">
                  <CustomCheckbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </th>
              )}

              {isIdColumnVisible && (
                <th className="p-4 text-left w-16">
                  <span
                    className={`font-medium ${
                      theme.isDark ? theme.textSecondary : theme.textPrimary
                    } text-sm`}
                  >
                    {idColumnTitle}
                  </span>
                </th>
              )}

              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={`p-4 text-${column.align || "left"} ${
                    column.width || ""
                  }`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        theme.isDark ? theme.textSecondary : theme.textPrimary
                      } text-sm`}
                    >
                      {column.title}
                    </span>
                    {sortable && column.sortable !== false && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className={`p-1 rounded hover:${theme.bgSearchBar} transition-colors`}
                      >
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp
                              className={`w-4 h-4 ${theme.textMain}`}
                            />
                          ) : (
                            <ChevronDown
                              className={`w-4 h-4 ${theme.textMain}`}
                            />
                          )
                        ) : (
                          <ArrowUpDown
                            className={`w-4 h-4 ${theme.textSecondary}`}
                          />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}

              {actions.length > 0 && (
                <th className="p-4 text-center w-32">
                  <span
                    className={`font-medium ${
                      theme.isDark ? theme.textSecondary : theme.textPrimary
                    } text-sm`}
                  >
                    {
                      {
                        ku: "کردارەکان",
                        ar: "إجراءات",
                        en: "Actions",
                      }[language]
                    }
                  </span>
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={
                    visibleColumns.length +
                    (selectable ? 1 : 0) +
                    (isIdColumnVisible ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="p-8 text-center"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className={`animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--bg-main)]`}
                    ></div>
                    <span className={theme.textSecondary}>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    visibleColumns.length +
                    (selectable ? 1 : 0) +
                    (isIdColumnVisible ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="p-8 text-center"
                >
                  <div className={`${theme.textSecondary}`}>{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b ${theme.borderCategory} ${
                    theme.isDark ? "hover:bg-[#424242]" : "hover:bg-[#f6f6f6]"
                  } hover:shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all duration-200 group ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${rowClassName?.(row, index) || ""}`}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {selectable && (
                    <td className="p-4">
                      <CustomCheckbox
                        checked={selectedRows.includes(row)}
                        onChange={() => handleSelectRow(row)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}

                  {isIdColumnVisible && (
                    <td
                      className={`p-4 text-left ${theme.textSecondary} font-mono text-sm`}
                    >
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                  )}

                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`p-4 text-${column.align || "left"} ${
                        theme.textPrimary
                      } group-hover:${
                        theme.textPrimary
                      } transition-colors duration-200`}
                    >
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-105">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row, index);
                            }}
                            disabled={action.disabled?.(row)}
                            className={`${getActionButtonClass(
                              action.variant
                            )} disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all duration-150`}
                            title={action.label}
                          >
                            {action.icon || (
                              <MoreVertical className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div
          className={`p-4 border-t ${theme.borderCategory} ${theme.bgTopbar}`}
        >
          <div className="flex items-center justify-between">
            <div className={`text-sm ${theme.textSecondary}`}>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
              {sortedData.length} entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`${isRTL ? "rotate-180" : ""} p-2 rounded-lg ${
                  theme.bgSecondary
                } ${theme.textSecondary} hover:${
                  theme.bgSearchBar
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? `${theme.bgMain} ${theme.buttonTextPrimary}`
                        : `${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar}`
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`${isRTL ? "rotate-180" : ""} p-2 rounded-lg ${
                  theme.bgSecondary
                } ${theme.textSecondary} hover:${
                  theme.bgSearchBar
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
