import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Building2,
  CheckCircle,
  XCircle,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface RestaurantStats {
  total: number;
  active: number;
  inactive: number;
  totalUsers: number;
  totalMenuItems: number;
  totalCategories: number;
}

interface RestaurantStatsCardsProps {
  stats: RestaurantStats;
  loading?: boolean;
}

const RestaurantStatsCards: React.FC<RestaurantStatsCardsProps> = ({
  stats,
  loading = false,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getActivePercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.active / stats.total) * 100);
  };

  const statsCards = [
    {
      title: {
        en: "Total Restaurants",
        ar: "إجمالي المطاعم",
        ku: "کۆی چێشتخانەکان",
      },
      value: formatNumber(stats.total),
      icon: Building2,
      color: "blue",
      trend: null,
    },
    {
      title: {
        en: "Active",
        ar: "نشط",
        ku: "چالاک",
      },
      value: formatNumber(stats.active),
      icon: CheckCircle,
      color: "green",
      trend: `${getActivePercentage()}%`,
      trendType: getActivePercentage() >= 80 ? "up" : "down",
    },
    {
      title: {
        en: "Inactive",
        ar: "غير نشط",
        ku: "ناچالاک",
      },
      value: formatNumber(stats.inactive),
      icon: XCircle,
      color: "red",
      trend: `${100 - getActivePercentage()}%`,
      trendType: stats.inactive > stats.active * 0.2 ? "up" : "down",
    },
    {
      title: {
        en: "Total Users",
        ar: "إجمالي المستخدمين",
        ku: "کۆی بەکارهێنەران",
      },
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "purple",
      trend: null,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-[#4e98ff] dark:bg-[#4e7dff]",
      green: "bg-[#18b577] dark:bg-[#18b577]",
      red: "bg-[#ef4444] dark:bg-[#dc2626]",
      yellow: "bg-[#ffd042] dark:bg-[#ffd042]",
      purple: "bg-[#8b5cf6] dark:bg-[#7c3aed]",
      indigo: "bg-[#6366f1] dark:bg-[#4f46e5]",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`
              ${theme.bgButtomNavigation}
              rounded-2xl sm:rounded-3xl p-4 sm:p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory}
              animate-pulse
            `}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`h-10 w-10 sm:h-12 sm:w-12 ${theme.isDark ? theme.bgCard : theme.bgRating} rounded-xl sm:rounded-2xl flex-shrink-0`}></div>
              <div className="flex flex-col items-start justify-between min-w-0 flex-1">
                <div className={`h-3 sm:h-4 ${theme.isDark ? theme.bgCard : theme.bgRating} rounded w-16 sm:w-20 mb-2`}></div>
                <div className={`h-6 sm:h-8 ${theme.isDark ? theme.bgCard : theme.bgRating} rounded w-12 sm:w-16`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        const colorClass = getColorClasses(card.color);
        const title =
          card.title[language as keyof typeof card.title] || card.title.en;

        return (
          <div
            key={index}
            className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  colorClass
                }`}
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-white" />
              </div>
              <div className="flex flex-col items-start justify-between min-w-0 flex-1">
                <div className="flex items-center justify-between w-full mb-1">
                  <p
                    className={`text-xs sm:text-sm font-medium ${theme.textSecondary} truncate`}
                  >
                    {title}
                  </p>
                  {card.trend && (
                    <div className="flex items-center ml-2 flex-shrink-0">
                      {card.trendType === "up" && (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      )}
                      {card.trendType === "down" && (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          card.trendType === "up"
                            ? "text-green-600 dark:text-green-400"
                            : card.trendType === "down"
                            ? "text-red-600 dark:text-red-400"
                            : theme.textSecondary
                        }`}
                      >
                        {card.trend}
                      </span>
                    </div>
                  )}
                </div>
                <p
                  className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                    theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
                  } truncate w-full`}
                >
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RestaurantStatsCards;