import { Rating } from "@/services/ratingService";

export interface RatingTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: Rating, language: string) => React.ReactNode;
}

export const getRatingTableColumns = (): RatingTableColumn[] => [
  {
    key: "menu_item",
    label: "Menu Item",
    sortable: true,
    width: "200px",
  },
  {
    key: "restaurant",
    label: "Restaurant",
    sortable: true,
    width: "150px",
  },
  {
    key: "rating",
    label: "Rating",
    sortable: true,
    width: "100px",
    align: "center",
  },
  {
    key: "ip_address",
    label: "IP Address",
    sortable: false,
    width: "120px",
    align: "center",
  },
  {
    key: "user_agent",
    label: "Device",
    sortable: false,
    width: "150px",
  },
  {
    key: "created_at",
    label: "Submitted",
    sortable: true,
    width: "120px",
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    width: "100px",
    align: "center",
  },
];

// Mobile card configuration for ratings
export interface RatingMobileCardConfig {
  showMenuItem: boolean;
  showRestaurant: boolean;
  showRatingValue: boolean;
  showIPAddress: boolean;
  showUserAgent: boolean;
  showSubmissionDate: boolean;
  showActions: boolean;
}

export const defaultRatingMobileCardConfig: RatingMobileCardConfig = {
  showMenuItem: true,
  showRestaurant: true,
  showRatingValue: true,
  showIPAddress: false, // Hidden by default for privacy
  showUserAgent: true,
  showSubmissionDate: true,
  showActions: true,
};

// Filter configuration for ratings
export interface RatingFilterConfig {
  showSearch: boolean;
  showRestaurantFilter: boolean;
  showRatingFilter: boolean;
  showDateRangeFilter: boolean;
  showIPFilter: boolean;
  showSortOptions: boolean;
  showItemsPerPage: boolean;
}

export const defaultRatingFilterConfig: RatingFilterConfig = {
  showSearch: true,
  showRestaurantFilter: true,
  showRatingFilter: true,
  showDateRangeFilter: true,
  showIPFilter: true,
  showSortOptions: true,
  showItemsPerPage: true,
};

// Bulk actions configuration for ratings
export interface RatingBulkActionConfig {
  action: string;
  label: string;
  variant: "default" | "destructive" | "secondary";
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}

export const getRatingBulkActionConfigs = (): RatingBulkActionConfig[] => [
  {
    action: "delete",
    label: "Delete Selected",
    variant: "destructive",
    requiresConfirmation: true,
    confirmationMessage:
      "Are you sure you want to delete the selected ratings? This action cannot be undone.",
  },
  {
    action: "export",
    label: "Export Selected",
    variant: "default",
    requiresConfirmation: false,
  },
  {
    action: "moderate",
    label: "Flag for Review",
    variant: "secondary",
    requiresConfirmation: false,
  },
];

// Rating analytics configuration
export interface RatingAnalyticsConfig {
  showOverallStats: boolean;
  showRatingDistribution: boolean;
  showTrendsChart: boolean;
  showTopRatedItems: boolean;
  showRecentRatings: boolean;
  showByRestaurant: boolean;
  showByTimeframe: boolean;
}

export const defaultRatingAnalyticsConfig: RatingAnalyticsConfig = {
  showOverallStats: true,
  showRatingDistribution: true,
  showTrendsChart: true,
  showTopRatedItems: true,
  showRecentRatings: true,
  showByRestaurant: true,
  showByTimeframe: true,
};

// Rating stats configuration
export interface RatingStatsConfig {
  totalRatings: {
    show: boolean;
    label: string;
    icon: string;
  };
  averageRating: {
    show: boolean;
    label: string;
    icon: string;
  };
  fiveStarRatings: {
    show: boolean;
    label: string;
    icon: string;
  };
  oneStarRatings: {
    show: boolean;
    label: string;
    icon: string;
  };
  todayRatings: {
    show: boolean;
    label: string;
    icon: string;
  };
  weeklyRatings: {
    show: boolean;
    label: string;
    icon: string;
  };
}

export const defaultRatingStatsConfig: RatingStatsConfig = {
  totalRatings: {
    show: true,
    label: "Total Ratings",
    icon: "star",
  },
  averageRating: {
    show: true,
    label: "Average Rating",
    icon: "trending-up",
  },
  fiveStarRatings: {
    show: true,
    label: "5-Star Ratings",
    icon: "star",
  },
  oneStarRatings: {
    show: true,
    label: "1-Star Ratings",
    icon: "alert-triangle",
  },
  todayRatings: {
    show: true,
    label: "Today's Ratings",
    icon: "calendar",
  },
  weeklyRatings: {
    show: true,
    label: "This Week",
    icon: "calendar-days",
  },
};

// Rating export configuration
export interface RatingExportConfig {
  formats: string[];
  includeColumns: {
    menuItem: boolean;
    restaurant: boolean;
    rating: boolean;
    ipAddress: boolean;
    userAgent: boolean;
    submissionDate: boolean;
  };
  dateRange: {
    enabled: boolean;
    defaultRange: "week" | "month" | "quarter" | "year" | "all";
  };
}

export const defaultRatingExportConfig: RatingExportConfig = {
  formats: ["csv", "excel", "json"],
  includeColumns: {
    menuItem: true,
    restaurant: true,
    rating: true,
    ipAddress: false, // Privacy consideration
    userAgent: true,
    submissionDate: true,
  },
  dateRange: {
    enabled: true,
    defaultRange: "month",
  },
};
