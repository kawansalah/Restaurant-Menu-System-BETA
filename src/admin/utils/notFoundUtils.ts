import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";

interface UseNotFoundUtilsReturn {
  getText: (key: keyof typeof defaultAdminConfig.ui.notFound) => string;
}

export const useNotFoundUtils = (): UseNotFoundUtilsReturn => {
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.notFound;

  const getText = (key: keyof typeof t) => {
    // Safety checks to prevent undefined access
    if (!t || !t[key]) {
      console.warn(`Missing translation key: ${String(key)}`);
      return String(key); // Fallback to key name
    }

    const translations = t[key];
    if (!translations) {
      console.warn(`Missing translations object for key: ${String(key)}`);
      return String(key);
    }

    // Check if the current language exists, fallback to English, then to any available language
    if (language && translations[language]) {
      return translations[language];
    }

    if (translations.en) {
      return translations.en;
    }

    // Last resort: return the first available translation
    const availableLanguages = Object.keys(translations);
    if (availableLanguages.length > 0) {
      return translations[availableLanguages[0] as keyof typeof translations];
    }

    // Ultimate fallback
    return String(key);
  };

  return { getText };
};
