import { Restaurant } from "@/admin/types/admin";

export interface RestaurantTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: Restaurant, language: string) => React.ReactNode;
}

export const getRestaurantTableColumns = (): RestaurantTableColumn[] => [
  {
    key: "logo",
    label: "Logo",
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
    key: "description",
    label: "Description",
    sortable: false,
    width: "200px",
  },
  {
    key: "address",
    label: "Address",
    sortable: false,
    width: "150px",
  },
  {
    key: "contact",
    label: "Contact",
    sortable: false,
    width: "150px",
  },
  {
    key: "theme_color",
    label: "Theme",
    sortable: false,
    width: "80px",
    align: "center",
  },
  {
    key: "is_active",
    label: "Status",
    sortable: true,
    width: "100px",
    align: "center",
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
export interface RestaurantMobileCardConfig {
  showLogo: boolean;
  showDescription: boolean;
  showAddress: boolean;
  showContact: boolean;
  showThemeColor: boolean;
  showCreatedDate: boolean;
  maxDescriptionLength: number;
}

export const defaultMobileCardConfig: RestaurantMobileCardConfig = {
  showLogo: true,
  showDescription: true,
  showAddress: true,
  showContact: true,
  showThemeColor: true,
  showCreatedDate: true,
  maxDescriptionLength: 100,
};

// Filter configuration
export interface RestaurantFilterConfig {
  showSearch: boolean;
  showStatusFilter: boolean;
  showSortOptions: boolean;
  showItemsPerPage: boolean;
}

export const defaultFilterConfig: RestaurantFilterConfig = {
  showSearch: true,
  showStatusFilter: true,
  showSortOptions: true,
  showItemsPerPage: true,
};

// Bulk actions configuration
export interface RestaurantBulkActionConfig {
  action: string;
  label: string;
  variant: "default" | "destructive" | "secondary";
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}

export const getBulkActionConfigs = (): RestaurantBulkActionConfig[] => [
  {
    action: "delete",
    label: "Delete Selected",
    variant: "destructive",
    requiresConfirmation: true,
    confirmationMessage:
      "Are you sure you want to delete the selected restaurants? This action cannot be undone.",
  },
  {
    action: "activate",
    label: "Activate",
    variant: "default",
    requiresConfirmation: false,
  },
  {
    action: "deactivate",
    label: "Deactivate",
    variant: "secondary",
    requiresConfirmation: false,
  },
];

// Stats card configuration
export interface RestaurantStatsConfig {
  totalRestaurants: {
    show: boolean;
    label: string;
    icon: string;
  };
  activeRestaurants: {
    show: boolean;
    label: string;
    icon: string;
  };
  inactiveRestaurants: {
    show: boolean;
    label: string;
    icon: string;
  };
  totalUsers: {
    show: boolean;
    label: string;
    icon: string;
  };
  totalMenuItems: {
    show: boolean;
    label: string;
    icon: string;
  };
  totalCategories: {
    show: boolean;
    label: string;
    icon: string;
  };
}

export const defaultStatsConfig: RestaurantStatsConfig = {
  totalRestaurants: {
    show: true,
    label: "Total Restaurants",
    icon: "building2",
  },
  activeRestaurants: {
    show: true,
    label: "Active",
    icon: "check-circle",
  },
  inactiveRestaurants: {
    show: true,
    label: "Inactive",
    icon: "x-circle",
  },
  totalUsers: {
    show: true,
    label: "Total Users",
    icon: "users",
  },
  totalMenuItems: {
    show: true,
    label: "Total Menu Items",
    icon: "package",
  },
  totalCategories: {
    show: true,
    label: "Total Categories",
    icon: "folder",
  },
};

// Form field configuration
export interface RestaurantFormFieldConfig {
  name: {
    required: boolean;
  };
  description: {
    required: boolean;
    type: "textarea" | "input";
  };
  address: {
    required: boolean;
  };
  phone: {
    required: boolean;
  };
  email: {
    required: boolean;
  };
  website: {
    required: boolean;
  };
  themeColor: {
    required: boolean;
    defaultValue: string;
  };
  logo: {
    required: boolean;
    maxSize: number; // in bytes
    allowedTypes: string[];
  };
  isActive: {
    defaultValue: boolean;
  };
}

export const defaultFormFieldConfig: RestaurantFormFieldConfig = {
  name: {
    required: true,
  },
  description: {
    required: false,
    type: "textarea",
  },
  address: {
    required: false,
  },
  phone: {
    required: false,
  },
  email: {
    required: false,
  },
  website: {
    required: false,
  },
  themeColor: {
    required: true,
    defaultValue: "#4e98ff",
  },
  logo: {
    required: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },
  isActive: {
    defaultValue: true,
  },
};