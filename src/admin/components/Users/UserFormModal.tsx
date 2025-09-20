import React, { useState, useEffect, useRef } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { AdminUser, AdminRole, Restaurant } from "@/admin/types/admin";
import { Input } from "@/admin/components/Input";
import Button from "@/components/Button";
import { X } from "lucide-react";
import { FORM_VALIDATION } from "@/admin/components/Users/UserConstants";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";
import { fetchRestaurants } from "@/admin/services/restaurantService";

const getAllRoleOptions = () => [
  { value: "staff", label: "Staff" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" }
];

const getFilteredRoleOptions = (currentUserRole: AdminRole | undefined) => {
  const allRoles = getAllRoleOptions();
  
  // Super admin can see all roles including super_admin
  if (currentUserRole === 'super_admin') {
    return allRoles;
  }
  
  // Admin can see admin, manager, staff (no super_admin)
  if (currentUserRole === 'admin') {
    return allRoles.filter(role => role.value !== 'super_admin');
  }
  
  // Manager can only see manager and staff
  if (currentUserRole === 'manager') {
    return allRoles.filter(role => ['manager', 'staff'].includes(role.value));
  }
  
  // Staff can see nothing (empty array)
  if (currentUserRole === 'staff') {
    return [];
  }
  
  // Default fallback (should not happen)
  return [];
};

interface UserFormData {
  restaurant_id?: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
}

interface UserFormModalProps {
  isOpen: boolean;
  editingUser: AdminUser | null;
  onClose: () => void;
  onSubmit: (formData: UserFormData) => Promise<void>;
  isSubmitting: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  editingUser,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const { user } = useAdminAuth();
  const t = defaultAdminConfig.ui.users;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;
  
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    restaurant_id: editingUser?.restaurant_id || user?.restaurant_id || "",
    username: editingUser?.username || "",
    email: editingUser?.email || "",
    password: "",
    confirmPassword: "",
    full_name: editingUser?.full_name || "",
    role: editingUser?.role || "staff",
    is_active: editingUser?.is_active ?? true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch restaurants for super_admin users
  useEffect(() => {
    const loadRestaurants = async () => {
      if (user?.role === 'super_admin' && isOpen) {
        setLoadingRestaurants(true);
        try {
          const { data, error } = await fetchRestaurants();
          if (error) {
            console.error('Error fetching restaurants:', error);
          } else {
            setRestaurants(data);
          }
        } catch (error) {
          console.error('Error loading restaurants:', error);
        } finally {
          setLoadingRestaurants(false);
        }
      }
    };

    loadRestaurants();
  }, [user?.role, isOpen]);

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger animation
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      handleCancel();
    }
  };

  React.useEffect(() => {
    if (editingUser) {
      setFormData({
        restaurant_id: editingUser.restaurant_id,
        username: editingUser.username,
        email: editingUser.email,
        password: "",
        confirmPassword: "",
        full_name: editingUser.full_name,
        role: editingUser.role,
        is_active: editingUser.is_active,
      });
    } else {
      setFormData({
        restaurant_id: user?.restaurant_id || "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        role: "staff",
        is_active: true,
      });
    }
    setFormErrors({});
  }, [editingUser, isOpen]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Restaurant validation for super_admin
    if (user?.role === 'super_admin' && !formData.restaurant_id) {
      errors.restaurant_id = "Restaurant selection is required";
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < FORM_VALIDATION.USERNAME_MIN_LENGTH) {
      errors.username = `Username must be at least ${FORM_VALIDATION.USERNAME_MIN_LENGTH} characters`;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!FORM_VALIDATION.EMAIL_PATTERN.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    } else if (formData.email.includes('.dev')) {
      errors.email = "Please use a standard email domain (e.g., .com, .org, .net) as .dev domains may not be supported";
    }

    // Password validation (only for new users)
    if (!editingUser) {
      if (!formData.password.trim()) {
        errors.password = "Password is required";
      } else if (formData.password.length < FORM_VALIDATION.PASSWORD_MIN_LENGTH) {
        errors.password = `Password must be at least ${FORM_VALIDATION.PASSWORD_MIN_LENGTH} characters`;
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    // Full name validation
    if (!formData.full_name.trim()) {
      errors.full_name = "Full name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData({
      restaurant_id: user?.restaurant_id || "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      role: "staff",
      is_active: true,
    });
    setFormErrors({});
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 hide-scrollbar transition-all duration-300 ease-out ${
        isAnimating 
          ? 'bg-black/50 dark:bg-black/70 backdrop-blur-sm' 
          : 'bg-black/0 dark:bg-black/0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`${theme.bgCard} rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] h-[80vh] 2xl:h-fit xl:h-fit lg:h-fit md:h-fit overflow-y-auto ${theme.topbarShadowStyle} border ${theme.borderCategory} hide-scrollbar transition-all duration-300 ease-out transform ${
          isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl font-bold ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            } transition-colors duration-200`}
          >
            {editingUser ? getText("editUser") : getText("addUser")}
          </h3>
          <button
            onClick={handleCancel}
            className={`p-2 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar} transition-all duration-200 hover:scale-105 active:scale-95`}
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Restaurant Selection - Only for super_admin */}
          {user?.role === 'super_admin' && (
            <div className="transform transition-all duration-200">
              <label
                className={`mx-2 block text-sm font-medium ${theme.isDark ? theme.textSecondary : theme.textPrimary} mb-2 transition-colors duration-200`}
              >
                Restaurant *
              </label>
              <Input
                type="dropdown"
                value={formData.restaurant_id || ""}
                onSelect={(value) => setFormData({ ...formData, restaurant_id: value as string })}
                placeholder={loadingRestaurants ? "Loading restaurants..." : "Select a restaurant"}
                options={restaurants.map(restaurant => ({
                  value: restaurant.id,
                  label: restaurant.name
                }))}
                disabled={isSubmitting || loadingRestaurants}
                required
                className={`w-full transition-all duration-200 ${formErrors.restaurant_id ? 'border-red-500 animate-pulse' : ''}`}
              />
              {formErrors.restaurant_id && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">{formErrors.restaurant_id}</p>
              )}
            </div>
          )}

          {/* Username */}
          <div className="transform transition-all duration-200  ">
            <label
              className={`mx-2 block text-sm font-medium ${theme.isDark ? theme.textSecondary : theme.textPrimary} mb-2 transition-colors duration-200`}
            >
              {getText("username")} *
            </label>
            <Input
              type="text"
              value={formData.username}
              onChange={(value) =>
                setFormData({ ...formData, username: value as string })
              }
              placeholder={getText("enterUsername")}
              className={`w-full transition-all duration-200 ${formErrors.username ? 'border-red-500 animate-pulse' : ''}`}
              disabled={isSubmitting}
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">{formErrors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="transform transition-all duration-200  ">
            <label
              className={`mx-2 block text-sm font-medium ${theme.isDark ? theme.textSecondary : theme.textPrimary} mb-2 transition-colors duration-200`}
            >
              {getText("email")} *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(value) =>
                setFormData({ ...formData, email: value as string })
              }
              placeholder={getText("enterEmail")}
              className={`w-full transition-all duration-200 ${formErrors.email ? 'border-red-500 animate-pulse' : ''}`}
              disabled={isSubmitting}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">{formErrors.email}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="transform transition-all duration-200  ">
            <label
              className={`mx-2 block text-sm font-medium ${theme.isDark ? theme.textSecondary : theme.textPrimary} mb-2 transition-colors duration-200`}
            >
              {getText("fullName")} *
            </label>
            <Input
              type="text"
              value={formData.full_name}
              onChange={(value) =>
                setFormData({ ...formData, full_name: value as string })
              }
              placeholder={getText("enterFullName")}
              className={`w-full transition-all duration-200 ${formErrors.full_name ? 'border-red-500 animate-pulse' : ''}`}
              disabled={isSubmitting}
            />
            {formErrors.full_name && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">{formErrors.full_name}</p>
            )}
          </div>

          {/* Password fields for new users only */}
          {!editingUser && (
            <>
              <div className="transform transition-all duration-200  ">
                <label
                  className={`mx-2 block text-sm font-medium ${theme.isDark ? theme.textSecondary : theme.textPrimary} mb-2 transition-colors duration-200`}
                >
                  {getText("password")} *
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(value) =>
                    setFormData({ ...formData, password: value as string })
                  }
                  placeholder={getText("enterPassword")}
                  className={`w-full transition-all duration-200 ${formErrors.password ? 'border-red-500 animate-pulse' : ''}`}
                  disabled={isSubmitting}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1 animate-fade-in">{formErrors.password}</p>
                )}
              </div>

              <div className="transform transition-all duration-200  ">
                <label
                  className={`mx-2 block text-sm font-medium ${theme.isDark ? theme.textSecondary : theme.textPrimary} mb-2 transition-colors duration-200`}
                >
                  {getText("confirmPassword")} *
                </label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(value) =>
                    setFormData({ ...formData, confirmPassword: value as string })
                  }
                  placeholder={getText("confirmPassword")}
                  className={`w-full transition-all duration-200 ${formErrors.confirmPassword ? 'border-red-500 animate-pulse' : ''}`}
                  disabled={isSubmitting}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 animate-fade-in">{formErrors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          {/* Role */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${theme.isDark ? theme.textSecondary : theme.textPrimary} mb-2 transition-colors duration-200`}
            >
              Role *
            </label>
            <Input
              type="dropdown"
              value={formData.role}
              onSelect={(value) => setFormData({ ...formData, role: value as AdminRole })}
              placeholder="Select a role"
              options={getFilteredRoleOptions(user?.role)}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center transform transition-all duration-200">
            <Input
              type="checkbox"
              checked={formData.is_active}
              onChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
              label={getText("activeUser")}
              disabled={isSubmitting}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {getText("cancel")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={() => {}}
              disabled={isSubmitting}
            >
              {isSubmitting ? getText("saving") : (editingUser ? getText("update") : getText("create"))}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;