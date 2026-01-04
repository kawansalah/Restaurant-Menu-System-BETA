// Admin route configuration
// Change ADMIN_ROUTE_PATH to customize your admin panel URL
// Examples: 'dashboard', 'management', 'backend', 'control', 'sys-admin', etc.

export const ADMIN_CONFIG = {
  // Change this to your desired admin path (without leading slash)
  ROUTE_PATH: import.meta.env.VITE_ADMIN_ROUTE_PATH || "sys-panel-2026",

  // Full paths (automatically generated)
  get BASE_PATH() {
    return `/${this.ROUTE_PATH}`;
  },
  get LOGIN_PATH() {
    return `/${this.ROUTE_PATH}/login`;
  },
  get DASHBOARD_PATH() {
    return `/${this.ROUTE_PATH}/dashboard`;
  },
  get USERS_PATH() {
    return `/${this.ROUTE_PATH}/users`;
  },
  get CATEGORIES_PATH() {
    return `/${this.ROUTE_PATH}/categories`;
  },
  get SUBCATEGORIES_PATH() {
    return `/${this.ROUTE_PATH}/subcategories`;
  },
  get MENU_ITEMS_PATH() {
    return `/${this.ROUTE_PATH}/menu-items`;
  },
  get FEEDBACK_PATH() {
    return `/${this.ROUTE_PATH}/feedback`;
  },
  get RESTAURANTS_PATH() {
    return `/${this.ROUTE_PATH}/restaurants`;
  },
  get SETTINGS_PATH() {
    return `/${this.ROUTE_PATH}/settings`;
  },
};

export default ADMIN_CONFIG;
