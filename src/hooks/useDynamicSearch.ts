import { useState, useCallback } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { searchMenuItems, MenuItemWithLabel } from "@/services/menuItemService";
import { MenuItem } from "@/types/menu";

export const useDynamicSearch = () => {
  const { restaurant } = useRestaurant();
  const { language } = useLanguage();
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      if (!restaurant || !query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const results = await searchMenuItems(
          restaurant.id,
          query,
          language as "ku" | "ar" | "en"
        );

        // Transform to MenuItem format
        const transformedResults: MenuItem[] = results.map(
          (item: MenuItemWithLabel) => ({
            id: parseInt(item.id.toString()),
            name: item.name,
            description: item.description,
            price: item.price,
            subcategory: item.subcategory_id,
            image: item.image || "",
            rating: item.rating,
            isAvailable: item.is_available,
          })
        );

        setSearchResults(transformedResults);
      } catch (error) {
        console.error("Search error:", error);
        setSearchError("Search failed. Please try again.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [restaurant, language]
  );

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    search,
    clearSearch,
  };
};
