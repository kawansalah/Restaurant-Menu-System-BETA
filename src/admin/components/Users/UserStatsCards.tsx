import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { ActiveUsersIcon, SheildIcon, SheildUsersIcon, UsersIcon } from "@/admin/components/Icons";

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    super_admin: number;
    admin: number;
    manager: number;
    staff: number;
  };
}

interface UserStatsCardsProps {
  stats: UserStats;
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.users;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const statsData = [
    {
      title: getText("totalUsers"),
      count: stats.total,
      icon: UsersIcon,
      color: "gray",
    },
    {
      title: getText("activeUsers"),
      count: stats.active,
      icon: ActiveUsersIcon,
      color: "green",
    },
    {
      title: getText("superAdmins"),
      count: stats.byRole.super_admin,
      icon: SheildIcon,
      color: "blue",
    },
    {
      title: getText("admins"),
      count: stats.byRole.admin,
      icon: SheildUsersIcon,
      color: "yellow",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory} transition-all duration-200`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                stat.color === "blue"
                  ? "bg-[#4e98ff] dark:bg-[#4e7dff]"
                  : stat.color === "green"
                  ? "bg-[#18b577] dark:bg-[#18b577]"
                  : stat.color === "gray"
                  ? "bg-[#3f3f3f] dark:bg-[#363636]"
                  : stat.color === "yellow"
                  ? "bg-[#ffd042] dark:bg-[#ffd042]"
                  : "bg-[#4e98ff] dark:bg-[#4e7dff]"
              }`}
            >
              <stat.icon
                className={`w-8 h-8 ${
                  stat.color === "blue"
                    ? "text-white dark:text-white"
                    : stat.color === "green"
                    ? "text-white dark:text-white"
                    : stat.color === "red"
                    ? "text-white dark:text-white"
                    : stat.color === "yellow"
                    ? "text-white dark:text-white"
                    : "text-white dark:text-white"
                }`}
              />
            </div>
            <div className="flex flex-col items-start justify-between">
              <p
                className={`text-sm font-medium ${theme.textSecondary} mb-1`}
              >
                {stat.title}
              </p>
              <p
                className={`text-3xl font-bold ${
                  theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
                }`}
              >
                {stat.count}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStatsCards;