import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import ADMIN_CONFIG from "@/admin/config/routes";
import {
  Analytics,
  Logout,
  Star,
  Category,
  SubCategory,
  Users,
  Feedback,
  Settings,
} from "@/admin/components/Icons";

export default function AdminDashboard() {
  const { logout, user } = useAdminAuth();
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Mock data for dashboard stats
  const dashboardStats = [
    {
      title: {
        ku: "کۆی سەردانیکەران",
        ar: "عدد الزيارات",
        en: "Total visitors",
      },
      value: "12,345",
      change: "+12.5%",
      icon: Analytics,
      color: "green",
      trend: "up",
    },
    {
      title: {
        ku: "بەشی ناسێنراو",
        ar: "عدد الفئات",
        en: "Category",
      },
      value: "8",
      // change: "+8.2%",
      icon: SubCategory,
      color: "blue",
      trend: "up",
    },
    {
      title: {
        ku: "جۆری ناسێنراو",
        ar: "عدد الفئات الفرعية",
        en: "SubCategory",
      },
      value: "24",
      // change: "+5.1%",
      icon: Category,
      color: "purple",
      // trend: "up",
    },
    {
      title: {
        ku: "هەڵسەنگاندن",
        ar: "التقييمات",
        en: "Reviews",
      },
      value: "4.8",
      change: "+0.3",
      icon: Star,
      color: "yellow",
      trend: "up",
    },
  ];

  const quickActions = [
    {
      icon: Users,
      label: {
        ku: "بەڕێوەبردنی بەکارهێنەران",
        ar: "إدارة المستخدمين",
        en: "Manage Users",
      },
      path: ADMIN_CONFIG.USERS_PATH,
    },
    {
      icon: Feedback,
      label: {
        ku: "بینینی فیدباک",
        ar: "عرض التعليقات",
        en: "View Feedback",
      },
      path: ADMIN_CONFIG.FEEDBACK_PATH,
    },
    {
      path: ADMIN_CONFIG.SETTINGS_PATH,
      icon: Settings,
      label: {
        ku: "ڕێکخستنەکان",
        ar: "الإعدادات",
        en: "Settings",
      },
    },
  ];

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  const getLocalizedText = (textObj: any) => {
    return textObj[language] || textObj.en;
  };

  return (
    <div className="space-y-8 mt-6">
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
                ? "سڵاو، بەخێربێیتەوە"
                : language === "ar"
                ? "مرحباً"
                : "Welcome"}
              , {user?.full_name || "Admin"}
            </h1>
            <p className={`text-lg ${theme.textSecondary}`}>
              {language === "ku"
                ? "لێرەوە دەتوانی مێنوی ڕێستۆرانتەکەت ڕێک بخەیت."
                : language === "ar"
                ? "كيف حالك اليوم؟ ابدأ إدارة مطعمك من هنا."
                : "How are you today? Start managing your restaurant from here."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-full ${theme.bgSearchBar} border ${theme.borderSubCategory}`}
            >
              <span className={`text-sm font-medium ${theme.textSecondary}`}>
                {new Date().toLocaleDateString(
                  language === "ku"
                    ? "ku-IQ"
                    : language === "ar"
                    ? "ar-SA"
                    : "en-US"
                )}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-[#FF4D4F] hover:bg-[#e25355] text-white px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {language === "ku"
                ? "دەرچوون"
                : language === "ar"
                ? "تسجيل خروج"
                : "Logout"}
              <Logout className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory} transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  stat.color === "green"
                    ? "bg-[#18b577] dark:bg-[#18b577]"
                    : stat.color === "blue"
                    ? "bg-[#4e98ff] dark:bg-[#4e7dff]"
                    : stat.color === "purple"
                    ? "bg-[#8b5cf6] dark:bg-[#8b5cf6]"
                    : stat.color === "yellow"
                    ? "bg-[#ffd042] dark:bg-[#ffd042]"
                    : "bg-[#4e98ff] dark:bg-[#4e7dff]"
                }`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${theme.textSecondary} mb-1`}
                >
                  {getLocalizedText(stat.title)}
                </p>
                <div className="flex items-center gap-2">
                  <p
                    className={`text-2xl font-bold ${
                      theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
                    }`}
                  >
                    {stat.value}
                  </p>
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div
          className={`lg:col-span-2 ${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl font-bold ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {language === "ku"
                ? "بەشەکان"
                : language === "ar"
                ? "الفئات"
                : "Category"}
            </h2>
            <button
              className={`p-2 rounded-full ${theme.bgMain} ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              } hover:bg-[#ff9822] dark:hover:bg-[#ff9822] transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={theme.buttonTextPrimary}
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div className="space-y-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`p-4 rounded-2xl ${theme.bgSearchBar} border ${theme.borderSubCategory}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className={`${theme.textSecondary} text-sm`}>
                    {language === "ku"
                      ? "بەشەکان"
                      : language === "ar"
                      ? "الفئات"
                      : "Category"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory}`}
        >
          <h2
            className={`text-xl font-bold ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            } mb-6`}
          >
            {language === "ku"
              ? "کردارە خێراکان"
              : language === "ar"
              ? "الإجراءات السريعة"
              : "Quick Actions"}
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl ${
                  theme.bgSearchBar
                } border ${theme.borderSubCategory} ${
                  theme.isDark ? "hover:bg-[#252525]" : "hover:bg-[#ececec]"
                } transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
              >
                <action.icon className={`w-5 h-5 ${theme.textSecondary}`} />
                <span className={`text-sm font-medium ${theme.textSecondary}`}>
                  {getLocalizedText(action.label)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl font-bold ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {language === "ku"
                ? "جۆرەکان"
                : language === "ar"
                ? "الفئة الفرعية"
                : "SubCategory"}
            </h2>
            <button
              className={`p-2 rounded-full ${theme.bgMain} ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              } hover:bg-[#ff9822] dark:hover:bg-[#ff9822] transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={theme.buttonTextPrimary}
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((order) => (
              <div
                key={order}
                className={`p-4 rounded-2xl ${theme.bgSearchBar} border ${theme.borderSubCategory}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme.textSecondary}`}>
                      {language === "ku"
                        ? "جۆرەکان لێرە دەبن"
                        : language === "ar"
                        ? "الفئة الفرعية هنا"
                        : "SubCategory here"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory}`}
        >
          <h2
            className={`text-xl font-bold ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            } mb-6`}
          >
            {language === "ku"
              ? "بەش"
              : language === "ar"
              ? "مخطط المبيعات"
              : "Sales Chart"}
          </h2>
          <div
            className={`h-[calc(100%-50px)] flex items-center justify-center ${theme.bgSearchBar} rounded-2xl border ${theme.borderSubCategory}`}
          ></div>
        </div>
      </div> */}
    </div>
  );
}
