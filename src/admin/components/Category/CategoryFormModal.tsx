import React, { useState, useEffect, useRef } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Category } from "@/admin/types/admin";
import { Input } from "@/admin/components/Input";
import Button from "@/components/Button";
import { X } from "lucide-react";
import { CATEGORY_VALIDATION } from "@/admin/components/Category/CategoryConstants";

interface CategoryFormData {
  label_ku: string;
  label_ar: string;
  label_en: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  editingCategory: Category | null;
  onClose: () => void;
  onSubmit: (formData: CategoryFormData) => Promise<void>;
  isSubmitting: boolean;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  editingCategory,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.categories;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [formData, setFormData] = useState<CategoryFormData>({
    label_ku: editingCategory?.label_ku || "",
    label_ar: editingCategory?.label_ar || "",
    label_en: editingCategory?.label_en || "",
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
      if (event.key === "Escape" && isOpen && !isSubmitting) {
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
  }, [isOpen, isSubmitting]);

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      handleCancel();
    }
  };

  React.useEffect(() => {
    if (editingCategory) {
      setFormData({
        label_ku: editingCategory.label_ku,
        label_ar: editingCategory.label_ar,
        label_en: editingCategory.label_en,
      });
    } else {
      setFormData({
        label_ku: "",
        label_ar: "",
        label_en: "",
      });
    }
    setFormErrors({});
  }, [editingCategory, isOpen]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // English label validation
    if (!formData.label_en.trim()) {
      errors.label_en = "English label is required";
    } else if (
      formData.label_en.length < CATEGORY_VALIDATION.LABEL_MIN_LENGTH
    ) {
      errors.label_en = `Label must be at least ${CATEGORY_VALIDATION.LABEL_MIN_LENGTH} character`;
    } else if (
      formData.label_en.length > CATEGORY_VALIDATION.LABEL_MAX_LENGTH
    ) {
      errors.label_en = `Label must be less than ${CATEGORY_VALIDATION.LABEL_MAX_LENGTH} characters`;
    }

    // Arabic label validation
    if (!formData.label_ar.trim()) {
      errors.label_ar = "Arabic label is required";
    } else if (
      formData.label_ar.length < CATEGORY_VALIDATION.LABEL_MIN_LENGTH
    ) {
      errors.label_ar = `Label must be at least ${CATEGORY_VALIDATION.LABEL_MIN_LENGTH} character`;
    } else if (
      formData.label_ar.length > CATEGORY_VALIDATION.LABEL_MAX_LENGTH
    ) {
      errors.label_ar = `Label must be less than ${CATEGORY_VALIDATION.LABEL_MAX_LENGTH} characters`;
    }

    // Kurdish label validation
    if (!formData.label_ku.trim()) {
      errors.label_ku = "Kurdish label is required";
    } else if (
      formData.label_ku.length < CATEGORY_VALIDATION.LABEL_MIN_LENGTH
    ) {
      errors.label_ku = `Label must be at least ${CATEGORY_VALIDATION.LABEL_MIN_LENGTH} character`;
    } else if (
      formData.label_ku.length > CATEGORY_VALIDATION.LABEL_MAX_LENGTH
    ) {
      errors.label_ku = `Label must be less than ${CATEGORY_VALIDATION.LABEL_MAX_LENGTH} characters`;
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
      label_ku: "",
      label_ar: "",
      label_en: "",
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
            {editingCategory ? getText("editCategory") : getText("addCategory")}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            {formErrors.label_ku && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                {formErrors.label_ku}
              </p>
            )}
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
              {isSubmitting
                ? "Saving..."
                : editingCategory
                ? getText("update")
                : getText("create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
