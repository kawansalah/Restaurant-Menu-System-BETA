import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";
import { Input } from "@/admin/components/Input";
import Button from "@/components/Button";
import {
  Settings as SettingsIcon,
  Globe,
  Palette,
  Database,
  Mail,
  Lock,
  Save,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import {
  saveAppearanceSettings,
  fetchAppearanceSettings,
  deleteLogo,
} from "@/admin/services/settingsService";
import { useAlerts } from "@/hooks/useAlerts";

interface SettingsSection {
  id: string;
  title: {
    ku: string;
    ar: string;
    en: string;
  };
  description: {
    ku: string;
    ar: string;
    en: string;
  };
  icon: React.ComponentType<any>;
  color: string;
}

const Settings: React.FC = () => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const alerts = useAlerts();
  const { user } = useAdminAuth();
  const [activeSection, setActiveSection] = useState<string>("general");

  // Add state for appearance settings
  const [lightLogo, setLightLogo] = useState<File | null>(null);
  const [darkLogo, setDarkLogo] = useState<File | null>(null);
  const [lightLogoPreview, setLightLogoPreview] = useState<string | null>(null);
  const [darkLogoPreview, setDarkLogoPreview] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState<string>("#4e98ff");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getLocalizedText = (textObj: any) => {
    return textObj[language] || textObj.en;
  };

  const settingsSections: SettingsSection[] = [
    // {
    //   id: 'general',
    //   title: {
    //     ku: 'گشتی',
    //     ar: 'عام',
    //     en: 'General'
    //   },
    //   description: {
    //     ku: 'ڕێکخستنە گشتییەکان',
    //     ar: 'الإعدادات العامة',
    //     en: 'General application settings'
    //   },
    //   icon: SettingsIcon,
    //   color: 'blue'
    // },

    // {
    //   id: 'localization',
    //   title: {
    //     ku: 'زمان و ناوچە',
    //     ar: 'اللغة والمنطقة',
    //     en: 'Localization'
    //   },
    //   description: {
    //     ku: 'ڕێکخستنی زمان و ناوچە',
    //     ar: 'إعدادات اللغة والمنطقة',
    //     en: 'Language and regional settings'
    //   },
    //   icon: Globe,
    //   color: 'purple'
    // },
    {
      id: "appearance",
      title: {
        ku: "ڕووکار",
        ar: "المظهر",
        en: "Appearance",
      },
      description: {
        ku: "ڕێکخستنی ڕووکار",
        ar: "إعدادات المظهر",
        en: "Theme and display preferences",
      },
      icon: Palette,
      color: "indigo",
    },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh operation
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  // Handle logo file change
  const handleLogoChange = (
    files: FileList | null,
    logoType: "light" | "dark"
  ) => {
    if (files && files[0]) {
      const file = files[0];

      // Validate file type - only support SVG, PNG, JPG
      const allowedTypes = [
        "image/svg+xml",
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        alerts.showError(
          language === "ku"
            ? "تکایە فایلێکی دروست هەڵبژێرە (تەنها SVG، PNG، یان JPG)"
            : language === "ar"
            ? "يرجى اختيار ملف صالح (SVG أو PNG أو JPG فقط)"
            : "Please select a valid image file (SVG, PNG, or JPG only)"
        );
        return;
      }

      if (logoType === "light") {
        setLightLogo(file);
      } else {
        setDarkLogo(file);
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (logoType === "light") {
          setLightLogoPreview(e.target?.result as string);
        } else {
          setDarkLogoPreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle theme color change
  const handleThemeColorChange = (value: string | number | boolean) => {
    setThemeColor(value as string);
  };

  // Handle logo deletion
  const handleDeleteLogo = async (logoType: "light" | "dark") => {
    try {
      setIsSaving(true);
      // The service will automatically use the current user's restaurant_id
      const result = await deleteLogo(logoType);

      if (result.success) {
        if (logoType === "light") {
          setLightLogo(null);
          setLightLogoPreview(null);
        } else {
          setDarkLogo(null);
          setDarkLogoPreview(null);
        }
        alerts.showSuccess(
          language === "ku"
            ? "لۆگۆ بە سەرکەوتوویی سڕایەوە!"
            : language === "ar"
            ? "تم حذف الشعار بنجاح!"
            : "Logo deleted successfully!"
        );
      } else {
        console.error("Failed to delete logo:", result.error);
        alerts.showError(
          language === "ku"
            ? `شکستی سڕینەوەی لۆگۆ: ${result.error}`
            : language === "ar"
            ? `فشل في حذف الشعار: ${result.error}`
            : `Failed to delete logo: ${result.error}`
        );
      }
    } catch (error) {
      console.error("Failed to delete logo:", error);
      alerts.showError(
        language === "ku"
          ? "هەڵەیەکی چاوەڕوان نەکراو ڕوویدا لە کاتی سڕینەوەی لۆگۆ."
          : language === "ar"
          ? "حدث خطأ غير متوقع أثناء حذف الشعار."
          : "An unexpected error occurred while deleting the logo."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle save appearance settings
  const handleSaveAppearance = async () => {
    setIsSaving(true);
    try {
      // Save both light and dark logos using the updated service
      // The service will automatically use the current user's restaurant_id
      const result = await saveAppearanceSettings(
        lightLogo,
        darkLogo,
        themeColor
      );

      if (result.success) {
        alerts.showSuccess(
          language === "ku"
            ? "ڕێکخستنەکانی ڕووکار بە سەرکەوتوویی پاشەکەوت کران!"
            : language === "ar"
            ? "تم حفظ إعدادات المظهر بنجاح!"
            : "Appearance settings saved successfully!"
        );

        // Clear the file inputs after successful save
        setLightLogo(null);
        setDarkLogo(null);
      } else {
        console.error("Failed to save appearance settings:", result.error);
        alerts.showError(
          language === "ku"
            ? `شکستی پاشەکەوتکردنی ڕێکخستنەکان: ${result.error}`
            : language === "ar"
            ? `فشل في حفظ الإعدادات: ${result.error}`
            : `Failed to save settings: ${result.error}`
        );
      }
    } catch (error) {
      console.error("Failed to save appearance settings:", error);
      alerts.showError(
        language === "ku"
          ? "هەڵەیەکی چاوەڕوان نەکراو ڕوویدا لە کاتی پاشەکەوتکردنی ڕێکخستنەکان."
          : language === "ar"
          ? "حدث خطأ غير متوقع أثناء حفظ الإعدادات."
          : "An unexpected error occurred while saving settings."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Load existing settings on component mount
  useEffect(() => {
    const loadAppearanceSettings = async () => {
      try {
        // The service will automatically use the current user's restaurant_id
        const settings = await fetchAppearanceSettings();
        if (settings) {
          // Load light logo
          if (settings.light_logo_url) {
            setLightLogoPreview(settings.light_logo_url);
          } else if (settings.logo_url) {
            // Fallback to legacy logo_url for backward compatibility
            setLightLogoPreview(settings.logo_url);
          }

          // Load dark logo
          if (settings.dark_logo_url) {
            setDarkLogoPreview(settings.dark_logo_url);
          }

          // Load theme color
          if (settings.theme_color) {
            setThemeColor(settings.theme_color);
          }
        }
      } catch (error) {
        console.error("Failed to load appearance settings:", error);
      }
    };

    loadAppearanceSettings();
  }, []);

  return (
    <div className={`min-h-screen ${theme.bgPrimary} py-6`}>
      <div className="w-full mx-auto space-y-6">
        {/* Header Section */}
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
                } mb-2`}
              >
                {language === "ku"
                  ? "ڕێکخستنەکان"
                  : language === "ar"
                  ? "الإعدادات"
                  : "Settings"}
              </h1>
              <p className={`text-lg ${theme.textSecondary}`}>
                {language === "ku"
                  ? "سیستەمەکەت بەڕێوە ببە و ڕێکی بخە"
                  : language === "ar"
                  ? "إدارة وتكوين إعدادات النظام"
                  : "Manage and configure your system settings"}
              </p>
            </div>
            {/* <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`p-3 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} border ${theme.borderSubCategory} hover:${theme.bgCard} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-3 rounded-xl ${theme.bgMain} ${theme.buttonTextPrimary} hover:bg-[#ff9822] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {
                  language === "ku" ? "پاشەکەوتکردن" :
                  language === "ar" ? "حفظ" :
                  "Save Changes"
                }
              </button>
            </div> */}
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.id;

            return (
              <div
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${
                  theme.topbarShadowStyle
                } border ${
                  isActive ? theme.borderMain : theme.borderSubCategory
                } cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isActive ? "ring-2 ring-[var(--bg-main)] ring-opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl ${
                      section.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : section.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : section.color === "indigo"
                        ? "bg-indigo-100 dark:bg-indigo-900/30"
                        : "bg-gray-100 dark:bg-gray-900/30"
                    }`}
                  >
                    <IconComponent
                      className={`w-6 h-6 ${
                        section.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : section.color === "purple"
                          ? "text-purple-600 dark:text-purple-400"
                          : section.color === "indigo"
                          ? "text-indigo-600 dark:text-indigo-400"
                          : theme.textSecondary
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold ${
                        theme.isDark
                          ? theme.buttonTextPrimary
                          : theme.textPrimary
                      } mb-2`}
                    >
                      {getLocalizedText(section.title)}
                    </h3>
                    <p
                      className={`${theme.textSecondary} text-sm leading-relaxed`}
                    >
                      {getLocalizedText(section.description)}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="mt-4 pt-4 border-t border-opacity-20 border-gray-300 dark:border-gray-600">
                    <div
                      className={`text-xs ${theme.textSecondary} flex items-center gap-1`}
                    >
                      <div className="w-2 h-2 bg-[var(--bg-main)] rounded-full animate-pulse"></div>
                      {language === "ku"
                        ? "هەڵبژێردراو"
                        : language === "ar"
                        ? "محدد"
                        : "Selected"}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Section Content */}
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory}`}
        >
          <div className="flex items-center gap-3 mb-6">
            {(() => {
              const activeSettingsSection = settingsSections.find(
                (s) => s.id === activeSection
              );
              if (activeSettingsSection) {
                const IconComponent = activeSettingsSection.icon;
                return (
                  <>
                    <div
                      className={`p-2 rounded-xl ${
                        activeSettingsSection.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : activeSettingsSection.color === "purple"
                          ? "bg-purple-100 dark:bg-purple-900/30"
                          : activeSettingsSection.color === "indigo"
                          ? "bg-indigo-100 dark:bg-indigo-900/30"
                          : "bg-gray-100 dark:bg-gray-900/30"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          activeSettingsSection.color === "blue"
                            ? "text-blue-600 dark:text-blue-400"
                            : activeSettingsSection.color === "purple"
                            ? "text-purple-600 dark:text-purple-400"
                            : activeSettingsSection.color === "indigo"
                            ? "text-indigo-600 dark:text-indigo-400"
                            : theme.textSecondary
                        }`}
                      />
                    </div>
                    <h2
                      className={`text-2xl font-bold ${
                        theme.isDark
                          ? theme.buttonTextPrimary
                          : theme.textPrimary
                      }`}
                    >
                      {getLocalizedText(activeSettingsSection.title)}
                    </h2>
                  </>
                );
              }
              return null;
            })()}
          </div>

          <div
            className={`${theme.bgSearchBar} rounded-2xl p-6 border ${theme.borderSubCategory}`}
          >
            {activeSection === "appearance" ? (
              <div className="space-y-8">
                {/* Logo Upload Section */}
                <div className="space-y-6">
                  <h3
                    className={`text-lg font-semibold ${
                      theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
                    }`}
                  >
                    {language === "ku"
                      ? "لۆگۆی سیستەم"
                      : language === "ar"
                      ? "شعار النظام"
                      : "System Logos"}
                  </h3>
                  <p className={`text-sm ${theme.textSecondary} mb-4`}>
                    {language === "ku"
                      ? "لۆگۆی جیاواز بۆ دۆخی ڕووناکی و تاریکی باربکە. قەبارەی پێشنیارکراو: ٢٠٠x٨٠ پیکسڵ"
                      : language === "ar"
                      ? "ارفع شعارات مختلفة للمظهر الفاتح والداكن. الحجم المقترح: 200x80 بكسل"
                      : "Upload different logos for light and dark themes. Recommended size: 200x80px"}
                  </p>

                  {/* Light Logo Section */}
                  <div className="space-y-3">
                    <h4
                      className={`text-md font-medium ${
                        theme.isDark
                          ? theme.buttonTextPrimary
                          : theme.textPrimary
                      }`}
                    >
                      {language === "ku"
                        ? "لۆگۆی ڕووکاری ڕووناک"
                        : language === "ar"
                        ? "شعار المظهر الفاتح"
                        : "Light Theme Logo"}
                    </h4>

                    {/* Light Logo Preview */}
                    {lightLogoPreview && (
                      <div
                        className={`p-4 rounded-xl ${theme.bgCard} border ${theme.borderSubCategory}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                              <img
                                src={lightLogoPreview}
                                alt="Light Logo Preview"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div>
                              <p
                                className={`font-medium ${
                                  theme.isDark
                                    ? theme.buttonTextPrimary
                                    : theme.textPrimary
                                }`}
                              >
                                {language === "ku"
                                  ? "لۆگۆ بۆ دۆخی ڕووناکی"
                                  : language === "ar"
                                  ? "معاينة الشعار الفاتح"
                                  : "Light Logo Preview"}
                              </p>
                              <p className={`text-sm ${theme.textSecondary}`}>
                                {lightLogo?.name}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteLogo("light")}
                            disabled={isSaving}
                            className={`p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={
                              language === "ku"
                                ? "سڕینەوەی لۆگۆ"
                                : language === "ar"
                                ? "حذف الشعار الفاتح"
                                : "Delete Light Logo"
                            }
                          >
                            <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    )}

                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                      onFileChange={(files) => handleLogoChange(files, "light")}
                      placeholder={
                        language === "ku"
                          ? "لۆگۆکەت باربکە"
                          : language === "ar"
                          ? "ارفع الشعار الفاتح"
                          : "Upload Light Logo"
                      }
                      icon={<ImageIcon />}
                    />
                  </div>

                  {/* Dark Logo Section */}
                  <div className="space-y-3">
                    <h4
                      className={`text-md font-medium ${
                        theme.isDark
                          ? theme.buttonTextPrimary
                          : theme.textPrimary
                      }`}
                    >
                      {language === "ku"
                        ? "لۆگۆی بۆ دۆخی تاریکی"
                        : language === "ar"
                        ? "شعار المظهر الداكن"
                        : "Dark Theme Logo"}
                    </h4>

                    {/* Dark Logo Preview */}
                    {darkLogoPreview && (
                      <div
                        className={`p-4 rounded-xl ${theme.bgCard} border ${theme.borderSubCategory}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                              <img
                                src={darkLogoPreview}
                                alt="Dark Logo Preview"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div>
                              <p
                                className={`font-medium ${
                                  theme.isDark
                                    ? theme.buttonTextPrimary
                                    : theme.textPrimary
                                }`}
                              >
                                {language === "ku"
                                  ? "لۆگۆ بۆ دۆخی تاریکی"
                                  : language === "ar"
                                  ? "معاينة الشعار الداكن"
                                  : "Dark Logo Preview"}
                              </p>
                              <p className={`text-sm ${theme.textSecondary}`}>
                                {darkLogo?.name}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteLogo("dark")}
                            disabled={isSaving}
                            className={`p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={
                              language === "ku"
                                ? "سڕینەوەی لۆگۆ"
                                : language === "ar"
                                ? "حذف الشعار الداكن"
                                : "Delete Dark Logo"
                            }
                          >
                            <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    )}

                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                      onFileChange={(files) => handleLogoChange(files, "dark")}
                      placeholder={
                        language === "ku"
                          ? "لۆگۆکەت باربکە"
                          : language === "ar"
                          ? "ارفع الشعار الداكن"
                          : "Upload Dark Logo"
                      }
                      icon={<ImageIcon />}
                    />
                  </div>
                </div>

                {/* Theme Color Section */}
                <div className="space-y-4">
                  <h3
                    className={`text-lg font-semibold ${
                      theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
                    }`}
                  >
                    {language === "ku"
                      ? "ڕەنگی سەرەکی"
                      : language === "ar"
                      ? "اللون الأساسي"
                      : "Primary Theme Color"}
                  </h3>
                  <p className={`text-sm ${theme.textSecondary} mb-4`}>
                    {language === "ku"
                      ? "ڕەنگی سەرەکی بۆ ناوەڕۆکی سیستەمەکەت هەڵبژێرە"
                      : language === "ar"
                      ? "اختر اللون الأساسي لواجهة النظام"
                      : "Choose the primary color for your system interface"}
                  </p>

                  {/* Color Preview */}
                  <div
                    className={`p-4 rounded-xl ${theme.bgCard} border ${theme.borderSubCategory}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-gray-200 dark:border-gray-600"
                        style={{ backgroundColor: themeColor }}
                      ></div>
                      <div>
                        <p
                          className={`font-medium ${
                            theme.isDark
                              ? theme.buttonTextPrimary
                              : theme.textPrimary
                          }`}
                        >
                          {language === "ku"
                            ? "ڕەنگی هەڵبژێردراو"
                            : language === "ar"
                            ? "اللون المحدد"
                            : "Selected Color"}
                        </p>
                        <p
                          className={`text-sm ${theme.textSecondary} font-mono`}
                        >
                          {themeColor.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Input
                    type="color"
                    value={themeColor}
                    onChange={handleThemeColorChange}
                    placeholder={
                      language === "ku"
                        ? "ڕەنگ هەڵبژێرە"
                        : language === "ar"
                        ? "اختر اللون"
                        : "Select Color"
                    }
                    icon={<Palette />}
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleSaveAppearance}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving
                      ? language === "ku"
                        ? "پاشەکەوتکردن..."
                        : language === "ar"
                        ? "جاري الحفظ..."
                        : "Saving..."
                      : language === "ku"
                      ? "پاشەکەوتکردن"
                      : language === "ar"
                      ? "حفظ"
                      : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.bgCard} flex items-center justify-center`}
                >
                  <SettingsIcon className={`w-8 h-8 ${theme.textSecondary}`} />
                </div>
                <h3
                  className={`text-lg font-semibold ${
                    theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
                  } mb-2`}
                >
                  {language === "ku"
                    ? "ڕێکخستنەکان لێرە دەبن"
                    : language === "ar"
                    ? "ستظهر الإعدادات هنا"
                    : "Settings content will appear here"}
                </h3>
                <p className={`${theme.textSecondary}`}>
                  {language === "ku"
                    ? "بەشێک هەڵبژێرە بۆ دەستکاریکردن"
                    : language === "ar"
                    ? "اختر قسماً للتحرير"
                    : "Select a section to configure settings"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions
        <div className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory}`}>
          <h2 className={`text-xl font-bold ${
            theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
          } mb-4`}>
            {
              language === "ku" ? "کردارە خێراکان" :
              language === "ar" ? "الإجراءات السريعة" :
              "Quick Actions"
            }
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Database,
                label: {
                  ku: "پاشەکەوتکردنی داتا",
                  ar: "نسخ احتياطي للبيانات",
                  en: "Backup Data"
                },
                color: "blue"
              },
              {
                icon: Mail,
                label: {
                  ku: "تێستی ئیمەیڵ",
                  ar: "اختبار البريد الإلكتروني",
                  en: "Test Email"
                },
                color: "purple"
              },
              {
                icon: Lock,
                label: {
                  ku: "ڕێکخستنی ئاسایش",
                  ar: "إعدادات الأمان",
                  en: "Security Check"
                },
                color: "indigo"
              },
              {
                icon: RefreshCw,
                label: {
                  ku: "نوێکردنەوەی سیستەم",
                  ar: "تحديث النظام",
                  en: "System Update"
                },
                color: "blue"
              }
            ].map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  className={`p-4 rounded-2xl ${theme.bgSearchBar} border ${theme.borderSubCategory} hover:${theme.bgCard} transition-all duration-300 hover:scale-105 group`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50' :
                      action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50' :
                      action.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50' :
                      'bg-gray-100 dark:bg-gray-900/30'
                    } transition-colors`}>
                      <IconComponent className={`w-5 h-5 ${
                        action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        action.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                        theme.textSecondary
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${theme.textSecondary} text-center`}>
                      {getLocalizedText(action.label)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Settings;
