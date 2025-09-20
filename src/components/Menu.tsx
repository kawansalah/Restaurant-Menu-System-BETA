import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { gsap } from "gsap";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { MenuProps, Language, MenuItem } from "@/types/menu";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import SubCategories from "@/components/SubCategories";
import Separator from "@/components/Separator";
import MenuItemCard from "@/components/MenuItemCard";
import Footer from "@/components/Footer";
import ItemInfo from "@/components/ItemInfo";
import Cart from "@/components/Cart";
import { all as AllIcon } from "@/components/Icons";
import { useNavigate } from "react-router-dom";
import { useRestaurantOptional } from "@/contexts/RestaurantContext";

function Menu({
  config = defaultMenuConfig,
  language: propLanguage,
  className = "",
  showSearch = true,
  showThemeToggle = true,
  onItemClick,
}: MenuProps) {
  const { language: urlLanguage } = useParams<{ language: string }>();
  const { language: contextLanguage, setLanguage } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubCategory, setActiveSubCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const theme = useThemeClasses();
  const navigate = useNavigate();
  const restaurantContext = useRestaurantOptional();
  const restaurant = restaurantContext?.restaurant || null;

  const currentLanguage: Language =
    contextLanguage || propLanguage || (urlLanguage as Language) || "ku";

  useEffect(() => {
    if (
      urlLanguage &&
      (urlLanguage === "ku" || urlLanguage === "ar" || urlLanguage === "en")
    ) {
      setLanguage(urlLanguage as Language);
    } else if (propLanguage) {
      setLanguage(propLanguage);
    }
  }, [urlLanguage, propLanguage, setLanguage]);

  // Get current category data
  const currentCategory = config.categories.find(
    (cat) => cat.id === activeCategory
  );

  const getLocalizedText = (text: any, fallback: string = "") => {
    if (typeof text === "string") return text;
    return text?.[currentLanguage] || text?.ku || fallback;
  };

  const currentSubCategories =
    activeCategory === "all"
      ? [
          {
            id: "all-items",
            label: getLocalizedText(
              config.ui?.all,
              currentLanguage === "ku"
                ? "هەموو"
                : currentLanguage === "ar"
                ? "الكل"
                : "All"
            ),
            img: AllIcon,
          },
          ...config.categories
            .flatMap((category) => category.subCategories)
            .filter((subCategory) => !subCategory.id.startsWith("all-"))
            .filter(
              (subCategory, index, self) =>
                index === self.findIndex((s) => s.id === subCategory.id)
            ),
        ]
      : currentCategory?.subCategories || [];

  useEffect(() => {
    if (currentSubCategories.length > 0) {
      setActiveSubCategory(currentSubCategories[0].id);
    }
  }, [activeCategory]);

  useEffect(() => {
    if (config.categories.length > 0 && !activeCategory) {
      setActiveCategory("all");
    }
  }, [config.categories, activeCategory]);

  const getSearchPlaceholder = () => {
    return getLocalizedText(config.searchPlaceholder, "Search...");
  };

  const getSeparatorText = () => {
    if (activeCategory === "all") {
      return getLocalizedText(
        config.ui?.allItems,
        currentLanguage === "ku"
          ? "هەموو خۆراکەکان"
          : currentLanguage === "ar"
          ? "جميع الأطباق"
          : "All Items"
      );
    }
    const category = config.categories.find((cat) => cat.id === activeCategory);
    return getLocalizedText(category?.label, "All");
  };

  const getRestaurantName = () => {
    return getLocalizedText(config.restaurantName, "Restaurant");
  };

  const getNoResultsMessage = () => {
    return getLocalizedText(config.noResultsMessage, "No results found");
  };

  const allCategory = {
    id: "all",
    label: getLocalizedText(
      config.ui?.all,
      currentLanguage === "ku"
        ? "هەموو"
        : currentLanguage === "ar"
        ? "الكل"
        : "All"
    ),
  };

  const transformedCategories = [
    allCategory,
    ...config.categories.map((category) => ({
      id: category.id,
      label: getLocalizedText(category.label),
    })),
  ];

  const transformedSubCategories = currentSubCategories.map((subCategory) => ({
    id: subCategory.id,
    label: getLocalizedText(subCategory.label),
    img: subCategory.img,
  }));

  // Get all items filtered by subcategory and search query
  const getFilteredItems = () => {
    if (activeCategory === "all") {
      const allItems = config.categories.flatMap((category) => category.items);

      return allItems.filter((item: MenuItem) => {
        const itemName = getLocalizedText(item.name, "");
        const matchesSearch = itemName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesSubcategory =
          activeSubCategory === "all-items" ||
          item.subcategory === activeSubCategory;

        return matchesSearch && matchesSubcategory;
      });
    } else {
      // Single category view
      return (currentCategory?.items || []).filter((item: MenuItem) => {
        const itemName = getLocalizedText(item.name, "");
        const matchesSearch = itemName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesSubcategory =
          activeSubCategory.startsWith("all-") ||
          item.subcategory === activeSubCategory;

        return matchesSearch && matchesSubcategory;
      });
    }
  };
  const filteredItems = getFilteredItems();

  const getGroupedItems = () => {
    if (activeCategory !== "all") {
      return null;
    }

    const groupedItems: {
      [categoryId: string]: { category: any; items: MenuItem[] };
    } = {};

    config.categories.forEach((category) => {
      const categoryItems = category.items.filter((item: MenuItem) => {
        const itemName = getLocalizedText(item.name, "");
        const matchesSearch = itemName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesSubcategory =
          activeSubCategory === "all-items" ||
          item.subcategory === activeSubCategory;

        return matchesSearch && matchesSubcategory;
      });

      if (categoryItems.length > 0) {
        groupedItems[category.id] = {
          category,
          items: categoryItems,
        };
      }
    });

    return groupedItems;
  };
  const groupedItems = getGroupedItems();

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleCloseItemInfo = () => {
    setSelectedItem(null);
  };

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    setSelectedItem(null);

    // Optional: You can add a toast notification here
    // console.log(`Added ${quantity} ${getLocalizedText(item.name)} to cart!`);
  };

  const handleSearchButtonClick = () => {
    if (buttonsRef.current && searchBarRef.current) {
      setIsSearchExpanded(true);

      // Set initial state for search bar
      gsap.set(searchBarRef.current, {
        display: "block",
        opacity: 0,
        scale: 0.8,
        y: 10,
      });

      // Create GSAP timeline for smooth animation
      const tl = gsap.timeline();

      // Animate buttons out
      tl.to(buttonsRef.current, {
        duration: 0.4,
        opacity: 0,
        scale: 0.8,
        y: -10,
        ease: "power2.inOut",
      })
        // Hide buttons and show search bar
        .call(() => {
          if (buttonsRef.current) buttonsRef.current.style.display = "none";
        })
        // Animate search bar in
        .to(
          searchBarRef.current,
          {
            duration: 0.5,
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "back.out(1.7)",
          },
          "-=0.1"
        )
        // Focus the input after animation
        .call(() => {
          const searchInput = document.getElementById("search-input");
          if (searchInput) {
            searchInput.focus();
          }
        });
    }
  };

  const handleFeedbackButtonClick = () => {
    if (restaurant) {
      navigate(`/${restaurant.slug}/feedback/${currentLanguage}`);
      return;
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    // Scroll down to show menu items after categories hide
    setTimeout(() => {
      window.scrollTo({
        top: window.scrollY + 0,
        behavior: "smooth",
      });
    }, 250);
  };

  const handleSearchBlur = () => {
    // Only hide the focused state if search input is empty
    if (searchQuery.trim() === "") {
      setIsSearchFocused(false);
      animateBackToButtons();
    }
  };

  const handleSearchClose = () => {
    // Clear search query and reset states
    setSearchQuery("");
    setIsSearchFocused(false);
    animateBackToButtons();
  };

  const animateBackToButtons = () => {
    if (buttonsRef.current && searchBarRef.current) {
      // Create GSAP timeline for reverse animation
      const tl = gsap.timeline();

      // Animate search bar out
      tl.to(searchBarRef.current, {
        duration: 0.3,
        opacity: 0,
        scale: 0.9,
        y: -5,
        ease: "power2.inOut",
      })
        // Hide search bar and show buttons
        .call(() => {
          if (searchBarRef.current) searchBarRef.current.style.display = "none";
          if (buttonsRef.current) {
            buttonsRef.current.style.display = "flex";
            gsap.set(buttonsRef.current, {
              opacity: 0,
              scale: 0.9,
              y: 5,
            });
          }
        })
        // Animate buttons back in
        .to(
          buttonsRef.current,
          {
            duration: 0.4,
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "back.out(1.2)",
          },
          "-=0.1"
        )
        // Set state after animation
        .call(() => {
          setIsSearchExpanded(false);
        });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If search becomes empty, hide the focused state and collapse
    if (value.trim() === "") {
      setIsSearchFocused(false);
      animateBackToButtons();
    } else {
      // If search has content and not already focused, set focused state
      if (!isSearchFocused) {
        setIsSearchFocused(true);
      }
    }
  };

  return (
    <div
      className={`min-h-screen ${theme.bgPrimary} ${theme.textSecondary} ${className}`}
    >
      {/* Header Component */}
      <Header
        config={config}
        currentLanguage={currentLanguage}
        theme={theme}
        showSearch={showSearch}
        showThemeToggle={showThemeToggle}
        searchQuery={searchQuery}
        isSearchExpanded={isSearchExpanded}
        isSearchFocused={isSearchFocused}
        onSearchButtonClick={handleSearchButtonClick}
        onFeedbackButtonClick={handleFeedbackButtonClick}
        onSearchFocus={handleSearchFocus}
        onSearchBlur={handleSearchBlur}
        onSearchChange={handleSearchChange}
        onSearchClose={handleSearchClose}
        getRestaurantName={getRestaurantName}
        getSearchPlaceholder={getSearchPlaceholder}
        setIsSearchExpanded={setIsSearchExpanded}
      />

      {/* Categories with animation */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isSearchFocused
            ? "max-h-0 opacity-0 transform -translate-y-4"
            : "max-h-[200px] opacity-100 transform translate-y-0"
        }`}
      >
        <Categories
          categories={transformedCategories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          theme={theme}
        />
      </div>

      <div className="px-4 py-2 w-full max-w-3xl mx-auto">
        {/* Sub Categories with animation */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isSearchFocused
              ? "max-h-0 opacity-0 transform -translate-y-4"
              : "max-h-[200px] opacity-100 transform translate-y-0"
          }`}
        >
          <SubCategories
            subCategories={transformedSubCategories}
            activeSubCategory={activeSubCategory}
            setActiveSubCategory={setActiveSubCategory}
            theme={theme}
          />
        </div>

        {/* Menu Items */}
        <div
          ref={menuItemsRef}
          className={`transition-all duration-500 ease-in-out ${
            isSearchFocused
              ? "transform -translate-y-8"
              : "transform translate-y-0"
          }`}
        >
          {activeCategory === "all" ? (
            /* All categories view - show grouped items with category separators */
            groupedItems &&
            Object.entries(groupedItems).map(
              ([categoryId, { category, items }]) => (
                <div key={categoryId}>
                  <Separator
                    text={getLocalizedText(category.label)}
                    theme={theme}
                    lineHeight="2px"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        language={currentLanguage}
                        theme={theme}
                        currency={config.currency}
                        defaultDescription={config.defaultDescription}
                        defaultRating={config.defaultRating}
                        showRating={config.showRating}
                        showDescription={config.showDescription}
                        onItemClick={handleItemClick}
                      />
                    ))}
                  </div>
                </div>
              )
            )
          ) : (
            /* Single category view */
            <>
              <Separator
                text={getSeparatorText()}
                theme={theme}
                lineHeight="2px"
              />
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    language={currentLanguage}
                    theme={theme}
                    currency={config.currency}
                    defaultDescription={config.defaultDescription}
                    defaultRating={config.defaultRating}
                    showRating={config.showRating}
                    showDescription={config.showDescription}
                    onItemClick={handleItemClick}
                  />
                ))}
              </div>
            </>
          )}

          {/* No results message */}
          {((activeCategory === "all" &&
            (!groupedItems || Object.keys(groupedItems).length === 0)) ||
            (activeCategory !== "all" && filteredItems.length === 0)) &&
            searchQuery && (
              <div className={`text-center py-8 ${theme.textSecondary}`}>
                <p className="text-lg">{getNoResultsMessage()}</p>
              </div>
            )}
        </div>
      </div>

      {/* Footer */}
      <Footer
        className={`mt-12 max-w-3xl mx-auto rounded-t-4xl ${theme.borderTopbar} border-1 border-b-0`}
      />

      {/* ItemInfo Modal */}
      {selectedItem && (
        <ItemInfo
          item={selectedItem}
          onClose={handleCloseItemInfo}
          onAddToCart={handleAddToCart}
          currency={config.currency}
          isOpen={!!selectedItem}
        />
      )}

      {/* Cart Component */}
      <Cart currency={config.currency} />
    </div>
  );
}

export default Menu;
