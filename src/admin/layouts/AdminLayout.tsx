import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import Navigation from "@/admin/components/Navigation";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import ADMIN_CONFIG from "@/admin/config/routes";

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const theme = useThemeClasses();

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme.bgPrimary}`}
      >
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--color-main)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_CONFIG.LOGIN_PATH} replace />;
  }

  return (
    <div className={`min-h-screen px-6 ${theme.bgPrimary}`}>
      <Navigation className="rounded-3xl py-2" />
      <div className="flex justify-center items-center">
        {/* <AdminSidebar /> */}
        <main className="flex-1 py-6 max-w-7xl 2xl:w-full xl:w-[95%] lg:w-[95%] md:w-[90%] sm:w-[90%] xs:w-[95%]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
