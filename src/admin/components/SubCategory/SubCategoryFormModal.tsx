import React, { useState, useEffect, useRef } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlerts } from "@/hooks/useAlerts";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import { SubCategory, Category } from "@/admin/types/admin";
import { Input } from "@/admin/components/Input";
import Button from "@/components/Button";
import { X, Upload, Loader, Trash2 } from "lucide-react";
import { fetchCategories } from "@/admin/services/categoryService";
import {
  uploadImageToSupabase,
  deleteImageFromSupabase,
  replaceImageInSupabase,
} from "@/admin/utils/imageUpload";

interface SubCategoryFormData {
  category_id: string;
  label_ku: string;
  label_ar: string;
  label_en: string;
  image_url?: string;
  thumbnail_url?: string;
}

interface SubCategoryFormModalProps {
  isOpen: boolean;
  editingSubCategory: SubCategory | null;
  onClose: () => void;
  onSubmit: (formData: SubCategoryFormData) => Promise<void>;
  isSubmitting: boolean;
}

const SubCategoryFormModal: React.FC<SubCategoryFormModalProps> = ({
  isOpen,
  editingSubCategory,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const alerts = useAlerts();
  const t = defaultAdminConfig.ui.categories; // Using same text config as categories for consistency
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Categories for dropdown
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<SubCategoryFormData>({
    category_id: editingSubCategory?.category_id || "",
    label_ku: editingSubCategory?.label_ku || "",
    label_ar: editingSubCategory?.label_ar || "",
    label_en: editingSubCategory?.label_en || "",
    image_url: editingSubCategory?.image_url || "",
    thumbnail_url: editingSubCategory?.thumbnail_url || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load categories
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      loadCategories();
    }
  }, [isOpen]);

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

  // Reset form when modal opens/closes or editing subcategory changes
  React.useEffect(() => {
    if (editingSubCategory) {
      setFormData({
        category_id: editingSubCategory.category_id,
        label_ku: editingSubCategory.label_ku,
        label_ar: editingSubCategory.label_ar,
        label_en: editingSubCategory.label_en,
        image_url: editingSubCategory.image_url || "",
        thumbnail_url: editingSubCategory.thumbnail_url || "",
      });
      setImagePreview(
        editingSubCategory.thumbnail_url || editingSubCategory.image_url || ""
      );
    } else {
      setFormData({
        category_id: "",
        label_ku: "",
        label_ar: "",
        label_en: "",
        image_url: "",
        thumbnail_url: "",
      });
      setImagePreview("");
    }
    setFormErrors({});
  }, [editingSubCategory, isOpen]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Category validation
    if (!formData.category_id.trim()) {
      errors.category_id = "Category is required";
    }

    // English label validation
    if (!formData.label_en.trim()) {
      errors.label_en = "English label is required";
    } else if (formData.label_en.length < 2) {
      errors.label_en = "Label must be at least 2 characters";
    } else if (formData.label_en.length > 100) {
      errors.label_en = "Label must be less than 100 characters";
    }

    // Arabic label validation
    if (!formData.label_ar.trim()) {
      errors.label_ar = "Arabic label is required";
    } else if (formData.label_ar.length < 2) {
      errors.label_ar = "Label must be at least 2 characters";
    } else if (formData.label_ar.length > 100) {
      errors.label_ar = "Label must be less than 100 characters";
    }

    // Kurdish label validation
    if (!formData.label_ku.trim()) {
      errors.label_ku = "Kurdish label is required";
    } else if (formData.label_ku.length < 2) {
      errors.label_ku = "Label must be at least 2 characters";
    } else if (formData.label_ku.length > 100) {
      errors.label_ku = "Label must be less than 100 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      let uploadResult;

      // If editing, use replace function to delete old images first
      if (
        editingSubCategory &&
        (editingSubCategory.image_url || editingSubCategory.thumbnail_url)
      ) {
        uploadResult = await replaceImageInSupabase(
          file,
          editingSubCategory.image_url,
          editingSubCategory.thumbnail_url,
          "subcategories"
        );
      } else {
        // For new subcategory, use regular upload
        uploadResult = await uploadImageToSupabase(file, "subcategories");
      }

      const { originalUrl, thumbnailUrl, error } = uploadResult;

      if (error) {
        await alerts.showError(`Upload failed: ${error}`, "Upload Error");
        setImagePreview("");
      } else if (originalUrl && thumbnailUrl) {
        setFormData((prev) => ({
          ...prev,
          image_url: originalUrl,
          thumbnail_url: thumbnailUrl,
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
    if (!formData.image_url && !formData.thumbnail_url) return;

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
      if (formData.thumbnail_url) {
        await deleteImageFromSupabase(formData.thumbnail_url);
      }

      setFormData((prev) => ({
        ...prev,
        image_url: "",
        thumbnail_url: "",
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

    await onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData({
      category_id: "",
      label_ku: "",
      label_ar: "",
      label_en: "",
      image_url: "",
      thumbnail_url: "",
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
            {editingSubCategory ? "Edit SubCategory" : "Add SubCategory"}
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
              Category *
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
                placeholder="Select Category"
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

          {/* English Label */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("labelEn")} *
            </label>
            <Input
              type="text"
              value={formData.label_en}
              onChange={(value) =>
                setFormData({ ...formData, label_en: value as string })
              }
              placeholder={getText("enterLabelEn")}
              className={`w-full transition-all duration-200 ${
                formErrors.label_en ? "border-red-500 animate-pulse" : ""
              }`}
              disabled={isSubmitting || uploading}
            />
            {formErrors.label_en && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.label_en}
              </p>
            )}
          </div>

          {/* Arabic Label */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("labelAr")} *
            </label>
            <Input
              type="text"
              value={formData.label_ar}
              onChange={(value) =>
                setFormData({ ...formData, label_ar: value as string })
              }
              placeholder={getText("enterLabelAr")}
              className={`w-full transition-all duration-200 ${
                formErrors.label_ar ? "border-red-500 animate-pulse" : ""
              }`}
              disabled={isSubmitting || uploading}
            />
            {formErrors.label_ar && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.label_ar}
              </p>
            )}
          </div>

          {/* Kurdish Label */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {getText("labelKu")} *
            </label>
            <Input
              type="text"
              value={formData.label_ku}
              onChange={(value) =>
                setFormData({ ...formData, label_ku: value as string })
              }
              placeholder={getText("enterLabelKu")}
              className={`w-full transition-all duration-200 ${
                formErrors.label_ku ? "border-red-500 animate-pulse" : ""
              }`}
              disabled={isSubmitting || uploading}
            />
            {formErrors.label_ku && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.label_ku}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="transform transition-all duration-200">
            <label
              className={`mx-2 block text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-4 transition-colors duration-200`}
            >
              {getText("subcategoryImage")}
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
                        alt="SubCategory preview"
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
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
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
                ? "Saving..."
                : editingSubCategory
                ? getText("update")
                : getText("create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoryFormModal;
