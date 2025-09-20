// Table configuration constants
export const FEEDBACK_TABLE_CONFIG = {
  pageSize: 10,
  mobilePageSize: 5,
  filterDebounceMs: 300,
} as const;

// Error messages
export const FEEDBACK_ERROR_MESSAGES = {
  LOAD_FAILED: "Failed to load feedback",
  DELETE_FAILED: "Failed to delete feedback",
  EXPORT_FAILED: "Failed to export feedback",
  NETWORK_ERROR: "Network error occurred",
  UNKNOWN_ERROR: "An unknown error occurred",
} as const;

// Rating options
export const RATING_OPTIONS = [
  { value: "", label: "allRatings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
] as const;
