import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/admin/contexts/AdminAuthContext";
import AdminLayout from "@/admin/layouts/AdminLayout";
import AdminLoginResponsive from "@/admin/pages/AdminLoginResponsive";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import Users from "@/admin/pages/Users";
import Categories from "@/admin/pages/Categories";
import SubCategories from "@/admin/pages/SubCategories";
import MenuItems from "@/admin/pages/MenuItems";
import Feedback from "@/admin/pages/Feedback";
import Restaurants from "@/admin/pages/Restaurants";
import NotFoundPage from "@/admin/pages/404";
import Settings from "@/admin/pages/Settings";

const AdminRoutes: React.FC = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/login" element={<AdminLoginResponsive />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<SubCategories />} />
          <Route path="menu-items" element={<MenuItems />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="users" element={<Users />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
};

export default AdminRoutes;
