import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { Navigate } from "react-router-dom";
import PaginatedRestaurantList from "@/admin/components/Restaurants/PaginatedRestaurantList";

const Restaurants: React.FC = () => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const { user } = useAdminAuth();
  const config = defaultAdminConfig.ui.restaurants;

  // Only super_admin can access this page
  if (!user || user.role !== "super_admin") {
    return <Navigate to="/admin" replace />;
  }

  const getLoadingText = () => {
    const loadingConfig = defaultAdminConfig.ui.loading;
    return loadingConfig[language] || loadingConfig.en || "Loading...";
  };

  return (
    <div className={`min-h-screen ${theme.bgPrimary} p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        <PaginatedRestaurantList />
      </div>
    </div>
  );
};

export default Restaurants;