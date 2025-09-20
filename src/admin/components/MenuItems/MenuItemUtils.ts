import { AdminMenuItem, MenuItemFilters } from "@/admin/types/admin";
import {
  MENU_ITEM_VALIDATION,
  getMenuItemDisplayName,
  getMenuItemDescription,
} from "./MenuItemConstants";

/**
 * Validate menu item form data
 */
export const validateMenuItemForm = (formData: {
  category_id: string;
  subcategory_id: string;
  name_ku: string;
  name_ar: string;
  name_en: string;
  description_ku?: string;
  description_ar?: string;
  description_en?: string;
  price: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Category validation
  if (!formData.category_id.trim()) {
    errors.category_id = "Category is required";
  }

  // Subcategory validation
  if (!formData.subcategory_id.trim()) {
    errors.subcategory_id = "Subcategory is required";
  }

  // English name validation
  if (!formData.name_en.trim()) {
    errors.name_en = "English name is required";
  } else if (formData.name_en.length < MENU_ITEM_VALIDATION.NAME_MIN_LENGTH) {
    errors.name_en = `Name must be at least ${MENU_ITEM_VALIDATION.NAME_MIN_LENGTH} characters`;
  } else if (formData.name_en.length > MENU_ITEM_VALIDATION.NAME_MAX_LENGTH) {
    errors.name_en = `Name must be less than ${MENU_ITEM_VALIDATION.NAME_MAX_LENGTH} characters`;
  }

  // Arabic name validation
  if (!formData.name_ar.trim()) {
    errors.name_ar = "Arabic name is required";
  } else if (formData.name_ar.length < MENU_ITEM_VALIDATION.NAME_MIN_LENGTH) {
    errors.name_ar = `Name must be at least ${MENU_ITEM_VALIDATION.NAME_MIN_LENGTH} characters`;
  } else if (formData.name_ar.length > MENU_ITEM_VALIDATION.NAME_MAX_LENGTH) {
    errors.name_ar = `Name must be less than ${MENU_ITEM_VALIDATION.NAME_MAX_LENGTH} characters`;
  }

  // Kurdish name validation
  if (!formData.name_ku.trim()) {
    errors.name_ku = "Kurdish name is required";
  } else if (formData.name_ku.length < MENU_ITEM_VALIDATION.NAME_MIN_LENGTH) {
    errors.name_ku = `Name must be at least ${MENU_ITEM_VALIDATION.NAME_MIN_LENGTH} characters`;
  } else if (formData.name_ku.length > MENU_ITEM_VALIDATION.NAME_MAX_LENGTH) {
    errors.name_ku = `Name must be less than ${MENU_ITEM_VALIDATION.NAME_MAX_LENGTH} characters`;
  }

  // Description validation (optional but if provided, must be within limits)
  if (
    formData.description_en &&
    formData.description_en.length > MENU_ITEM_VALIDATION.DESCRIPTION_MAX_LENGTH
  ) {
    errors.description_en = `Description must be less than ${MENU_ITEM_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
  }

  if (
    formData.description_ar &&
    formData.description_ar.length > MENU_ITEM_VALIDATION.DESCRIPTION_MAX_LENGTH
  ) {
    errors.description_ar = `Description must be less than ${MENU_ITEM_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
  }

  if (
    formData.description_ku &&
    formData.description_ku.length > MENU_ITEM_VALIDATION.DESCRIPTION_MAX_LENGTH
  ) {
    errors.description_ku = `Description must be less than ${MENU_ITEM_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
  }

  // Price validation
  const priceValue = formData.price;
  const priceStr = String(priceValue || "");
  if (!priceStr.trim()) {
    errors.price = "Price is required";
  } else {
    const priceNum = parseFloat(priceStr);
    if (isNaN(priceNum)) {
      errors.price = "Price must be a valid number";
    } else if (priceNum < MENU_ITEM_VALIDATION.PRICE_MIN) {
      errors.price = `Price must be at least ${MENU_ITEM_VALIDATION.PRICE_MIN}`;
    } else if (priceNum > MENU_ITEM_VALIDATION.PRICE_MAX) {
      errors.price = `Price must be less than ${MENU_ITEM_VALIDATION.PRICE_MAX}`;
    }
  }

  return errors;
};

/**
 * Validate image file for menu items
 */
export const validateMenuItemImage = (file: File): string | null => {
  // Check file size
  if (file.size > MENU_ITEM_VALIDATION.IMAGE_MAX_SIZE) {
    return `Image size must be less than ${
      MENU_ITEM_VALIDATION.IMAGE_MAX_SIZE / (1024 * 1024)
    }MB`;
  }

  // Check file type
  if (
    !(MENU_ITEM_VALIDATION.ALLOWED_IMAGE_TYPES as readonly string[]).includes(
      file.type
    )
  ) {
    return `Image must be one of: ${MENU_ITEM_VALIDATION.ALLOWED_IMAGE_TYPES.join(
      ", "
    )}`;
  }

  return null;
};

/**
 * Filter menu items based on search criteria
 */
export const filterMenuItems = (
  menuItems: AdminMenuItem[],
  filters: MenuItemFilters
): AdminMenuItem[] => {
  return menuItems.filter((item) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch =
        item.name_en.toLowerCase().includes(searchLower) ||
        item.name_ar.toLowerCase().includes(searchLower) ||
        item.name_ku.toLowerCase().includes(searchLower);

      const descriptionMatch =
        item.description_en?.toLowerCase().includes(searchLower) ||
        item.description_ar?.toLowerCase().includes(searchLower) ||
        item.description_ku?.toLowerCase().includes(searchLower);

      if (!nameMatch && !descriptionMatch) {
        return false;
      }
    }

    // Category filter
    if (filters.category_id && item.category_id !== filters.category_id) {
      return false;
    }

    // Subcategory filter
    if (
      filters.subcategory_id &&
      item.subcategory_id !== filters.subcategory_id
    ) {
      return false;
    }

    // Availability filter
    if (
      filters.is_available !== undefined &&
      item.is_available !== filters.is_available
    ) {
      return false;
    }

    // Price range filter
    const itemPrice = item.price;
    if (filters.min_price !== undefined && itemPrice < filters.min_price) {
      return false;
    }
    if (filters.max_price !== undefined && itemPrice > filters.max_price) {
      return false;
    }

    // Rating filter
    if (
      filters.min_rating !== undefined &&
      (item.rating || 0) < filters.min_rating
    ) {
      return false;
    }

    return true;
  });
};

/**
 * Sort menu items based on criteria
 */
export const sortMenuItems = (
  menuItems: AdminMenuItem[],
  sortBy: string,
  sortDirection: "asc" | "desc"
): AdminMenuItem[] => {
  return [...menuItems].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "name_en":
        aValue = a.name_en.toLowerCase();
        bValue = b.name_en.toLowerCase();
        break;
      case "name_ar":
        aValue = a.name_ar.toLowerCase();
        bValue = b.name_ar.toLowerCase();
        break;
      case "name_ku":
        aValue = a.name_ku.toLowerCase();
        bValue = b.name_ku.toLowerCase();
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "rating":
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case "views_count":
        aValue = a.views_count;
        bValue = b.views_count;
        break;
      case "is_available":
        aValue = a.is_available ? 1 : 0;
        bValue = b.is_available ? 1 : 0;
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
 * Generate menu item CSV data for export
 */
export const generateMenuItemCSV = (
  menuItems: AdminMenuItem[],
  language: string
): string => {
  const headers = [
    "ID",
    "Name",
    "Description",
    "Category",
    "Subcategory",
    "Price",
    "Rating",
    "Status",
    "Views",
    "Created At",
  ];

  const rows = menuItems.map((item) => [
    item.id,
    getMenuItemDisplayName(item, language),
    getMenuItemDescription(item, language) || "",
    item.category?.label_en || "",
    item.subcategory?.label_en || "",
    item.price,
    item.rating || "0",
    item.is_available ? "Available" : "Unavailable",
    (item.views_count || 0).toString(),
    new Date(item.created_at).toLocaleDateString(),
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
};

/**
 * Generate menu item JSON data for export
 */
export const generateMenuItemJSON = (menuItems: AdminMenuItem[]): string => {
  const exportData = menuItems.map((item) => ({
    id: item.id,
    name: {
      en: item.name_en,
      ar: item.name_ar,
      ku: item.name_ku,
    },
    description: {
      en: item.description_en || "",
      ar: item.description_ar || "",
      ku: item.description_ku || "",
    },
    category: item.category,
    subcategory: item.subcategory,
    price: item.price,
    rating: item.rating,
    is_available: item.is_available,
    views_count: item.views_count,
    image_url: item.image_url,
    created_at: item.created_at,
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
 * Get menu item availability status text
 */
export const getAvailabilityStatusText = (
  isAvailable: boolean,
  language: string
) => {
  const statusTexts = {
    available: {
      en: "Available",
      ar: "متوفر",
      ku: "بەردەست",
    },
    unavailable: {
      en: "Unavailable",
      ar: "غير متوفر",
      ku: "نابەردەست",
    },
  };

  const status = isAvailable ? "available" : "unavailable";
  return (
    statusTexts[status][
      language as keyof (typeof statusTexts)[typeof status]
    ] || statusTexts[status].en
  );
};
