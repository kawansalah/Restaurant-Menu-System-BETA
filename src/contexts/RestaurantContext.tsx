import React, { createContext, useContext, useState, ReactNode } from "react";
import { getRestaurantBySlug, Restaurant } from "@/services/restaurantService";
import { getMenuConfig } from "@/config/dynamicMenuConfig";
import { MenuConfig } from "@/types/menu";

interface RestaurantContextType {
  restaurant: Restaurant | null;
  menuConfig: MenuConfig | null;
  loading: boolean;
  error: string | null;
  loadRestaurant: (slug: string) => Promise<void>;
  clearRestaurant: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({
  children,
}) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuConfig, setMenuConfig] = useState<MenuConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRestaurant = async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      // console.log("Loading restaurant with slug:", slug);

      // Get restaurant data
      const restaurantData = await getRestaurantBySlug(slug);
      if (!restaurantData) {
        // throw new Error(`Restaurant not found with slug: ${slug}`);
      }

      // console.log("Restaurant loaded:", restaurantData);
      setRestaurant(restaurantData);

      // Get dynamic menu configuration
      const config = await getMenuConfig(slug);
      // console.log("Menu config loaded");
      setMenuConfig(config);
    } catch (err) {
      console.error("Error loading restaurant:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load restaurant"
      );
      setRestaurant(null);
      setMenuConfig(null);
    } finally {
      setLoading(false);
    }
  };

  const clearRestaurant = () => {
    setRestaurant(null);
    setMenuConfig(null);
    setError(null);
  };

  const value: RestaurantContextType = {
    restaurant,
    menuConfig,
    loading,
    error,
    loadRestaurant,
    clearRestaurant,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};

export const useRestaurantOptional = (): RestaurantContextType | null => {
  const context = useContext(RestaurantContext);
  return context || null;
};
