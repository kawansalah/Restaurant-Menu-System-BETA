import React, { useState, useEffect, useRef } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import {defaultMenuConfig} from "@/config/dynamicMenuConfig";
import Button from "@/components/Button";
import { AlertOptions } from "@/contexts/AlertContext";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  AlertCircle,
  X,
} from "lucide-react";

interface AlertModalProps {
  options: AlertOptions;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  options,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const theme = useThemeClasses();
  const { language, isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Animation handling
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (options.showCancel) {
          onCancel();
        } else {
          onClose();
        }
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, options.showCancel, onCancel, onClose]);

  // Focus management
  useEffect(() => {
    if (isVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isVisible]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      if (options.showCancel) {
        onCancel();
      } else {
        onClose();
      }
    }
  };

  // Get icon based on alert type
  const getIcon = () => {
    if (options.icon) return options.icon;

    const iconClass = `w-8 h-8 ${
      theme.isDark ? "text-white" : "text-gray-600"
    }`;

    switch (options.type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case "error":
        return <XCircle className={`${iconClass} text-red-500`} />;
      case "warning":
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case "confirm":
        return <AlertCircle className={`${iconClass} text-blue-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  // Get default texts based on language from menu config
  const getDefaultTexts = () => {
    const alertTexts = defaultMenuConfig.ui?.alerts;
    if (!alertTexts) {
      // Fallback to hardcoded texts if config is not available
      const texts = {
        ku: {
          ok: "باشە",
          yes: "بەڵێ",
          no: "نەخێر",
          cancel: "هەڵوەشاندنەوە",
          confirm: "پشتڕاستکردنەوە",
        },
        ar: {
          ok: "موافق",
          yes: "نعم",
          no: "لا",
          cancel: "إلغاء",
          confirm: "تأكيد",
        },
        en: {
          ok: "OK",
          yes: "Yes",
          no: "No",
          cancel: "Cancel",
          confirm: "Confirm",
        },
      };
      return texts[language as keyof typeof texts] || texts.en;
    }

    return {
      ok: alertTexts.buttons.ok[language] || alertTexts.buttons.ok.en,
      yes: alertTexts.buttons.yes[language] || alertTexts.buttons.yes.en,
      no: alertTexts.buttons.no[language] || alertTexts.buttons.no.en,
      cancel:
        alertTexts.buttons.cancel[language] || alertTexts.buttons.cancel.en,
      confirm:
        alertTexts.buttons.confirm[language] || alertTexts.buttons.confirm.en,
    };
  };

  const defaultTexts = getDefaultTexts();

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] p-4 transition-all duration-300 ease-out ${
        isAnimating
          ? "bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          : "bg-black/0 dark:bg-black/0"
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-message"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`${
          theme.bgCard
        } rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto ${
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
        {/* Header */}
        <div
          className={`flex items-start gap-4 mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">{getIcon()}</div>

          {/* Content */}
          <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
            {/* Title */}
            <h3
              id="alert-title"
              className={`text-xl font-bold ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              } mb-2 transition-colors duration-200`}
            >
              {options.title}
            </h3>

            {/* Message */}
            <p
              id="alert-message"
              className={`text-base ${
                theme.isDark ? theme.textSecondary : theme.textSecondary
              } leading-relaxed transition-colors duration-200`}
            >
              {options.message}
            </p>
          </div>

          {/* Close button for non-confirm alerts */}
          {!options.showCancel && (
            <button
              onClick={onClose}
              className={`flex-shrink-0 p-2 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar} transition-all duration-200 hover:scale-105 active:scale-95`}
              aria-label="Close alert"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""} ${
            options.showCancel ? "justify-end" : "justify-center"
          }`}
        >
          {/* Cancel/No Button */}
          {options.showCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              {options.cancelText ||
                (options.type === "confirm"
                  ? defaultTexts.no
                  : defaultTexts.cancel)}
            </Button>
          )}

          {/* Confirm/OK/Yes Button */}
          <Button
            type="button"
            variant={options.type === "error" ? "delete" : "primary"}
            onClick={onConfirm}
          >
            {options.confirmText ||
              options.okText ||
              (options.showCancel
                ? options.type === "confirm"
                  ? defaultTexts.yes
                  : defaultTexts.confirm
                : defaultTexts.ok)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
