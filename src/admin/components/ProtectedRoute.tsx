import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";
import ADMIN_CONFIG from "@/admin/config/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "superadmin" | "admin" | "moderator";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--color-main)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login and save the attempted location
    return (
      <Navigate
        to={ADMIN_CONFIG.LOGIN_PATH}
        state={{ from: location }}
        replace
      />
    );
  }

  // Role-based access control (if required)
  if (requiredRole && user?.role !== requiredRole) {
    // User doesn't have required role
    return <Navigate to={ADMIN_CONFIG.DASHBOARD_PATH} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
