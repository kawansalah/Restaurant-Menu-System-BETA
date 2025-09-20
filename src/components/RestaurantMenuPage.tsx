import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useRestaurant } from "@/contexts/RestaurantContext";

interface RestaurantMenuPageProps {
  children: React.ReactNode;
}

const RestaurantMenuPage: React.FC<RestaurantMenuPageProps> = ({
  children,
}) => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const { restaurant, loading, error, loadRestaurant } = useRestaurant();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (restaurantSlug && initialLoad) {
      loadRestaurant(restaurantSlug);
      setInitialLoad(false);
    }
  }, [restaurantSlug, loadRestaurant, initialLoad]);

  // Show loading state
  if (loading || initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--bg-main)]"></div>
      </div>
    );
  }

  // Show error or redirect if restaurant not found
  if (error || !restaurant) {
    console.error("Restaurant not found or error:", error);
    return <Navigate to="/not-found" replace />;
  }

  // Restaurant loaded successfully, render children
  return <>{children}</>;
};

export default RestaurantMenuPage;
