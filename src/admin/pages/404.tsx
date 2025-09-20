import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Users, Folder } from "lucide-react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotFoundUtils } from "@/admin/utils/notFoundUtils";
import ThemeToggle from "@/components/ThemeToggle";

const NotFoundPage: React.FC = () => {
  const theme = useThemeClasses();

  const { direction, isRTL } = useLanguage();
  const { getText } = useNotFoundUtils();


  return (
    <div
      className={`min-h-screen ${theme.bgPrimary} flex flex-col relative`}
      dir={direction}
    >
      {/* Theme Toggle - positioned in top-right corner */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-12">
            {/* <div className="mb-8">
              <img
                src={logoSrc}
                alt="Admin Logo"
                className="w-20 h-20 object-contain opacity-80"
              />
            </div> */}

            {/* Error Card */}
            <div
              className={`w-full ${theme.bgCard} rounded-[40px] p-8 ${theme.topbarShadowStyle} border border-[var(--category-stroke)]`}
            >
              {/* 404 Number */}
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold ${theme.textMain} mb-2`}>
                  {getText("subtitle")}
                </div>
                <div
                  className={`text-2xl font-bold ${
                    theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
                  } mb-4`}
                >
                  {getText("title")}
                </div>
                <div
                  className={`text-base ${theme.textSecondary} leading-relaxed`}
                >
                  {getText("description")}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-8">
                {/* Primary Button - Go to Dashboard */}
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center justify-center w-full py-[18px] px-6 rounded-[40px] text-xl font-bold transition-all ease-in-out duration-200 cursor-pointer border-none outline-none focus:outline-none ${theme.bgMain} ${theme.buttonTextPrimary} ${theme.buttonShadowPrimary} hover:translate-y-[2px] ${theme.buttonShadowPrimaryHover} active:translate-y-[6px] active:shadow-[0px_0px_0px_0px_#e6bb00] text-center gap-2`}
                >
                  <Home className={`w-5 h-5`} />
                  {getText("goToDashboard")}
                </Link>

                {/* Secondary Options */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className={`h-px flex-1 ${theme.bgSeparator}`}></div>
                  <span className={`text-sm ${theme.textSecondary}`}>
                    {getText("helpText")}
                  </span>
                  <div className={`h-px flex-1 ${theme.bgSeparator}`}></div>
                </div>

                {/* Admin Navigation Links */}
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => window.history.back()}
                    className={`py-3 px-6 rounded-[30px] text-center transition-all duration-200 ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar} border border-[var(--category-stroke)] flex items-center justify-center gap-2`}
                  >
                    <ArrowLeft
                      className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                    />
                    {getText("goBack")}
                  </button>
                  <Link
                    to="/admin/users"
                    className={`py-3 px-6 rounded-[30px] text-center transition-all duration-200 ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar} border border-[var(--category-stroke)] flex items-center justify-center gap-2`}
                  >
                    <Users className={`w-4 h-4`} />
                    User Management
                  </Link>
                  <Link
                    to="/admin/categories"
                    className={`py-3 px-6 rounded-[30px] text-center transition-all duration-200 ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar} border border-[var(--category-stroke)] flex items-center justify-center gap-2`}
                  >
                    <Folder className={`w-4 h-4`} />
                    Category Management
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className={`text-sm ${theme.textSecondary} opacity-70`}>
          © 2025 Admin Panel - {getText("support")}
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
