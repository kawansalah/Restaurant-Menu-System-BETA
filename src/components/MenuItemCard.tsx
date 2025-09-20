import React, { useState, useEffect } from "react";
import { MenuItemCardProps } from "@/types/menu";
import { getRatingStats } from "@/services/ratingService";
import rating from "@/assets/icons/rating.svg";
import { Rating } from "@/components/Icons";

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  language,
  theme,
  currency,
  defaultDescription,
  defaultRating = 4.5,
  showRating = true,
  showDescription = true,
  onItemClick,
}) => {
  const [currentRating, setCurrentRating] = useState<number>(
    item.rating || defaultRating
  );
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [isLoadingRating, setIsLoadingRating] = useState<boolean>(true);

  // Load rating stats when component mounts or item ID changes
  useEffect(() => {
    // Only load if we don't have ratings yet or if the item ID changed
    if (
      totalRatings === 0 &&
      currentRating === (item.rating || defaultRating)
    ) {
      loadRatingStats();
    }
  }, [item.id]);

  const loadRatingStats = async () => {
    try {
      setIsLoadingRating(true);
      const stats = await getRatingStats(item.id);
      if (stats.total_ratings > 0) {
        setCurrentRating(stats.average_rating);
        setTotalRatings(stats.total_ratings);
      } else {
        // If no ratings exist, fall back to item rating or default
        setCurrentRating(item.rating || defaultRating);
        setTotalRatings(0);
      }
    } catch (error) {
      console.error("Error loading rating stats for item:", item.id, error);
      // Use fallback values on error
      setCurrentRating(item.rating || defaultRating);
      setTotalRatings(0);
    } finally {
      setIsLoadingRating(false);
    }
  };
  const handleClick = () => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const getItemName = () => {
    return item.name[language] || item.name.ku;
  };

  const getDescription = () => {
    if (item.description) {
      return item.description[language] || item.description.ku;
    }
    if (defaultDescription) {
      return defaultDescription[language] || defaultDescription.ku;
    }
    return language === "ku"
      ? "وەسفی خۆراک"
      : language === "ar"
      ? "وصف الطبق"
      : "Delicious dish description";
  };

  const priceWithComma = Number(item.price.replace(/,/g, "")).toLocaleString();
  const getPrice = () => {
    if (currency) {
      const currencyText = currency[language] || currency.ku;
      return language === "en"
        ? `${currencyText} ${priceWithComma}`
        : `${priceWithComma} ${currencyText}`;
    }
    return language === "en"
      ? `IQD ${priceWithComma}`
      : `${priceWithComma} دینار`;
  };

  // Use currentRating from state instead of fallback logic
  const displayRating =
    currentRating > 0 ? currentRating.toFixed(1) : defaultRating.toFixed(1);
  const isAvailable = item.isAvailable !== false;

  return (
    <div
      className={`flex flex-col justify-center ${theme.topbarShadowStyle} ${
        theme.card
      } rounded-4xl overflow-hidden hover:${
        theme.bgSearchBar
      } transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
        !isAvailable ? "opacity-60" : ""
      }`}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative h-38 overflow-hidden rounded-b-3xl bg-[var(--bg-secondary)]">
        <img
          src={item.image}
          alt={getItemName()}
          className="w-full h-full object-cover "
        />
        {/* Rating - Top Right Corner */}
        {showRating && (
          <div className="absolute top-3 right-3 border-2 border-[var(--bg-main)] rounded-full">
            <div
              className={`bg-[var(--bg-rating)] px-2 py-1 rounded-full text-xs font-bold hover:opacity-80 transition-opacity flex items-center justify-center gap-1`}
            >
              {isLoadingRating ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-white rounded-full animate-spin border-t-transparent"></div>
                  <img
                    src={rating}
                    alt="rating"
                    className="w-4 h-4 fill-[var(--bg-main)]"
                  />
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold">{displayRating}</span>
     
                  <Rating className="w-4 h-4 text-main" />
                  {totalRatings > 0 && (
                    <span className="text-[10px] opacity-75">
                      ({totalRatings})
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {/* Availability overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {language === "ku"
                ? "نییە"
                : language === "ar"
                ? "غير متوفر"
                : "Unavailable"}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col justify-center items-center">
        <h3
          className={`font-bold text-base mb-1 ${
            theme.isDark ? theme.textSecondary : theme.textPrimary
          } line-clamp-1 text-center`}
        >
          {getItemName()}
        </h3>
        {showDescription && (
          <p
            className={`${
              theme.isDark ? theme.textTertiary : theme.textSecondary
            } text-sm mb-3 line-clamp-1 text-center font-family-bahij-regular font-normal`}
          >
            {getDescription()}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-center">
          <div
            className={`${theme.bgMain} ${
              theme.isDark ? theme.buttonTextPrimary : theme.buttonTextPrimary
            } px-2 py-1 rounded-full text-sm font-bold hover:opacity-80 transition-opacity flex items-center justify-center`}
          >
            {getPrice()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
