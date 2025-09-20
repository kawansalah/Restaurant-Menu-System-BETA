import { AdminMenuItem } from "@/admin/types/admin";

export interface MenuItemTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: AdminMenuItem, language: string) => React.ReactNode;
}

export const getMenuItemTableColumns = (): MenuItemTableColumn[] => [
  {
    key: "image",
    label: "Image",
    sortable: false,
    width: "80px",
    align: "center",
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
    width: "200px",
  },
  {
    key: "category",
    label: "Category",
    sortable: false,
    width: "150px",
  },
  {
    key: "subcategory",
    label: "Subcategory",
    sortable: false,
    width: "150px",
  },
  {
    key: "price",
    label: "Price",
    sortable: true,
    width: "100px",
    align: "right",
  },
  {
    key: "rating",
    label: "Rating",
    sortable: true,
    width: "80px",
    align: "center",
  },
  {
    key: "is_available",
    label: "Status",
    sortable: true,
    width: "100px",
    align: "center",
  },
  {
    key: "views_count",
    label: "Views",
    sortable: true,
    width: "80px",
    align: "right",
  },

  {
    key: "created_at",
    label: "Created",
    sortable: true,
    width: "120px",
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    width: "120px",
    align: "center",
  },
];

// Mobile card configuration
export interface MenuItemMobileCardConfig {
  showImage: boolean;
  showCategory: boolean;
  showSubcategory: boolean;
  showDescription: boolean;
  showRating: boolean;
  showViews: boolean;
  showCartAdditions: boolean;
  showCreatedDate: boolean;
  maxDescriptionLength: number;
}

export const defaultMobileCardConfig: MenuItemMobileCardConfig = {
  showImage: true,
  showCategory: true,
  showSubcategory: true,
  showDescription: true,
  showRating: true,
  showViews: true,
  showCartAdditions: true,
  showCreatedDate: true,
  maxDescriptionLength: 100,
};

// Filter configuration
export interface MenuItemFilterConfig {
  showSearch: boolean;
  showCategoryFilter: boolean;
  showSubcategoryFilter: boolean;
  showStatusFilter: boolean;
  showPriceRangeFilter: boolean;
  showRatingFilter: boolean;
  showSortOptions: boolean;
  showItemsPerPage: boolean;
}

export const defaultFilterConfig: MenuItemFilterConfig = {
  showSearch: true,
  showCategoryFilter: true,
  showSubcategoryFilter: true,
  showStatusFilter: true,
  showPriceRangeFilter: true,
  showRatingFilter: true,
  showSortOptions: true,
  showItemsPerPage: true,
};

// Bulk actions configuration
export interface MenuItemBulkActionConfig {
  action: string;
  label: string;
  variant: "default" | "destructive" | "secondary";
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}

export const getBulkActionConfigs = (): MenuItemBulkActionConfig[] => [
  {
    action: "delete",
    label: "Delete Selected",
    variant: "destructive",
    requiresConfirmation: true,
    confirmationMessage:
      "Are you sure you want to delete the selected menu items? This action cannot be undone.",
  },
  {
    action: "make_available",
    label: "Make Available",
    variant: "default",
    requiresConfirmation: false,
  },
  {
    action: "make_unavailable",
    label: "Make Unavailable",
    variant: "secondary",
    requiresConfirmation: false,
  },
];

// Stats card configuration
export interface MenuItemStatsConfig {
  totalItems: {
    show: boolean;
    label: string;
    icon: string;
  };
  availableItems: {
    show: boolean;
    label: string;
    icon: string;
  };
  unavailableItems: {
    show: boolean;
    label: string;
    icon: string;
  };
  averageRating: {
    show: boolean;
    label: string;
    icon: string;
  };
  totalViews: {
    show: boolean;
    label: string;
    icon: string;
  };
  averagePrice: {
    show: boolean;
    label: string;
    icon: string;
  };
}

export const defaultStatsConfig: MenuItemStatsConfig = {
  totalItems: {
    show: true,
    label: "Total Items",
    icon: "package",
  },
  availableItems: {
    show: true,
    label: "Available",
    icon: "check-circle",
  },
  unavailableItems: {
    show: true,
    label: "Unavailable",
    icon: "x-circle",
  },
  averageRating: {
    show: true,
    label: "Avg Rating",
    icon: "star",
  },
  totalViews: {
    show: true,
    label: "Total Views",
    icon: "eye",
  },
  averagePrice: {
    show: true,
    label: "Avg Price",
    icon: "dollar-sign",
  },
};

// Form field configuration
export interface MenuItemFormFieldConfig {
  name: {
    required: boolean;
    showAllLanguages: boolean;
  };
  description: {
    required: boolean;
    showAllLanguages: boolean;
    type: "textarea" | "input";
  };
  category: {
    required: boolean;
    allowCreate: boolean;
  };
  subcategory: {
    required: boolean;
    allowCreate: boolean;
    dependsOnCategory: boolean;
  };
  price: {
    required: boolean;
    currency: string;
    min: number;
    max: number;
  };
  image: {
    required: boolean;
    maxSize: number; // in bytes
    allowedTypes: string[];
  };
  availability: {
    defaultValue: boolean;
  };
}

export const defaultFormFieldConfig: MenuItemFormFieldConfig = {
  name: {
    required: true,
    showAllLanguages: true,
  },
  description: {
    required: false,
    showAllLanguages: true,
    type: "textarea",
  },
  category: {
    required: true,
    allowCreate: false,
  },
  subcategory: {
    required: true,
    allowCreate: false,
    dependsOnCategory: true,
  },
  price: {
    required: true,
    currency: "IQD",
    min: 0.01,
    max: 9999.99,
  },
  image: {
    required: false,
    maxSize: 10 * 1024 * 1024, // 10MB to accommodate PNG files
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
  },
  availability: {
    defaultValue: true,
  },
};
