import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { AdminUser, AdminRole } from "@/admin/types/admin";

interface UseUserUtilsReturn {
  getText: (key: keyof typeof defaultAdminConfig.ui.users) => string;
  handleExportUsers: (users: AdminUser[]) => void;
  getErrorMessage: (error: string, formData?: { email?: string; username?: string }) => string;
  getRoleDisplayText: (role: AdminRole) => string;
}

export const useUserUtils = (): UseUserUtilsReturn => {
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.users;
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

  const getRoleDisplayText = (role: AdminRole) => {
    const roleTextMap = {
      super_admin: getText("superAdmin"),
      admin: getText("admin"),
      manager: getText("manager"),
      staff: getText("staff"),
    };
    return roleTextMap[role] || getText("staff");
  };

  const handleExportUsers = (users: AdminUser[]) => {
    const csvContent = [
      [
        getText("user"),
        "Username",
        getText("email"),
        getText("role"),
        getText("status"),
        getText("lastLogin"),
        getText("created"),
      ],
      ...users.map((user) => [
        user.full_name,
        user.username,
        user.email,
        getRoleDisplayText(user.role),
        user.is_active ? getText("active") : getText("inactive"),
        user.last_login ? new Date(user.last_login).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) : getText("never"),
        new Date(user.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getErrorMessage = (error: string, formData?: { email?: string; username?: string }): string => {
    if (error.includes('Email address') && error.includes('invalid')) {
      return `The email address "${formData?.email}" is not accepted. Please use a standard email domain (e.g., .com, .org, .net) as .dev domains may not be supported.`;
    } else if (error.includes('Username already exists')) {
      return `The username "${formData?.username}" is already taken. Please choose a different username.`;
    } else if (error.includes('Auth error')) {
      return `Authentication error: ${error.replace('Auth error: ', '')}. Please check your email format and try again.`;
    }
    return error;
  };

  return {
    getText,
    handleExportUsers,
    getErrorMessage,
    getRoleDisplayText,
  };
};