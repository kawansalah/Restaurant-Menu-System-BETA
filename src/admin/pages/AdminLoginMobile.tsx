import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { defaultAdminConfig } from "../config/adminConfig";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageDropdown from "@/components/LanguageDropdown";
import Input from "@/admin/components/Input";
import Button from "@/components/Button";

const AdminLoginMobile: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const { language, isRTL } = useLanguage();
  const themeClasses = useThemeClasses();
  const config = defaultAdminConfig;

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const t = config.ui.login;

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    // setCredentialsDefault();
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Check for empty inputs
    if (!credentials.username.trim()) {
      setUsernameError(t.usernameRequired[language]);
      setIsSubmitting(false);
      return;
    } else {
      setUsernameError("");
    }

    if (!credentials.password.trim()) {
      setPasswordError(t.passwordRequired[language]);
      setIsSubmitting(false);
      return;
    } else {
      setPasswordError("");
    }

    try {
      const success = await login(credentials);
      if (!success) {
        setError(t.invalidCredentials[language]);
      }
    } catch (error) {
      setError(t.loginFailed[language]);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getPasswordIcon = (color: string, size: number) => {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C9.23858 2 7 4.23858 7 7V8.41604C5.2341 9.1876 4 10.9497 4 13V17C4 19.7614 6.23858 22 9 22H15C17.7614 22 20 19.7614 20 17V13C20 10.9497 18.7659 9.1876 17 8.41604V7C17 4.23858 14.7614 2 12 2ZM15 8V7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7V8H15ZM13 15.7324C13.5978 15.3866 14 14.7403 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 14.7403 10.4022 15.3866 11 15.7324V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V15.7324Z"
            fill={color}
            width={size}
            height={size}
          ></path>
      </svg>
    );
  };
  
  const getUsernameIcon = (color: string, size: number) => {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6ZM17.8946 17.4473L17.0002 17C17.8946 17.4473 17.8939 17.4487 17.8939 17.4487L17.8932 17.4502L17.8916 17.4532L17.8882 17.46L17.88 17.4756C17.8739 17.4871 17.8666 17.5004 17.858 17.5155C17.8409 17.5458 17.8186 17.5832 17.7906 17.6267C17.7346 17.7138 17.6558 17.8254 17.5497 17.9527C17.3369 18.208 17.0163 18.5245 16.5549 18.8321C15.6228 19.4534 14.1751 20 12.0001 20C8.31494 20 6.76549 18.4304 6.26653 17.7115C5.96463 17.2765 5.99806 16.7683 6.18066 16.4031C6.91705 14.9303 8.42234 14 10.069 14H13.7642C15.5134 14 17.1124 14.9883 17.8947 16.5528C18.0354 16.8343 18.0354 17.1657 17.8946 17.4473Z"
            fill={color}
            width={size}
            height={size}
          ></path>
      </svg>
    );
  };
  
  const getLoginIcon = (color: string, size: number) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.1839 4.04199L13.694 2.35043C12.8859 2.08334 12.0777 2.17237 11.4491 2.61752C11.1798 2.79558 11.0002 2.97364 10.8206 3.1517H7.40833C6.0614 3.1517 4.89404 4.30908 4.89404 5.64453V6.53481C4.89404 6.89093 5.16344 7.24705 5.61241 7.24705C6.0614 7.24705 6.33078 6.89093 6.33078 6.53481V5.64453C6.33078 5.02132 6.86955 4.57617 7.40833 4.57617H10.3716V17.4854H7.40833C6.77976 17.4854 6.33078 16.9513 6.33078 16.417V15.5268C6.33078 15.1707 6.0614 14.8146 5.61241 14.8146C5.16344 14.8146 4.89404 15.0816 4.89404 15.4378V16.3281C4.89404 17.6635 5.9716 18.8208 7.40833 18.8208H10.8206C11.0002 18.999 11.1798 19.266 11.3594 19.3551C11.8084 19.6222 12.2573 19.8002 12.7961 19.8002C13.0654 19.8002 13.4247 19.7111 13.694 19.6222L18.1839 17.9305C19.1716 17.5745 19.8002 16.6842 19.8002 15.6158V6.26773C19.8002 5.28841 19.0818 4.30908 18.1839 4.04199Z"
          fill="white"
        />
        <path
          d="M6.06118 12.3218C5.79179 12.5889 5.79179 13.0341 6.06118 13.3012C6.15097 13.3902 6.33057 13.4792 6.51016 13.4792C6.68975 13.4792 6.86934 13.3902 6.95913 13.3012L8.75505 11.5206C8.84485 11.4315 8.84485 11.3426 8.93464 11.3426C8.93464 11.2535 9.02444 11.1645 9.02444 11.0755C9.02444 10.9864 9.02444 10.8974 8.93464 10.8084C8.93464 10.7194 8.84485 10.6303 8.75505 10.6303L6.95913 8.84973C6.68975 8.58264 6.24077 8.58264 5.97138 8.84973C5.70199 9.11682 5.70199 9.56198 5.97138 9.82906L6.59995 10.4523H2.91832C2.55913 10.4523 2.19995 10.7194 2.19995 11.1645C2.19995 11.6097 2.46934 11.8767 2.91832 11.8767H6.68975L6.06118 12.3218Z"
          fill={color}
        />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--bg-main)] border-t-transparent"></div>
          <p className={`${themeClasses.textSecondary} text-lg font-medium`}>
            {config.ui.loading[language]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen h-full w-full flex justify-center items-center ${themeClasses.bgPrimary} transition-colors duration-300 px-4 sm:px-6`}
    >
      {/* Theme and Language Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-4 z-10">
        <ThemeToggle />
        <LanguageDropdown isReverce={true} />
      </div>

      <div
        className={`flex flex-col items-center justify-center border-1 ${themeClasses.borderBottomNav} ${themeClasses.bgTopbar} w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden p-4 sm:p-6 xs:pb-8 rounded-3xl sm:rounded-[30px] ${themeClasses.topbarShadowStyle} my-20`}
      >
        {/* Branding Section - Top on Mobile */}
        <div
          className={`w-full flex flex-col justify-center items-center px-4 sm:px-6 py-6 sm:py-8 ${themeClasses.isDark ? themeClasses.bgButtomNavigation : "bg-[#F5F5F5]"} rounded-3xl sm:rounded-2xl mb-6`}
        >
          <img
            src={themeClasses.isDark ? t.login_image_dark : t.login_image}
            alt="Restaurant Admin"
            className="max-w-[200px] sm:max-w-[250px] md:max-w-[300px] max-h-[150px] sm:max-h-[200px] object-contain"
          />
          <div className="mt-4 sm:mt-6 text-center">
            <h2
              className={`${
                themeClasses.isDark
                  ? themeClasses.buttonTextPrimary
                  : themeClasses.textPrimary
              } text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2`}
            >
              Restaurant Menu System
            </h2>
            <p
              className={`${
                themeClasses.isLight
                  ? themeClasses.textSecondary
                  : themeClasses.textTertiary
              } text-xs sm:text-sm`}
            >
              Manage your restaurant menu with ease
            </p>
          </div>
        </div>

        {/* Login Form Section - Bottom on Mobile */}
        <div
          className={`w-full flex flex-col justify-center px-4 sm:px-6 md:px-8 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <div className="w-full mb-6 sm:mb-8">
            <h1
              className={`${
                themeClasses.isDark
                  ? themeClasses.buttonTextPrimary
                  : themeClasses.textPrimary
              } text-2xl sm:text-3xl font-bold mb-2 text-center`}
            >
              {t.hello[language]}
            </h1>
            <p
              className={`${themeClasses.textSecondary} text-sm sm:text-base font-normal text-center`}
            >
              {t.subtitle[language]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 sm:gap-6">
            <div className="space-y-1">
              <Input
                id="username"
                type="text"
                size="lg"
                value={credentials.username}
                onChange={(value) => {
                  setCredentials((prev) => ({ ...prev, username: value as string }));
                }}
                placeholder={t.username[language]}
                icon={getUsernameIcon("currentColor", 20)}
                iconPosition="left"
                error={usernameError}
              />
            </div>

            <div className="space-y-1">
              <Input
                id="password"
                type="password"
                size="lg"
                value={credentials.password}
                onChange={(value) => {
                  setCredentials((prev) => ({ ...prev, password: value as string }));
                }}
                placeholder={t.password[language]}
                icon={getPasswordIcon("currentColor", 20)}
                iconPosition="left"
                error={passwordError}
              />
            </div>

            {error && (
              <div
                className={`p-3 rounded-full bg-[rgba(251,94,94,0.45)] border border-[rgba(255,77,77,0.67)] ${
                  themeClasses.isDark
                    ? "text-[rgb(255,255,255)]"
                    : "text-[rgb(177,33,33)]"
                } text-sm`}
              >
                {error}
              </div>
            )}

            <div className="mt-4 sm:mt-6 px-2 sm:px-4">
              <Button type="submit" onClick={() => handleSubmit}>
                {t.signIn[language]} {getLoginIcon("currentColor", 20)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginMobile;