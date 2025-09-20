import React from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import Menu from "@/components/Menu";

interface DynamicMenuProps {
  onItemClick: () => void;
}

const DynamicMenu: React.FC<DynamicMenuProps> = ({ onItemClick }) => {
  const { menuConfig, loading, error } = useRestaurant();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--bg-main)]"></div>
      </div>
    );
  }

  if (error || !menuConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Menu
          </h2>
          <p className="text-gray-600">
            {error || "Failed to load menu configuration"}
          </p>
        </div>
      </div>
    );
  }

  return <Menu config={menuConfig} onItemClick={onItemClick} />;
};

export default DynamicMenu;
