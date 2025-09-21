import React, { useState, useEffect, useRef } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlerts } from "@/hooks/useAlerts";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import {
  AdminMenuItem,
  Category,
  SubCategory,
  MenuItemCreateData,
} from "@/admin/types/admin";
import { Input } from "@/admin/components/Input";
import Button from "@/components/Button";
import { X, Upload, Loader, Trash2 } from "lucide-react";
import { fetchCategories } from "@/admin/services/categoryService";
import { fetchSubCategories } from "@/admin/services/subcategoryService";
import {
  uploadImageToSupabase,
  deleteImageFromSupabase,
  replaceImageInSupabase,
} from "@/admin/utils/imageUpload";
import { validateMenuItemForm, validateMenuItemImage } from "./MenuItemUtils";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";

interface MenuItemFormData {
  restaurant_id: string;
  category_id: string;
  subcategory_id: string;
  name_ku: string;
  name_ar: string;
  name_en: string;
  description_ku?: string;
  description_ar?: string;
  description_en?: string;
  price: string;
  image_url?: string;
  is_available: boolean;
}

interface MenuItemFormModalProps {
  isOpen: boolean;
  editingMenuItem: AdminMenuItem | null;
  onClose: () => void;
  onSubmit: (formData: MenuItemCreateData) => Promise<void>;
  isSubmitting: boolean;
}

const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({
  isOpen,
  editingMenuItem,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const alerts = useAlerts();
  const { user } = useAdminAuth();
  const t = defaultAdminConfig.ui.menuItems;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Categories and subcategories for dropdowns
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<MenuItemFormData>({
    restaurant_id: editingMenuItem?.restaurant_id || user?.restaurant_id || "",
    category_id: editingMenuItem?.category_id || "",
    subcategory_id: editingMenuItem?.subcategory_id || "",
    name_ku: editingMenuItem?.name_ku || "",
    name_ar: editingMenuItem?.name_ar || "",
    name_en: editingMenuItem?.name_en || "",
    description_ku: editingMenuItem?.description_ku || "",
    description_ar: editingMenuItem?.description_ar || "",
    description_en: editingMenuItem?.description_en || "",
    price: editingMenuItem?.price ? String(editingMenuItem.price) : "",
    image_url: editingMenuItem?.image_url || "",
    is_available: editingMenuItem?.is_available ?? true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load categories and subcategories
  useEffect(() => {
    if (isOpen) {
      if (categories.length === 0) {
        loadCategories();
      }
      if (subcategories.length === 0) {
        loadSubcategories();
      }
    }
  }, [isOpen]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (formData.category_id) {
      const filtered = subcategories.filter(
        (sub) => sub.category_id === formData.category_id
      );
      setFilteredSubcategories(filtered);

      // Reset subcategory if it doesn't belong to the selected category
      if (
        formData.subcategory_id &&
        !filtered.find((sub) => sub.id === formData.subcategory_id)
      ) {
        setFormData((prev) => ({ ...prev, subcategory_id: "" }));
      }
    } else {
      setFilteredSubcategories([]);
      setFormData((prev) => ({ ...prev, subcategory_id: "" }));
    }
  }, [formData.category_id, subcategories]);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const { data, error } = await fetchCategories();
      if (!error) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadSubcategories = async () => {
    setLoadingSubcategories(true);
    try {
      const { data, error } = await fetchSubCategories();
      if (!error) {
        setSubcategories(data);
      }
    } catch (error) {
      console.error("Failed to load subcategories:", error);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = async (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isSubmitting && !uploading) {
        await handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isSubmitting, uploading, formData]); // Added formData dependency

  // Handle click outside modal
  const handleBackdropClick = async (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget && !isSubmitting && !uploading) {
      await handleCancel();
    }
  };

  // Reset form when modal opens/closes or editing menu item changes
  React.useEffect(() => {
    if (editingMenuItem) {
      setFormData({
        restaurant_id: editingMenuItem.restaurant_id,
        category_id: editingMenuItem.category_id,
        subcategory_id: editingMenuItem.subcategory_id || "",
        name_ku: editingMenuItem.name_ku,
        name_ar: editingMenuItem.name_ar,
        name_en: editingMenuItem.name_en,
        description_ku: editingMenuItem.description_ku || "",
        description_ar: editingMenuItem.description_ar || "",
        description_en: editingMenuItem.description_en || "",
        price: String(editingMenuItem.price || ""),
        image_url: editingMenuItem.image_url || "",
        is_available: editingMenuItem.is_available,
      });
      setImagePreview(editingMenuItem.image_url || "");
    } else {
      setFormData({
        restaurant_id: user?.restaurant_id || "",
        category_id: "",
        subcategory_id: "",
        name_ku: "",
        name_ar: "",
        name_en: "",
        description_ku: "",
        description_ar: "",
        description_en: "",
        price: "",
        image_url: "",
        is_available: true,
      });
      setImagePreview("");
    }
    setFormErrors({});
  }, [editingMenuItem, isOpen]);

  const validateForm = (): boolean => {
    const errors = validateMenuItemForm(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate image
    const validationError = validateMenuItemImage(file);
    if (validationError) {
      await alerts.showError(validationError, "Invalid Image");
      return;
    }

    setUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      let uploadResult;

      // If editing, use replace function to delete old image first
      if (editingMenuItem && editingMenuItem.image_url) {
        uploadResult = await replaceImageInSupabase(
          file,
          editingMenuItem.image_url,
          undefined, // No thumbnail for menu items
          "menu-images"
        );
      } else {
        // For new menu item, use regular upload
        uploadResult = await uploadImageToSupabase(file, "menu-images");
      }

      const { originalUrl, error } = uploadResult;

      if (error) {
        await alerts.showError(`Upload failed: ${error}`, "Upload Error");
        setImagePreview("");
      } else if (originalUrl) {
        setFormData((prev) => ({
          ...prev,
          image_url: originalUrl,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      await alerts.showError("Failed to upload image", "Upload Error");
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  // Handle image deletion
  const handleImageDelete = async () => {
    if (!formData.image_url) return;

    // Get localized texts
    const alertTexts = defaultMenuConfig.ui?.alerts;
    const removeImageMessage =
      alertTexts?.messages?.removeImage?.[language] ||
      alertTexts?.messages?.removeImage?.en ||
      "Are you sure you want to remove this image? This action cannot be undone.";
    const removeImageTitle =
      alertTexts?.titles?.removeImage?.[language] ||
      alertTexts?.titles?.removeImage?.en ||
      "Remove Image";
    const removeButton =
      alertTexts?.buttons?.remove?.[language] ||
      alertTexts?.buttons?.remove?.en ||
      "Remove";
    const cancelButton =
      alertTexts?.buttons?.cancel?.[language] ||
      alertTexts?.buttons?.cancel?.en ||
      "Cancel";
    const successMessage =
      alertTexts?.messages?.imageRemoved?.[language] ||
      alertTexts?.messages?.imageRemoved?.en ||
      "Image removed successfully";
    const errorMessage =
      alertTexts?.messages?.imageRemoveFailed?.[language] ||
      alertTexts?.messages?.imageRemoveFailed?.en ||
      "Failed to delete image";

    // Show confirmation dialog before deleting
    const confirmed = await alerts.confirm(
      removeImageMessage,
      removeImageTitle,
      removeButton,
      cancelButton
    );

    if (!confirmed) return;

    try {
      if (formData.image_url) {
        await deleteImageFromSupabase(formData.image_url);
      }

      setFormData((prev) => ({
        ...prev,
        image_url: "",
      }));
      setImagePreview("");

      // Show success message
      await alerts.showSuccess(successMessage);
    } catch (error) {
      console.error("Delete error:", error);
      await alerts.showError(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Convert form data to the expected format
      const submitData = {
        ...formData,
        price: parseFloat(formData.price), // Convert string to number
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // Helper function to check if form has any filled data
  const hasFormData = (): boolean => {
    const defaultValues = {
      category_id: "",
      subcategory_id: "",
      name_ku: "",
      name_ar: "",
      name_en: "",
      description_ku: "",
      description_ar: "",
      description_en: "",
      price: "",
      image_url: "",
    };

    // Check if any field has been modified from default values
    return (
      formData.category_id !== defaultValues.category_id ||
      formData.subcategory_id !== defaultValues.subcategory_id ||
      formData.name_ku.trim() !== defaultValues.name_ku ||
      formData.name_ar.trim() !== defaultValues.name_ar ||
      formData.name_en.trim() !== defaultValues.name_en ||
      formData.description_ku?.trim() !== defaultValues.description_ku ||
      formData.description_ar?.trim() !== defaultValues.description_ar ||
      formData.description_en?.trim() !== defaultValues.description_en ||
      formData.price.trim() !== defaultValues.price ||
      formData.image_url !== defaultValues.image_url
    );
  };

  const handleCancel = async () => {
    // Check if form has any data filled
    if (hasFormData()) {
      const confirmed = await alerts.confirm(
        getText("unsavedChangesMessage"),
        getText("unsavedChangesTitle"),
        getText("closeAnyway"),
        getText("continueEditing")
      );

      if (!confirmed) {
        return; // User chose to continue editing
      }
    }

    // Reset form and close modal
    setFormData({
      restaurant_id: user?.restaurant_id || "",
      category_id: "",
      subcategory_id: "",
      name_ku: "",
      name_ar: "",
      name_en: "",
      description_ku: "",
      description_ar: "",
      description_en: "",
      price: "",
      image_url: "",
      is_available: true,
    });
    setFormErrors({});
    setImagePreview("");
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 hide-scrollbar transition-all duration-300 ease-out ${
        isAnimating
          ? "bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          : "bg-black/0 dark:bg-black/0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`${
          theme.bgCard
        } rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          theme.topbarShadowStyle
        } border ${
          theme.borderCategory
        } hide-scrollbar transition-all duration-300 ease-out transform ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl font-bold ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            } transition-colors duration-200`}
          >
            {editingMenuItem ? getText("editMenuItem") : getText("addMenuItem")}
          </h3>
          <button
            onClick={handleCancel}
            className={`p-2 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar} transition-all duration-200 hover:scale-105 active:scale-95`}
            disabled={isSubmitting || uploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selection */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("category")} *
            </label>
            {loadingCategories ? (
              <div
                className={`p-3 ${theme.bgSearchBar} rounded-xl flex items-center gap-2`}
              >
                <Loader className="w-4 h-4 animate-spin" />
                <span className={theme.textSecondary}>
                  Loading categories...
                </span>
              </div>
            ) : (
              <Input
                type="dropdown"
                value={formData.category_id}
                onChange={(value) =>
                  setFormData({ ...formData, category_id: value as string })
                }
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: `${cat.label_en} - ${cat.label_ku} - ${cat.label_ar}`,
                }))}
                placeholder={getText("selectCategory")}
                className={`w-full transition-all duration-200 ${
                  formErrors.category_id ? "border-red-500 animate-pulse" : ""
                }`}
                disabled={isSubmitting || uploading}
              />
            )}
            {formErrors.category_id && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.category_id}
              </p>
            )}
          </div>

          {/* Subcategory Selection */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("subcategory")} *
            </label>
            {loadingSubcategories ? (
              <div
                className={`p-3 ${theme.bgSearchBar} rounded-xl flex items-center gap-2`}
              >
                <Loader className="w-4 h-4 animate-spin" />
                <span className={theme.textSecondary}>
                  Loading subcategories...
                </span>
              </div>
            ) : (
              <Input
                type="dropdown"
                value={formData.subcategory_id}
                onChange={(value) =>
                  setFormData({ ...formData, subcategory_id: value as string })
                }
                options={filteredSubcategories.map((sub) => ({
                  value: sub.id,
                  label: `${sub.label_en} - ${sub.label_ku} - ${sub.label_ar}`,
                }))}
                placeholder={
                  formData.category_id
                    ? getText("selectSubcategory")
                    : getText("selectCategoryFirst")
                }
                className={`w-full transition-all duration-200 ${
                  formErrors.subcategory_id
                    ? "border-red-500 animate-pulse"
                    : ""
                }`}
                disabled={isSubmitting || uploading || !formData.category_id}
              />
            )}
            {formErrors.subcategory_id && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.subcategory_id}
              </p>
            )}
          </div>

          {/* English Name */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("nameEnglish")} *
            </label>
            <Input
              type="text"
              value={formData.name_en}
              onChange={(value) =>
                setFormData({ ...formData, name_en: value as string })
              }
              placeholder={getText("enterNameEnglish")}
              className={`w-full transition-all duration-200 ${
                formErrors.name_en ? "border-red-500 animate-pulse" : ""
              }`}
              disabled={isSubmitting || uploading}
            />
            {formErrors.name_en && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.name_en}
              </p>
            )}
          </div>

          {/* Arabic Name */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("nameArabic")} *
            </label>
            <Input
              type="text"
              value={formData.name_ar}
              onChange={(value) =>
                setFormData({ ...formData, name_ar: value as string })
              }
              placeholder="أدخل الاسم بالعربية"
              className={`w-full transition-all duration-200 ${
                formErrors.name_ar ? "border-red-500 animate-pulse" : ""
              }`}
              disabled={isSubmitting || uploading}
            />
            {formErrors.name_ar && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.name_ar}
              </p>
            )}
          </div>

          {/* Kurdish Name */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("nameKurdish")} *
            </label>
            <Input
              type="text"
              value={formData.name_ku}
              onChange={(value) =>
                setFormData({ ...formData, name_ku: value as string })
              }
              placeholder="ناو بە کوردی بنووسە"
              className={`w-full transition-all duration-200 ${
                formErrors.name_ku ? "border-red-500 animate-pulse" : ""
              }`}
              disabled={isSubmitting || uploading}
            />
            {formErrors.name_ku && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.name_ku}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("price")} *
            </label>
            <Input
              type="number"
              value={formData.price}
              onChange={(value) =>
                setFormData({ ...formData, price: value as string })
              }
              placeholder="0.00"
              className={`w-full transition-all duration-200 ${
                formErrors.price ? "border-red-500 animate-pulse" : ""
              }`}
              disabled={isSubmitting || uploading}
            />
            {formErrors.price && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.price}
              </p>
            )}
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* English Description */}
            <div className="transform transition-all duration-200">
              <label
                className={`mx-2 block text-sm font-medium ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } mb-2 transition-colors duration-200`}
              >
                {getText("descriptionEnglish")}
              </label>
              <Input
                type="textarea"
                value={formData.description_en}
                onChange={(value) =>
                  setFormData({ ...formData, description_en: value as string })
                }
                placeholder={getText("enterDescriptionEnglish")}
                rows={3}
                error={formErrors.description_en}
                disabled={isSubmitting || uploading}
              />
            </div>

            {/* Arabic Description */}
            <div className="transform transition-all duration-200">
              <label
                className={`mx-2 block text-sm font-medium ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } mb-2 transition-colors duration-200`}
              >
                {getText("descriptionArabic")}
              </label>
              <Input
                type="textarea"
                value={formData.description_ar}
                onChange={(value) =>
                  setFormData({ ...formData, description_ar: value as string })
                }
                placeholder="أدخل الوصف بالعربية"
                rows={3}
                error={formErrors.description_ar}
                disabled={isSubmitting || uploading}
              />
            </div>

            {/* Kurdish Description */}
            <div className="transform transition-all duration-200">
              <label
                className={`mx-2 block text-sm font-medium ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } mb-2 transition-colors duration-200`}
              >
                {getText("descriptionKurdish")}
              </label>
              <Input
                type="textarea"
                value={formData.description_ku}
                onChange={(value) =>
                  setFormData({ ...formData, description_ku: value as string })
                }
                placeholder="وەسف بە کوردی بنووسە"
                rows={3}
                error={formErrors.description_ku}
                disabled={isSubmitting || uploading}
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="transform transition-all duration-200">
            <Input
              type="checkbox"
              checked={formData.is_available}
              onChange={(value) =>
                setFormData({ ...formData, is_available: value as boolean })
              }
              label={getText("availableForCustomers")}
              disabled={isSubmitting || uploading}
            />
          </div>

          {/* Image Upload */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-4 transition-colors duration-200`}
            >
              {getText("menuItemImage")}
            </label>

            <div
              className={`${theme.bgSearchBar} rounded-2xl p-4 sm:p-6 border ${theme.borderCategory} transition-all duration-200`}
            >
              {/* Mobile Layout - Vertical Stack */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                {/* Image Preview Container */}
                <div className="relative group mx-auto sm:mx-0 flex-shrink-0">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 ${theme.borderCategory} ${theme.bgSecondary} flex items-center justify-center transition-all duration-200`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Menu item preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload
                        className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.textSecondary}`}
                      />
                    )}
                  </div>

                  {/* Overlay on hover - Hidden on mobile touch devices */}
                  {imagePreview && (
                    <div className="hidden sm:flex absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 items-center justify-center">
                      <button
                        type="button"
                        onClick={handleImageDelete}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                        disabled={uploading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload indicator */}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                      <div
                        className={`p-2 sm:p-3 ${theme.bgButtomNavigation} rounded-full`}
                      >
                        <Loader
                          className={`w-4 h-4 sm:w-6 sm:h-6 animate-spin ${theme.textMain}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                  <div
                    className={`text-center sm:${
                      language == "ar" || language == "ku" ? "text-right" : ""
                    }`}
                  >
                    <h4
                      className={`text-sm sm:text-base font-medium ${theme.textMain} mb-1`}
                    >
                      {imagePreview
                        ? getText("changeImage")
                        : getText("uploadImage")}
                    </h4>
                    <p className={`text-xs sm:text-sm ${theme.textSecondary}`}>
                      {getText("imageDescription")}
                    </p>
                  </div>

                  {/* Mobile-first button layout */}
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      disabled={uploading || isSubmitting}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || isSubmitting}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl ${theme.bgButtomNavigation} ${theme.textMain} hover:${theme.bgMain} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transform hover:scale-105 active:scale-95 ${theme.topbarShadowStyle} text-sm sm:text-base`}
                    >
                      {uploading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span className="truncate">
                            {getText("uploading")}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {imagePreview
                              ? getText("changeImage")
                              : getText("chooseImage")}
                          </span>
                        </>
                      )}
                    </button>

                    {imagePreview && !uploading && (
                      <button
                        type="button"
                        onClick={handleImageDelete}
                        disabled={uploading || isSubmitting}
                        className={`w-full sm:w-auto px-3 sm:px-4 py-2.5 rounded-xl border ${theme.borderCategory} ${theme.textSecondary} hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transform hover:scale-105 active:scale-95 text-sm sm:text-base`}
                      >
                        {getText("remove")}
                      </button>
                    )}
                  </div>

                  {/* Success indicator */}
                  {imagePreview && !uploading && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span
                        className={`text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 text-center sm:text-left`}
                      >
                        {getText("imageUploadedSuccess")}
                      </span>
                    </div>
                  )}

                  {/* File format info */}
                  <div
                    className={`text-xs ${
                      theme.textSecondary
                    } bg-opacity-50 text-center sm:${
                      language == "ar" || language == "ku" ? "text-right" : ""
                    }`}
                  >
                    {getText("supportedFormats")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting || uploading}
            >
              {getText("cancel")}
            </Button>

            <Button
              type="submit"
              variant="primary"
              onClick={() => {}}
              disabled={isSubmitting || uploading}
            >
              {isSubmitting
                ? getText("saving")
                : editingMenuItem
                ? getText("update")
                : getText("create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemFormModal;
