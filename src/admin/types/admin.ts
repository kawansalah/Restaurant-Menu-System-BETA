export type AdminRole = "super_admin" | "admin" | "manager" | "staff";

export interface AdminUser {
  id: string;
  restaurant_id: string;
  username: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  restaurant?: Restaurant; // For joined restaurant data
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  theme_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  id: string;
  admin_user_id: string;
  session_token: string;
  expires_at: string;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminPermission {
  id: string;
  role: AdminRole;
  permission: string;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_user_id?: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminStats {
  total_menu_items: number;
  total_categories: number;
  total_subcategories: number;
  total_feedback: number;
  total_ratings: number;
  popular_items: Array<{
    id: string;
    name: any;
    views: number;
    cart_additions: number;
  }>;
}

export interface Category {
  id: string;
  restaurant_id: string;
  label_ku: string;
  label_ar: string;
  label_en: string;
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  restaurant_id: string;
  category_id: string;
  label_ku: string;
  label_ar: string;
  label_en: string;
  image_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  category?: Category; // For joined data
}

export interface CategoryFilters {
  search?: string;
  restaurant_id?: string;
}

export interface SubCategoryFilters {
  search?: string;
  category_id?: string;
  restaurant_id?: string;
}

export interface CategoryUpdateData {
  label_ku?: string;
  label_ar?: string;
  label_en?: string;
}

export interface CategoryCreateData {
  restaurant_id: string;
  label_ku: string;
  label_ar: string;
  label_en: string;
}

export interface SubCategoryUpdateData {
  restaurant_id?: string;
  category_id?: string;
  label_ku?: string;
  label_ar?: string;
  label_en?: string;
  image_url?: string;
  thumbnail_url?: string;
}

export interface SubCategoryCreateData {
  restaurant_id: string;
  category_id: string;
  label_ku: string;
  label_ar: string;
  label_en: string;
  image_url?: string;
  thumbnail_url?: string;
}

export interface Feedback {
  id: string;
  restaurant_id: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  message: string;
  rating?: number;
  created_at: string;
}

export interface FeedbackStats {
  total: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  totalWithRating: number;
}

export interface FeedbackFilters {
  search?: string;
  rating?: number;
}

export interface AdminMenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  subcategory_id?: string;
  name_ku: string;
  name_ar: string;
  name_en: string;
  description_ku?: string;
  description_ar?: string;
  description_en?: string;
  price: number; // Database stores as number
  image_url?: string;
  rating?: number;
  is_available: boolean;
  views_count?: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  subcategory?: SubCategory;
}

export interface MenuItemFilters {
  search?: string;
  restaurant_id?: string;
  category_id?: string;
  subcategory_id?: string;
  is_available?: boolean;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

// Restaurant Management Types
export interface RestaurantFilters {
  search?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

export interface RestaurantCreateData {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  theme_color: string;
  is_active?: boolean;
}

export interface RestaurantUpdateData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  theme_color?: string;
  is_active?: boolean;
}

export interface RestaurantStats {
  total: number;
  active: number;
  inactive: number;
  totalUsers: number;
  totalMenuItems: number;
  totalCategories: number;
}

export interface MenuItemCreateData {
  restaurant_id: string;
  category_id: string;
  subcategory_id?: string;
  name_ku: string;
  name_ar: string;
  name_en: string;
  description_ku?: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
}

export interface MenuItemUpdateData {
  restaurant_id?: string;
  category_id?: string;
  subcategory_id?: string;
  name_ku?: string;
  name_ar?: string;
  name_en?: string;
  description_ku?: string;
  description_ar?: string;
  description_en?: string;
  price?: number;
  image_url?: string;
  is_available?: boolean;
}

export interface MenuItemStats {
  total: number;
  available: number;
  unavailable: number;
  totalViews: number;
  averageRating: number;
}

export interface MenuItemFilters {
  search?: string;
  restaurant_id?: string;
  category_id?: string;
  subcategory_id?: string;
  is_available?: boolean;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}
