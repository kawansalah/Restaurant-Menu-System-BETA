import React from "react";

import PaginatedMenuItemList from "@/admin/components/MenuItems/PaginatedMenuItemList";

/**
 * Menu Items Management Page
 *
 * This page provides a complete interface for managing restaurant menu items.
 * Features include:
 * - View all menu items with pagination
 * - Add new menu items with image upload
 * - Edit existing menu items
 * - Toggle availability status
 * - Delete menu items with confirmation
 * - Search and filter functionality
 * - Mobile-responsive design
 * - Bulk actions for multiple items
 * - Statistics dashboard
 */
const MenuItems: React.FC = () => {

  return (
    <div className="py-6">
      <div className="w-full mx-auto space-y-6">
        <PaginatedMenuItemList />
      </div>
    </div>
  );
};

export default MenuItems;
