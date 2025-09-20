import React, { useState, useEffect, useRef } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlerts } from "@/hooks/useAlerts";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import {
  Restaurant,
  RestaurantCreateData,
} from "@/admin/types/admin";
import { Input } from "@/admin/components/Input";
import Button from "@/components/Button";
import { X, Upload, Loader, Trash2 } from "lucide-react";
import {
  uploadImageToSupabase,
  deleteImageFromSupabase,
  replaceImageInSupabase,
} from "@/admin/utils/imageUpload";
import { validateRestaurantForm, validateRestaurantImage } from "./RestaurantUtils";

interface RestaurantFormData {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  theme_color: string;
  is_active: boolean;
}

interface RestaurantFormModalProps {
  isOpen: boolean;
  editingRestaurant: Restaurant | null;
  onClose: () => void;
  onSubmit: (formData: RestaurantCreateData) => Promise<void>;
  isSubmitting: boolean;
}

const RestaurantFormModal: React.FC<RestaurantFormModalProps> = ({
  isOpen,
  editingRestaurant,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const alerts = useAlerts();
  const t = defaultAdminConfig.ui.restaurants;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: editingRestaurant?.name || "",
    description: editingRestaurant?.description || "",
    address: editingRestaurant?.address || "",
    phone: editingRestaurant?.phone || "",
    email: editingRestaurant?.email || "",
    website: editingRestaurant?.website || "",
    logo_url: editingRestaurant?.logo_url || "",
    theme_color: editingRestaurant?.theme_color || "#4e98ff",
    is_active: editingRestaurant?.is_active ?? true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isSubmitting && !uploading) {
        handleCancel();
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
  }, [isOpen, isSubmitting, uploading]);

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSubmitting && !uploading) {
      handleCancel();
    }
  };

  // Reset form when modal opens/closes or editing restaurant changes
  React.useEffect(() => {
    if (editingRestaurant) {
      setFormData({
        name: editingRestaurant.name,
        description: editingRestaurant.description || "",
        address: editingRestaurant.address || "",
        phone: editingRestaurant.phone || "",
        email: editingRestaurant.email || "",
        website: editingRestaurant.website || "",
        logo_url: editingRestaurant.logo_url || "",
        theme_color: editingRestaurant.theme_color,
        is_active: editingRestaurant.is_active,
      });
      setImagePreview(editingRestaurant.logo_url || "");
    } else {
      setFormData({
        name: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        logo_url: "",
        theme_color: "#4e98ff",
        is_active: true,
      });
      setImagePreview("");
    }
    setFormErrors({});
  }, [editingRestaurant, isOpen]);

  const validateForm = (): boolean => {
    const errors = validateRestaurantForm(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate image
    const validationError = validateRestaurantImage(file);
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
      if (editingRestaurant && editingRestaurant.logo_url) {
        uploadResult = await replaceImageInSupabase(
          file,
          editingRestaurant.logo_url,
          undefined, // No thumbnail for restaurant logos
          "restaurant-logos"
        );
      } else {
        // For new restaurant, use regular upload
        uploadResult = await uploadImageToSupabase(file, "restaurant-logos");
      }

      const { originalUrl, error } = uploadResult;

      if (error) {
        await alerts.showError(`Upload failed: ${error}`, "Upload Error");
        setImagePreview("");
      } else if (originalUrl) {
        setFormData((prev) => ({
          ...prev,
          logo_url: originalUrl,
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
    if (!formData.logo_url) return;

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
      if (formData.logo_url) {
        await deleteImageFromSupabase(formData.logo_url);
      }

      setFormData((prev) => ({
        ...prev,
        logo_url: "",
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
      await onSubmit(formData);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      logo_url: "",
      theme_color: "#4e98ff",
      is_active: true,
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
            {editingRestaurant ? getText("editRestaurant") : getText("addRestaurant")}
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
          {/* Restaurant Name */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("name")} *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(value) =>
                setFormData({ ...formData, name: value as string })
              }
              placeholder={getText("enterName")}
              className={`w-full transition-all duration-200 ${
                formErrors.name ? "border-red-500 animate-pulse" : ""
              }`}
              disabled={isSubmitting || uploading}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("description")}
            </label>
            <Input
              type="textarea"
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value as string })
              }
              placeholder={getText("enterDescription")}
              rows={3}
              error={formErrors.description}
              disabled={isSubmitting || uploading}
            />
          </div>

          {/* Address */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("address")}
            </label>
            <Input
              type="text"
              value={formData.address}
              onChange={(value) =>
                setFormData({ ...formData, address: value as string })
              }
              placeholder={getText("enterAddress")}
              className={`w-full transition-all duration-200 ${
                formErrors.address ? "border-red-500 animate-pulse" : ""
              }`}
              disabled={isSubmitting || uploading}
            />
            {formErrors.address && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.address}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="transform transition-all duration-200">
              <label
                className={`mx-2 block text-sm font-medium ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } mb-2 transition-colors duration-200`}
              >
                {getText("phone")}
              </label>
              <Input
                type="text"
                value={formData.phone}
                onChange={(value) =>
                  setFormData({ ...formData, phone: value as string })
                }
                placeholder={getText("enterPhone")}
                className={`w-full transition-all duration-200 ${
                  formErrors.phone ? "border-red-500 animate-pulse" : ""
                }`}
                disabled={isSubmitting || uploading}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                  {formErrors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="transform transition-all duration-200">
              <label
                className={`mx-2 block text-sm font-medium ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } mb-2 transition-colors duration-200`}
              >
                {getText("email")}
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(value) =>
                  setFormData({ ...formData, email: value as string })
                }
                placeholder={getText("enterEmail")}
                className={`w-full transition-all duration-200 ${
                  formErrors.email ? "border-red-500 animate-pulse" : ""
                }`}
                disabled={isSubmitting || uploading}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                  {formErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Website and Theme Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Website */}
            <div className="transform transition-all duration-200">
              <label
                className={`mx-2 block text-sm font-medium ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } mb-2 transition-colors duration-200`}
              >
                {getText("website")}
              </label>
              <Input
                type="text"
                value={formData.website}
                onChange={(value) =>
                  setFormData({ ...formData, website: value as string })
                }
                placeholder={getText("enterWebsite")}
                className={`w-full transition-all duration-200 ${
                  formErrors.website ? "border-red-500 animate-pulse" : ""
                }`}
                disabled={isSubmitting || uploading}
              />
              {formErrors.website && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                  {formErrors.website}
                </p>
              )}
            </div>

            {/* Theme Color */}
            <div className="transform transition-all duration-200">
              <label
                className={`mx-2 block text-sm font-medium ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } mb-2 transition-colors duration-200`}
              >
                {getText("themeColor")} *
              </label>
              <Input
                type="color"
                value={formData.theme_color}
                onChange={(value) =>
                  setFormData({ ...formData, theme_color: value as string })
                }
                placeholder="#4e98ff"
                className={`w-full transition-all duration-200 ${
                  formErrors.theme_color ? "border-red-500 animate-pulse" : ""
                }`}
                disabled={isSubmitting || uploading}
              />
              {formErrors.theme_color && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                  {formErrors.theme_color}
                </p>
              )}
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="transform transition-all duration-200">
            <Input
              type="checkbox"
              checked={formData.is_active}
              onChange={(value) =>
                setFormData({ ...formData, is_active: value as boolean })
              }
              label={getText("activeRestaurant")}
              disabled={isSubmitting || uploading}
            />
          </div>

          {/* Logo Upload */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-4 transition-colors duration-200`}
            >
              {getText("restaurantLogo")}
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
                        alt="Restaurant logo preview"
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
                        ? getText("changeLogo")
                        : getText("uploadLogo")}
                    </h4>
                    <p className={`text-xs sm:text-sm ${theme.textSecondary}`}>
                      {getText("logoDescription")}
                    </p>
                  </div>

                  {/* Mobile-first button layout */}
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
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
                              ? getText("changeLogo")
                              : getText("chooseLogo")}
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
                        {getText("logoUploadedSuccess")}
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
                : editingRestaurant
                ? getText("update")
                : getText("create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantFormModal;