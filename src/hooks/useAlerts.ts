import { useAlert } from "@/contexts/AlertContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";

/**
 * Custom hook that provides convenient methods for showing different types of alerts
 * with predefined configurations that match common use cases.
 */
export const useAlerts = () => {
  const alertContext = useAlert();
  const { language } = useLanguage();

  // Get localized text helper
  const getLocalizedText = (
    textKey: string,
    section: "buttons" | "titles" | "messages"
  ) => {
    const alertTexts = defaultMenuConfig.ui?.alerts;
    if (!alertTexts) return "";

    const sectionTexts = alertTexts[section] as any;
    const text = sectionTexts[textKey];
    if (!text) return "";
    return text[language] || text.en;
  };

  // Quick confirmation dialog
  const confirmDelete = async (itemName?: string): Promise<boolean> => {
    const title = getLocalizedText("deleteConfirmation", "titles");
    const baseMessage = getLocalizedText("deleteItem", "messages");
    const message = itemName
      ? baseMessage.replace("this item", `"${itemName}"`)
      : baseMessage;

    return alertContext.showConfirm({
      title,
      message,
      confirmText: getLocalizedText("delete", "buttons"),
      cancelText: getLocalizedText("cancel", "buttons"),
    });
  };

  // Quick success message
  const showSuccess = async (
    message: string,
    title?: string
  ): Promise<boolean> => {
    return alertContext.showSuccess({
      title: title || getLocalizedText("success", "titles"),
      message,
      okText: getLocalizedText("ok", "buttons"),
      autoClose: true,
      autoCloseDelay: 3000,
    });
  };

  // Quick error message
  const showError = async (
    message: string,
    title?: string
  ): Promise<boolean> => {
    return alertContext.showError({
      title: title || getLocalizedText("error", "titles"),
      message,
      okText: getLocalizedText("ok", "buttons"),
    });
  };

  // Quick warning message
  const showWarning = async (
    message: string,
    title?: string
  ): Promise<boolean> => {
    return alertContext.showWarning({
      title: title || getLocalizedText("warning", "titles"),
      message,
      okText: getLocalizedText("ok", "buttons"),
    });
  };

  // Quick info message
  const showInfo = async (
    message: string,
    title?: string
  ): Promise<boolean> => {
    return alertContext.showAlert({
      type: "alert",
      title: title || getLocalizedText("information", "titles"),
      message,
      okText: getLocalizedText("ok", "buttons"),
    });
  };

  // Confirm navigation away from unsaved changes
  const confirmUnsavedChanges = async (): Promise<boolean> => {
    return alertContext.showConfirm({
      title: getLocalizedText("warning", "titles"),
      message: getLocalizedText("unsavedChanges", "messages"),
      confirmText: getLocalizedText("yes", "buttons"),
      cancelText: getLocalizedText("no", "buttons"),
    });
  };

  // Confirm logout
  const confirmLogout = async (): Promise<boolean> => {
    return alertContext.showConfirm({
      title: getLocalizedText("confirmation", "titles"),
      message: getLocalizedText("logout", "messages"),
      confirmText: getLocalizedText("yes", "buttons"),
      cancelText: getLocalizedText("cancel", "buttons"),
    });
  };

  // Generic confirmation with custom text
  const confirm = async (
    message: string,
    title?: string,
    confirmText?: string,
    cancelText?: string
  ): Promise<boolean> => {
    return alertContext.showConfirm({
      title: title || getLocalizedText("confirmation", "titles"),
      message,
      confirmText: confirmText || getLocalizedText("yes", "buttons"),
      cancelText: cancelText || getLocalizedText("no", "buttons"),
    });
  };

  return {
    // Direct access to context methods
    ...alertContext,

    // Convenience methods
    confirmDelete,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirmUnsavedChanges,
    confirmLogout,
    confirm,
  };
};

export default useAlerts;
