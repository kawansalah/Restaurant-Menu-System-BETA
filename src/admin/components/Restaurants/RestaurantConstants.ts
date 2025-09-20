import { Restaurant } from "@/admin/types/admin";

// Restaurant table column configuration
export const RESTAURANT_COLUMNS = [
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description", sortable: false },
  { key: "address", label: "Address", sortable: false },
  { key: "phone", label: "Phone", sortable: false },
  { key: "email", label: "Email", sortable: true },
  { key: "is_active", label: "Status", sortable: true },
  { key: "created_at", label: "Created", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
] as const;

// Restaurant default sorting
export const DEFAULT_RESTAURANT_SORT = {
  key: "created_at",
  direction: "desc" as const,
};

// Restaurant filters
export const RESTAURANT_FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

// Restaurant status options
export const RESTAURANT_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
] as const;

// Restaurant sorting options
export const RESTAURANT_SORT_OPTIONS = [
  { value: "created_at", label: "Created Date" },
  { value: "name", label: "Name (A-Z)" },
  { value: "email", label: "Email" },
  { value: "is_active", label: "Status" },
] as const;

// Restaurant per page options
export const RESTAURANTS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

// Default items per page
export const DEFAULT_ITEMS_PER_PAGE = 25;

// Restaurant search placeholder text
export const RESTAURANT_SEARCH_PLACEHOLDER = {
  en: "Search restaurants...",
  ar: "البحث في المطاعم...",
  ku: "گەڕان لە چێشتخانەکان...",
} as const;

// Restaurant form validation
export const RESTAURANT_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
  ADDRESS_MAX_LENGTH: 500,
  PHONE_MAX_LENGTH: 20,
  EMAIL_MAX_LENGTH: 255,
  WEBSITE_MAX_LENGTH: 255,
  LOGO_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/svg+xml",
  ],
} as const;

// Restaurant status colors
export const RESTAURANT_STATUS_COLORS = {
  active: "bg-[#18b577] text-white dark:bg-[#18b577] dark:text-white",
  inactive: "bg-[#FF5E5E] text-white dark:bg-[#FF5E5E] dark:text-white",
} as const;

// Restaurant bulk actions
export const RESTAURANT_BULK_ACTIONS = [
  { value: "delete", label: "Delete Selected", variant: "destructive" },
  { value: "activate", label: "Activate", variant: "default" },
  { value: "deactivate", label: "Deactivate", variant: "secondary" },
] as const;

// Restaurant export formats
export const RESTAURANT_EXPORT_FORMATS = [
  { value: "csv", label: "Export as CSV" },
  { value: "json", label: "Export as JSON" },
] as const;

// Helper function to get status color
export const getStatusColor = (isActive: boolean) => {
  return isActive
    ? RESTAURANT_STATUS_COLORS.active
    : RESTAURANT_STATUS_COLORS.inactive;
};

// Helper function to format phone number
export const formatPhoneNumber = (phone: string | undefined) => {
  if (!phone) return "N/A";
  // Basic phone formatting - can be enhanced based on requirements
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};

// Helper function to format website URL
export const formatWebsiteUrl = (website: string | undefined) => {
  if (!website) return null;
  if (!website.startsWith("http://") && !website.startsWith("https://")) {
    return `https://${website}`;
  }
  return website;
};

// Helper function to get restaurant display name
export const getRestaurantDisplayName = (restaurant: Restaurant) => {
  return restaurant.name || "Unnamed Restaurant";
};

// Helper function to get restaurant description
export const getRestaurantDescription = (restaurant: Restaurant) => {
  return restaurant.description || "No description available";
};

// Helper function to validate email
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone number
export const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
};

// Helper function to validate website URL
export const isValidWebsiteUrl = (website: string) => {
  try {
    const url = website.startsWith("http") ? website : `https://${website}`;
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to validate hex color
export const isValidHexColor = (color: string) => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
};
