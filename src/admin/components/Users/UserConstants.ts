import { AdminRole } from "@/admin/types/admin";

// Form validation constants
export const FORM_VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Role and status color mappings
export const ROLE_COLORS: Record<AdminRole, string> = {
  super_admin: "bg-[#4e98ff] text-white dark:bg-[#4e7dff] dark:text-white",
  admin: "bg-[#ffd042] text-white dark:bg-[#ffd042] dark:text-white",
  manager: "bg-[#18b577] text-white dark:bg-[#18b577] dark:text-white",
  staff: "bg-[#3f3f3f] text-white dark:bg-[#363636] dark:text-white",
};

export const STATUS_COLORS = {
  active: "bg-[#18b577] text-white dark:bg-[#18b577] dark:text-white",
  inactive: "bg-[#FF5E5E] text-white dark:bg-[#FF5E5E] dark:text-white",
} as const;

// Table configuration
export const TABLE_CONFIG = {
  PAGE_SIZE: 10,
  DATE_FORMAT_OPTIONS: {
    year: "numeric" as const,
    month: "short" as const,
    day: "numeric" as const,
    hour: "2-digit" as const,
    minute: "2-digit" as const,
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
  FAILED_TO_LOAD: "Failed to load users",
  FAILED_TO_TOGGLE_STATUS: "Failed to toggle user status",
  FAILED_TO_DELETE: "Failed to delete user",
  FAILED_TO_ACTIVATE: "Failed to activate users",
  FAILED_TO_DEACTIVATE: "Failed to deactivate users",
} as const;