import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { gsap } from "gsap";
import { Language } from "@/types/menu";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageDropdown from "@/components/LanguageDropdown";
import { useRestaurantOptional } from "@/contexts/RestaurantContext";

interface HeaderProps {
  config: any;
  currentLanguage: Language;
  theme: any;
  showSearch?: boolean;
  showThemeToggle?: boolean;
  searchQuery: string;
  isSearchExpanded: boolean;
  isSearchFocused: boolean;
  onSearchButtonClick: () => void;
  onFeedbackButtonClick: () => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClose: () => void;
  getRestaurantName: () => string;
  getSearchPlaceholder: () => string;
  setIsSearchExpanded: (expanded: boolean) => void;
}

function Header({
  config,
  currentLanguage,
  theme,
  showSearch = true,
  showThemeToggle = true,
  searchQuery,
  isSearchExpanded,
  isSearchFocused,
  onSearchButtonClick,
  onFeedbackButtonClick,
  onSearchFocus,
  onSearchBlur,
  onSearchChange,
  onSearchClose,
  getRestaurantName,
  getSearchPlaceholder,
  setIsSearchExpanded,
}: HeaderProps) {
  const navigate = useNavigate();
  const buttonsRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const restaurantContext = useRestaurantOptional();
  const restaurant = restaurantContext?.restaurant || null;


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
        ease: "power2.inOut"
      })
      // Hide search bar and show buttons
      .call(() => {
        if (searchBarRef.current) searchBarRef.current.style.display = 'none';
        if (buttonsRef.current) {
          buttonsRef.current.style.display = 'flex';
          gsap.set(buttonsRef.current, {
            opacity: 0,
            scale: 0.9,
            y: 5
          });
        }
      })
      // Animate buttons back in
      .to(buttonsRef.current, {
        duration: 0.4,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "back.out(1.2)"
      }, "-=0.1")
      // Set state after animation
      .call(() => {
        setIsSearchExpanded(false);
      });
    }
  };

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchExpanded &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        // If search has content, keep it in search state but blur
        if (searchQuery.trim() !== '') {
          // Just blur the input, keep search state
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            searchInput.blur();
          }
        } else {
          // If no content, close the search completely with animation
          animateBackToButtons();
          onSearchClose();
        }
      }
    };

    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded, searchQuery, onSearchClose]);

  const getFeedbackIcon = (color: string, size: number) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 21 20"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5005 0.000244141C5.00049 0.000244141 0.500488 4.50024 0.500488 10.0002C0.500488 12.3002 1.30049 14.5002 2.80049 16.3002L0.800488 18.3002C0.400488 18.7002 0.400488 19.3002 0.800488 19.7002C1.00049 19.9002 1.20049 20.0002 1.50049 20.0002H10.5005C16.0005 20.0002 20.5005 15.5002 20.5005 10.0002C20.5005 4.50024 16.0005 0.000244141 10.5005 0.000244141ZM6.50049 11.0002C5.90049 11.0002 5.50049 10.6002 5.50049 10.0002C5.50049 9.40024 5.90049 9.00024 6.50049 9.00024C7.10049 9.00024 7.50049 9.40024 7.50049 10.0002C7.50049 10.6002 7.10049 11.0002 6.50049 11.0002ZM10.5005 11.0002C9.90049 11.0002 9.50049 10.6002 9.50049 10.0002C9.50049 9.40024 9.90049 9.00024 10.5005 9.00024C11.1005 9.00024 11.5005 9.40024 11.5005 10.0002C11.5005 10.6002 11.1005 11.0002 10.5005 11.0002ZM14.5005 11.0002C13.9005 11.0002 13.5005 10.6002 13.5005 10.0002C13.5005 9.40024 13.9005 9.00024 14.5005 9.00024C15.1005 9.00024 15.5005 9.40024 15.5005 10.0002C15.5005 10.6002 15.1005 11.0002 14.5005 11.0002Z"
          fill={color}
        />
      </svg>
    );
  };

  const handleSearchButtonClick = () => {
    if (buttonsRef.current && searchBarRef.current) {
      setIsSearchExpanded(true);
      
      // Set initial state for search bar
      gsap.set(searchBarRef.current, {
        display: 'block',
        opacity: 0,
        scale: 0.8,
        y: 10
      });
      
      // Create GSAP timeline for smooth animation
      const tl = gsap.timeline();
      
      // Animate buttons out
      tl.to(buttonsRef.current, {
        duration: 0.4,
        opacity: 0,
        scale: 0.8,
        y: -10,
        ease: "power2.inOut"
      })
      // Hide buttons and show search bar
      .call(() => {
        if (buttonsRef.current) buttonsRef.current.style.display = 'none';
      })
      // Animate search bar in
      .to(searchBarRef.current, {
        duration: 0.5,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "back.out(1.7)"
      }, "-=0.1")
      // Focus the input after animation
      .call(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      });
    }
    onSearchButtonClick();
  };

  const handleCloseClick = () => {
    // Animate back to buttons first, then call parent close handler
    animateBackToButtons();
    onSearchClose();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 pt-6">
      <div
        className={`${theme.bgTopbar} px-5 py-5 flex flex-col items-start justify-between ${theme.borderTopbar} border-1 rounded-[30px] ${theme.topbarShadowStyle}`}
      >
        <div className="flex items-center justify-between w-full gap-3">
          <div 
            className="flex justify-center items-center gap-2 cursor-pointer"
            onClick={() => navigate(`/${restaurant ? restaurant.slug : ''}/`)}
          >

            {config.logo && (
              <img
                src={
                  theme.isDark ? config.logo?.dark : config.logo?.light
                }
                alt="Logo"
                className="w-14 h-14 object-contain"
              />
            )}
            <div
              className={`text-xl ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              }`}
            >
              {getRestaurantName()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <LanguageDropdown />
              {showThemeToggle && <ThemeToggle />}
            </div>
          </div>
        </div>

        {/* Search and Feedback Buttons / Search Bar */}
        {showSearch && (
          <div className="mt-4 w-full relative h-14" ref={searchContainerRef}>
            {/* Buttons Container */}
            <div
              ref={buttonsRef}
              className="absolute inset-0 flex items-center justify-center gap-4"
            >
              {/* Search Button */}
              <button
                onClick={handleSearchButtonClick}
                className={`flex-1 flex items-center justify-center gap-2 ${theme.bgSearchBar} h-14 rounded-full transition-all duration-200 ease-out hover:scale-105 hover:shadow-[0_6px_10px_rgba(0,0,0,0.08)] border-1 border-transparent hover:border-opacity-30 min-w-[120px] group`}
                style={{
                  borderColor: theme.isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                }}
              >
                <Search
                  className={`w-5 h-5 ${theme.textSearch} transition-all duration-200 ease-out group-hover:scale-110`}
                />
                <span className={`text-base ${theme.textSearch} font-medium`}>
                  {currentLanguage === "ku"
                    ? "گەڕان"
                    : currentLanguage === "ar"
                    ? "بحث"
                    : "Search"}
                </span>
              </button>

              {/* Feedback Button */}
              <button
                onClick={onFeedbackButtonClick}
                className={`flex-1 flex items-center justify-center gap-2 ${theme.bgSearchBar} h-14 rounded-full transition-all duration-200 ease-out hover:scale-105 hover:shadow-[0_6px_10px_rgba(0,0,0,0.08)] border-1 border-transparent hover:border-opacity-30 min-w-[120px] group`}
                style={{
                  borderColor: theme.isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                }}
              >
                {theme.isDark
                  ? getFeedbackIcon("#FDBB2A", 20)
                  : getFeedbackIcon("#313234", 20)}
                <span className={`text-base ${theme.textSearch} font-medium`}>
                  {currentLanguage === "ku"
                    ? "ڕای تۆ"
                    : currentLanguage === "ar"
                    ? "رأي"
                    : "Feedback"}
                </span>
              </button>
            </div>

            {/* Expanded Search Bar */}
            <div
              ref={searchBarRef}
              className="absolute inset-0"
              style={{ display: 'none' }}
            >
              <div
                className={`flex items-center gap-2 w-full ${theme.bgSearchBar} h-14 rounded-full px-6 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg group focus-within:scale-[1.02] focus-within:shadow-[0_6px_10px_rgba(0,0,0,0.08)] border-1 border-transparent hover:border-opacity-30 focus-within:border-opacity-50`}
                style={{
                  borderColor: theme.isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                }}
              >
                <Search
                  className={`w-5 h-5 ${theme.textSearch} transition-all duration-200 ease-out group-hover:scale-110 group-focus-within:scale-110 group-hover:text-opacity-80 group-focus-within:text-opacity-80`}
                />
                <input
                  id="search-input"
                  type="text"
                  placeholder={getSearchPlaceholder()}
                  onFocus={onSearchFocus}
                  onBlur={onSearchBlur}
                  value={searchQuery}
                  onChange={onSearchChange}
                  className={`flex-1 bg-transparent outline-none text-base ${theme.inputSearch} placeholder:${theme.textSearch} font-bold placeholder:font-medium transition-all duration-200 ease-out placeholder:transition-all placeholder:duration-200 focus:placeholder:opacity-50 focus:placeholder:scale-95`}
                />
                {/* Close Button */}
                <button
                  onClick={handleCloseClick}
                  className={`flex-shrink-0 p-1 rounded-full transition-all duration-200 ${theme.textSearch} hover:${theme.textPrimary} hover:${theme.bgCard} hover:scale-110 active:scale-95`}
                  aria-label={
                    currentLanguage === "ku"
                      ? "داخستن"
                      : currentLanguage === "ar"
                      ? "إغلاق"
                      : "Close"
                  }
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;