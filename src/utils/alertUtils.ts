import { AlertOptions } from "@/contexts/AlertContext";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import { Language } from "@/types/menu";

/**
 * Utility functions for creating pre-configured alert options with localization
 * These functions return AlertOptions objects that can be used with the alert system
 */

// Get localized text helper
const getLocalizedText = (
  textKey: string,
  section: "buttons" | "titles" | "messages",
  language: Language
) => {
  const alertTexts = defaultMenuConfig.ui?.alerts;
  if (!alertTexts) return "";

  const sectionTexts = alertTexts[section] as any;
  const text = sectionTexts[textKey];
  if (!text) return "";
  return text[language] || text.en;
};

export const createDeleteAlert = (
  itemName?: string,
  language: Language = "en"
): Omit<AlertOptions, "type"> => {
  const title = getLocalizedText("deleteConfirmation", "titles", language);
  const baseMessage = getLocalizedText("deleteItem", "messages", language);
  const message = itemName
    ? baseMessage.replace("this item", `"${itemName}"`)
    : baseMessage;

  return {
    title,
    message,
    confirmText: getLocalizedText("delete", "buttons", language),
    cancelText: getLocalizedText("cancel", "buttons", language),
  };
};

export const createLogoutAlert = (
  language: Language = "en"
): Omit<AlertOptions, "type"> => ({
  title: getLocalizedText("confirmation", "titles", language),
  message: getLocalizedText("logout", "messages", language),
  confirmText: getLocalizedText("yes", "buttons", language),
  cancelText: getLocalizedText("cancel", "buttons", language),
});

export const createNavigationAlert = (
  language: Language = "en"
): Omit<AlertOptions, "type"> => ({
  title: getLocalizedText("warning", "titles", language),
  message: getLocalizedText("unsavedChanges", "messages", language),
  confirmText: getLocalizedText("yes", "buttons", language),
  cancelText: getLocalizedText("no", "buttons", language),
});

export const createSuccessAlert = (
  action: string,
  language: Language = "en"
): Omit<AlertOptions, "type"> => ({
  title: getLocalizedText("success", "titles", language),
  message: action,
  okText: getLocalizedText("ok", "buttons", language),
  autoClose: true,
  autoCloseDelay: 3000,
});

export const createErrorAlert = (
  error: string | Error,
  language: Language = "en"
): Omit<AlertOptions, "type"> => ({
  title: getLocalizedText("error", "titles", language),
  message: typeof error === "string" ? error : error.message,
  okText: getLocalizedText("ok", "buttons", language),
});

export const createWarningAlert = (
  warning: string,
  language: Language = "en"
): Omit<AlertOptions, "type"> => ({
  title: getLocalizedText("warning", "titles", language),
  message: warning,
  okText: getLocalizedText("ok", "buttons", language),
});

export const createInfoAlert = (
  info: string,
  title?: string,
  language: Language = "en"
): Omit<AlertOptions, "type"> => ({
  title: title || getLocalizedText("information", "titles", language),
  message: info,
  okText: getLocalizedText("ok", "buttons", language),
});

export const createNetworkErrorAlert = (
  language: Language = "en"
): Omit<AlertOptions, "type"> => ({
  title: getLocalizedText("error", "titles", language),
  message: getLocalizedText("networkError", "messages", language),
  okText: getLocalizedText("ok", "buttons", language),
});
