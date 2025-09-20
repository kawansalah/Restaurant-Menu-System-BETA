import { Restaurant, RestaurantFilters } from "@/admin/types/admin";
import {
  RESTAURANT_VALIDATION,
  getRestaurantDisplayName,
  getRestaurantDescription,
  isValidEmail,
  isValidPhoneNumber,
  isValidWebsiteUrl,
  isValidHexColor,
} from "./RestaurantConstants";

/**
 * Validate restaurant form data
 */
export const validateRestaurantForm = (formData: {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  theme_color: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Restaurant name is required";
  } else if (formData.name.length < RESTAURANT_VALIDATION.NAME_MIN_LENGTH) {
    errors.name = `Name must be at least ${RESTAURANT_VALIDATION.NAME_MIN_LENGTH} characters`;
  } else if (formData.name.length > RESTAURANT_VALIDATION.NAME_MAX_LENGTH) {
    errors.name = `Name must be less than ${RESTAURANT_VALIDATION.NAME_MAX_LENGTH} characters`;
  }

  // Description validation (optional but if provided, must be within limits)
  if (
    formData.description &&
    formData.description.length > RESTAURANT_VALIDATION.DESCRIPTION_MAX_LENGTH
  ) {
    errors.description = `Description must be less than ${RESTAURANT_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
  }

  // Address validation (optional but if provided, must be within limits)
  if (
    formData.address &&
    formData.address.length > RESTAURANT_VALIDATION.ADDRESS_MAX_LENGTH
  ) {
    errors.address = `Address must be less than ${RESTAURANT_VALIDATION.ADDRESS_MAX_LENGTH} characters`;
  }

  // Phone validation (optional but if provided, must be valid)
  if (formData.phone && !isValidPhoneNumber(formData.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  // Email validation (optional but if provided, must be valid)
  if (formData.email && !isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Website validation (optional but if provided, must be valid)
  if (formData.website && !isValidWebsiteUrl(formData.website)) {
    errors.website = "Please enter a valid website URL";
  }

  // Theme color validation
  if (!formData.theme_color.trim()) {
    errors.theme_color = "Theme color is required";
  } else if (!isValidHexColor(formData.theme_color)) {
    errors.theme_color = "Please enter a valid hex color (e.g., #FF6B35)";
  }

  return errors;
};

/**
 * Validate image file for restaurants
 */
export const validateRestaurantImage = (file: File): string | null => {
  // Check file size
  if (file.size > RESTAURANT_VALIDATION.LOGO_MAX_SIZE) {
    return `Image size must be less than ${
      RESTAURANT_VALIDATION.LOGO_MAX_SIZE / (1024 * 1024)
    }MB`;
  }

  // Check file type
  if (
    !(RESTAURANT_VALIDATION.ALLOWED_IMAGE_TYPES as readonly string[]).includes(
      file.type
    )
  ) {
    return `Image must be one of: ${RESTAURANT_VALIDATION.ALLOWED_IMAGE_TYPES.join(
      ", "
    )}`;
  }

  return null;
};

/**
 * Filter restaurants based on search criteria
 */
export const filterRestaurants = (
  restaurants: Restaurant[],
  filters: RestaurantFilters
): Restaurant[] => {
  return restaurants.filter((restaurant) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = restaurant.name.toLowerCase().includes(searchLower);
      const descriptionMatch = restaurant.description?.toLowerCase().includes(searchLower);
      const addressMatch = restaurant.address?.toLowerCase().includes(searchLower);
      const emailMatch = restaurant.email?.toLowerCase().includes(searchLower);

      if (!nameMatch && !descriptionMatch && !addressMatch && !emailMatch) {
        return false;
      }
    }

    // Status filter
    if (
      filters.is_active !== undefined &&
      restaurant.is_active !== filters.is_active
    ) {
      return false;
    }

    return true;
  });
};

/**
 * Sort restaurants based on criteria
 */
export const sortRestaurants = (
  restaurants: Restaurant[],
  sortBy: string,
  sortDirection: "asc" | "desc"
): Restaurant[] => {
  return [...restaurants].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "email":
        aValue = (a.email || "").toLowerCase();
        bValue = (b.email || "").toLowerCase();
        break;
      case "is_active":
        aValue = a.is_active ? 1 : 0;
        bValue = b.is_active ? 1 : 0;
        break;
      case "created_at":
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      default:
        aValue = a.created_at;
        bValue = b.created_at;
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Generate restaurant CSV data for export
 */
export const generateRestaurantCSV = (restaurants: Restaurant[]): string => {
  const headers = [
    "ID",
    "Name",
    "Description",
    "Address",
    "Phone",
    "Email",
    "Website",
    "Theme Color",
    "Status",
    "Created At",
  ];

  const rows = restaurants.map((restaurant) => [
    restaurant.id,
    getRestaurantDisplayName(restaurant),
    getRestaurantDescription(restaurant),
    restaurant.address || "",
    restaurant.phone || "",
    restaurant.email || "",
    restaurant.website || "",
    restaurant.theme_color,
    restaurant.is_active ? "Active" : "Inactive",
    new Date(restaurant.created_at).toLocaleDateString(),
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
};

/**
 * Generate restaurant JSON data for export
 */
export const generateRestaurantJSON = (restaurants: Restaurant[]): string => {
  const exportData = restaurants.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    phone: restaurant.phone,
    email: restaurant.email,
    website: restaurant.website,
    theme_color: restaurant.theme_color,
    is_active: restaurant.is_active,
    created_at: restaurant.created_at,
    updated_at: restaurant.updated_at,
  }));

  return JSON.stringify(exportData, null, 2);
};

/**
 * Download data as file
 */
export const downloadFile = (data: string, filename: string, type: string) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Get restaurant status text
 */
export const getStatusText = (isActive: boolean, language: string) => {
  const statusTexts = {
    active: {
      en: "Active",
      ar: "نشط",
      ku: "چالاک",
    },
    inactive: {
      en: "Inactive",
      ar: "غير نشط",
      ku: "ناچالاک",
    },
  };

  const status = isActive ? "active" : "inactive";
  return (
    statusTexts[status][language as keyof (typeof statusTexts)[typeof status]] ||
    statusTexts[status].en
  );
};