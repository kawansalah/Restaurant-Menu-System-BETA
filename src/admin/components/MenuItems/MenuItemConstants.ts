import { AdminMenuItem } from "@/admin/types/admin";

// Menu Items table column configuration
export const MENU_ITEM_TABLE_COLUMNS = [
  { key: "name_en", label: "Name (EN)", sortable: true },
  { key: "name_ar", label: "Name (AR)", sortable: true },
  { key: "name_ku", label: "Name (KU)", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "subcategory", label: "Subcategory", sortable: true },
  { key: "price", label: "Price", sortable: true },
  { key: "is_available", label: "Available", sortable: true },
  { key: "rating", label: "Rating", sortable: true },
  { key: "views_count", label: "Views", sortable: true },
  { key: "created_at", label: "Created", sortable: true },
  { key: "updated_at", label: "Updated", sortable: true },
];

// Menu Items default sorting
export const DEFAULT_MENU_ITEM_SORT = {
  key: "created_at",
  direction: "desc" as const,
};

// Menu Items filters
export const MENU_ITEM_FILTERS = {
  ALL: "all",
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
} as const;

// Menu Items status options
export const MENU_ITEM_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "true", label: "Available" },
  { value: "false", label: "Unavailable" },
] as const;

// Menu Items sorting options
export const MENU_ITEM_SORT_OPTIONS = [
  { value: "name_en", label: "Name (EN)" },
  { value: "name_ar", label: "Name (AR)" },
  { value: "name_ku", label: "Name (KU)" },
  { value: "category", label: "Category" },
  { value: "subcategory", label: "Subcategory" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "views_count", label: "Views" },
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
] as const;

// Menu Items per page options
export const MENU_ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

// Default items per page
export const DEFAULT_ITEMS_PER_PAGE = 25;

// Menu Items search placeholder text
export const MENU_ITEM_SEARCH_PLACEHOLDER = {
  en: "Search menu items...",
  ar: "البحث في عناصر القائمة...",
  ku: "گەڕان لە خواردنەکان...",
} as const;

// Menu Items form validation
export const MENU_ITEM_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
  PRICE_MIN: 0.01,
  PRICE_MAX: 9999.99,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
} as const;

// Menu Items status colors
export const MENU_ITEM_STATUS_COLORS = {
  available: "bg-[#18b577] text-white dark:bg-[#18b577] dark:text-white",
  unavailable: "bg-[#FF5E5E] text-white dark:bg-[#FF5E5E] dark:text-white",
} as const;

// Menu Items rating colors
export const MENU_ITEM_RATING_COLORS = {
  bad: { bg: "bg-[#ffd042]", text: "text-white", border: "border-[#ffd042]" }, // 3.0+
  worse: { bg: "bg-[#FF5E5E]", text: "text-white", border: "border-[#FF5E5E]" } // <3.0
} as const;

// Menu Items bulk actions
export const MENU_ITEM_BULK_ACTIONS = [
  { value: "delete", label: "Delete Selected", variant: "destructive" },
  { value: "make_available", label: "Make Available", variant: "default" },
  {
    value: "make_unavailable",
    label: "Make Unavailable",
    variant: "secondary",
  },
] as const;

// Menu Items export formats
export const MENU_ITEM_EXPORT_FORMATS = [
  { value: "csv", label: "Export as CSV" },
  { value: "json", label: "Export as JSON" },
] as const;

// Helper function to get rating color
export const getRatingColor = (rating: number) => {
  if (rating >= 3.0) return MENU_ITEM_RATING_COLORS.bad;
  return MENU_ITEM_RATING_COLORS.worse;
};

// Helper function to get status color
export const getStatusColor = (isAvailable: boolean) => {
  return isAvailable
    ? MENU_ITEM_STATUS_COLORS.available
    : MENU_ITEM_STATUS_COLORS.unavailable;
};

// Helper function to format price
export const formatPrice = (price: string | number, currency = "IQD") => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numPrice);
};

// Helper function to get menu item display name
export const getMenuItemDisplayName = (
  menuItem: AdminMenuItem,
  language: string
) => {
  switch (language) {
    case "ar":
      return menuItem.name_ar;
    case "ku":
      return menuItem.name_ku;
    default:
      return menuItem.name_en;
  }
};

// Helper function to get menu item description
export const getMenuItemDescription = (
  menuItem: AdminMenuItem,
  language: string
) => {
  switch (language) {
    case "ar":
      return menuItem.description_ar;
    case "ku":
      return menuItem.description_ku;
    default:
      return menuItem.description_en;
  }
};
