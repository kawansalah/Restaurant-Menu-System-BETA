import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  Home,
  Category,
  SubCategory,
  MenuItems,
  Users,
  Feedback,
  Settings as SettingsIcon,
  Restaurant
} from "@/admin/components/Icons";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageDropdown from "@/components/LanguageDropdown";
import adminLogoDark from "@/assets/logo/MyMenu.svg";
import adminLogoLight from "@/assets/logo/My Menu Dark.svg";

interface NavigationItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: {
    ku: string;
    ar: string;
    en: string;
  };
}

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const { user } = useAdminAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      path: "/admin",
      icon: Home,
      label: {
        ku: "سەرەتا",
        ar: "الرئيسية",
        en: "Home",
      },
    },
    {
      path: "/admin/categories",
      icon: Category,
      label: {
        ku: "بەشەکان",
        ar: "الفئات",
        en: "Categories",
      },
    },
    {
      path: "/admin/subcategories",
      icon: SubCategory,
      label: {
        ku: "جۆرەکان",
        ar: "صِنف",
        en: "SubCategories",
      },
    },
    {
      path: "/admin/menu-items",
      icon: MenuItems,
      label: {
        ku: "خواردنەکان",
        ar: "القائمة",
        en: "Menu",
      },
    },
    {
      path: "/admin/feedback",
      icon: Feedback,
      label: {
        ku: "فیدباک",
        ar: "التعليقات",
        en: "Feedback",
      },
    },
    {
      path: "/admin/users",
      icon: Users,
      label: {
        ku: "بەکارهێنەران",
        ar: "المستخدمون",
        en: "Users",
      },
    },
    // Only show Restaurants for super_admin
    ...(user?.role === "super_admin" ? [{
      path: "/admin/restaurants",
      icon: Restaurant,
      label: {
        ku: "چێشتخانەکان",
        ar: "المطاعم",
        en: "Restaurants",
      },
    }] : []),
  ];

  const getLocalizedLabel = (item: NavigationItem) => {
    return item.label[language] || item.label.en;
  };

  const isActiveRoute = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const title ={
    ku: "مێنوەکەم",
    ar: "قائمتي",
    en: "My Menu",
  }

  return (
    <header
      className={`
        sticky top-4 z-50 mx-auto max-w-7xl
        ${theme.bgTopbar} border-1 ${theme.borderCategory} 
        ${className}
      `}
      style={{ boxShadow: "10px 4px 20px rgba(0, 0, 0, 0.11)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-5">
        <div className="relative h-16">
          {/* Logo/Brand - Positioned on the right */}
          <div className={`absolute ${language === "ku" || language === "ar" ? "right-0" : "left-0"} top-1/2 transform -translate-y-1/2`}>
            <Link
              to="/admin"
              className={`flex items-center gap-2 text-xl font-bold ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              } hover:${theme.textMain} transition-colors`}
            >
              <img
                src={theme.isDark ? adminLogoLight : adminLogoDark}
                className="w-13 h-13"
              />
              <span>{title[language]}</span>
            </Link>
          </div>

          {/* Desktop & Tablet Navigation - Icons Only with Tooltips - Positioned in center */}
          <nav className="hidden md:flex items-center space-x-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);

              return (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-full
                      transition-all duration-200 font-bold border
                      ${
                        isActive
                          ? `${theme.bgMain} ${
                              theme.isDark
                                ? theme.buttonTextPrimary
                                : theme.buttonTextPrimary
                            } ${theme.borderMain} `
                          : `${
                              theme.isDark
                                ? theme.textSecondary
                                : theme.textPrimary
                            } ${theme.bgSearchBar}  ${
                              theme.borderSubCategory
                            }  ${
                              theme.isDark
                                ? theme.itemHover
                                : "hover:bg-[#ececec]"
                            }`
                      }
                    `}
                  >
                    <Icon className="transition-colors duration-200 h-6 w-6" />
                  </Link>

                  {/* Custom Tooltip */}
                  <div
                    className={`
                    absolute top-full left-1/2 transform -translate-x-1/2 mt-3
                    px-3 py-2 text-sm font-medium rounded-lg shadow-lg
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    pointer-events-none whitespace-nowrap z-50
                    ${theme.bgCard} ${
                      theme.isDark ? theme.textSecondary : theme.textPrimary
                    } ${theme.borderCategory}
                    border backdrop-blur-sm
                  `}
                  >
                    {getLocalizedLabel(item)}
                    {/* Tooltip Arrow */}
                    <div
                      className={`
                      absolute bottom-full left-1/2 transform -translate-x-1/2
                      border-l-4 border-r-4 border-b-4 border-transparent
                      ${
                        theme.isDark
                          ? "border-b-[var(--bg-card)]"
                          : "border-b-[var(--bg-card)]"
                      }
                    `}
                    ></div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right Side Controls - Positioned on the left */}
          <div className={`absolute ${language === "ku" || language === "ar" ? "left-0" : "right-0"} top-1/2 transform -translate-y-1/2 flex items-center space-x-1 md:space-x-3`}>
            {/* Language Dropdown */}
            <div className="hidden md:block">
              <LanguageDropdown />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Settings Button */}
            <div className="relative group">
              <Link
                to="/admin/settings"
                className={`
                  hidden md:flex items-center justify-center w-10 h-10 rounded-full
                  transition-all duration-200 border
                  ${
                    isActiveRoute("/admin/settings")
                      ? `${theme.bgMain} ${
                          theme.isDark
                            ? theme.buttonTextPrimary
                            : theme.buttonTextPrimary
                        } ${theme.borderMain}`
                      : `${
                          theme.isDark ? theme.textSecondary : theme.textPrimary
                        } ${theme.bgSearchBar} ${theme.borderSubCategory} ${
                          theme.isDark ? theme.itemHover : "hover:bg-[#ececec]"
                        }`
                  }
                `}
              >
                <SettingsIcon className="h-5 w-5" />
              </Link>

              {/* Settings Tooltip */}
              <div
                className={`
                absolute top-full left-1/2 transform -translate-x-1/2 mt-3
                px-3 py-2 text-sm font-medium rounded-lg shadow-lg
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                pointer-events-none whitespace-nowrap z-50
                ${theme.bgCard} ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                } ${theme.borderCategory}
                border backdrop-blur-sm
              `}
              >
                {language === "ku"
                  ? "ڕێکخستنەکان"
                  : language === "ar"
                  ? "الإعدادات"
                  : "Settings"}
                {/* Tooltip Arrow */}
                <div
                  className={`
                  absolute bottom-full left-1/2 transform -translate-x-1/2
                  border-l-4 border-r-4 border-b-4 border-transparent
                  ${
                    theme.isDark
                      ? "border-b-[var(--bg-card)]"
                      : "border-b-[var(--bg-card)]"
                  }
                `}
                ></div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`
                md:hidden p-2 rounded-lg
                ${theme.textSecondary} hover:${theme.bgSearchBar}
                transition-colors duration-200
              `}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`
            md:hidden transition-all duration-300 ease-in-out
            ${theme.borderCategory} 
            ${
              isMobileMenuOpen
                ? "max-h-[600px] opacity-100 border-t"
                : "max-h-0 opacity-0 border-t-0"
            }
            overflow-hidden
          `}
          
        >
          <div
            className={`
              py-4 transform transition-all duration-300 ease-in-out
              ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }
            `}
          >
            <nav className="space-y-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);

                return (
                  <div
                    key={item.path}
                    className={`
                      transform transition-all duration-300 ease-in-out
                      ${
                        isMobileMenuOpen
                          ? "translate-x-0 opacity-100"
                          : language === "ar" || language === "ku"
                          ? "translate-x-4 opacity-0"
                          : "-translate-x-4 opacity-0"
                      }
                    `}
                    style={{
                      transitionDelay: isMobileMenuOpen
                        ? `${index * 50}ms`
                        : "0ms",
                    }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center px-4 py-3 rounded-full
                        transition-all duration-200 hover:scale-[1.02]
                        ${
                          isActive
                            ? `${theme.bgMain} ${
                                theme.isDark
                                  ? theme.buttonTextPrimary
                                  : theme.buttonTextPrimary
                              } ${theme.borderMain}`
                            : `${theme.textSecondary} hover:${theme.bgSearchBar} ${theme.itemHover}`
                        }
                      `}
                    >
                      <Icon
                        className={`
                          ${
                            language === "ar" || language === "ku"
                              ? "ml-3"
                              : "mr-3"
                          }
                          transition-all duration-200 h-6 w-6 transform
                          ${
                            isActive
                              ? `scale-110 ${
                                  theme.isDark
                                    ? theme.buttonTextPrimary
                                    : theme.buttonTextPrimary
                                }`
                              : `scale-100 ${theme.textSecondary}`
                          }
                        `}
                      />
                      <span className="font-medium transition-all duration-200">
                        {getLocalizedLabel(item)}
                      </span>
                    </Link>
                  </div>
                );
              })}

              {/* Mobile Settings Link */}
              <div
                className={`
                  transform transition-all duration-300 ease-in-out
                  ${
                    isMobileMenuOpen
                      ? "translate-x-0 opacity-100"
                      : language === "ar" || language === "ku"
                      ? "translate-x-4 opacity-0"
                      : "-translate-x-4 opacity-0"
                  }
                `}
                style={{
                  transitionDelay: isMobileMenuOpen
                    ? `${navigationItems.length * 50}ms`
                    : "0ms",
                }}
              >
                <Link
                  to="/admin/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-full
                    transition-all duration-200 hover:scale-[1.02]
                    ${
                      isActiveRoute("/admin/settings")
                        ? `${theme.bgMain} ${
                            theme.isDark
                              ? theme.textPrimary
                              : theme.buttonTextPrimary
                          } ${theme.borderMain} shadow-md`
                        : `${theme.textSecondary} hover:${theme.bgSearchBar} ${theme.itemHover}`
                    }
                  `}
                >
                  <SettingsIcon
                    className={`
                      ${
                        language === "ar" || language === "ku" ? "ml-3" : "mr-3"
                      }
                      transition-all duration-200 h-6 w-6 transform
                      ${
                        isActiveRoute("/admin/settings")
                          ? `scale-110 ${
                              theme.isDark
                                ? theme.textPrimary
                                : theme.buttonTextPrimary
                            }`
                          : `scale-100 ${theme.textSecondary}`
                      }
                    `}
                  />
                  <span className="font-medium transition-all duration-200">
                    {language === "ku"
                      ? "ڕێکخستنەکان"
                      : language === "ar"
                      ? "الإعدادات"
                      : "Settings"}
                  </span>
                </Link>
              </div>

              {/* Mobile Language Dropdown */}
              <div
                className={`
                  md:hidden transform transition-all duration-300 ease-in-out
                  ${
                    isMobileMenuOpen
                      ? "translate-x-0 opacity-100"
                      : language === "ar" || language === "ku"
                      ? "translate-x-4 opacity-0"
                      : "-translate-x-4 opacity-0"
                  }
                `}
                style={{
                  transitionDelay: isMobileMenuOpen
                    ? `${(navigationItems.length + 1) * 50}ms`
                    : "0ms",
                }}
              >
                <div className={`h-fit border-t ${theme.borderCategory} pt-5 `}>
                  <LanguageDropdown isMobile={true} />
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
